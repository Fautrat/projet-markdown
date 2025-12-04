import { useEffect, useState, useRef, useCallback } from "react";
import FileTree from "./FileTree";
import EditorPage from "./EditorPage";
import { getTree, createFile } from "./markdownStorage";

export default function MarkdownPage() {
    const [currentId, setCurrentId] = useState(null);
    const [treeKey, setTreeKey] = useState(0);
    const initializedRef = useRef(false);

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        async function init() {
            const tree = await getTree();
            if (tree.length === 0) {
                const id = await createFile("Bienvenue.md", null, "# Bienvenue\n\nCommencez à écrire...");
                setCurrentId(id);
                setTreeKey(k => k + 1);
            } else {
                const firstFile = tree.find((n) => n.type === "file");
                setCurrentId(firstFile?.id ?? null);
            }
        }

        init();
    }, []);


    const refreshTree = useCallback(() => {
        setTreeKey(k => k + 1);
    }, []);

    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            <FileTree key={treeKey} onSelectFile={(id) => setCurrentId(id)} selectedId={currentId}/>

            <div className="flex-grow-1 p-3" style={{ background: "#f4f6f8" }}>
                {!currentId ? (
                <div
                    className="d-flex flex-column justify-content-center align-items-center text-center"
                    style={{
                        height: "100%",
                        gap: 16,
                        border: "2px dashed #d0d7df",
                        borderRadius: 8,
                        background: "white",
                        padding: 24,
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files).filter((f) =>
                            /\.md$/i.test(f.name)
                        );
                        if (files.length === 0) {
                            alert("Déposez des fichiers .md ici.");
                            return;
                        }
                        // importe le premier fichier et l'ouvre
                        const text = await files[0].text();
                        const id = await createFile(files[0].name, null, text);
                        setCurrentId(id);
                        refreshTree();
                    }}
                >
                    <h4>Sélectionner un fichier</h4>
                    <p className="text-muted mb-2">
                        Glissez-déposez un fichier <strong>.md</strong> ici pour l'importer et l'ouvrir.
                    </p>
                    <div className="small text-muted">Ou sélectionnez un fichier dans la colonne de gauche.</div>
                </div>
                ) : (
                <EditorPage fileId={currentId} />
                )}
            </div>
        </div>
    );
}
