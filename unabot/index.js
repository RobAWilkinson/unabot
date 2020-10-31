require('dotenv').config()
const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_BOT_TOKEN;

const emails = [
  "foo@bar.com"
]
const web = new WebClient(token);
(async () => {
  let res = await web.users.list()
  // console.log('Message sent: ', res);
  Promise.all(
    emails.map(async(email) => {
      const user = await web.users.lookupByEmail({
          email
        });
        console.log(user)
    }))

})();