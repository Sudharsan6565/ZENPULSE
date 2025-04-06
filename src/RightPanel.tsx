import React from "react";
import LiveChannelFeed from "./LiveChannelFeed";
import PushBar from "./PushBar";
import StatsBar from "./StatsBar";

export default function RightPanel() {
  return (
    <div className="flex flex-col justify-between h-full w-full px-4 py-2 gap-4 overflow-y-auto">
      {/* Top row: SMS, Email, Slack stacked vertically */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-1/2">
        <LiveChannelFeed channel="sms" />
        <LiveChannelFeed channel="email" />
        <LiveChannelFeed channel="slack" />
      </div>

      {/* Middle row: PushBar gets breathing room */}
      <div className="h-32">
        <PushBar />
      </div>

      {/* Bottom row: Stats + CSV */}
      <div className="mt-auto">
        <StatsBar />
      </div>
    </div>
  );
}

