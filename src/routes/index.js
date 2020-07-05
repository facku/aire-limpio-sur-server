const fs = require('fs');
const app = require('express')();

const routes = fs.readdirSync(__dirname).filter((route) => route != 'index.js');

routes.forEach((file) => {
    const route = file.split('.').shift();
    app.use(`/api/${route}`, require(`./${file}`));
});

module.exports = app;
