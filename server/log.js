export const logError = (msg, req, res) => {
    console.warn(msg)
    console.dir(req.body)
    res.send(msg)
}

export const logSuccess = (msg, req, res) => {
    console.log(msg)
    res.send(msg)
}