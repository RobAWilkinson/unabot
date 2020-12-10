const { WebClient } = require("@slack/web-api");
const token = process.env.SLACK_BOT_TOKEN;
let web;
if (process.env.NODE_ENV === "test") {
  web = new WebClient(token, { slackApiUrl: "http://localhost:3000/api/" });
  console.log("testing");
} else {
  web = new WebClient(token);
}
const lookupByEmail = async emails => {
  const users = await Promise.all(
    emails.map(async email => {
      const user = await web.users.lookupByEmail({
        email,
      });
      return user;
    })
  );
  return users;
};
const messageUser = async (user, message) => {
  const resp = await web.chat.postMessage({
    channel: user.id,
    text: message,
    as_user: true,
    token: process.env.SLACK_BOT_TOKEN,
  });
  return resp;
};

const allUsers = async () => {
  const res = await web.users.list();
  return res;
};
const lookupByName = async names => {
  // Doe, Jane => Jane Doe
  let newNames = names.map(name => {
    return name.split(",").reverse().join(" ").trim();
  });
  const users = await allUsers();
  const activeOddballs = users.members.filter(
    user => !user.deleted && /.*@oddball.io$/.test(user.profile.email)
  );
  // activeOddballs.map( oddball => {
  //   const { display_name, real_name } = oddball.profile;
  //   let bool = regexp.test(real_name);
  //   let bool2 = regexp.test(display_name);

  // })
  return newNames.map(newName => {
    // .*Jane Doe.*
    const regexp = new RegExp(`.*${newName}.*`);
    // Jane Doe => jane.doe@oddball.io
    const email = newName.toLowerCase().replace(" ", ".") + "@oddball.io";
    const emailRegex = new RegExp(email);
    const match = activeOddballs.filter(oddball => {
      const { display_name, real_name, email } = oddball.profile;
      let bool = regexp.test(real_name);
      let bool2 = regexp.test(display_name);
      let bool3 = emailRegex.test(email);
      if (bool) {
        return true;
      } else if (bool2) {
        return true;
      } else if (bool3) {
        return true;
      }
      return false;
    });
    if (match.length == 0) {
      console.error(`couldnt find a match for ${newName}`);
    }
    return match[0];
  });
};

module.exports = {
  lookupByEmail,
  allUsers,
  messageUser,
  lookupByName,
};
