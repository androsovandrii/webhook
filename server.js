// values for the enviroment variables set in the .env file can be accesed at proces.env.VARIABLE_NAME
const http = require('http')

const app = require('github-app')({
  id: '50724',
  cert: require('fs').readFileSync('.data/private-key.pem')
})


const webHookHandler = require('github-webhook-handler')({
  path: '/',
  secret: '1234567890'
})
http.createServer(handleRequest).listen(3000)


webHookHandler.on('issues', (event) => {
  // ignore all issue events other than new issue opened
  if (event.payload.action !== 'opened') return

  const {installation, repository, issue} = event.payload
  app.asInstallation(installation.id).then((github) => {
    github.issues.createComment({
      owner: repository.owner.login,
      repo: repository.name,
      number: issue.number,
      body: 'Welcome to the robot uprising.'
    })
  })
})

webHookHandler.on('push', (event) => {
  console.log("PUSH EVENT")
  console.log(event.payload)
  console.log(event.payload.repository)
})

function handleRequest (request, response) {
  // ignore all requests that aren’t POST requests
  if (request.method !== 'POST') return response.end('ok')

  // here we pass the current request & response to the webHookHandler we created
  // on top. If the request is valid, then the "issue" above handler is called
  webHookHandler(request, response, () => response.end('ok'))
}

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






