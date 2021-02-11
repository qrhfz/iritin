const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./queries')
const path = require('path');

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/landing.html'));
})

app.get('/*', db.resolveLink)


app.post('/link', db.createLink)


