function httpRequest(method, url, request_body, func) {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onload = func
    xhr.send(JSON.stringify(request_body))
}

const url = ''

export { httpRequest, url }