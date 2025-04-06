// src/RightPanel.tsx
import React from "react";
import LiveChannelFeed from "./LiveChannelFeed";
import PushBar from "./PushBar";
import StatsBar from "./StatsBar";
import useWebSocketFeed from "./useWebSocketFeed";
import NotificationLineChart from "./LineChart";



const RightPanel = ({ smsCount = 0, emailCount = 0, slackCount = 0 }) => {
  const pushEvents = useWebSocketFeed();

  return (
    <div className="flex flex-col w-full h-full space-y-4">

      {/* 📱 SMS, 📧 Email, 💬 Slack: Side-by-side scrollable vertical panels */}
  {/* SMS / Email / Slack */}
<div className="flex w-full justify-between space-x-4 mb-4 h-[50vh]">
  <div className="flex-1 overflow-y-auto border rounded p-2 bg-white text-sm">
   
    <LiveChannelFeed channel="sms" />
  </div>
  <div className="flex-1 overflow-y-auto border rounded p-2 bg-white text-sm">
    
    <LiveChannelFeed channel="email" />
  </div>
  <div className="flex-1 overflow-y-auto border rounded p-2 bg-white text-sm">
    
    <LiveChannelFeed channel="slack" />
  </div>
</div>


      {/* ⚡ PushBar: real-time WebSocket feed (horizontal, compact) */}
      <div className="mb-4 border-t pt-4">
        <h3 className="text-sm font-semibold text-purple-700 mb-2">⚡ Real-time Push Feed</h3>
        <div className="flex space-x-2 overflow-x-auto h-24 bg-black text-green-300 rounded p-3 text-xs font-mono">
          {pushEvents.length === 0 ? (
            <p className="italic text-gray-400">Waiting for push events...</p>
          ) : (
            pushEvents.slice(-3).map((event, idx) => (
              <div
                key={idx}
                className="min-w-max bg-gray-900 rounded p-2 border border-purple-500 shadow"
              >
                🧠 {event?.message || JSON.stringify(event)}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 📊 StatsBar: Live stats + Export CSV */}
      <StatsBar
        sms={smsCount}
        email={emailCount}
        slack={slackCount}
        pushEvents={pushEvents}
      />
 
<div className="w-full h-64 mt-4 p-4 bg-white border rounded shadow overflow-hidden">
  <NotificationLineChart
    stats={{
      sms: smsCount,
      email: emailCount,
      slack: slackCount,
      push: pushEvents.length,
    }}
  />
</div>


    </div>
  );
};

export default RightPanel;

