import React, { useEffect, useState } from 'react';
import ControlPanel from './components/ControlPanel';
import './index.css';

type Notification = {
  id: string;
  channel: string;
  message: string;
  timestamp: string;
};

const WEBSOCKET_URL = "wss://w1lme4ecy0.execute-api.us-east-1.amazonaws.com/prod";

function App() {
  const [messages, setMessages] = useState<Notification[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      console.log("📦 Message received from WS:", event.data);

      try {
        const data = JSON.parse(event.data);
        const newNotification: Notification = {
          id: Date.now().toString(),
          channel: data.channel || "unknown",
          message: data.message,
          timestamp: new Date().toLocaleTimeString(),
        };
        console.log("✅ Parsed Notification:", newNotification);
        setMessages((prev) => [newNotification, ...prev]);
      } catch (err) {
        console.error("❌ Failed to parse message:", event.data, err);
      }
    };

    socket.onerror = (error) => {
      console.error("⚠️ WebSocket error", error);
    };

    socket.onclose = () => {
      console.warn("🚪 WebSocket connection closed");
      setConnected(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <h1 className="text-2xl font-bold mb-4">📢 Zenpulse Notification Dashboard</h1>

      <div className={`mb-6 text-sm font-medium ${connected ? 'text-green-600' : 'text-red-500'}`}>
        Status: {connected ? 'Connected to WebSocket' : 'Disconnected'}
      </div>

      <ControlPanel />

      <div className="bg-white shadow-md rounded-md p-4 max-w-3xl mx-auto mt-6">
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

      <footer className="text-center text-xs text-gray-400 mt-12">
        ⛅ Powered by <strong>Serverless LLC</strong> · Zenpulse 2025
      </footer>
    </main>
  );
}

export default App;

