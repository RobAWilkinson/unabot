const superagent = require('superagent')

superagent.post('http://localhost:4000/stop')
  .then(res => { console.log(res.body) })
  .catch(err => { console.log(err) })
