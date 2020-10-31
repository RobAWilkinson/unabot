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


// look up the user in slack based on the name

// send the message to that user in slack