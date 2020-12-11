"use strict";
const slackClient = require("./slackClient");
const simpleParser = require("mailparser").simpleParser;
const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10'}).DocumentClient();

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
  // loop
  for (let index = 0; index < matches.length; index++) {
    const element = matches[index];
    const notified = await checkIfNotifiedToday(element);
    console.log(`Notified Today?: ${notified}`);
    await sleep(async arg => {
      try {
        const resp = await slackClient.messageUser(
          {
            id: "U1ZEPGQ0P",
          },
          createMessage(arg)
        );
        try {
        const loggedUser = await logNotification(element);
        console.log("saved Successfully");
        console.log(loggedUser)
        responses.push(resp);
        } catch(error) {
          console.error(error);
          throw new Error({
            statusCode: error.statusCode || 501,
            headers: { "Content-Type": "text/plain" },
            body: "Couldn't log the user.",
          });
        }
      }catch(error) {
        // handle the error in slack messaging
        console.error(error);
        throw new Error({
          statusCode: error.statusCode || 501,
          headers: { "Content-Type": "text/plain" },
          body: "Couldn't slack message the user.",
        });
      }

    }, element);
  } // end loop
  return JSON.stringify(responses);
};

async function checkIfNotifiedToday(user) {
  let today = new Date();
  let todayPretty = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;
  // see if the users in dynamodb,
  let params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      email: user.profile.email,
    },
  };
  try {
    console.log("Checking in DB");
    console.log(params);
    let result = await dynamoDb.getItem(params).promise()
    console.log("Checked for notification")
    console.log(result);
    if (result.Item) {
      if (Object.keys(result.Item.days).indexOf(todayPretty) >= 0) {
        // the day is in there
        return true;
      }
      return false;
    }
    return false;

    // if it is, check if the day is in there
    // if the day is in there, return true
    // if it isnt, add the day and return false
    // do
  } catch (error) {
    // handle potential errors
    console.error(error);
    throw new Error({
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't fetch the user item.",
    });
  }
}

// return result or throw error
async function logNotification(user) {
  // enter the notification
  let today = new Date();
  let todayPretty = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      email: {
        [user.profile.email]: {
          [todayPretty]: true,
        },
      },
    }
  };

  try {
    console.log("Saving in DB");
    console.log(params);
    const result = await dynamoDb.putItem(params).promise();
    console.log("Log notification");
    console.log(result)
    return result.Item;
  } catch (error) {
    console.error(error);
    throw new Error({
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't fetch the todo item.",
    });
  }
}

const createMessage = user => {
  return `
  <@${user.id}> Please enter your timesheet for yesterday
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
