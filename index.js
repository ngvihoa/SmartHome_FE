
const { SerialPort } = require('serialport');
const path = require('path');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


let token;

async function writeData({
    record,
    deviceID,
    dateCreate
}) {
    return fetch("http://192.168.0.2:8080/write/data", {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            jwt: token,
            record: record,
            deviceID: deviceID,
            dateCreate: dateCreate
        })
    });
}

async function getSetting() {
    return fetch("http://192.168.0.2:8080/get/allSetting", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({jwt: token})
        });
}

async function handleData(chunk) {
    const str = chunk.toString().trim();
    if (!str) return;
    console.log(str);
    //const time = (new Date(Date.now())).toISOString();
    //console.log(time);
    try {
        // const [temp, humid, light] = str.split(',');
        // if (!(temp || humid || light)) return;

        // const responses = await Promise.all([
        //     writeData({
        //         record: light,
        //         deviceID: 4,
        //         dateCreate: time
        //     }),
        //     writeData({
        //         record: temp,
        //         deviceID: 5,
        //         dateCreate: time
        //     }),
        //     writeData({
        //         record: humid,
        //         deviceID: 6,
        //         dateCreate: time
        //     })
            
        // ]);
        // responses.forEach(async (res) => console.log(await res.text()));
        
        // console.log({ light, temp, humid });
    } catch (e) {
        console.log(e);
    }
}

function handleError(err) { throw err; }

async function main() {
    const listSerial = (await SerialPort.list()).filter(v => v.vendorId === "1A86" && v.productId === "7523");
    try {

        if (!listSerial.length) throw "No device found";
        const jwt = await fetch("http://192.168.0.2:8080/login", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({email: "huuduc2707@gmail.com"})
        });


        token = (await jwt.json()).token;

        const settings = await (await getSetting()).json();
          console.log(settings);




        const port = new SerialPort({
            path: listSerial[0].path,
            baudRate: 115200
        });

        let light = '000000';
        let temp  = '000';
        let humid = '100';

        const TYPE_LIGHT = 1;
        const TYPE_TEMP = 2;
        const TYPE_HUMID = 3;
        settings.forEach((setting) => {
            switch (setting.type) {
                case TYPE_LIGHT: 
                    light = Math.floor(setting.record * 255 / 100).toString(16).padStart(2, '0').repeat(3);
                    break;
                case TYPE_TEMP: 
                    temp = setting.record.toString().padStart(3, '0');
                    break;
                case TYPE_HUMID: 
                    humid = (setting.record === 100 ? 100 : 0).toString().padStart(3, '0');
                    break;
            }
        })
        
        setTimeout(() => {
            port.write(`!${light}`);
            port.write(`%${temp}`);
            port.write(`#${humid}`);
            port.drain();
        }, 1000);
       

        port.on("data", handleData);
        port.on("error", handleError);
    } catch (e) { console.log(e); }
}

app.use(express.static('./public'));
app.use(cookieParser());
const JWT_SECRET = "doandanganh";

app.get('/log', (req, res) => {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    const params = new URLSearchParams({
        client_id: "386980888510-c9dpabmmacg9la2rp6cnkvgg49kooapp.apps.googleusercontent.com",
        prompt: "select_account",
        redirect_uri: "http://localhost:8080/login",
        response_type: "code",
        scope: "profile email"
    });
    res.redirect(url + '?' + params);
});

app.get('/login', async (req, res) => {
    if (!req.query.code) {
        res.end("error");
        return;
    }
    const urlparams = new URLSearchParams({
        code: req.query.code,
        client_id: "386980888510-c9dpabmmacg9la2rp6cnkvgg49kooapp.apps.googleusercontent.com",
        client_secret: "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",
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:8080/login"
    }).toString();
    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: urlparams
    });

    const token = (await response.json()).id_token.split('.')[1];
    const info = JSON.parse(Buffer.from(token, "base64").toString());
    const cookie = jwt.sign({ userEmail: info.email }, JWT_SECRET);
    res.cookie("cookie", cookie, {
        maxAge: 3600 * 1000,
        path: "page"
    }).redirect("page/dashboard.html");

});

app.listen(8080, main);
