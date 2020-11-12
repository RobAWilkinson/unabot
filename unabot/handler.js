'use strict';
const simpleParser = require('mailparser').simpleParser;


module.exports.hello = async event => {
  const message = JSON.parse(event.Records[0].Sns.Message);
  const mail = message.mail;
  const source = mail.source;
  const content = message.content
  let parsed = await simpleParser(content);
  // value: [
  //   name: "",
  //   address: ""
  // ]
  const ccAddresses = parsed.cc.value.map(element => element.address);
  const toAddresses = parsed.to.value.map(element => element.address);
  const offenderEmail = toAddresses.filter(address => address != "test@oddballunanet.com" && address != "greg.summer@oddball.io")[0];
  console.log(offenderEmail);
  console.log(`To Addresses: ${toAddresses}`);
  console.log(`CC Addresses: ${ccAddresses}`);
  console.log(`Offender ${offenderEmail}`);
};


// look up the user in slack based on the name
// takes an email body, does the splitting, and returns an array of users
function parser() {
}

// send the message to that user in slack