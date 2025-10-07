import React, { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const { setUserData } = useContext(AppContext);

  // 🟢 Convert File to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  // 🟢 Compress image before converting to Base64
  const compressImage = (file, maxSizeKB = 100) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Reduce dimensions if image is too large
          const maxDimension = 400;
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          let quality = 0.7;
          let base64 = canvas.toDataURL("image/jpeg", quality);

          // Further compress if still too large
          while (base64.length > maxSizeKB * 1024 && quality > 0.1) {
            quality -= 0.1;
            base64 = canvas.toDataURL("image/jpeg", quality);
          }

          resolve(base64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const profileUpdate = async (e) => {
    e.preventDefault();

    try {
      if (!prevImage && !image) {
        toast.error("Upload profile picture");
        return;
      }

      const docRef = doc(db, "users", uid);
      let avatarBase64 = prevImage;

      if (image) {
        // 🟢 Compress and convert to Base64
        avatarBase64 = await compressImage(image);
        setPrevImage(avatarBase64);
      }

      // 🟢 Save Base64 string in Firestore
      await updateDoc(docRef, {
        bio: bio,
        name: name,
        avatar: avatarBase64, // ✅ Base64 Firestore mein save
      });

      const snap = await getDoc(docRef);
      setUserData(snap.data());
      toast.success("Profile updated successfully!");
      navigate("/chat");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || "");
            setBio(data.bio || "");
            setPrevImage(data.avatar || "");

            // ✅ Ab redirect sirf tab hoga jab name/bio na ho (yaani new user ho)
            if (!data.name || !data.bio) {
              console.log("Profile incomplete — stay on profile page");
            }
          }
        } catch (err) {
          console.error("[Firestore] Error fetching user document:", err);
        }
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate, setUserData]);

  return (
    <div>
      <div className="min-h-screen w-full flex items-center justify-center profile bg-[url('/background.png')] font-[poppins]">
        <div className="profile-container rounded-2xl w-[50%] h-96 bg-white flex items-center gap-x-36 p-10">
          <form
            onSubmit={profileUpdate}
            className="flex items-start flex-col gap-y-6"
          >
            <h2 className="text-2xl font-bold">Profile Details</h2>

            <label
              htmlFor="avatar"
              className="flex items-center gap-x-2.5 text-gray-500 font-bold cursor-pointer"
            >
              <input
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
                type="file"
                id="avatar"
                accept=".png, .jpg, .jpeg"
                hidden
              />
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : prevImage || assets.avatar_icon
                }
                alt="avatar-preview"
                className="w-12 h-12 object-cover rounded-full"
              />
              upload profile image
            </label>

            <input
              type="text"
              placeholder="Your name"
              required
              className="border-2 border-gray-400 w-80 px-5 py-3"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />

            <textarea
              placeholder="Write profile bio"
              required
              className="px-5 py-3 border-2 border-gray-400 w-80"
              cols={40}
              style={{ resize: "none" }}
              onChange={(e) => setBio(e.target.value)}
              value={bio}
            ></textarea>

            <button
              type="submit"
              className="bg-[#077EFF] w-80 py-2 text-white text-xl"
            >
              Save
            </button>
          </form>

          <img
            src={
              image ? URL.createObjectURL(image) : prevImage || assets.logo_icon
            }
            alt="preview-logo"
            className="w-36 h-36 rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
