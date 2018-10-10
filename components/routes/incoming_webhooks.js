module.exports = function (webserver, controller) {
    webserver.post('/slack/receive', function (req, res) {
        // NOTE: we should enforce the token check here

        // respond to Slack that the webhook has been received.
        res.status(200);

        // Now, pass the webhook into be processed
        controller.handleWebhookPayload(req, res);
    });

}
