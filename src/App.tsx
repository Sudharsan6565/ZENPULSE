import React, { useEffect, useState } from 'react';

const WEBSOCKET_URL = 'wss://rcs0vzl59i.execute-api.us-east-1.amazonaws.com/$default';


type Notification = {
  id: string;
  channel: string;
  message: string;
  timestamp: string;
};

function App() {
  const [messages, setMessages] = useState<Notification[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      console.log('✅ Connected to WebSocket');
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newNotification: Notification = {
          id: Date.now().toString(),
          channel: data.channel || "unknown",
          message: data.message,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [newNotification, ...prev]);
      } catch (err) {
        console.error('❌ Error parsing message:', err);
      }
    };

    socket.onerror = (error) => {
      console.error('⚠️ WebSocket error', error);
    };

    socket.onclose = () => {
      console.warn('🚪 WebSocket connection closed');
      setConnected(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <h1 className="text-2xl font-bold mb-4">📢 Zenpulse Notification Dashboard</h1>

      <div className={`mb-6 text-sm font-medium ${connected ? 'text-green-600' : 'text-red-500'}`}>
        Status: {connected ? 'Connected to WebSocket' : 'Disconnected'}
      </div>

      <div className="bg-white shadow-md rounded-md p-4 max-w-3xl mx-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No notifications received yet.</div>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li key={msg.id} className="border-l-4 pl-3 py-2 border-blue-500 bg-blue-50 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">{msg.channel.toUpperCase()}</span>
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </div>
                <p className="text-sm mt-1">{msg.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;

