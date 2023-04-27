const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
const params = new URLSearchParams({
    client_id: "386980888510-c9dpabmmacg9la2rp6cnkvgg49kooapp.apps.googleusercontent.com",
    prompt: "select_account",
    redirect_uri: "http://localhost:8080/login",
    response_type: "code",
    scope: "profile email"
});

document.querySelector('#login').onclick = ()=>{
    window.location.assign(url.toString() + '?' + params.toString());
}