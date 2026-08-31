import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: false
    })
  }
  return socket
}

export const connectSocket = (userId: string) => {
  const socket = getSocket()
  socket.auth = { userId }
  socket.connect()
  return socket
}