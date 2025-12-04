import { useImages } from "../../hooks/useImages.js";

function Library() {
  const { images, remove, update } = useImages();

  const handleDelete = (id) => {
    remove(id);
  };

  const handleEdit = (id) => {
    const newName = prompt("Enter new name for the image:");
    if (newName) {
      update(id, { name: newName });
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
