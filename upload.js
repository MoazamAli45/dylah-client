import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-storage.js";
import {
  getDatabase,
  ref as databaseRef,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyCbC64WTIRcZt8qWHJpbmqD_1s4Vcl7JV0",
  authDomain: "dashboard-images-3d2b6.firebaseapp.com",
  projectId: "dashboard-images-3d2b6",
  storageBucket: "dashboard-images-3d2b6.appspot.com",
  messagingSenderId: "123036189390",
  appId: "1:123036189390:web:63fce8b5d4dd9dcb03c69f",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

const fileInputs = document.querySelectorAll(".upload-input");
const textInputs = document.querySelectorAll(".text-input");

fileInputs.forEach((fileInput, index) => {
  const imagePreview = document.getElementById(`imagePreview${index + 1}`);

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        imagePreview.innerHTML = "";
        imagePreview.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });
});

// async function saveImage() {
//   const images = [];
//   let hasSelectedImage = false; // Flag to track if at least one image is selected
//   try {
//     fileInputs.forEach((fileInput, index) => {
//       const file = fileInput.files[0];
//       const linkInput = textInputs[index];
//       const link = linkInput.value.trim(); // Get link input value

//       if (file) {
//         hasSelectedImage = true;
//         uploadImage(file, link, index + 1);
//       }
//     });
//     if (!hasSelectedImage) {
//       alert("Please select an image");
//       return; // Stop execution if no image is selected
//     }
//     alert("Image uploaded successfully");
//   } catch (error) {
//     console.error("Error saving image:", error);
//   }
// }
async function saveImage() {
  const images = [];
  let hasSelectedImage = false; // Flag to track if at least one image is selected
  try {
    images.length = 0; // Reset the images array before processing new uploads

    fileInputs.forEach((fileInput, index) => {
      const file = fileInput.files[0];
      const linkInput = textInputs[index];
      const link = linkInput.value.trim(); // Get link input value

      if (file) {
        hasSelectedImage = true;
        uploadImage(file, link, index + 1);
      }
    });

    if (!hasSelectedImage) {
      alert("Please select an image");
      return; // Stop execution if no image is selected
    }
    alert("Image uploaded successfully");
  } catch (error) {
    console.error("Error saving image:", error);
  }
}
const saveBtn = document.querySelector(".save-button");
if (saveBtn) {
  saveBtn.addEventListener("click", saveImage);
}

async function uploadImage(file, link, index) {
  const imageName = Date.now() + "_" + file.name;
  const imageRef = ref(storage, `images/image_${index}_${imageName}`);

  try {
    const snapshot = await uploadBytes(imageRef, file);
    console.log("Uploaded a file:", snapshot.ref.fullPath);
    const imageUrl = await getDownloadURL(snapshot.ref);
    saveImageToDatabase(imageUrl, link); // Pass both image URL and link to save
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

function saveImageToDatabase(imageUrl, link) {
  const imagesRef = databaseRef(database, "images");
  const imageData = { imageUrl, link }; // Create an object containing both image URL and link
  push(imagesRef, imageData)
    .then(() => {
      console.log("Image reference saved to database");
    })
    .catch((error) => {
      alert("Error saving image reference to database");
      console.error("Error saving image reference to database:", error);
    });
}

//   fetching Images

// Function to set background image for an element
function setBackgroundImage(elementId, imageUrl, linkId, linkUrl) {
  const element = document.getElementById(elementId);
  const link = document.getElementById(linkId);
  if (!imageUrl) return;
  if (element) {
    link.setAttribute("href", linkUrl || "/"); // Set href attribute for the element
    element.style.backgroundImage = `url('${imageUrl}')`; // Wrap imageUrl with single quotes
    element.style.backgroundSize = "cover"; // Ensure the background size is set appropriately
  }
}

// Fetch images from Firebase Database and set as background
function fetchAndSetBackgrounds() {
  const imagesRef = databaseRef(database, "images");
  onValue(imagesRef, (snapshot) => {
    const imageUrls = [];
    snapshot.forEach((childSnapshot) => {
      const { imageUrl, link } = childSnapshot.val();
      //  const { imageUrl, link } = childSnapshot.val(); // Destructure imageUrl and link from snapshot data
      //       imageData.push({ imageUrl, link }); /
      imageUrls.push({ imageUrl, link });
    });

    // Set background images for specific elements
    setBackgroundImage(
      "card1",
      imageUrls[imageUrls.length - 1].imageUrl,
      "link1",
      imageUrls[imageUrls.length - 1].link
    ); // Replace 'card1' with the ID of your first card element
    setBackgroundImage(
      "card2",
      imageUrls[imageUrls.length - 2].imageUrl,
      "link2",
      imageUrls[imageUrls.length - 2].link
    ); // Replace 'card2' with the ID of your second card element
    setBackgroundImage(
      "card3",
      imageUrls[imageUrls.length - 3].imageUrl,
      "link3",
      imageUrls[imageUrls.length - 3].link
    ); // Replace 'card3' with the ID of your third card element
    setBackgroundImage(
      "card4",
      imageUrls[imageUrls.length - 4].imageUrl,
      "link4",
      imageUrls[imageUrls.length - 4].link
    ); // Replace 'card4' with the ID of your fourth card element
  });
}

// Call the function to fetch and set background images
fetchAndSetBackgrounds();
