const http = require('http')

function check(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      resolve(res.statusCode)
    }).on('error', err => reject(err))
  })
}

(async ()=>{
  try {
    const status = await check('http://localhost:5001/api')
    console.log('health status:', status)
    process.exit(0)
  } catch (err) {
    console.error('health check failed', err)
    process.exit(2)
  }
})()
