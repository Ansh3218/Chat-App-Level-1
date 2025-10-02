import React from "react";
import ChatLeftSideBar from "../../Components/ChatLeftSideBar/ChatLeftSideBar";
import ChatBox from "../../Components/ChatBox/ChatBox";
import ChatRightSideBar from "../../Components/ChatRightSideBar/ChatRightSideBar";

const Chat = () => {
  return (
    <>
      <div
        className="min-h-screen grid place-items-center 
    bg-gradient-to-tr from-[#013a63] via-[#014f86] via-[#468faf] to-[#a9d6e5] chat"
      >
        <div className="chat-container w-[100%] h-[85vh] max-w-[1300px] bg-[aliceblue] grid grid-cols-[1fr_2fr_1fr]">
          <ChatLeftSideBar />
          <ChatBox />
          <ChatRightSideBar />
        </div>
      </div>
    </>
  );
};

export default Chat;
