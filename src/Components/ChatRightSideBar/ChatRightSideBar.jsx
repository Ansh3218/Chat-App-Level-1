import React from "react";
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";

const ChatRightSideBar = () => {
  return (
    <div className="bg-[#001030] text-white overflow-y-scroll relative h-[85vh] font-[poppins]">
      <div className="rs">
        <div className="rs-profile flex flex-col items-center gap-y-4 py-8">
          <img src={assets.profile_img} alt="" className="rounded-full w-24" />
          <h3 className="flex items-center gap-x-2 text-xl">
            Richard Sanford{" "}
            <img src={assets.green_dot} alt="" className="w-5 h-5" />
          </h3>
          <p className="text-xs text-gray-300">
            Hey, There i am Richard Sanford using chat app
          </p>
        </div>
        <hr className="text-gray-500" />
        <div className="rs-media p-4">
          <p className="p-3 text-[14px]">Media</p>
          <div className="grid grid-cols-3 gap-2 p-3 max-h-[180px] overflow-y-scroll">
            <img
              className="w-[90px] cursor-pointer rounded-lg object-cover"
              src={assets.pic1}
              alt=""
            />
            <img
              className="w-[90px] cursor-pointer rounded-lg object-cover"
              src={assets.pic2}
              alt=""
            />
            <img
              className="w-[90px] cursor-pointer rounded-lg object-cover"
              src={assets.pic3}
              alt=""
            />
            <img
              className="w-[90px] cursor-pointer rounded-lg object-cover"
              src={assets.pic4}
              alt=""
            />
            <img
              className="w-[90px] cursor-pointer rounded-lg object-cover"
              src={assets.pic2}
              alt=""
            />
            <img
              className="w-[90px] cursor-pointer rounded-lg object-cover"
              src={assets.pic3}
              alt=""
            />
          </div>
          <button
            className="absolute left-1/2 bottom-5 -translate-x-1/2 bg-[#077eff] text-white border-none text-[14px] font-light p-[10px_65px] rounded-full cursor-pointer"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRightSideBar;
