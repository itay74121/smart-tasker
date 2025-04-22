import { Server } from 'socket.io'

var io = null

export function initIO(server){
    if (io !== null) return
    io = new Server(server,{
        cors: { origin: '*' }
      })
    io.on('connection',(socket)=>{
        console.log('Client connected:', socket.id);
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
          });
    })
    return io
}

export default io



