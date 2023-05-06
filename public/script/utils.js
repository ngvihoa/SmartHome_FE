function httpRequest(method, url, request_body, func) {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onload = func
    xhr.send(JSON.stringify(request_body))
}

const url = ''

function cookieToJSON(cookie) {
    const res = {}
    cookie.split('; ').forEach(pair => {
        pair = pair.split('=')
        res[pair[0]] = pair[1]
    })
    return res    
}

export { httpRequest, url, cookieToJSON }