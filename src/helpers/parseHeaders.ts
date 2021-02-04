export function parseHeaders(headers: string): any {

    let parsed = Object.create(null)
    if (!headers) {
        return parsed
    }



    headers.split('\r\n').forEach(line => {
        let [key, val] = line.split(':')
        key = key.trim().toLowerCase()
        if (!key) {
            return
        }
        if (val) {
            val = val.trim()
        }
        parsed[key] = val
    })
    return parsed
}