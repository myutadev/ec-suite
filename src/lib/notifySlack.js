const axios = require("axios");
require("dotenv").config();

function notifySlack(error) {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
  console.log(SLACK_WEBHOOK_URL);
  axios
    .post(SLACK_WEBHOOK_URL, {
      text: `An error occurred in EC-suite WORKER: ${error.message} \n stack trace:${error.stack}`,
    })
    .then(() => console.log("Notified Slack about the error."))
    .catch((e) => console.log("Error occurred while notifying Slack.", e));
}

module.exports = {
  notifySlack,
};

// notifySlack({ error: "test error" });
