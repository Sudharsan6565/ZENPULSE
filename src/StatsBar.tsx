import React, { useEffect, useState } from "react";
import useWebSocketFeed from "./useWebSocketFeed";

export default function StatsBar() {
  const pushEvents = useWebSocketFeed();

  const [smsCount, setSmsCount] = useState(0);
  const [emailCount, setEmailCount] = useState(0);
  const [slackCount, setSlackCount] = useState(0);

  // Pull updated counts on mount and every push
  useEffect(() => {
    const fetchCounts = async () => {
      const channels = ["sms", "email", "slack"];
      for (let ch of channels) {
        try {
          const res = await fetch(`https://0lt1zwvd1g.execute-api.us-east-1.amazonaws.com/prod/zenpulseNotificationGenerator?channel=${ch}`);
          const data = await res.json();
          if (ch === "sms") setSmsCount(data.items.length);
          if (ch === "email") setEmailCount(data.items.length);
          if (ch === "slack") setSlackCount(data.items.length);
        } catch (err) {
          console.error(`Failed to fetch ${ch} count`, err);
        }
      }
    };

    fetchCounts();
  }, [pushEvents.length]); // Refresh every time push updates

  return (
    <div className="flex justify-between items-center bg-white text-black p-2 rounded shadow text-sm">
      <span>📩 SMS: {smsCount}</span>
      <span>📧 Email: {emailCount}</span>
      <span>💬 Slack: {slackCount}</span>
      <span>⚡ Push: {pushEvents.length}</span>
      <button className="bg-blue-100 px-2 py-1 rounded shadow text-xs">📥 Export CSV</button>
    </div>
  );
}

