import React, { useEffect, useRef } from "react";
import useWebSocketFeed from "./useWebSocketFeed";

export default function PushBar() {
  const pushEvents = useWebSocketFeed();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll right when new push event arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [pushEvents]);

  return (
    <div className="w-full mt-4">
      <h3 className="text-base font-semibold mb-2 text-white">
        ⚡ Real-time Push Feed
      </h3>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-3 py-2 px-1 rounded bg-zinc-900 text-white h-24"
      >
        {pushEvents.length === 0 ? (
          <p className="italic text-gray-400 px-2">Waiting for push events...</p>
        ) : (
          pushEvents
            .slice(-5)
            .map((event, idx) => (
              <div
                key={idx}
                className="min-w-[240px] max-w-[300px] bg-zinc-800 p-3 rounded shadow text-sm text-white whitespace-pre-wrap leading-snug"
              >
                {event?.message.replace(/["]+/g, "")}
              </div>
            ))
        )}
      </div>
    </div>
  );
}

