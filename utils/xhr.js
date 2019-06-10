import pify from 'pify'

const xhrGet = (url, contentType, callback) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.setRequestHeader('Content-Type', contentType)

    xhr.onload = () => { callback(null, JSON.parse(xhr.response)) }
    xhr.onerror = () => { callback(xhr.response) }
    xhr.oabort = () => { callback(xhr.response) }

    xhr.send()
}

export const getPromise = async (endpoint) => {
    const contentType = 'application/json'
    const response = await pify(xhrGet)(endpoint, contentType)
    return response
}