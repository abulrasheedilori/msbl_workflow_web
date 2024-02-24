import React, { memo, useEffect } from "react";

export type StatusProps = {
  status: string;
  title: string;
  message: string;
  showStatus?: boolean;
  setShowStatus: (e: boolean) => void;
};

const Status: React.FC<StatusProps> = ({
  status,
  title,
  message,
  showStatus,
  setShowStatus,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setShowStatus(false);
    }, 2000);
  }, [status, title, message, showStatus, setShowStatus]);

  return (
    <>
      {showStatus && (
        <div
          className={`w-container p-4 mx-2vw lg:w-fit fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
            status === "succeeded" ? "bg-green-200" : "bg-red-200"
          } p-4 rounded-md shadow-md`}
        >
          <div className="flex items-center space-x-2">
            <p className="p-2 m-2 text-4xl font-bold text-green-900 border-2 border-green-900 rounded-full animate-spin border-spacing-8">
              M
            </p>
            <div>
              <h3 className="font-semibold whitespace-normal text-md lg:text-2xl text-green-950">
                {title}
              </h3>
              <p className="text-xs text-black whitespace-normal lg:text-lg">
                {message}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Status);
