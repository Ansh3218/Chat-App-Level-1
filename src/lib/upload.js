// lib/upload.js (Base64 Version with Compression)
import { toast } from "react-toastify";

// ✅ Function to compress image before converting to base64
const compressImage = (file, maxWidth = 800, quality = 0.7) => {
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

        // Resize if image is too large
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        canvas.toBlob(
          (blob) => {
            const compressedReader = new FileReader();
            compressedReader.readAsDataURL(blob);
            compressedReader.onloadend = () => {
              resolve(compressedReader.result);
            };
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = (error) => {
        reject(error);
      };
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};

const upload = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file) {
        reject(new Error("No file provided"));
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file!");
        reject(new Error("Invalid file type"));
        return;
      }

      console.log("📸 Original size:", (file.size / 1024).toFixed(2), "KB");

      // ✅ Compress image before converting to base64
      const base64 = await compressImage(file, 800, 0.7);

      console.log(
        "✅ Compressed size:",
        (base64.length / 1024).toFixed(2),
        "KB"
      );

      // Check if compressed size is still too large
      if (base64.length > 800 * 1024) {
        // 800KB limit
        toast.error("Image is too large even after compression!");
        reject(new Error("Image too large"));
        return;
      }

      // ✅ Optional: Save to localStorage (be careful with size limits)
      try {
        const storedImages = JSON.parse(
          localStorage.getItem("chatImages") || "[]"
        );
        const newImage = {
          id: Date.now(),
          base64,
          name: file.name,
          timestamp: new Date().toISOString(),
        };
        storedImages.push(newImage);

        // Keep only last 50 images to avoid storage issues
        if (storedImages.length > 50) {
          storedImages.shift();
        }

        localStorage.setItem("chatImages", JSON.stringify(storedImages));
      } catch (storageError) {
        console.warn("LocalStorage full or unavailable:", storageError);
        // Continue anyway, we still return the base64
      }

      // ✅ Return base64 string URL
      console.log("✅ Upload complete, returning base64 URL");
      resolve(base64);
    } catch (err) {
      console.error("❌ Upload error:", err);
      toast.error("Something went wrong during upload!");
      reject(err);
    }
  });
};

export default upload;
