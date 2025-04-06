import { useEffect, useState } from "react";

interface LogItem {
  timestamp: string;
  message: string;
}

export default function LiveChannelFeed({ channel }: { channel: string }) {
  const [logs, setLogs] = useState<LogItem[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://0lt1zwvd1g.execute-api.us-east-1.amazonaws.com/prod/zenpulseNotificationGenerator?channel=${channel.toLowerCase()}`
      );
      const data = await res.json();
      const sorted = (data?.items || []).sort(
        (a: any, b: any) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setLogs(sorted.slice(0, 5));
    } catch (err) {
      console.error(`❌ Failed to load ${channel} logs`, err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [channel]);

  return (
    <div className="bg-white rounded p-3 shadow text-sm h-full overflow-y-auto border border-zinc-300">
      <h3 className="text-sm font-semibold mb-2 text-black">
        {channel.toLowerCase() === "sms" && "📱 SMS"}
        {channel.toLowerCase() === "email" && "📧 Email"}
        {channel.toLowerCase() === "slack" && "💬 Slack"}
      </h3>

      {logs.length === 0 ? (
        <p className="italic text-gray-400">No logs found.</p>
      ) : (
        logs.map((log, idx) => (
          <div key={idx} className="mb-3 border-b border-dotted pb-2">
            <div className="text-xs text-gray-500 mb-1">
              {new Date(log.timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </div>
            <p className="text-sm leading-snug text-gray-900 whitespace-pre-wrap">
              {log.message.replace(/["]+/g, "")}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

