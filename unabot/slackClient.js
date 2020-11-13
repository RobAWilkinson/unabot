const { WebClient } = require('@slack/web-api')
const token = process.env.SLACK_BOT_TOKEN
let web
if (process.env.NODE_ENV === 'test') {
  web = new WebClient(token, { slackApiUrl: 'http://localhost:3000/api/' })
  console.log('testing')
} else {
  web = new WebClient(token)
}
const lookupByEmail = async (emails) => {
  const users = await Promise.all(
    emails.map(async (email) => {
      const user = await web.users.lookupByEmail({
        email
      })
      return user
    }))
  return users
}
const messageUser = async (user, message) => {
  const resp = await web.chat.postMessage({
    channel: user.id,
    text: message,
    as_user: true,
    token: process.env.SLACK_BOT_TOKEN
  })
  return resp
}

const allUsers = async () => {
  const res = await web.users.list()
  return res
}

module.exports =
{
  lookupByEmail,
  allUsers,
  messageUser
}
