import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addBlockLocal } from "../../store/slices/blockSlice.js";
import { addBlock } from "../../services/blockService.js";

function CustomBlock() {
  const dispatch = useDispatch();
  const [block, setBlock] = useState({ id: Date.now(), title: "", content: "", shortcut: "" });
  const [shortcut, setShortcut] = useState("");
  const [importedBlocks, setImportedBlocks] = useState([]);

  async function saveBlock() {
    try {
      const id = await addBlock(block);
      dispatch(addBlockLocal({ ...block, id }));
      setBlock({ id: Date.now(), title: "", content: "", shortcut: "" });
      setShortcut("");
      alert("Block saved successfully! ");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Block save failed! ");
    }
  }

  async function saveImportedBlocks() {
    if (!importedBlocks.length) return alert("No blocks to save! ");
    try {
      for (const b of importedBlocks) {
        const id = await addBlock(b);
        dispatch(addBlockLocal({ ...b, id }));
      }
      setImportedBlocks([]);
      alert("All imported blocks saved! ");
    } catch (err) {
      console.error("Failed to save imported blocks:", err);
      alert("Saving imported blocks failed! ");
    }
  }

  function updateBlock(field, value) {
    setBlock((prevBlock) => ({ ...prevBlock, [field]: value }));
  }

  function createShortcut(e) {
    e.preventDefault();
    const keys = [];
    if (e.metaKey) keys.push("Command");
    if (e.ctrlKey) keys.push("Ctrl");
    if (e.shiftKey) keys.push("Shift");
    if (e.altKey) keys.push("Alt");
    const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    if (!["Control", "Shift", "Meta", "Alt"].includes(key)) keys.push(key);
    const combo = keys.join("+");
    setShortcut(combo);
    updateBlock("shortcut", combo);
  }

  async function importSingleBlock(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.title || !data.content) {
        alert("Invalid .block.mdlc file");
        return;
      }
      const blockData = { ...data, id: Date.now() + Math.random() };
      setImportedBlocks((prev) => [...prev, blockData]);
      alert("Block imported! Click 'Save Imported Blocks' to persist.");
    } catch (err) {
      console.error("Failed to import single block:", err);
      alert("Failed to import .block.mdlc file");
    }
  }

  async function importMultipleBlocks(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) {
        alert("Invalid .blocks.mdlc file");
        return;
      }
      const validBlocks = data
        .filter((b) => b.title && b.content)
        .map((b) => ({ ...b, id: Date.now() + Math.random() }));
      setImportedBlocks((prev) => [...prev, ...validBlocks]);
      alert(`${validBlocks.length} blocks imported! Click 'Save Imported Blocks' to persist.`);
    } catch (err) {
      console.error("Failed to import multiple blocks:", err);
      alert("Failed to import .blocks.mdlc file");
    }
  }

  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.name.endsWith(".blocks.mdlc")) return importMultipleBlocks(file);
    if (file.name.endsWith(".block.mdlc")) return importSingleBlock(file);
    alert("Unsupported file type! ");
  }

  return (
    <div style={{ margin: "2rem" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="m-0">Custom Block</h3>
        <div className="d-flex flex-column align-items-end">
          <Form.Label>Import Block(s)</Form.Label>
          <input
            type="file"
            accept=".block.mdlc, .blocks.mdlc"
            onChange={handleImport}
            className="form-control"
            style={{ width: "250px" }}
          />
        </div>
      </div>

      <Form.Label>Title</Form.Label>
      <Form.Control
        type="text"
        placeholder="ex: Title block"
        value={block.title}
        onChange={(e) => updateBlock("title", e.target.value)}
        style={{ marginBottom: "1rem", width: "50%" }}
      />

      <Form.Label>Content</Form.Label>
      <Form.Control
        as="textarea"
        placeholder="ex: Content block"
        rows={6}
        value={block.content}
        onChange={(e) => updateBlock("content", e.target.value)}
        style={{ marginBottom: "1rem", width: "50%" }}
      />

      <Form.Label>Keyboard Shortcut</Form.Label>
      <Form.Control
        type="text"
        placeholder="Shortcut"
        value={shortcut}
        onKeyDown={createShortcut}
        readOnly
        style={{ marginBottom: "1rem", width: "50%" }}
      />

      <div style={{ display: "flex", gap: "1rem", margin: "2rem" }}>
        <Button variant="outline-primary" onClick={saveBlock}>
          Save Current Block
        </Button>
        {importedBlocks.length > 0 && (
          <Button variant="success" onClick={saveImportedBlocks}>
            Save Imported Blocks ({importedBlocks.length})
          </Button>
        )}
      </div>
    </div>
  );
}

export default CustomBlock;
