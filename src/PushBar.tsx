import useWebSocketFeed from "./useWebSocketFeed";

export default function PushBar() {
  const pushEvents = useWebSocketFeed();

  return (
    <div className="bg-yellow-50 rounded p-3 shadow text-sm overflow-y-auto border border-yellow-300 flex flex-col gap-2 h-[200px]">
      <h3 className="text-sm font-semibold mb-2 text-yellow-800">
        ⚡ Real-time Push Feed
      </h3>

      {pushEvents.length === 0 ? (
        <p className="italic text-gray-500">Waiting for push events...</p>
      ) : (
        <div className="flex flex-col space-y-2 overflow-y-auto">
          {pushEvents.slice(-5).map((event, index) => (
            <div
              key={index}
              className="bg-white text-gray-800 p-2 rounded shadow text-xs whitespace-pre-wrap"
            >
              {event.message.replace(/["]+/g, "")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

