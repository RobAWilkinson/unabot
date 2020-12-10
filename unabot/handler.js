"use strict";
const slackClient = require("./slackClient");
const simpleParser = require("mailparser").simpleParser;

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
  // const users = await slackClient.lookupByEmail(["rob@oddball.io", "greg.summer@oddball.io", "elena.stewart-james@oddball.io"])
  const str = matches.map(user => `<@${user.id}>`).join(" ");

  const resp = await slackClient.messageUser(
    {
      id: "U1ZEPGQ0P",
    },
    str
  );
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
