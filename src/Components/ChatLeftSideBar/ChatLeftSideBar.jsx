import React, { useContext, useRef, useState } from "react";
import assets from "../../assets/assets";
import { MdEdit, MdLogout, MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const ChatLeftSideBar = ({ isOpen, onClose }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { userData, chatData, setMessageId, messageId, setChatUser } =
    useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const openMenuFun = () => {
    setMenuOpen((prev) => {
      const newState = !prev;
      if (menuRef.current) {
        menuRef.current.style.height = newState ? "7rem" : "0rem";
        menuRef.current.style.opacity = newState ? "1" : "0";
      }
      return newState;
    });
  };

  let searchTimer;

  const inputHandler = (e) => {
    const input = e.target.value.trim().toLowerCase();

    clearTimeout(searchTimer);

    if (!input) {
      setShowSearch(false);
      setUsers([]);
      return;
    }

    searchTimer = setTimeout(async () => {
      try {
        setShowSearch(true);

        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input));
        const querySnap = await getDocs(q);

        if (querySnap.empty) {
          setUsers([]);
          toast.info("No user found with this username");
          return;
        }

        const userDoc = querySnap.docs[0].data();

        // Self check
        if (userDoc.id === userData.id) {
          setUsers([]);
          toast.info("You can't chat with yourself");
          return;
        }

        // Check if already in chat
        const alreadyInChat = chatData.some(
          (chat) => chat.userData?.id === userDoc.id
        );

        if (alreadyInChat) {
          setUsers([]);
          toast.info("This user is already in your chat list");
          return;
        }

        setUsers([userDoc]);
      } catch (error) {
        console.error("Error in search:", error);
        toast.error("Search failed, please try again");
      }
    }, 800);
  };

  const addChat = async (user) => {
    try {
      if (!user?.id || !userData?.id) {
        toast.error("User data is missing");
        return;
      }

      const messageRef = collection(db, "messages");
      const chatsRef = collection(db, "chats");
      const newMessageRef = doc(messageRef);

      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      // Add to recipient
      await updateDoc(doc(chatsRef, user.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
          userData: user,
        }),
      });

      // Add to current user
      await updateDoc(doc(chatsRef, userData.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
          userData: user,
        }),
      });

      toast.success("Chat created successfully");
      setShowSearch(false);
      setUsers([]);
      if (onClose) onClose();
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const setChat = async (item) => {
    try {
      setMessageId(item.messageId);
      setChatUser(item);
      const userChatsRef = doc(db, "chats", userData.id);
      const userChatsSnapshot = await getDoc(userChatsRef);
      const userChatsData = userChatsSnapshot.data();
      console.log(userChatsData);
      const chatIndex = userChatsData.chatData.findIndex(
        (c) => c.messageId === item.messageId
      );
      userChatsData.chatData[chatIndex].messageSeen = true;
      await updateDoc(userChatsRef, {
        chatData: userChatsData.chatData,
      });
      if (onClose) onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="ls bg-[#001030] font-[poppins] overflow-y-auto w-full h-full flex flex-col">
      {/* Header - Sticky */}
      <div className="sticky top-0 bg-[#001030] p-3 sm:p-4 lg:p-5 z-10 shadow-lg">
        <div className="ls-nav flex items-center justify-between">
          {/* Logo - Responsive sizing */}
          <img
            src={assets.logo}
            alt="Logo"
            className="logo w-24 sm:w-28 md:w-32 lg:w-36"
          />

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Close button - Only on mobile */}
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center cursor-pointer rounded-full hover:bg-red-500/30 transition text-white"
            >
              <MdClose className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Menu Icon */}
            <div className="menu relative">
              <div
                onClick={openMenuFun}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center cursor-pointer rounded-full hover:bg-blue-500/30 transition"
              >
                <img
                  src={assets.menu_icon}
                  alt="Menu"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </div>

              {/* Dropdown Menu */}
              <div
                ref={menuRef}
                className="w-32 sm:w-36 h-0 opacity-0 bg-white absolute right-0 rounded-lg flex flex-col items-start justify-center gap-y-1.5 transition-all duration-300 overflow-hidden shadow-xl"
              >
                <Link
                  to={"/profile"}
                  className="w-full"
                  onClick={() => {
                    setMenuOpen(false);
                    if (onClose) onClose();
                  }}
                >
                  <span className="flex items-center gap-x-2 hover:bg-gray-300 p-2 w-full transition-all duration-200">
                    <MdEdit className="text-sm sm:text-base" />
                    <p className="cursor-pointer font-bold text-xs sm:text-sm text-nowrap">
                      Edit Profile
                    </p>
                  </span>
                </Link>
                <span className="flex items-center gap-x-2 hover:bg-gray-300 p-2 w-full transition-all duration-200 cursor-pointer">
                  <MdLogout className="text-sm sm:text-base" />
                  <p className="font-bold text-xs sm:text-sm">Logout</p>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar - Responsive */}
        <div className="ls-search bg-[#002670] text-white flex items-center gap-x-3 sm:gap-x-4 lg:gap-x-5 my-3 sm:my-4 lg:my-5 px-3 sm:px-4 lg:px-5 p-2 sm:p-2.5 lg:p-3 rounded-lg">
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
          />
          <input
            onChange={inputHandler}
            type="text"
            aria-autocomplete="none"
            placeholder="Search here"
            className="placeholder:text-white outline-none bg-transparent w-full text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Chat List - Scrollable */}
      <div className="ls-list text-white flex-1 overflow-y-auto">
        {showSearch && users.length > 0
          ? users.map((usr, idx) => (
              <div
                onClick={() => addChat(usr)}
                key={idx}
                className="friends flex gap-2 sm:gap-3 items-center hover:bg-[#077EFF] px-3 sm:px-4 lg:px-5 cursor-pointer py-2.5 sm:py-3 transition-colors duration-200 active:bg-[#0668cc]"
              >
                <img
                  src={usr?.avatar || assets.profile_img}
                  alt="user avatar"
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 overflow-hidden min-w-0">
                  <p className="text-sm sm:text-[15px] leading-tight font-medium truncate">
                    {usr.name || usr.username || "Unknown"}
                  </p>
                  <span className="text-xs sm:text-[13px] text-gray-300 block truncate mt-0.5">
                    {usr.bio || "Hey there! I'm using chat app"}
                  </span>
                </div>
              </div>
            ))
          : Array.from(
              new Map(
                chatData
                  .filter((item) => item.userData)
                  .map((item) => [item.userData.id, item])
              ).values()
            ).map((item, idx) => (
              <div
                onClick={() => setChat(item)}
                key={idx}
                className={`friends flex gap-2 sm:gap-3 items-center hover:bg-[#077EFF] px-3 sm:px-4 lg:px-5 cursor-pointer py-2.5 sm:py-3 transition-colors duration-200 active:bg-[#0668cc]
                  ${
                    item.messageSeen || item.messageId === messageId
                      ? ""
                      : "bg-[#002670]"
                  }`}
              >
                <img
                  src={item.userData.avatar || assets.profile_img}
                  alt="user avatar"
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 overflow-hidden min-w-0">
                  <p className="text-sm sm:text-[15px] leading-tight font-medium truncate">
                    {item.userData.name || item.userData.username}
                  </p>
                  <span className="text-xs sm:text-[13px] text-gray-300 block truncate mt-0.5">
                    {item.lastMessage
                      ? item.lastMessage
                      : item.userData.bio || "Hey there! I'm using chat app"}
                  </span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ChatLeftSideBar;
