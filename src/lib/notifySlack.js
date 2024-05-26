function notifySlack(error) {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
  axios
    .post(SLACK_WEBHOOK_URL, {
      text: `An error occurred in EC-suite WORKER: ${error.message} \n stack trace:${error.stack}`,
    })
    .then(() => console.log("Notified Slack about the error."))
    .catch(() => console.log("Error occurred while notifying Slack."));
}

module.exports = {
  notifySlack,
};
