var env = require('node-env-file');
var path = require("path");
var fs = require("fs");
var botkit = require('botkit');

env(__dirname + '/.env');
if (!process.env.clientId || !process.env.clientSecret || !process.env.DB_PATH) {
    usage_tip();
    process.exit(1);
}

var bot_options = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    clientSigningSecret: process.env.clientSigningSecret,
    debug: false,
    scopes: ['bot']
};

var dbPath = __dirname + process.env.DB_PATH;
let dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}
var sqliteStorage = require(__dirname + '/components/sqlite_storage.js')({
    path: dbPath
});
bot_options.storage = sqliteStorage;

// Create the Botkit controller, which controls all instances of the bot.
var controller = botkit.slackbot(bot_options);
controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

webserver.get('/', function (req, res) {
    res.render('index', {
        domain: req.get('host'),
        protocol: req.protocol,
        glitch_domain: process.env.PROJECT_DOMAIN,
        layout: 'layouts/default'
    });
})

// Start app domain
require(__dirname + '/app.js').default.instance.init(controller);

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

// Load in some helpers that make running Botkit on Glitch.com better
require(__dirname + '/components/plugin_glitch.js')(controller);

var normalizedPath = path.join(__dirname, "skills");
fs.readdirSync(normalizedPath).forEach(function (file) {
    require("./skills/" + file)(controller);
});

function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Slack Translator Bot');
    console.log('Execute your bot application like this:');
    console.log('clientId=<MY SLACK CLIENT ID> clientSecret=<MY CLIENT SECRET> PORT=3000 node bot.js');
    console.log('Get Slack app credentials here: https://api.slack.com/apps');
    console.log('~~~~~~~~~~');
}
