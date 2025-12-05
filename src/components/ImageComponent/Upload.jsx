import { useState } from "react";
import { useDispatch } from "react-redux";
import { addImageLocal } from "../../store/slices/imagesSlice.js";
import { addImage } from "../../services/imageService.js";

function Upload() {
  const dispatch = useDispatch();
  const [newImage, setNewImage] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage({
        name: file.name,
        data: reader.result,
      });
    };
    reader.readAsDataURL(file);
  }

  async function saveImage() {
    if (!newImage) {
      alert("No image to save!");
      return;
    }

    try {
      const id = await addImage(newImage);

      dispatch(addImageLocal({ ...newImage, id }));

      setNewImage(null);
      alert("Image saved successfully!");
    }
    catch (err) {
      console.error("Save failed:", err);
      alert("Image save failed!");

    }
  }

  return (
    <div className="image-upload container py-4">
      <input type="file" accept="image/*" onChange={handleFileChange} className="form-control mb-3" />
      {newImage && <img src={newImage.data} alt={newImage.name} width="200" className="img-thumbnail mb-3" />}
      <button className="btn btn-success" onClick={saveImage}>💾 Save image</button>
    </div>
  );
}

export default Upload;
