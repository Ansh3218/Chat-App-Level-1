import React, { useContext, useRef, useState } from "react";
import assets from "../../assets/assets";
import { MdEdit } from "react-icons/md";
import { MdLogout } from "react-icons/md";
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
const ChatLeftSideBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { userData, chatData } = useContext(AppContext);
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

  const inputHandler = async (e) => {
    try {
      const input = e.target.value.trim().toLowerCase();
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input));

        const querySnap = await getDocs(q);
        const results = [];

        querySnap.forEach((doc) => {
          // 🟢 doc.data() ko function ke tarah call karna
          const data = doc.data();
          if (data.id !== userData.id) {
            let userExist = false;
            chatData.map((user) => {
              if (user.rId === querySnap.docs[0].data().id) {
                userExist = true;
              }
            });
            if (!userExist) {
              setUsers(querySnap.docs[0].data());
            }
            results.push(data);
          }
        });

        setUsers(results); // 🟢 All matched users ko state me set karo
      } else {
        setShowSearch(false);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error in search:", error);
    }
  };

  const addChat = async (user) => {
    // 🟢 Parameter add karo
    const messageRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");

    try {
      // Validation
      if (!user?.id || !userData?.id) {
        toast.error("User data is missing");
        return;
      }

      const newMessageRef = doc(messageRef);

      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatsRef, user.id), {
        // 🟢 users.id ki jagah user.id
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id, // 🟢 users.id ki jagah user.id
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      toast.success("Chat created successfully");
      setShowSearch(false); // Search band karo
      setUsers([]); // Users list clear karo
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <>
      <div className="ls bg-[#001030] font-[poppins] overflow-y-scroll overflow-hidden">
        <div className="sticky top-0 bg-[#001030] p-5">
          <div className="ls-nav flex items-center justify-between">
            <img src={assets.logo} alt="" className="logo w-36" />
            <div className="menu relative">
              <div
                onClick={openMenuFun}
                className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-full hover:bg-blue-500/30 transition"
              >
                <img src={assets.menu_icon} alt="" className="w-6 h-6" />
              </div>

              <div
                ref={menuRef}
                className="w-36 h-0 opacity-0 bg-white absolute right-0 rounded-lg flex flex-col items-start justify-center gap-y-1.5 transition-all duration-300 overflow-hidden"
              >
                <span className="flex items-center gap-x-2 hover:bg-gray-300 p-2 w-full transition-all duration-200">
                  <MdEdit />
                  <Link to={"/profile"}>
                    <p className="cursor-pointer font-bold text-nowrap">
                      Edit Profile
                    </p>
                  </Link>
                </span>

                <span className="flex items-center gap-x-2 hover:bg-gray-300 p-2 w-full transition-all duration-200">
                  <MdLogout />
                  <p className="cursor-pointer font-bold">Logout</p>
                </span>
              </div>
            </div>
          </div>
          <div className="ls-search bg-[#002670] text-white flex items-center gap-x-5 my-5 px-5 p-3 rounded-lg">
            <img src={assets.search_icon} alt="" className="w-5 h-5" />
            <input
              onChange={inputHandler}
              type="text"
              placeholder="Search here"
              className="placeholder:text-white outline-none"
            />
          </div>
        </div>
        <div className="ls-list text-white w-full h-[80%]">
          {showSearch && users.length > 0
            ? users.map((usr, idx) => (
                <div
                  onClick={() => addChat(usr)} // 🟢 Arrow function use karke usr pass karo
                  key={idx}
                  className="friends flex gap-3 items-end hover:bg-[#077EFF] pl-5 cursor-pointer overflow-y-scroll py-3"
                >
                  <img
                    src={
                      usr?.avatar && usr.avatar.trim() !== ""
                        ? usr.avatar
                        : assets.profile_img
                    }
                    alt="user avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[15px] leading-[15px]">{usr.name}</p>
                    <span className="text-[13px] text-gray-300">{usr.bio}</span>
                  </div>
                </div>
              ))
            : Array(6)
                .fill("")
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="friends flex gap-3 items-end hover:bg-[#077EFF] pl-5 cursor-pointer overflow-y-scroll py-3"
                  >
                    <img
                      src={assets.profile_img}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="">
                      <p className="text-[15px] leading-[15px]">
                        Richard Sanford
                      </p>
                      <span className="text-[13px] text-gray-300">
                        Hello, How are you?
                      </span>
                    </div>
                  </div>
                ))}
        </div>
      </div>
    </>
  );
};
export default ChatLeftSideBar;
