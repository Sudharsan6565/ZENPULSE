import React, { useEffect, useState } from "react";

interface Notification {
  timestamp: string;
  message: string;
}

interface Props {
  channel: "sms" | "email" | "slack";
}

export default function LiveChannelFeed({ channel }: Props) {
  const [messages, setMessages] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://0lt1zwvd1g.execute-api.us-east-1.amazonaws.com/prod/zenpulseNotificationGenerator?channel=${channel}`
        );
        const data = await res.json();
        const items = data.items || [];
        setMessages(
          items.slice(0, 5).map((item: any) => ({
            timestamp: item.timestamp,
            message: item.message,
          }))
        );
      } catch (err) {
        console.error(`❌ Failed to fetch ${channel} logs:`, err);
      }
    };
    fetchData();
  }, [channel]);

  const labelMap: Record<string, string> = {
    sms: "📱 SMS",
    email: "📧 Email",
    slack: "💬 Slack",
  };

return (
  <div className="h-64 overflow-y-auto border rounded p-2 bg-white text-[12px] leading-snug w-full">
    <h3 className="font-bold mb-2">{labelMap[channel]}</h3>
    {messages.length === 0 ? (
      <p className="italic text-gray-400 text-[11px]">No messages yet.</p>
    ) : (
      <ul className="space-y-1">
        {messages.map((item, idx) => (
          <li key={idx}>
            <div className="text-[10px] text-gray-500 italic">
              {new Date(item.timestamp).toLocaleTimeString()}
            </div>
            <div className="text-[11px] text-gray-800">{item.message}</div>
            <hr className="border-dashed my-1" />
          </li>
        ))}
      </ul>
    )}
  </div>
);
}

