import { useSelector, useDispatch } from "react-redux";
import { removeBlockLocal, updateBlockLocal } from "../../store/slices/blockSlice.js";
import { deleteBlock, updateBlock } from "../../services/blockService.js";
import { useState } from "react";

function BlockLibrary() {
  const dispatch = useDispatch();
  const blocks = useSelector((state) => state.blocks.items || []);
  const [editingId, setEditingId] = useState(null);

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
      setEditingId(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

    const exportSingleBlock = (block) => {
  const blob = new Blob(
    [JSON.stringify(block, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${block.title}.block.mdlc`;
  a.click();
  URL.revokeObjectURL(url);
}

const exportAllBlocks = (allBlocks) => {
  const blob = new Blob(
    [JSON.stringify(allBlocks, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `blocks.blocks.mdlc`;
  a.click();
  URL.revokeObjectURL(url);
}

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-4">Block Library</h1>
        <button className="btn btn-primary mb-3" onClick={() => exportAllBlocks(blocks)}>
          📦 Export all blocks
        </button>
      </div>
      <div className="row">
        {blocks.map((block) => (
          <EditableBlock
            key={block.id}
            block={block}
            isEditing={editingId === block.id}
            onEdit={() => setEditingId(block.id)}
            onCancel={() => setEditingId(null)}
            onDelete={() => handleDelete(block.id)}
            onSave={(edited) => handleSave(block, edited)}
            exportSingleBlock={exportSingleBlock}
          />
        ))}
      </div>
    </>
  );
}

  const EditableBlock = ({ block, isEditing, onEdit, onCancel, onDelete, onSave, exportSingleBlock }) => {
    const [formData, setFormData] = useState({
      title: block.title,
      content: block.content,
      shortcut: block.shortcut,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShortcut = (e) => {
    e.preventDefault();
    const keys = [];
    if (e.metaKey) keys.push("Command");
    if (e.ctrlKey) keys.push("Ctrl");
    if (e.shiftKey) keys.push("Shift");
    if (e.altKey) keys.push("Alt");

    const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    if (!["Control", "Shift", "Meta", "Alt"].includes(key)) {
      keys.push(key);
    }

    const combo = keys.join("+");
    setFormData({ ...formData, shortcut: combo });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm">
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
                  className="form-control"/>
              </div>

              <div className="mb-2">
                <label className="form-label">Content:</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="form-control"/>
              </div>

              <div className="mb-2">
                <label className="form-label">Shortcut:</label>
                <input
                  type="text"
                  name="shortcut"
                  value={formData.shortcut}
                  onKeyDown={handleShortcut}
                  readOnly
                  className="form-control"/>
              </div>
            </>)
            :
            (<>
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
                <button className="btn btn-sm btn-secondary" onClick={onCancel}>
                  ❌ Cancel
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-sm btn-secondary" onClick={() => exportSingleBlock(block)}>
                  ⬇️ Export
                </button>
                <button className="btn btn-sm btn-warning" onClick={onEdit}>
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
