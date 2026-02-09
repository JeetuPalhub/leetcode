import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let ioInstance: Server | null = null;

export const initSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    console.log('🔌 Socket.io initialized');


    io.on('connection', (socket) => {
        console.log(`👤 User connected: ${socket.id}`);

        // Join a specific room for pair programming
        socket.on('join_room', (roomId: string) => {
            socket.join(roomId);
            console.log(`🏢 User ${socket.id} joined room: ${roomId}`);

            // Notify others in the room
            socket.to(roomId).emit('user_joined', { userId: socket.id });
        });

        // Sync code changes
        socket.on('code_change', ({ roomId, code }: { roomId: string, code: string }) => {
            socket.to(roomId).emit('code_update', code);
        });

        // Sync cursor position
        socket.on('cursor_move', ({ roomId, position }: { roomId: string, position: any }) => {
            socket.to(roomId).emit('cursor_update', { userId: socket.id, position });
        });

        // Invite a buddy
        socket.on('invite_buddy', ({ buddyEmail, roomId, problemTitle }: { buddyEmail: string, roomId: string, problemTitle: string }) => {
            // In a real app, this might send an email or a real-time notification to the user if they are online
            // For now, we'll emit to a global room or handle via backend if user is online
            console.log(`📩 Invitation sent to ${buddyEmail} for room ${roomId}`);
            io.emit('new_invitation', { buddyEmail, roomId, problemTitle });
        });

        socket.on('disconnect', () => {
            console.log(`👤 User disconnected: ${socket.id}`);
        });
    });

    return io;
};
