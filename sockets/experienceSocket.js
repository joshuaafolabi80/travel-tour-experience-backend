module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 New client connected to Experiences: ${socket.id}`);
    
    // Join experiences room
    socket.on('join-experiences-room', () => {
      socket.join('experiences-room');
    });
    
    // Experience submitted
    socket.on('experience-submitted', (data) => {
      // Broadcast to all connected clients
      io.to('experiences-room').emit('new-experience', {
        message: 'A new experience has been shared!',
        experience: data,
        timestamp: new Date()
      });
    });
    
    // Experience liked
    socket.on('experience-liked', (data) => {
      // Broadcast to all except the sender
      socket.broadcast.to('experiences-room').emit('experience-like-updated', {
        experienceId: data.experienceId,
        newLikeCount: data.likes,
        timestamp: new Date()
      });
    });
    
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};