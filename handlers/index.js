const homeHandler = require('./homepage');
const filesHandler = require('./static-files');
const productHandler = require('./product');

module.exports = [ homeHandler, filesHandler, productHandler ];