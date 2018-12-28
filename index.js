var http = require('http');
var port = 8080;
var handlers = require('./handlers')


http.createServer((req, res) => {
    
    for (let handler of handlers) {
        if (!handler(req, res)) {
            break;
        }
    }
}).listen(port);