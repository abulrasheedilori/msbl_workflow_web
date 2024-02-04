import { memo } from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-8">
        <img
          src={require("../../asset/images/meristem_name_logo.png")}
          alt=""
          className="bg-green-200 w-50 h-5 lg:w-[200px] lg:h-12 rounded-xl shadow-md m-1 lg:m-8 animate-spin"
        />
        <p className="w-full h-full text-center">Loading...</p>
      </div>
      <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default memo(Loading);
