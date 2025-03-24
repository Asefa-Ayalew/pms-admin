import { useState, useEffect } from "react";

export default function InternetConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [shouldShowAlert, setShouldShowAlert] = useState<boolean>(false);

  useEffect(() => {
    const updateConnectionStatus = () => {
      setIsConnected(navigator.onLine);
      setShouldShowAlert(!navigator.onLine);
    };

    // Update the connection status on mount
    updateConnectionStatus();

    const handleOnline = (): void => {
      setIsConnected(true);
      setTimeout(() => {
        setShouldShowAlert(false);
      }, 2000);
    };

    const handleOffline = (): void => {
      setIsConnected(false);
      setShouldShowAlert(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!shouldShowAlert) {
    return null;
  }

  const alertBackgroundColor = isConnected ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed w-full ${alertBackgroundColor} bottom-0 left-0 text-center text-white`}
      id="internet-connection-status"
    >
      {isConnected ? "Online" : "No internet"}
    </div>
  );
}