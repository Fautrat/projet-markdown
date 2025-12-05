import { useState } from "react";
import { useDispatch } from "react-redux";
import { addImageLocal } from "../../store/slices/imagesSlice.js";
import { addImage } from "../../services/imageService.js";

function Upload() {
  const dispatch = useDispatch();
  const [newImage, setNewImage] = useState(null);
  const [bulkImages, setBulkImages] = useState(null);

  async function importMultipleMdlc(file) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const cleaned = parsed.map(img => ({
        name: img.name,
        data: img.data.replace(/\s+/g, ""),
      }));

      setBulkImages(cleaned);
      setNewImage(null);

      alert(`${cleaned.length} images loaded for import.`);
    }
    catch (err) {
      console.error("Invalid .imgs.mdlc:", err);
      alert("Failed to import .imgs.mdlc file!");
    }
  }



  async function importSingleMdlc(file) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.data || !parsed.name) {
        alert("Invalid .img.mdlc file format !");
        return;
      }

      setNewImage({
        name: parsed.name,
        data: parsed.data,
      });
      setBulkImages(null);
    }
    catch (err) {
      console.error("Invalid .img.mdlc:", err);
      alert("Failed to import .img.mdlc file");
    }
  }

  function importNormalImage(file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage({
        name: file.name,
        data: reader.result,
      });
      setBulkImages(null);
    };
    reader.readAsDataURL(file);
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith(".imgs.mdlc")) {
      return importMultipleMdlc(file);
    }

    if (file.name.endsWith(".img.mdlc")) {
      return importSingleMdlc(file);
    }

    importNormalImage(file);
  }

  async function saveImage() {
    if (!newImage) {
      alert("No image to save ");
      return;
    }

    try {
      const id = await addImage(newImage);

      dispatch(addImageLocal({ ...newImage, id }));

      setNewImage(null);
      alert("Image saved successfully !");
    }
    catch (err) {
      console.error("Save failed:", err);
      alert("Image save failed !");

    }
  }

  async function saveBulkImages() {
    if (!bulkImages || bulkImages.length === 0) {
      alert("No images to import!");
      return;
    }

    try {
      for (const img of bulkImages) {
        const id = await addImage(img);
        dispatch(addImageLocal({ ...img, id }));
      }

      alert(`${bulkImages.length} images imported successfully!`);
      setBulkImages(null);
    }
    catch (err) {
      console.error("Bulk import failed:", err);
      alert("Bulk import failed!");
    }
  }

  return (
    <div className="image-upload container py-4">
      <input type="file" accept="image/*, .img.mdlc, .imgs.mdlc" onChange={handleFileChange} className="form-control mb-3" />
      {newImage && <img src={newImage.data} alt={newImage.name} width="200" className="img-thumbnail mb-3" />}
      <button className="btn btn-success" onClick={saveImage}>💾 Save image</button>
      {bulkImages && (
        <div className="mt-3">
          <p><strong>{bulkImages.length}</strong> images ready to import.</p>
          <button className="btn btn-primary" onClick={saveBulkImages}>
            📦 Import all images
          </button>
        </div>
      )}
    </div>
  );
}

export default Upload;

