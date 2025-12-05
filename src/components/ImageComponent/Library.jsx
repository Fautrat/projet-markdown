import { useSelector, useDispatch } from "react-redux";
import {removeImageLocal,updateImageLocal,} from "../../store/slices/imagesSlice.js";
import { deleteImage, updateImage } from "../../services/imageService.js";
import { downloadFile } from "../../utils/download.js";

function Library() {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.items || []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this image ?")) return;
    try {
      await deleteImage(id);
      dispatch(removeImageLocal(id));
    }
    catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = async (id) => {
    const newNamePrompt = prompt("New name :", "");
    if (newNamePrompt === null) return;
    try {
      const updated = await updateImage(id, { name: newNamePrompt });
      dispatch(updateImageLocal(updated));
    }
    catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleExportOne = (img) => {
    const fileContent = JSON.stringify(img, null, 2);
    const filename = `${img.name || "image"}-${img.id}.img.mdlc`;
    downloadFile(filename, fileContent);
  };

  const handleExportAll = () => {
    if (!images.length) return;
    const fileContent = JSON.stringify(images, null, 2);
    downloadFile("library.imgs.mdlc", fileContent);
  };

  return (
    <div className="image-library container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-4">Image Library</h1>
          <button className="btn btn-primary mb-4" onClick={handleExportAll}>
            📦 Export ALL (.imgs.mdlc)
          </button>
        </div>
      <div className="row">
        {images.map((img) => (
          <div key={img.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img src={img.data} alt={`Image ${img.id}`} className="card-img-top" />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{img.name}</h5>
                <div className="mt-auto d-flex justify-content-between">
                  <button className="btn btn-sm btn-secondary" onClick={() => handleExportOne(img)}>
                    ⬇️ Export
                  </button>
                  <button className="btn btn-sm btn-warning" onClick={() => handleEdit(img.id)}>
                    ✏️ Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(img.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Library;
