import React, { useEffect, useState } from "react";

interface LogItem {
  timestamp: string;
  message: string;
}

export default function LiveChannelFeed({ channel }: { channel: string }) {
  const [logs, setLogs] = useState<LogItem[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://0lt1zwvd1g.execute-api.us-east-1.amazonaws.com/prod/zenpulseNotificationGenerator?channel=${channel}`
      );
      const data = await res.json();
      const sorted = (data?.items || []).sort(
        (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setLogs(sorted.slice(0, 5));
    } catch (err) {
      console.error(`❌ Failed to load ${channel} logs`, err);
    }
  };

  // 🔁 Fetch on mount + every 5 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [channel]);

  return (
    <div className="bg-white rounded p-2 shadow text-sm h-full overflow-y-auto">
      <h3 className="text-md font-bold mb-2">
        {channel === "sms" && "📱 SMS"}
        {channel === "email" && "📧 Email"}
        {channel === "slack" && "💬 Slack"}
      </h3>

      {logs.length === 0 ? (
        <p className="italic text-gray-400">No logs found.</p>
      ) : (
        logs.map((log, idx) => (
          <div key={idx} className="mb-3 border-b border-dotted pb-2">
            <div className="text-xs text-gray-600 mb-1">
              {new Date(log.timestamp).toLocaleTimeString()}
            </div>
            <p className="text-xs leading-snug whitespace-pre-wrap">{log.message}</p>
          </div>
        ))
      )}
    </div>
  );
}

