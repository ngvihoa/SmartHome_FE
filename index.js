
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
    return fetch("http://192.168.12.250:8080/write/data", {
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
    return fetch("http://192.168.12.250:8080/get/allSetting", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({jwt: token})
        });
}

let time;
let temp_real, humid_real, light_real;

async function handleData(chunk) {
    const str = chunk.toString().trim();
    if (!str) return;
    console.log(str);
    try {
        const [t, h, l] = str.split(',');
        if (!(t || h || l)) return;
        time = (new Date(Date.now())).toISOString();
        [temp_real, humid_real, light_real] = [t, h, l]
     
        
        console.log({ temp_real, humid_real, light_real });
    } catch (e) {
        console.log(e);
    }
}

function handleError(err) { throw err; }

function getSecondsFromTime(time) {
    const [hour, minute, second] = time.split(':').map(v => parseInt(v));
    return hour * 3600 + minute * 60 + second;
}

function getCurrentTime() {
    const date = new Date(Date.now());
    return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}

const TYPE_LIGHT = 1;
const TYPE_TEMP = 2;
const TYPE_HUMID = 3;
const deviceType = {};
let port;
async function main() {
    const listSerial = (await SerialPort.list()).filter(v => v.vendorId === "1A86" && v.productId === "7523");
    try {

        if (!listSerial.length) throw "No device found";
        const jwt = await fetch("http://192.168.12.250:8080/login", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({email: "huuduc2707@gmail.com"})
        });


        token = (await jwt.json()).token;





        port = new SerialPort({
            path: listSerial[0].path,
            baudRate: 115200
        });

        
        let light = '000000';
        let temp  = '000';
        let humid = '100';

        setInterval(async () => {
        const settings = await (await getSetting()).json();
          console.log(settings);
        
        settings.forEach((setting) => {
            const onTime = getSecondsFromTime(setting.onTime);
            const offTime = getSecondsFromTime(setting.offTime);

            
            let lastTime = getCurrentTime();
            switch (setting.type) {
                case TYPE_LIGHT: 
                    deviceType[setting.deviceId] = TYPE_LIGHT;
                    light = Math.floor(setting.record * 255 / 100).toString(16).padStart(2, '0').repeat(3);
                            
                    if (onTime !== offTime) {
                        setTimeout(() => {
                            const currentTime = getCurrentTime();
                            if (currentTime >= onTime && lastTime <= onTime) {
                                port.write('!' + light);
                            }
                            else if (currentTime >= offTime && lastTime <= offTime) {
                                port.write('!000000');
                            }
                            lastTime = currentTime;
                        }, 0);
                    }
                    break;
                case TYPE_TEMP:
                    deviceType[setting.deviceId] = TYPE_TEMP;
                    temp = setting.record.toString().padStart(3, '0');
                    
                    if (onTime !== offTime) {
                        setTimeout(() => {
                            const currentTime = getCurrentTime();
                            if (currentTime >= onTime && lastTime <= onTime) {
                                port.write('%' + temp);
                            }
                            else if (currentTime >= offTime && lastTime <= offTime) {
                                port.write('%000');
                            }
                            lastTime = currentTime;
                        }, 0);
                    }
                    break;
                case TYPE_HUMID:
                    deviceType[setting.deviceId] = TYPE_HUMID;
                    humid = (setting.record === 100 ? 100 : 0).toString().padStart(3, '0');
                    
                    if (onTime !== offTime) {
                        setTimeout(() => {
                            const currentTime = getCurrentTime();
                            if (currentTime >= onTime && lastTime <= onTime) {
                                port.write('#' + humid);
                            }
                            else if (currentTime >= offTime && lastTime <= offTime) {
                                port.write('#000');
                            }
                            lastTime = currentTime;
                        }, 0);
                    }
                    break;
            }
        })
    }, 1000);
        
        setTimeout(() => {
            port.write(`!${light}`);
            port.write(`%${temp}`);
            port.write(`#${humid}`);
            port.drain();
        }, 1000);
       

        port.on("data", handleData);
        port.on("error", handleError);
        setInterval(async () => {
            const responses = await Promise.all([
                writeData({
                    record: light_real,
                    deviceID: 4,
                    dateCreate: time
                }),
                writeData({
                    record: temp_real,
                    deviceID: 5,
                    dateCreate: time
                }),
                writeData({
                    record: humid_real,
                    deviceID: 6,
                    dateCreate: time
                })
                
            ]);
            responses.forEach(async (res) => console.log(await res.text()));
        }, 10000);
    } catch (e) { console.log(e); }
}

app.use(express.static('./public'));
app.use(cookieParser());
app.use(express.json());
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

app.post('/write/setting', (req, res) => {
    
    console.log(req.body);
    const {deviceID, record} = req.body;
    switch (deviceType[deviceID]) {
        case TYPE_LIGHT: 
            port.write('!' + Math.floor(parseInt(record) * 255 / 100).toString(16).padStart(2, '0').repeat(3));
            port.drain();
            break;
        case TYPE_TEMP:
            port.write('%' + parseInt(record).toString().padStart(3, '0'));
            port.drain();
            break;
        case TYPE_HUMID:
            port.write('#' + (parseInt(record) === 100 ? 100 : 0).toString().padStart(3, '0'));
            port.drain();
            break;
    }
    res.end("OK");
});

app.listen(8080, main);
