const nextJs = require('next')
const express = require('express')
const fileUpload = require('express-fileupload')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = nextJs({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use(fileUpload())

  server.get(/^(?!\/upload).+$/, (req, res) => {
    return handle(req, res)
  })

  server.post('/upload', async function (req, res) {
    res.send('OK')
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
