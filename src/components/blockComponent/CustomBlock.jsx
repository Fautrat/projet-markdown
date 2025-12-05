import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addBlockLocal } from "../../store/slices/blockSlice.js";
import { addBlock } from"../../services/blockService.js";

function CustomBlock() {

  const dispatch = useDispatch();
  const [block, setBlock] = useState({id :Date.now(), title :"", content :"", shortcut :""});
  const [shortcut, setShortcut] = useState("");
 
  async function saveBlock() {
    
    try {
      const id = await addBlock(block);

      dispatch(addBlockLocal({ ...block, id }));

      setBlock({id :Date.now(), title :"", content :"", shortcut :""});
      alert("Block saved successfully!");
    }
    catch (err) {
      console.error("Save failed:", err);
      alert("Block save failed!");

    }

    setBlock(block);
    console.log("Bloc sauvegardé :", block);
  }
  
  function updateBlock(field, value) {
    setBlock((prevBlock) => ({
      ...prevBlock,
      [field]: value,
    }));
  }
    
  function createShortcut(e) {
      e.preventDefault();
      const keys = [];
      if (e.metaKey) keys.push("Command"); // Mac
      if (e.ctrlKey) keys.push("Ctrl");
      if (e.shiftKey) keys.push("Shift");
      if (e.altKey) keys.push("Alt");
      setShortcut(keys.join("+"));
      updateBlock("shortcut", keys.join("+"));

      const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
      if (!["Control", "Shift", "Meta", "Alt"].includes(key)) {
          keys.push(key);
      }

      const combo = keys.join("+");
      setShortcut(combo);
      updateBlock("shortcut", combo); 
  }


  return (
  <div style={{ margin: "2rem" }}>
   <h3>Custom Block</h3><br />
  

      <Form.Label>Title</Form.Label>
      <Form.Control
        type="text"
        placeholder="ex: Title block"
        value={block.title}
        onChange={(e) => updateBlock("title",e.target.value)}
        style={{ marginBottom: "1rem" , width: "50%"}}
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
          placeholder="Short cut"
          value={shortcut}
          onKeyDown={createShortcut}
          readOnly
          style={{ marginBottom: "1rem" , width: "50%"}}
        />

    <div style={{ display: "flex", gap: "1rem", margin: "2rem" }}>
    <Button variant="outline-primary" onClick={saveBlock} >Save</Button >
    </div>

    <Form.Label>Preview</Form.Label>
    <Form style={{ marginBottom: "1rem", width: "50%" }}>
      <p>Title : {block.title}</p>
      <p>Content : {block.content}</p>
      <p>Shortcut : {block.shortcut}</p>
    </Form>
  </div>
);
}

export default CustomBlock;