import { Delete, Trash } from "lucide-react";
import React from "react";

const Sessions = () => {
  const sessions = [
    {
      device: "Windows 10",
      ip: "127.0.0.1",
      lastActive: "2 days ago",
    },
    {
      device: "MacOS",
      ip: "127.0.0.1",
      lastActive: "5 days ago",
    },
  ];
  // const serverUrl = import.meta.env.VITE_SERVER_URL;
  // console.log("env link", serverUrl);
  return (
    <div className="w-full h-full">
      <div className="w-full p-6">
        <h2 className="text-2xl tracking-wider text-neutral-500">Sessions</h2>
      </div>
      <div className="w-full h-full rounded-xl shadow-md bg-white ring-1 ring-neutral-100">
        {sessions.map((session) => {
          return (
            <div className="w-full border border-t-0 border-l-0 border-r-0 border-neutral-200 p-6 flex flex-row items-start justify-between">
              <div>
                <p className="text-neutral-500 text-sm">Device</p>
                <p className="text-neutral-700">{session.device}</p>
              </div>
              <div>
                <p className="text-neutral-500 text-sm">IP Address</p>
                <p className="text-neutral-700">{session.ip}</p>
              </div>
              <div>
                <Trash size={20} color="gray" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sessions;
