import { useSelector, useDispatch } from "react-redux";
import {removeImageLocal,updateImageLocal,} from "../../store/slices/imagesSlice.js.js";
import { deleteImage, updateImage } from "../../services/imageService.js";

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

  return (
    <div className="image-library container py-4">
      <h1 className="mb-4">Image Library</h1>
      <div className="row">
        {images.map((img) => (
          <div key={img.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img src={img.data} alt={`Image ${img.id}`} className="card-img-top" />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{img.name}</h5>
                <div className="mt-auto d-flex justify-content-between">
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
