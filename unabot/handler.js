'use strict';

module.exports.hello = async event => {
  console.log(event)
  const message = event.Records[0].Sns.Message;
  console.log(message)


  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
