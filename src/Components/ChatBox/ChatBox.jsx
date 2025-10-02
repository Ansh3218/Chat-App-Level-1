import React from "react";
import assets from "../../assets/assets";
import { LuSendHorizontal } from "react-icons/lu";
import { IoImageOutline } from "react-icons/io5";

const ChatBox = () => {
  return (
    <>
      <div className="check-box min-h-[85vh] w-full font-[arial] relative">
        <div className="chat-user flex items-center  justify-between w-full p-3 shadow-xl shadow-black/5">
          <div className="flex items-center gap-x-3">
            <img
              src={assets.profile_img}
              alt=""
              className="w-12 rounded-full"
            />
            <p className="flex items-center text-nowrap text-xl gap-x-2.5">
              Richard Sanford{" "}
              <img className="dot w-4" src={assets.green_dot} alt="" />
            </p>
          </div>
          <img src={assets.help_icon} className="help w-6" alt="" />
        </div>

        <div className="chat-msg h-[65vh] overflow-y-scroll flex flex-col-reverse p-5 font-[poppins]">
          <div className="s-msg flex items-end justify-end gap-2 py-3.5">
            <p className="msg text-white bg-[#077EFF] p-[8px] max-w-[300px] text-[12px] font-light rounded-xl rounded-br-none mb-8">
              Lorem ipsum dolor, sit amet consectetur adipisicing elirrt. Ex,
              minima....
            </p>
            <div className="">
              <img
                src={assets.profile_img}
                alt=""
                className="w-12 rounded-full"
              />
              <p className="text-[13px] text-center">2:50 PM</p>
            </div>
          </div>
          <div className="s-msg flex items-end justify-end gap-2 py-3.5">
            <img
              src={assets.pic1}
              alt=""
              className="max-w-[240px] mb-[30px] rounded-[10px]"
            />
            <div className="">
              <img
                src={assets.profile_img}
                alt=""
                className="w-12 rounded-full"
              />
              <p className="text-[13px] text-center">2:50 PM</p>
            </div>
          </div>
          <div className="r-msg flex flex-row-reverse items-end justify-end gap-2 py-3.5">
            <p className="msg text-white bg-[#077EFF] p-[8px] max-w-[300px] text-[13px] font-light rounded-xl rounded-bl-none mb-8">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex,
              minima....
            </p>
            <div className="">
              <img
                src={assets.profile_img}
                alt=""
                className="w-12 rounded-full"
              />
              <p className="text-[13px] text-center">2:50 PM</p>
            </div>
          </div>
        </div>

        <div className="chat-input flex justify-between items-center p-3 px-6 absolute w-full bottom-0 left-0 shadow-2xl shadow-black font-[poppins]">
          <input
            type="text"
            placeholder="Send a message"
            className="placeholder:text-black outline-none w-[70%]"
          />
          <div className="flex gap-x-3 items-start">
            <input
              type="file"
              id="image"
              accept="image/png, image/jpeg, image/jpg"
              hidden
            />
            <label htmlFor="image">
              <span className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-300 p-1 transition-all duration-300">
                <IoImageOutline className="text-2xl cursor-pointer" />
              </span>
            </label>
            <span className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-300">
              <LuSendHorizontal className="text-2xl cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
