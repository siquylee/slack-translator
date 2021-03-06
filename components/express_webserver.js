var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var http = require('http');
var hbs = require('express-hbs');

module.exports = function (controller) {
    var webserver = express();
    webserver.use(function (req, res, next) {
        req.rawBody = '';
        req.on('data', function (chunk) {
            req.rawBody += chunk;
        });
        next();
    });
    webserver.use(cookieParser());
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({ extended: true }));
    webserver.use(express.static('public'));

    // Set up handlebars ready for tabs
    webserver.engine('hbs', hbs.express4({ partialsDir: __dirname + '/../views/partials' }));
    webserver.set('view engine', 'hbs');
    webserver.set('views', __dirname + '/../views/');

    // Import express middlewares that are present in /components/express_middleware
    var path = require("path");
    var fs = require('fs');
    var normalizedPath = path.join(__dirname, "express_middleware");
    if (fs.existsSync(normalizedPath)) {
        fs.readdirSync(normalizedPath).forEach(function (file) {
            require("./express_middleware/" + file)(webserver, controller);
        });
    }

    // Import all the pre-defined routes that are present in /components/routes
    normalizedPath = path.join(__dirname, "routes");
    if (fs.existsSync(normalizedPath)) {
        fs.readdirSync(normalizedPath).forEach(function (file) {
            require("./routes/" + file)(webserver, controller);
        });
    }

    var server = http.createServer(webserver);
    server.listen(process.env.PORT || 3000, null, function () {
        console.log('Express webserver configured and listening at http://localhost:' + process.env.PORT || 3000);
    });

    controller.webserver = webserver;
    controller.httpserver = server;
    return webserver;
}
