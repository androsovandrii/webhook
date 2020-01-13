// values for the enviroment variables set in the .env file can be accesed at proces.env.VARIABLE_NAME
const fs = require('fs');
const jwt = require('jsonwebtoken');
var privateKEY  = fs.readFileSync('.data/private-key.pem', 'utf8');
/*
 ====================   JWT Signing =====================
*/
var payload = {
 data1: "Data 1",
 data2: "Data 2",
 data3: "Data 3",
 data4: "Data 4",
};
var signOptions = {
 expiresIn:  "12h",
 algorithm:  "RS256"   // RSASSA [ "RS256", "RS384", "RS512" ]
};


var express = require('express')
var app1 = express()
app1.use(express.json())
app1.set('port', (process.env.PORT || 3000))

const app = require('github-app')({
  id: process.env.APP_ID || 50724,
  cert: require('fs').readFileSync('.data/private-key.pem')
})

const secret = process.env.WEBHOOK_SECRET || "1234567890"
const webHookHandler = require('github-webhook-handler')({
  path: '/',
  secret: secret
})

webHookHandler.on('issues', (event) => {
  // ignore all issue events other than new issue opened
  if (event.payload.action !== 'opened') return

  const {installation, repository, issue} = event.payload
  app.asInstallation(installation.id).then((github) => {
    github.issues.createComment({
      owner: repository.owner.login,
      repo: repository.name,
      number: issue.number,
      body: 'Welcome: AVAS just started analysis of your repository'
    })
  })
})

webHookHandler.on('pull_request.opened', (event) => {
  console.log("PULL REQUEST EVENT")
  console.log(event.payload)
  // ignore all issue events other than new issue opened
  //if (event.payload.action !== 'opened') return
})

webHookHandler.on('push', (event) => {
  console.log("PUSH EVENT")
  console.log(event.payload)
  console.log(event.payload.repository)
})

app1.get('/', function(request, response) {
  response.send('Hello World!')
  var token = jwt.sign(payload, privateKEY, signOptions);
  console.log("Token :" + token);
})

app1.post('/', function(request, response) {
  webHookHandler(request, response, () => response.end('ok'))
})

/*app1.post('/webhook', function(request, response) {
  console.log(request.body);
  console.log(request.body.pull_request.head.sha);
  response.send('Hello World!');
})*/

function handleRequest (request, response) {
  // ignore all requests that aren’t POST requests
  if (request.method !== 'POST') return response.end('ok')

  // here we pass the current request & response to the webHookHandler we created
  // on top. If the request is valid, then the "issue" above handler is called
  webHookHandler(request, response, () => response.end('ok'))
}

app1.listen(app1.get('port'), function() {
  console.log("Node app is running at localhost:" + app1.get('port'))
})

// webHookHandler.on('issues', (event) => {
//   console.log("ISSUES EVENT")
//   console.log(event.payload)
//   console.log(`Received issue event for "${event.payload.issue.title}"`)
// })




// function handleRequest1 (request, response) {
  
//   // log request method & URL
//   console.log(`${request.method} ${request.url}`)
  
//   // for GET (and other non-POST) requests show "ok" and stop here
//   if (request.method !== 'POST') return response.end('ok')
  
//   // for POST requests, read out the request body, log it, then show "ok" as response
//   let payload = ''
//   request.on('data', (data) => payload += data );
//   request.on('end', () => {
//     console.log(payload)
//     var obj = JSON.parse(payload);
//     console.log(obj.repository.html_url)
//     response.end('ok')
//   })
// }








