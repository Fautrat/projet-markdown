import { useSelector, useDispatch } from "react-redux";
import { removeBlockLocal, updateBlockLocal } from "../../store/slices/blockSlice.js";
import { deleteBlock, updateBlock } from "../../services/blockService.js";
import { useState } from "react";

function BlockLibrary() {
  const dispatch = useDispatch();
  const blocks = useSelector((state) => state.blocks.items || []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this block ?")) return;
    try {
      await deleteBlock(id);
      dispatch(removeBlockLocal(id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSave = async (block, edited) => {
    try {
      const updated = await updateBlock(block.id, edited);
      dispatch(updateBlockLocal(updated));
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <>
      <h1 className="mb-4">Block Library</h1>
      <div className="row">
         {
          blocks.map((block) => (
            <EditableBlock key={block.id} block={block} onDelete={() => handleDelete(block.id)} onSave={(edited) => handleSave(block, edited)}/>
          ))
          }
      </div>
    </>
  );
}

function EditableBlock({ block, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: block.title,
    content: block.content,
    shortcut: block.shortcut,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          {isEditing ? (
            <>
              <div className="mb-2">
                <label className="form-label">Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Content:</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Shortcut:</label>
                <input
                  type="text"
                  name="shortcut"
                  value={formData.shortcut}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </>
          ) : (
            <>
              <h5 className="card-title">Title: {block.title}</h5>
              <p className="card-text">Content: {block.content}</p>
              <small className="text-muted">Shortcut: {block.shortcut}</small>
            </>
          )}


          <div className="mt-auto d-flex justify-content-between">
            {isEditing ? (
              <>
                <button className="btn btn-sm btn-success" onClick={handleSubmit}>
                  💾 Save
                </button>
                <button className="btn btn-sm btn-secondary" onClick={() => setIsEditing(false)}>
                  ❌ Cancel
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-sm btn-warning" onClick={() => setIsEditing(true)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={onDelete}>
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlockLibrary;
