import React from "react";
import useWebSocketFeed from "./useWebSocketFeed";

export default function PushBar() {
  const pushEvents = useWebSocketFeed();

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold mb-2">⚡ Real-time Push Feed</h3>
      <div className="flex space-x-2 overflow-x-auto h-24 text-xs">
        {pushEvents.length === 0 ? (
          <p className="italic text-gray-400">Waiting for push events...</p>
        ) : (
          pushEvents.slice(-3).map((event, idx) => (
            <div
              key={idx}
              className="min-w-max border rounded p-2 bg-gray-800 text-green-200"
            >
              🧠 {event?.message || JSON.stringify(event)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

