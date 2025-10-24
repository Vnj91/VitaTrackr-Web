const { start } = require('../server')
const http = require('http')

async function wait(ms){ return new Promise(r=>setTimeout(r, ms)) }

;(async ()=>{
  let server
  try {
    server = await start()
  } catch (err) {
    console.error('Failed to start server for checks:', err)
    process.exit(2)
  }

  const options = { hostname: 'localhost', port: 5001, path: '/api/health', method: 'GET', timeout: 3000 }
  const req = http.request(options, res => {
    let body = ''
    res.on('data', chunk=> body += chunk)
    res.on('end', ()=>{
      try {
        const j = JSON.parse(body)
        if (j.server === 'ok') {
          console.log('health ok')
          server.close(()=>process.exit(0))
        } else {
          console.error('unexpected health payload', j)
          server.close(()=>process.exit(3))
        }
      } catch (err) {
        console.error('invalid health response', err)
        server.close(()=>process.exit(4))
      }
    })
  })
  req.on('error', err=>{
    console.error('health request failed', err)
    server.close(()=>process.exit(5))
  })
  req.end()
})()
