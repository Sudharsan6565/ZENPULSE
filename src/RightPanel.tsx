import { useState } from "react";
import LiveChannelFeed from "./LiveChannelFeed";
import PushBar from "./PushBar";
import StatsBar from "./StatsBar";

export default function RightPanel() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCSVExport = () => {
    const pushData = JSON.parse(localStorage.getItem("zenpulse-push-log") || "[]");
    const csvRows = [
      ["Channel", "Step", "Message"],
      ...pushData.map((msg: any) => ["Push", "Realtime", msg.message.replace(/[\r\n]+/g, " ")])
    ];
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    link.download = "zenpulse_push.csv";
    link.click();
  };

  return (
    <div className="flex flex-col h-full w-full px-4 py-2 overflow-hidden">
      {/* Main content with scroll */}
      <div className="flex-grow overflow-y-auto space-y-2">
        <div className="h-[24%]">
          <LiveChannelFeed channel="sms" refreshTrigger={refreshTrigger} />
        </div>
        <div className="h-[24%]">
          <LiveChannelFeed channel="email" refreshTrigger={refreshTrigger} />
        </div>
        <div className="h-[24%]">
          <LiveChannelFeed channel="slack" refreshTrigger={refreshTrigger} />
        </div>
        <div className="h-[45%] overflow-y-auto">
          <PushBar />
        </div>
      </div>

      {/* Sticky stats + export row */}
      <div className="flex items-center justify-between border-t pt-2 bg-white sticky bottom-0 z-10">
        <StatsBar />
        <button
          onClick={handleCSVExport}
          className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs"
        >
          📁 Export CSV
        </button>
      </div>
    </div>
  );
}

