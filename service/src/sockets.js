module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('A user connected to Socket.IO');
  
      socket.on('disconnect', () => {
        console.log('A user disconnected from Socket.IO');
      });
  
      // Add other events here
    });
  };
  