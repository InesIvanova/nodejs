const fs = require('fs');
const path = require('path');
const url = require('url');
const database = require('../config/database');
const qs = require('querystring');
const multiparty = require('multiparty');
const shortid = require('shortid'); 
const formidable = require('formidable'); 

module.exports = (req, res) => {
    let request = url.parse(req.url).pathname;
    if (request === '/product/add' && req.method === 'GET') {
       let filePath = path.normalize(path.join(__dirname, '../views/products/add.html'));

       fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                return;
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
       });
    } 
    else if (request === '/product/add' && req.method === 'POST') {
        let product = {};
        let dataStr = '';
        req.on('data', (data) => {
            dataStr += data;
            console.log('formata? ', data)
        })
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
        product = fields;
            
        var oldpath = files.image.path;
        var newpath = path.normalize(path.join(__dirname, '../content/images/')) + files.image.name;
        var relativePath = 'http://localhost:8080/content/images/' + files.image.name;
        product.image = relativePath
        console.log('product', product);

        fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        database.addProduct(product);
        res.writeHead(302, {
            Location: '/'
        });
        res.end();
        
      });

      
    });

   
    } else {
        return true;
    }

}