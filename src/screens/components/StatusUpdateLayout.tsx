import { useEffect } from "react";
import { StatusUpdateLayoutPropType } from "../../store/apiTypes";

const StatusUpdateLayout: React.FC<StatusUpdateLayoutPropType> = ({
  statusUpdate,
  setStatusUpdate,
}) => {
  const { status, message } = statusUpdate;
  const logo = require("../../asset/images/meristem_name_logo.png");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatusUpdate(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [setStatusUpdate, statusUpdate]);

  const getStatusColor = () =>
    status === "succeeded" ? "bg-green-300" : "bg-red-300";

  return (
    <>
      {statusUpdate && (
        <section
          className={`w-screen h-screen bg-opacity-80 fixed top-0 left-0 transform -translate-x-0 -translate-y-0 ${getStatusColor()} transition-all duration-500`}
        >
          <div
            className={`z-50 w-[50vw] lg:w-[300px] h-[150px] absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-md shadow-lg ${
              status === "succeeded" ? "bg-green-50" : "bg-red-50"
            } animate-bounce`}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <img
                src={logo}
                alt="Company Logo"
                className="w-70 lg:w-[200px] h-6 lg:h-12 rounded-md "
              />
              <h2
                className={`text-sm lg:text-xl font-semibold ${
                  status === "succeeded" ? "text-green-700" : "text-red-700"
                } `}
              >
                {status}
              </h2>
            </div>
            <p
              className={`text-xs text-gray-800 ${
                status === "succeeded" ? "text-green-700" : "text-red-700"
              } mt-4 text-center text-md `}
            >
              {message}
            </p>
          </div>
        </section>
      )}
    </>
  );
};

export default StatusUpdateLayout;
