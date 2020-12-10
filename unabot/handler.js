"use strict";
const slackClient = require("./slackClient");
const simpleParser = require("mailparser").simpleParser;

async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
  await timeout(1000);
  return fn(...args);
}

function parser(text) {
  const names = [];
  const lines = text.split("\n");
  const numLines = lines.length;
  let index = 0;
  for (; index < numLines; index++) {
    const element = lines[index];
    if (/.*The following users.*/.test(element)) {
      index++;
      break;
    }
  }
  for (; index < numLines; index++) {
    let line = lines[index];
    if (line != "") {
      names.push(line);
    }
  }
  return names;
}
module.exports.hello = async event => {
  console.log(JSON.stringify(event));
  const message = JSON.parse(event.Records[0].Sns.Message);
  const content = message.content;
  const parsed = await simpleParser(content);
  const text = parsed.text;
  const names = parser(text);
  // value: [
  //   name: "",
  //   address: ""
  // ]
  const matches = await slackClient.lookupByName(names);
  if (!matches) {
    const resp = await slackClient.messageUser(
      {
        id: "U1ZEPGQ0P",
      },
      `There was an error finding users`
    );
  }
  const str = matches.map(user => `<@${user.id}>`).join(" ");
  // send a message to rob to test
  // TODO: setup a way to throttle this and work through the array once a second
  const responses = [];
  for (let index = 0; index < matches.length; index++) {
    const element = matches[index];
    await sleep(async arg => {
      const resp = await slackClient.messageUser(
        {
          id: "U1ZEPGQ0P",
        },
        createMessage(arg)
      );
      responses.push(resp);
    }, element);
  }
  return JSON.stringify(responses);
};

const createMessage = user => {
  return `
  ${user.id} Please enter your timesheet for yesterday
  https://oddball.unanet.biz/oddball/action/time/current
  `;
};

// look up the user in slack based on the name
// takes an email body, does the splitting, and returns an array of users
// send the message to that user in slack

const stepId = `arn:aws:states:us-east-1:412204798376:stateMachine:UnabotStateMachine`;

module.exports.stepTrigger = async event => {
  const stepFunction = new StepFunctions();
  const params = {
    stateMachineArn: stepId,
    input: event,
    name: uuid.gen(),
  };
  const resp = await stepFunction.startExecution(params);
  return JSON.stringify(resp);
};
