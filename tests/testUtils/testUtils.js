function parseJsonBody(response) {
    return JSON.parse(JSON.stringify(response.body));
}

module.exports = { parseJsonBody }