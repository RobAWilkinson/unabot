const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_BOT_TOKEN;
let web;
if(process.env.NODE_ENV == "test") {
    web = new WebClient(token, { slackApiUrl: "http://localhost:3000/api/"});
} else {
    web = new WebClient(token);
}
const emails = [
    "foo@bar.com"
]

const lookupByName = async(name) => {
    const realName = name.replace(' ', '').split(',').reverse().join(' ');
    const users = await allUsers();
    const activeUsers = users.members.filter(user => !user.deleted);
}

const lookupByEmail = async (emails) => {
    const users = await Promise.all(
        emails.map(async (email) => {
            const user = await web.users.lookupByEmail({
                email
            });
            return user;
        }))
        return users;
};
const messageUser = async(user, message) => {
    const resp = await web.chat.postMessage({
        channel: user.id,
        text: message
    })
    return resp;
}

const allUsers = async () => {
    let res = await web.users.list()
    return res;
}

module.exports =
{
    lookupByEmail,
    allUsers,
    lookupByName,
    messageUser
}