import React, { useEffect, useState } from "react";
import { getTree, createFile, createFolder, renameNode, deleteNodeRecursive, moveNode, getNode} from "./markdownStorage";
import NodeItem from "./NodeItem";

export default function FileTree({ onSelectFile, selectedId, onTreeChange }) {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load();}, []);

    async function load() {
        setLoading(true);
        const t = await getTree();
        // ordre : dossiers d'abord, puis par titre
        t.sort((a, b) => {
            if ((a.parentId ?? null) === (b.parentId ?? null)) {
                if (a.type === b.type) return (a.title || "").localeCompare(b.title || "");
                return a.type === "folder" ? -1 : 1;
            }
            return 0;
        });
        setNodes(t);
        setLoading(false);
        if (onTreeChange) onTreeChange();
    }

    function childrenOf(parentId) {
        return nodes.filter((n) => (n.parentId ?? null) === (parentId ?? null));
    }

    async function createFileAt(parentId = null) {
        const id = await createFile("Nouveau fichier.md", parentId, "");
        await load();
        if (onSelectFile) onSelectFile(id);
    }

    async function createFolderAt(parentId = null) {
        await createFolder("Nouveau dossier", parentId);
        await load();
    }

    async function rename(id, newTitle) {
        await renameNode(id, newTitle);
        await load();
    }

    async function remove(id) {
        await deleteNodeRecursive(id);
        if (selectedId === id && onSelectFile) onSelectFile(null);
        await load();
    }

    function onDragStart(e, id) {
        e.dataTransfer.setData("text/plain", String(id));
        e.dataTransfer.effectAllowed = "move";
    }

    async function onDropOnFolder(e, folderId) {
        e.preventDefault();
        const raw = e.dataTransfer.getData("text/plain");
        const id = Number(raw);
        if (Number.isNaN(id)) return;
        try {
            await moveNode(id, folderId);
            await load();
        } catch (err) {
            alert("Impossible de déplacer : " + err.message);
        }
    }

    async function onDropOnRoot(e) {
        e.preventDefault();
        const raw = e.dataTransfer.getData("text/plain");
        const id = Number(raw);
        if (Number.isNaN(id)) return;
        try {
            await moveNode(id, null);
            await load();
        } catch (err) {
            alert("Impossible de déplacer : " + err.message);
        }
    }

    function onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }

    async function importFiles(files, parentId = null, openFirst = false) {
        for (const f of files) {
            if (!/\.md$/i.test(f.name)) continue;
            const txt = await f.text();
            const id = await createFile(f.name, parentId, txt);
            if (openFirst && onSelectFile) {
                onSelectFile(id);
                openFirst = false;
            }
        }
        await load();
    }

    async function exportFile(id) {
        const node = await getNode(id);
        if (!node || node.type !== "file") {
            alert("Sélectionnez un fichier à exporter.");
            return;
        }
        const blob = new Blob([node.content || ""], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = node.title || "export.md";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function renderLevel(parentId = null, depth = 0) {
        const children = childrenOf(parentId);
        return (
        <div className="position-relative">
            {children.map((node, idx) => (
            <div key={node.id} style={{ position: "relative" }}>
                <div
                onDragOver={onDragOver}
                onDrop={(e) => {
                    if (node.type === "folder") onDropOnFolder(e, node.id);
                }}
                >
                <NodeItem
                    node={node}
                    depth={depth}
                    selectedId={selectedId}
                    onSelectFile={(id) => {
                    if (onSelectFile) onSelectFile(id);
                    }}
                    onRename={rename}
                    onDelete={remove}
                    onCreateFile={createFileAt}
                    onCreateFolder={createFolderAt}
                    onImportFiles={(files) => importFiles(files, node.id, true)}
                    onDragStart={onDragStart}
                />
                </div>

                {node.type === "folder" && renderLevel(node.id, depth + 1)}
            </div>
            ))}
        </div>
        );
    }

    return (
        <div className="bg-white border-end d-flex flex-column" style={{ width: 380, maxWidth: 460, minWidth: 300, height: "100vh" }}>
            <div className="p-3">
                <div className="d-flex gap-2 mb-3">
                    <button className="btn btn-primary" onClick={() => createFileAt()}>
                        📄 Nouveau fichier
                    </button>
                    <button className="btn btn-secondary" onClick={() => createFolderAt()}>
                        📁 Nouveau dossier
                    </button>

                    <label className="btn btn-outline-dark mb-0">
                        ⬇️ Importer des fichier(s)
                        <input type="file" accept=".md,text/markdown" multiple style={{ display: "none" }} onChange={(e) => importFiles(Array.from(e.target.files), null, false)}/>
                    </label>

                    {/* <button className="btn btn-outline-primary ms-auto" onClick={() => {
                            if (!selectedId) return alert("Sélectionnez un fichier à exporter.");
                            exportFile(selectedId);
                        }}>
                        Export Fichier(s)
                    </button> */}
                </div>

                <div className="p-2 mb-2 small text-muted" onDragOver={onDragOver} onDrop={onDropOnRoot} style={{ borderRadius: 6, background: "#fbfbfb", border: "1px dashed #ddd" }}>
                    Glisser ici pour déplacer à la racine
                </div>

                <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                    {loading ? <div>Chargement...</div> : renderLevel(null)}
                </div>
            </div>
        </div>
    );
}
