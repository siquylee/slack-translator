var request = require('request');
module.exports = function (controller) {
    function keepalive() {
        request({
            url: 'http://' + process.env.PROJECT_DOMAIN + '.glitch.me',
        }, function (err) {
            setTimeout(function () {
                keepalive();
            }, 60000);
        });
    }

    // If this is running on Glitch
    if (process.env.PROJECT_DOMAIN) {
        // Make a web call to self every 60 seconds
        // in order to avoid the process being put to sleep.
        keepalive();
    }
}
