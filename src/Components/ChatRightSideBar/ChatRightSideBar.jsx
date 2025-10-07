import React, { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";

const ChatRightSideBar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    let tempVar = [];
    messages.forEach((msg) => {
      if (msg.image) tempVar.push(msg.image);
    });
    setMsgImages(tempVar);
  }, [messages]);

  return chatUser ? (
    <div className="bg-[#001030] text-white overflow-y-scroll relative h-[85vh] font-[poppins]">
      <div className="rs">
        {/* ✅ Profile Section */}
        <div className="rs-profile flex flex-col items-center gap-y-4 py-8 px-3 sm:px-6 text-center">
          <img
            src={chatUser.userData.avatar}
            alt=""
            className="rounded-full w-20 h-20 sm:w-24 sm:h-24 object-cover"
          />
          <h3 className="flex items-center justify-center gap-x-2 text-lg sm:text-xl">
            {chatUser.userData.name}
            {Date.now() - chatUser.userData.lastSeen <= 60000 && (
              <img
                className="dot w-3.5 h-3.5 sm:w-4 sm:h-4"
                src={assets.green_dot}
                alt="online"
              />
            )}
          </h3>
          <p className="text-xs sm:text-sm text-gray-300">
            {chatUser.userData.bio}
          </p>
        </div>

        <hr className="border-gray-600" />

        {/* ✅ Media Section */}
        <div className="rs-media p-3 sm:p-5">
          <p className="pb-2 sm:pb-3 text-[13px] sm:text-[15px] font-medium">
            Media
          </p>

          <div className="relative">
            {/* Responsive Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 sm:p-3 max-h-[180px] sm:max-h-[220px] overflow-y-auto">
              {msgImages.map((url, idx) => (
                <img
                  src={url}
                  alt=""
                  key={idx}
                  onClick={() => setSelectedImg(url)}
                  className="w-full aspect-square cursor-pointer rounded-lg object-cover hover:opacity-80 transition-all duration-300"
                />
              ))}
            </div>

            {/* ✅ Image Popup */}
            {selectedImg && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 px-4"
                onClick={() => setSelectedImg(null)}
              >
                <div
                  className="relative rounded-2xl p-2 sm:p-3 shadow-2xl w-full max-w-[90vw] sm:max-w-[60vw] h-auto max-h-[80vh] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={selectedImg}
                    alt="preview"
                    className="max-h-[75vh] max-w-full object-contain rounded-xl"
                  />
                  <button
                    onClick={() => setSelectedImg(null)}
                    className="absolute top-3 right-4 text-2xl font-bold text-gray-200 hover:text-red-500 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ✅ Logout Button */}
          <button
            className="absolute left-1/2 bottom-5 -translate-x-1/2 bg-[#077eff] text-white border-none text-[13px] sm:text-[14px] font-light px-10 py-2 sm:py-2.5 rounded-full cursor-pointer hover:bg-[#066ad1] transition-all"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-[#001030] text-white overflow-y-scroll relative h-[85vh] font-[poppins]">
      <button
        onClick={() => logout()}
        className="absolute left-1/2 bottom-5 -translate-x-1/2 bg-[#077eff] text-white border-none text-[13px] sm:text-[14px] font-light px-10 py-2 sm:py-2.5 rounded-full cursor-pointer hover:bg-[#066ad1]"
      >
        Logout
      </button>
    </div>
  );
};

export default ChatRightSideBar;
