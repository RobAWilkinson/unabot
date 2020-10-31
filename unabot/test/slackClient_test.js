const { expect } = require('chai');
const slackClient = require('../slackClient')


describe('Lookup User', async () => {
    it('has a method to lookup a user by email', async () => {
        const emails = [
            "rob@oddball.io"
        ]
        const users = await slackClient.lookupByEmail(emails)
        expect(users.length).to.equal(1);
        expect(users[0].user.name).to.eql("rob")
    });

    it('has a method to lookup a user by name', async () => {
        const name = "Wilkinson, Robert";
        const user = await slackClient.lookupByName(name);
        expect(user.user.name).to.eql("rob")
    })
})

