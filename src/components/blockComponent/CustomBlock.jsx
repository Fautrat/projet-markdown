import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addBlockLocal } from "../../store/slices/blockSlice.js";
import { addBlock } from"../../services/blockService.js";

function CustomBlock() {

  const dispatch = useDispatch();
  const [block, setBlock] = useState({id :Date.now(), title :"", content :"", shortcut :""});

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


  return (
  <div style={{ margin: "2rem" }}>
   <h3>Bloc Personalisé</h3><br />
  

      {/* TITRE */}
      <Form.Label>Nom de Titre</Form.Label>
      <Form.Control
        type="text"
        placeholder="ex: un titre personalisé"
        value={block.title}
        onChange={(e) => updateBlock("title",e.target.value)}
        style={{ marginBottom: "1rem" , width: "50%"}}
      />

      {/* TEXTE */}
      <Form.Label>Contenu</Form.Label>
      <Form.Control
        as="textarea"
        placeholder="ex: un texte personalisé"
        rows={6}
        value={block.content}
        onChange={(e) => updateBlock("content", e.target.value)}
        style={{ marginBottom: "1rem", width: "50%" }}
      />

      <Form.Label>Racourcis claviers - Uniques et accessibles via une interface dédiée</Form.Label>
        <Form.Control
          type="text"
          placeholder="ex: commonde + T ..."
          value={block.shortcut}
          onChange={(e) => updateBlock("shortcut", e.target.value)}
          style={{ marginBottom: "1rem" , width: "50%"}}
        />

    {/* Boutons */}
    <div style={{ display: "flex", gap: "1rem", margin: "2rem" }}>
    <Button variant="outline-primary" onClick={saveBlock} >Valider</Button >
    </div>

    {/* Nouveau bloc d'affichiage */}
    <Form.Label>Previsualization</Form.Label>
    <Form style={{ marginBottom: "1rem", width: "50%" }}>
      <p>Title : {block.title}</p>
      <p>Content : {block.content}</p>
      <p>Shortcut : {block.shortcut}</p>
    </Form>
  </div>
);
}

export default CustomBlock;