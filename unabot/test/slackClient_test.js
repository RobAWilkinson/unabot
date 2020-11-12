require('dotenv').config()

const { expect } = require('chai');
const slackClient = require('../slackClient')
const sampleUser = require('./user')

describe('Lookup User', async () => {
    it('has a method to lookup a user by email', async () => {
        const emails = [
            "rob@oddball.io",
        ]
        const users = await slackClient.lookupByEmail(emails)
        expect(users.length).to.equal(1);
        expect(users[0].user.name).to.eql("rob")
    });

    it('has a method to lookup 2 users by email', async () => {
        const emails = [
            "rob@oddball.io",
            "dale.nelson@oddball.io"
        ];
        const users = await slackClient.lookupByEmail(emails)
        expect(users.length).to.equal(2);
        expect(users[0].user.name).to.eql("rob")
        expect(users[1].user.name).to.eql("dale.nelson")
    });
    it('sends a message to a specific user', async () => {
        const message = `Please enter your hours\nhttps://oddball.unanet.biz/oddball/action/time/current`;
        const resp = await slackClient.messageUser(sampleUser, message);
        expect(resp.ok).to.be.true;
    })
})

