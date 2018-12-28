var fs = require('fs');
var path = require('path');
var url = require('url');

function getContentType(url) {
    let extension = path.extname(url);
    let contentType = {'.css': {'Content-Type': 'text/css'}, '.ico': {'Content-Type': 'image/x-icon'}};
    return contentType[extension];
}

module.exports = (req, res) => {
    let requestName = url.parse(req.url).pathname;
    if (requestName.startsWith('/content/') && req.method ===  'GET') {
        let filePath = path.normalize(path.join(__dirname, `..${requestName}`));

        fs.readFile(filePath, function(err, data) {
            if (err) {
                console.log('ima err')
                res.writeHead(404, {'Content-type': 'text/html'});
                res.write('Not found');
                res.end();
                return;
            }
            res.writeHead(200, getContentType(req.url));
            res.write(data);
            res.end();
        })
    } else {
        return true;
    }
}
