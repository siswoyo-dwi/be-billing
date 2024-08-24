const jwt = require('jsonwebtoken')


function generateToken(payload){
  return jwt.sign(payload, 'ppid')
}

function verifyToken(token){
  return jwt.verify(token, 'ppid')
}

module.exports = {
  generateToken,
  verifyToken
}