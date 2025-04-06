import { useEffect, useState } from "react";

const useWebSocketFeed = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const ws = new WebSocket("wss://w1lme4ecy0.execute-api.us-east-1.amazonaws.com/prod");

    ws.onopen = () => console.log("✅ WebSocket connected");

    ws.onmessage = (msg) => {
      try {
        const parsed = JSON.parse(msg.data);
        console.log("📥 Push received:", parsed);
        setEvents((prev) => [...prev, parsed]);
      } catch (err) {
        console.error("❌ Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = (err) => console.error("❌ WebSocket error:", err);
    ws.onclose = () => console.log("❌ WebSocket disconnected");

    return () => ws.close();
  }, []);

  return events;
};

export default useWebSocketFeed;

