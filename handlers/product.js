const fs = require('fs');
const path = require('path');
const url = require('url');
const database = require('../config/database');
const qs = require('querystring');
const multiparty = require('multiparty');
const shortid = require('shortid'); 

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
        let form = new multiparty.Form();
        let product = {};

        form.on('part', (part) => {
            if (part.fillename) {
                let dataStr = '';

                part.setEncoding('binary');
                part.on('data', (data) => {
                    dataStr += data;
                });
                part.on('end', () => {
                    let fileName = shortid.generate();
                    let filePath = path.normalize(path.join(__dirname, `../content/views/images/${fileName}`));

                    product.image = filePath;
                    console.log(filePath);
                    fs.writeFile(`${filePath}`, dataStr, 
                    {encoding: 'ascii'}, (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    })
                })

            } else {
                part.setEncoding('utf-8');
                let field = '';
                part.on('data', (data) => {
                    field += data;
                });
                part.on('end', () => {
                    product[part.name] = field
                })
            }
        })

        form.on('close', () => {
            database.addProduct(product);
            res.writeHead(302, {
                Location: '/'
            })
            res.end();

        })
        form.parse(req);
        return
    } else {
        return true;
    }

}