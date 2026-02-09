import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8080';

export const useSocket = (roomId) => {
    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        console.log('🔌 Socket connection attempting...');

        socketRef.current.on('connect', () => {
            console.log('✅ Connected to socket server:', socketRef.current.id);
            if (roomId) {
                socketRef.current.emit('join_room', roomId);
            }
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('❌ Socket connection error:', err);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [roomId]);

    const sendMessage = (event, data) => {
        if (socketRef.current) {
            socketRef.current.emit(event, data);
        }
    };

    const subscribeToEvent = (event, callback) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    };

    return {
        socket: socketRef.current,
        sendMessage,
        subscribeToEvent
    };
};
