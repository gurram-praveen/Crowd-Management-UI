import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect(url = 'https://hiring-dev.internal.kloudspot.com') {
        if (this.socket?.connected) {
            return this.socket;
        }

        const token = localStorage.getItem('authToken');

        this.socket = io(url, {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket.id);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.listeners.clear();
        }
    }

    on(event, callback) {
        if (!this.socket) {
            console.warn('Socket not connected. Call connect() first.');
            return;
        }

        this.socket.on(event, callback);

        // Store listener for cleanup
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (!this.socket) return;

        this.socket.off(event, callback);

        // Remove from stored listeners
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (!this.socket) {
            console.warn('Socket not connected. Call connect() first.');
            return;
        }

        this.socket.emit(event, data);
    }

    isConnected() {
        return this.socket?.connected || false;
    }
}

export default new SocketService();
