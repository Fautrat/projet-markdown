import { useState } from "react";
import { Button, Form } from "react-bootstrap";

function CustomBlock() {

  const [titre, setTitre] = useState("");
  const [texte, setTexte] = useState("");
  const [titreSauvegarde, setTitreSauvegarde] = useState("");
  const [texteSauvegarde, setTexteSauvegarde] = useState("");

  // Sauvegarde le texte actuel
  function sauvegarderTexte(e) {
    setTitreSauvegarde(titre);
    setTexteSauvegarde(texte);
    console.log("Titre sauvegardé :", titre, " | Texte sauvegardé :", texte);
  }
  
  // Supprimer le texte actuel et vider le contenu éditable
  function supprimerTexte(e) {
    setTitre("");
    setTexte("");
  }

  // modifier le texte et sauvegarde
  // function modifierTexte(e) {
  //   setTitre(titreSauvegarde);
  //   setTexte(texteSauvegarde);
  //   // setNouveau(sauvegarderTexte);
  // }

  
  // function renommageTexte(e) {
  //   setTexte(e.target.value);
  // }

  // function importTexte(e) {
  // }

  // function exportTexte(e) {
  // }


  return (
  <div style={{ margin: "2rem" }}>
   <h3>Bloc Personalisé</h3><br />
  

      {/* TITRE */}
      <Form.Label>Nom de Titre</Form.Label>
      <Form.Control
        type="text"
        placeholder="ex: un titre personalisé"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        style={{ marginBottom: "1rem" , width: "50%"}}
      />

      {/* TEXTE */}
      <Form.Label>Contenu</Form.Label>
      <Form.Control
        as="textarea"
        placeholder="ex: un texte personalisé"
        rows={6}
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        style={{ marginBottom: "1rem", width: "50%" }}
      />

      <Form.Label>Racourcis claviers - Uniques et accessibles via une interface dédiée</Form.Label>
        <Form.Control
          type="text"
          placeholder="ex: commonde + T ..."
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          style={{ marginBottom: "1rem" , width: "50%"}}
        />
    {/* Boutons */}
    <div style={{ display: "flex", gap: "1rem", margin: "2rem" }}>
    <Button variant="outline-primary" onClick={sauvegarderTexte} >Valider</Button >
    {/* <Button variant="info" onClick={modifierTexte} >Modifier</Button >
    // <Button variant="secondary" onClick={supprimerTexte} >Supprimer</Button > */}
    </div>

    {/* Nouveau bloc d'affichiage */}
    <Form.Label>Sauvegarde</Form.Label>
    <Form style={{ marginBottom: "1rem", width: "50%" }}>
      <p>Titre : {titreSauvegarde}</p>
      <p>Texte : {texteSauvegarde}</p>
    </Form>
  </div>
);
}

export default CustomBlock;