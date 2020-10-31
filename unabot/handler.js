'use strict';
const simpleParser = require('mailparser').simpleParser;


module.exports.hello = async event => {
  const message = JSON.parse(event.Records[0].Sns.Message);
  const mail = message.mail;
  const source = mail.source;
  const content = message.content
  let parsed = await simpleParser(content);
  console.log(parsed.text);
};
