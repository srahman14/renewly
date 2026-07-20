import toast from "react-hot-toast";
import { Bell, BellOff } from "lucide-react";
export const ToggleNotificationToast = (muted: boolean, contract: string) => {
  return toast.custom(
    <div className=" pointer-events-auto flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm text-ink shadow-md ">
      {" "}
      {muted ? (
        <BellOff className="h-4 w-4 shrink-0 text-teal" />
      ) : (
        <Bell className="h-4 w-4 shrink-0 text-amber" />
      )}{" "}
      <span>
        {" "}
        Notifications {muted ? "muted" : "unmuted"} for{" "}
        <span className="font-medium">{contract}</span>{" "}
      </span>{" "}
    </div>,
    { duration: 2500 },
  );
};
