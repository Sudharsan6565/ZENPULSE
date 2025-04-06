import React from "react";
import useWebSocketFeed from "./useWebSocketFeed";

export default function PushBar() {
  const pushEvents = useWebSocketFeed();

  return (
    <div className="w-full mt-4">
      <h3 className="text-sm font-semibold mb-2 text-white">⚡ Real-time Push Feed</h3>
      <div className="flex overflow-x-auto gap-3 py-2 px-1 rounded bg-zinc-900 text-white h-24">
        {pushEvents.length === 0 ? (
          <p className="italic text-gray-400">Waiting for push events...</p>
        ) : (
          [...pushEvents]
            .reverse()
            .slice(0, 3)
            .map((event, idx) => (
              <div
                key={idx}
                className="min-w-[220px] max-w-[300px] bg-zinc-800 p-3 rounded shadow"
              >
                <p className="text-xs">{event?.message || JSON.stringify(event)}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

