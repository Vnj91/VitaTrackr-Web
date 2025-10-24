const level = process.env.LOG_LEVEL || 'info'
function info(...args){ if(['info','debug'].includes(level)) console.info(...args) }
function debug(...args){ if(level === 'debug') console.debug(...args) }
function error(...args){ console.error(...args) }
module.exports = { info, debug, error }
