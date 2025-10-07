import React, { useContext, useEffect, useState } from "react";
import ChatLeftSideBar from "../../Components/ChatLeftSideBar/ChatLeftSideBar";
import ChatBox from "../../Components/ChatBox/ChatBox";
import ChatRightSideBar from "../../Components/ChatRightSideBar/ChatRightSideBar";
import { AppContext } from "../../context/AppContext";
import { HiMenuAlt3 } from "react-icons/hi";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData]);

  return (
    <>
      <div className="min-h-screen grid place-items-center bg-gradient-to-tr from-[#013a63] via-[#014f86] via-[#468faf] to-[#a9d6e5] chat p-4 sm:p-6 lg:p-8">
        {loading ? (
          <p className="text-xl sm:text-2xl text-white font-[gilroy] tracking-widest">
            Loading...
          </p>
        ) : (
          <div className="chat-container w-full h-[85vh] max-w-[1300px] bg-[aliceblue] grid lg:grid-cols-[380px_1fr_320px] xl:grid-cols-[420px_1fr_350px] grid-cols-1 overflow-hidden rounded-xl shadow-2xl relative">
            {/* Hamburger Menu Button - Positioned inside chat container */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden absolute top-3 left-3 z-30 bg-blue-600 text-white p-2.5 sm:p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
              <HiMenuAlt3 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Overlay - Only covers chat container area */}
            {sidebarOpen && (
              <div
                className="lg:hidden absolute inset-0 bg-black/50 z-40 rounded-xl"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Left Sidebar - Constrained to chat container */}
            <div
              className={`lg:relative absolute inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
              ${
                sidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0"
              }
              w-[280px] sm:w-[320px] lg:w-full h-full`}
            >
              <ChatLeftSideBar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            </div>

            {/* Chat Box - Responsive */}
            <div className="relative w-full h-full">
              <ChatBox
                onMenuClick={() => setSidebarOpen(true)}
                onBackClick={() => setSidebarOpen(true)}
                onRightSidebarToggle={() =>
                  setRightSidebarOpen((prev) => !prev)
                }
              />
            </div>

            {/* Right Sidebar - Hidden on mobile/tablet */}
            {/* Right Sidebar */}
            <div
              className={`absolute lg:relative h-full right-0 top-0 z-50 transition-transform duration-300 ease-in-out
  ${rightSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
  w-[280px] sm:w-[320px] lg:w-full bg-[aliceblue]`}
            >
              <ChatRightSideBar />
            </div>

            {/* Overlay for right sidebar */}
            {rightSidebarOpen && (
              <div
                className="lg:hidden absolute inset-0 bg-black/50 z-40 rounded-xl"
                onClick={() => setRightSidebarOpen(false)}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
