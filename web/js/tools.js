const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

const $ = function(selecteur, f) {
    if (f == undefined)
        return document.querySelector(selecteur)
    else
        document.querySelectorAll(selecteur).forEach(f)
}

function ajax(method, url, callback, data) {
    const xhr = new XMLHttpRequest()
    xhr.open(method, encodeURI(url))
    xhr.onload = () => {
        if (xhr.status === 200 && xhr.responseText !== "") {
            callback(xhr.status, JSON.parse(xhr.responseText, reviver))
        } else {
            callback(xhr.status)
        }
    }
    if (data !== undefined) {
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data))
    } else {
        xhr.send()
    }
}

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
function reviver(key, value) {
    if (typeof value === "string" && dateFormat.test(value)) {
        return new Date(value);
    }
    return value;
}

function getParameterByName(name) {
    let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function installBootstrapValidation() {
    window.addEventListener("load", () => {
        $("form", (form) => {
            form.addEventListener("submit", (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add("was-validated")
            }, false)
        })
    }, false)
}
