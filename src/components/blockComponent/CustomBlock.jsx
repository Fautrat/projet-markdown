import { useState, useRef, useEffect } from "react";
import { Card } from "react-bootstrap";
import Button from 'react-bootstrap/Button';

function CustomBlock() {

  const [titre, setTitre] = useState("Titre");
  const [texte, setTexte] = useState("Écrivez ici..");
  const [titreSauvegarde, setTitreSauvegarde] = useState("");
  const [texteSauvegarde, setTexteSauvegarde] = useState("");
  const [nouveau, setNouveau] = useState("");


  const titreRef = useRef(null);  // We havent seen this hook before so let's explain it hummmm ????? ;) DOnt use too much IA hehe, signed Andrew
  const texteRef = useRef(null);

  useEffect(() => {
    if (titreRef.current) titreRef.current.textContent = titre;
    if (texteRef.current) texteRef.current.textContent = texte;
  }, []);

  // Mise à jour du contenu éditable
  const handleInputTitre = (e) => setTitre(e.currentTarget.textContent);
  const handleInputTexte = (e) => setTexte(e.currentTarget.textContent);

  // Sauvegarde le texte actuel
  function sauvegarderTexte(e) {
    setTexteSauvegarde(texte);
    setTitreSauvegarde(titre);
    console.log("Titre sauvegardé :", titre, " | Texte sauvegardé :", texte);
  }
  
  // modifier le texte et sauvegarde
  function modifierTexte(e) {
    setTitre(titreSauvegarde);
    setTexte(texteSauvegarde);
    setNouveau(sauvegarderTexte);
    console.log("Modifier le texte :", nouveau);
  }

  // Supprimer le texte actuel et vider le contenu éditable
  function supprimerTexte(e) {
    setTitre("");
    setTexte("");
    if (titreRef.current) titreRef.current.textContent = "";
    if (texteRef.current) texteRef.current.textContent = "";
    console.log("Texte supprimé");
    setTitreSauvegarde("");
    setTexteSauvegarde("");
  }

  // function renommageTexte(e) {
  //   setTexte(e.target.value);
  // }

  // function importTexte(e) {
  // }

  // function exportTexte(e) {
  // }


  return (
  <div style={{ margin: "2rem" }}>

    {/* TITRE */}
    <div
      ref={titreRef}
      contentEditable={true}
      onInput={handleInputTitre}
      style={{
        border: "1px solid #ddd",
        width: "22rem",
        height: "4rem",
        padding: "1rem",
        margin: "2rem",
        borderRadius: "1rem",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        background: "#fff",
      }}
    ></div>

    {/* TEXTE */}
    <div
      ref={texteRef}
      contentEditable={true}
      onInput={handleInputTexte}
      style={{
        border: "1px solid #ddd",
        width: "22rem",
        height: "16rem",
        padding: "1rem",
        margin: "2rem",
        borderRadius: "1rem",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        background: "#fff",
      }}
    ></div>

    {/* Boutons */}
    <div style={{ display: "flex", gap: "1rem", margin: "2rem" }}>
    <Button variant="success" onClick={sauvegarderTexte} >Valider</Button >
    <Button variant="info" onClick={modifierTexte} >Modifier</Button >
    <Button variant="secondary" onClick={supprimerTexte} >Supprimer</Button >
    </div>
    {/* Nouveau bloc d'affichiage */}
    <Card style={{ width: '22rem',
        padding: "1rem",
        margin: "2rem",
        borderRadius: "1rem",
        background: "#e0e3e7ff"
      }}>
      <p>Sauvegarde</p>
      <p>Titre :{titreSauvegarde}</p>
      <p>Texte :{texteSauvegarde}</p>
    </Card>
  </div>
);
}

export default CustomBlock;