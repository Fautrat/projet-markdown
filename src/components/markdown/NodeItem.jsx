import { useRef, useState } from "react";

function fmtDate(ts) {
    if (!ts) return "";
    try {
        return new Date(ts).toLocaleString();
    } catch {
        return "";
    }
}

export default function NodeItem({node, depth = 0, selectedId, onSelectFile, onRename, onDelete, onCreateFile, onCreateFolder, onImportFiles, onDragStart}) {
    const isSelected = selectedId === node.id;
    const [editing, setEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(node.title || "");
    const fileInputRef = useRef(null);

    function handleDragStart(e) {
        if (onDragStart) onDragStart(e, node.id);
    }

    function saveRename() {
        if (tempTitle && tempTitle.trim() !== "") {
            onRename(node.id, tempTitle.trim());
        }
        setEditing(false);
    }

    async function confirmDelete() {
        if (confirm(`Supprimer "${node.title}" et tous ses enfants ?`)) {
            await onDelete(node.id);
        }
    }

    function handleImportClick(e) {
        e.stopPropagation();
        if (fileInputRef.current) fileInputRef.current.click();
    }

    async function onFilesPicked(e) {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        if (onImportFiles) await onImportFiles(files);
        e.target.value = "";
    }

    return (
        <div
        draggable
        onDragStart={handleDragStart}
        className="d-flex align-items-center gap-2 p-2 mb-1"
        style={{
            marginLeft: depth * 12,
            background: isSelected ? "linear-gradient(90deg,#e9f2ff,#f8fbff)" : "transparent",
            border: isSelected ? "1px solid #80b3ff" : "1px solid transparent",
            borderRadius: 6,
        }}
        >
            <div style={{ width: 20, textAlign: "center", userSelect: "none" }}>
                {node.type === "folder" ? "📁" : "📄"}
            </div>

            <div className="flex-grow-1" onClick={() => {if (node.type === "file" && onSelectFile) onSelectFile(node.id);}}style={{ cursor: node.type === "file" ? "pointer" : "default" }}>
                <div className="d-flex justify-content-between">
                    <div>
                        {editing ? (
                        <input
                            className="form-control form-control-sm"
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            onBlur={saveRename}
                            onKeyDown={(e) => {
                            if (e.key === "Enter") saveRename();
                            if (e.key === "Escape") setEditing(false);
                            }}
                            autoFocus
                        />
                        ) : (
                        <strong style={{ fontSize: 14 }}>{node.title}</strong>
                        )}
                    </div>

                    {/* <div className="text-end" style={{ minWidth: 130 }}>
                        <div className="small text-muted">
                        {fmtDate(node.updatedAt)}
                        </div>
                    </div> */}
                </div>
            </div>

            <div className="d-flex gap-1">
                {node.type === "folder" && (
                <>
                    <button className="btn btn-sm btn-outline-secondary" title="Nouveau fichier enfant" onClick={(e) => {
                        e.stopPropagation();
                        onCreateFile(node.id);
                    }}
                    >
                        📄
                    </button>

                    <button className="btn btn-sm btn-outline-secondary" title="Nouveau dossier enfant" onClick={(e) => {
                        e.stopPropagation();
                        onCreateFolder(node.id);
                    }}
                    >
                        📁
                    </button>

                    <button className="btn btn-sm btn-outline-success" title="Importer .md dans ce dossier" onClick={(e) => {
                        e.stopPropagation();
                        handleImportClick(e);
                    }}
                    >
                        ⬇️
                    </button>

                    <input ref={fileInputRef} type="file" accept=".md,text/markdown" multiple style={{ display: "none" }} onChange={onFilesPicked}/>
                </>
                )}

                <button className="btn btn-sm btn-outline-primary" title="Renommer" onClick={(e) => {
                    e.stopPropagation();
                    setEditing(true);
                    setTempTitle(node.title || "");
                }}
                >
                    ✎
                </button>

                <button className="btn btn-sm btn-outline-danger" title="Supprimer" onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete();
                }}
                >
                    🗑
                </button>
            </div>
        </div>
    );
}
