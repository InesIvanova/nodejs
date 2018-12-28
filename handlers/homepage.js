var url = require('url');
var fs = require('fs');
var path = require('path');
var db = require('../config/database');
const qs = require('querystring');


module.exports = (req, res) => {
    let request = req.url;
    let isSearch = false;
    let product = ''; 

    if (request === '/' && req.method === 'GET') {
    } else  if(request === '/' && req.method === 'POST') {
        let productName = '';
        req.on('data', (data) => {
            productName += data;
            product = qs.parse(productName)['query'];
            isSearch = true;           
        });
    } else {
        return true;
    }

    let filePath = path.normalize(path.join(__dirname, '../views/home/index.html'));

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(400, {'Content-type': 'text/html'});
            res.write('404 not found');
            res.end();
            return;
        }

        let products = [];
        if (isSearch) {
            products = db.findProduct(product); 
            console.log(products);
        }
        else {
            products = db.getAllProducts();
            console.log(products);
        }
        let content = '';

        for (let product of products) {
            content += 
            `<div class="product-card">
                <img src="${product.image}" alt="kur" class="product-img">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
            </div>`           
        }
        let html = data.toString().replace('{content}', content);
       
        res.writeHead(200, {'Content-type': 'text/html'});
        res.write(html);
        res.end();
        return;
        

    });

    
}