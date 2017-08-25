const socket = require('socket.io')

function server (port) {
  const serv = require('http').createServer();
  const io = socket(serv)

  io.on('connection', client => {
    console.log('client connected!')
    client.on('disconnect', _ => {
      console.log('client disconnected!')
    })
  })

  serv.listen(port)

  return serv
}

module.exports = {
  server: server,
}
