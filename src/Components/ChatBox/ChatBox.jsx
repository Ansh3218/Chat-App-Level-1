import React, { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import { LuSendHorizontal } from "react-icons/lu";
import { IoImageOutline } from "react-icons/io5";
import { AppContext } from "../../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
import upload from "../../lib/upload";

const ChatBox = ({ onRightSidebarToggle }) => {
  const { userData, messageId, chatUser, messages, setMessages } =
    useContext(AppContext);
  const [input, setInput] = useState("");

  // Function to send text message
  const sendMessage = async () => {
    try {
      if (input && messageId) {
        // Update messages array in Firestore
        await updateDoc(doc(db, "messages", messageId), {
          messages: arrayUnion({
            sId: userData?.id || "",
            text: input || "",
            createdAt: new Date().toISOString(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];

        // ✅ Changed forEach to for...of for better async handling
        for (const id of userIDs) {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatData.findIndex(
              (c) => c.messageId === messageId
            );

            if (chatIndex > -1) {
              userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30);
              userChatData.chatData[chatIndex].updatedAt = Date.now();

              if (userChatData.chatData[chatIndex].rId === userData.id) {
                userChatData.chatData[chatIndex].messageSeen = false;
              }

              await updateDoc(userChatsRef, {
                chatData: userChatData.chatData,
              });
            }
          }
        }

        setInput(""); // Clear input after sending
      }
    } catch (error) {
      console.error("❌ Send message error:", error);
      toast.error(error.message);
    }
  };

  // Real-time listener for messages
  useEffect(() => {
    if (messageId) {
      const unSub = onSnapshot(doc(db, "messages", messageId), (res) => {
        const msgs = res.data()?.messages || [];
        setMessages(msgs.reverse());
      });
      return () => unSub();
    }
  }, [messageId, setMessages]);

  // Convert Firestore timestamp to readable time
  const convertTimeStamp = (timestamp) => {
    let date;

    if (!timestamp) return "";

    if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === "number") {
      date = new Date(timestamp);
    } else {
      return "";
    }

    const hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    const formattedMinute = minute.toString().padStart(2, "0");

    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };

  // ✅ FIXED: Function to send image
  const sendImage = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) {
        console.log("❌ No file selected");
        return;
      }

      console.log("📸 File selected:", file.name, "Size:", file.size);

      // Upload file and get base64 URL
      const fileUrl = await upload(file);

      // 🔍 DEBUG: Check what upload returned
      console.log("🧪 Type of fileUrl:", typeof fileUrl);
      console.log("🧪 Is string?", typeof fileUrl === "string");

      // ✅ Explicit type checking
      if (!fileUrl || typeof fileUrl !== "string") {
        toast.error("Upload failed - invalid URL");
        return;
      }

      if (!messageId) {
        toast.error("Message ID missing!");
        return;
      }

      // ✅ Create CLEAN object with ONLY primitive types
      const msgData = {
        sId: String(userData?.id || ""),
        image: String(fileUrl),
        createdAt: new Date().toISOString(),
      };

      // 🔍 DEBUG: Verify all values are strings
      console.log("🧾 Sending message types:", {
        sId: typeof msgData.sId,
        image: typeof msgData.image,
        createdAt: typeof msgData.createdAt,
      });

      // ✅ FIXED: Get existing messages first, then append
      const messageDocRef = doc(db, "messages", messageId);
      const messageDoc = await getDoc(messageDocRef);

      if (messageDoc.exists()) {
        const existingMessages = messageDoc.data().messages || [];

        // Add new message to array
        await updateDoc(messageDocRef, {
          messages: [...existingMessages, msgData],
        });

        console.log("✅ Image message sent successfully");
      } else {
        toast.error("Message document not found!");
        return;
      }

      // Update chat previews for both users
      const userIDs = [chatUser.rId, userData.id];

      // ✅ Changed forEach to for...of
      for (const id of userIDs) {
        const userChatsRef = doc(db, "chats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatData = userChatsSnapshot.data();
          const chatIndex = userChatData.chatData.findIndex(
            (c) => c.messageId === messageId
          );

          if (chatIndex > -1) {
            userChatData.chatData[chatIndex].lastMessage = "Image";
            userChatData.chatData[chatIndex].updatedAt = Date.now();

            if (userChatData.chatData[chatIndex].rId === userData.id) {
              userChatData.chatData[chatIndex].messageSeen = false;
            }

            await updateDoc(userChatsRef, {
              chatData: userChatData.chatData,
            });
          }
        }
      }

      // ✅ Reset file input after successful upload
      e.target.value = "";
    } catch (error) {
      console.error("❌ Image send error:", error);
      toast.error("Image send failed: " + error.message);
    }
  };

  return chatUser ? (
    <div className="check-box min-h-[85vh] w-full font-[arial] relative">
      {/* Chat Header */}
      <div className="chat-user flex items-center justify-between w-full p-3 shadow-xl shadow-black/5">
        <div className="flex items-center gap-x-3">
          <img
            src={chatUser.userData?.avatar || assets.profile_img}
            alt="avatar"
            className="w-12 h-12 object-cover rounded-full max-[1000px]:ml-16"
          />
          <p className="flex items-center text-nowrap text-xl gap-x-2.5">
            {chatUser.userData?.name || "Unknown User"}
            {Date.now() - chatUser.userData.lastSeen <= 60000 ? (
              <img
                className="dot w-4 h-4"
                src={assets.green_dot}
                alt="online"
              />
            ) : null}
          </p>
        </div>
        <img
          src={assets.help_icon}
          className="help w-6 hidden max-[1000px]:block cursor-pointer"
          alt="menu"
          onClick={onRightSidebarToggle} // 👈 ye function prop ke through handle hoga
        />
      </div>

      {/* Messages Container */}
      <div className="chat-msg h-[65vh] overflow-y-scroll flex flex-col-reverse p-5 font-[poppins]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sId === userData.id
                ? "s-msg flex items-end justify-end gap-2 py-3.5"
                : "r-msg flex flex-row-reverse items-end justify-end gap-2 py-3.5"
            }
          >
            {msg.text && (
              <p
                className={
                  msg.sId === userData.id
                    ? "msg text-white bg-[#077EFF] p-[8px] max-w-[300px] text-[12px] font-light rounded-xl rounded-br-none mb-8"
                    : "msg text-white bg-[#077EFF] p-[8px] max-w-[300px] text-[13px] font-light rounded-xl rounded-bl-none mb-8"
                }
              >
                {msg.text}
              </p>
            )}
            {msg.image && (
              <img
                src={msg.image}
                alt="sent"
                className="max-w-[240px] mb-[30px] rounded-[10px]"
              />
            )}
            <div>
              <img
                src={
                  msg.sId === userData.id
                    ? userData.avatar || assets.profile_img
                    : chatUser.userData?.avatar || assets.profile_img
                }
                alt="avatar"
                className="w-12 h-12 object-cover rounded-full"
              />
              <p className="text-[13px] text-center">
                {convertTimeStamp(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="chat-input flex justify-between items-center p-3 px-6 absolute w-full bottom-0 left-0 shadow-2xl shadow-black font-[poppins] bg-white">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send a message"
          aria-autocomplete="none"
          className="placeholder:text-black bg-transparent outline-none w-[70%]"
          onKeyDown={(e) => {
            // ✅ Enter key to send message
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <div className="flex gap-x-3 items-start">
          <input
            onChange={sendImage}
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
            <LuSendHorizontal
              onClick={sendMessage}
              className="text-2xl cursor-pointer"
            />
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center">
      <img
        src={assets.logo_icon}
        alt="chat-welcome"
        className="w-[5vw] min-w-[2rem]"
      />
      <p className="font-bold font-[poppins] text-xl">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatBox;
