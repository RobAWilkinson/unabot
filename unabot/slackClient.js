const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_BOT_TOKEN;

const web = new WebClient(token);
const emails = [
    "foo@bar.com"
]

const lookupByName = async(name) => {
    const realName = name.replace(' ', '').split(',').reverse().join(' ');
    console.log(realName);
    const users = await allUsers();
    const activeUsers = users.members.filter(user => !user.deleted);

    console.log(activeUsers);

}

const lookupByEmail = async (emails) => {
    try {

    const users = await Promise.all(
        emails.map(async (email) => {
            const user = await web.users.lookupByEmail({
                email
            });
            return user;
        }))
        return users;
        
    } catch (error) {
        if(error.code == "slack_webapi_platform_error") {
            throw new Error("No user matching that email found");

        }
    }

};

const allUsers = async () => {
    let res = await web.users.list()
    return res;
}

module.exports =
{
    lookupByEmail,
    allUsers,
    lookupByName
}