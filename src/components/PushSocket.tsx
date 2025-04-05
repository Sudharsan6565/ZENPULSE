import React, { useEffect, useState } from "react";

const PushSocket = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = new WebSocket("wss://rcs0vzl59i.execute-api.us-east-1.amazonaws.com");

    socket.onopen = () => {
      console.log("✅ WebSocket connected to Zenpulse");
    };

    socket.onmessage = (event) => {
      console.log("📡 Message:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onerror = (err) => {
      console.error("⚠️ WebSocket error", err);
    };

    socket.onclose = () => {
      console.warn("❌ WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="bg-black text-green-400 p-4 rounded-md shadow-md max-h-80 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">🔴 Live Push Notifications</h2>
      {messages.map((msg, idx) => (
        <div key={idx} className="mb-1">
          {msg}
        </div>
      ))}
    </div>
  );
};

export default PushSocket;

