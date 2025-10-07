import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate(null);
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [messageId, setMessageId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.warn("User data not found, creating default document...");
        await setDoc(userRef, {
          id: uid,
          username: "",
          name: "",
          avatar: "https://i.ibb.co/2n4pJjK/default-avatar.png",
          bio: "Hey, There I am using chat app",
          lastSeen: Date.now(),
        });
        return loadUserData(uid); // re-call after creating doc
      }

      const userData = userSnap.data();
      setUserData(userData);
      if (userData.avatar && userData.name) {
        navigate("/chat");
      } else {
        navigate("/profile");
      }

      await updateDoc(userRef, { lastSeen: Date.now() });
      setInterval(async () => {
        if (auth.chatUser) {
          await updateDoc(userRef, { lastSeen: Date.now() });
        }
      }, 60000);
    } catch (error) {
      toast.error(error.message || "Failed to load user data");
      console.error(error);
    }
  };

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        if (!res.exists()) {
          setChatData([]);
          return;
        }

        const data = res.data();
        const chatItems = data.chatData || [];

        const tempData = [];
        for (const item of chatItems) {
          const userRef = doc(db, "users", item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          tempData.push({ ...item, userData });
        }

        setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
      });

      return () => {
        unSub();
      };
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,
    setMessages,
    messageId,
    setMessageId,
    chatUser,
    setChatUser,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
