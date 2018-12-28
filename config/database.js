const fs = require('fs');
const path = require('path');
const databasePath = path.normalize(path.join(__dirname, './database.json'));

const products = [];
let productID = 1;

module.exports = {
    getAllProducts: () => {
        let rawdata = fs.readFileSync(databasePath);  
        let p = JSON.parse(rawdata);  
        console.log(p);
        return p; 
    },
    addProduct: (product) => {
        product.id = productID++;
        products.push(product);
        console.log('product added', products)
        saveProducts();       
    },
    findProduct: (name) => {
        let product = products.filter(x => x.name.toLowerCase() === name.toLowerCase());
        return product ? product : null;
    }
}

function getProducts() {
    fs.readFileSync(databasePath, (err, data) => {
        console.log('chete')
        if (err) {
            console.log(err);
            return;
        }
        let mydata = JSON.parse(data);
        console.log('data', mydata);
        return mydata;
    });
}

function saveProducts() {
    let data = JSON.stringify(products);
    fs.writeFileSync(databasePath, data)
}