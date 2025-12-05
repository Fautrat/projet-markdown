import { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Folder, FileText, Edit2, Trash2, FilePlus, FolderPlus, Download } from "lucide-react";

import '../../styles/markdown.css';

function fmtDate(ts) {
    if (!ts) return "";
    try {
        return new Date(ts).toLocaleString();
    } catch {
        return "";
    }
}

export default function NodeItem({node, depth = 0, selectedId, onSelectFile, onRename, onDelete, onCreateFile, onCreateFolder, onImportFiles, onDragStart, isLast = false}) {
    const isSelected = selectedId === node.id;
    const [editing, setEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(node.title || "");
    const fileInputRef = useRef(null);

    const isFolder = node.type === "folder";

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
        <div draggable onDragStart={handleDragStart} className="node-item-wrapper" style={{ position: "relative" }} >
            {depth > 0 && (
                <>
                <div className="tree-line-vertical"
                    style={{
                        position: "absolute",
                        left: depth * 24 - 12,
                        top: 0,
                        bottom: isLast ? "50%" : 0,
                        backgroundColor: "hsla(0, 0%, 0%, 1.00)",
                        width: 2,
                        opacity: 0.4,
                    }}
                />
                <div className="tree-line-horizontal"
                    style={{
                        position: "absolute",
                        left: depth * 24 - 12,
                        top: "50%",
                        width: 12,
                        height: 2,
                        backgroundColor: "hsla(0, 0%, 0%, 1.00)",
                        opacity: 0.4,
                    }}
                />
                </>
            )}

            <div className={`d-flex align-items-center gap-2 py-2 px-2 mb-1 rounded-2 transition-all ${
                isSelected
                    ? "bg-primary bg-opacity-10 border border-primary"
                    : "border border-transparent hover-bg-light"
                }`}
                style={{
                    marginLeft: depth * 24,
                    cursor: isFolder ? "default" : "pointer",
                    transition: "all 0.15s ease",
                }}
                onClick={() => {
                    if (!isFolder && onSelectFile && node.id !== undefined) onSelectFile(node.id);
                }}
            >
                <div className="d-flex align-items-center justify-content-center rounded"
                style={{
                    width: 28,
                    height: 28,
                    backgroundColor: isSelected
                    ? "hsl(210, 70%, 95%)"
                    : "hsl(0, 0%, 96%)",
                    flexShrink: 0,
                }}
                >
                {isFolder ? (
                    <Folder size={16} />
                ) : (
                    <FileText size={16} style={{ color: isSelected ? "hsl(210, 70%, 45%)" : "hsl(215, 16%, 47%)" }} />
                )}
                </div>

                <div className="flex-grow-1 min-w-0">
                    {editing ? (
                        <Form.Control
                        size="sm"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onBlur={saveRename}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") saveRename();
                            if (e.key === "Escape") setEditing(false);
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span className={`d-block text-truncate ${isFolder ? "fw-semibold" : ""}`}
                        style={{
                            fontSize: isFolder ? 16 : 14,
                        }}
                        >
                        {node.title}
                        </span>
                    )}
                </div>

                <div className="d-flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                {isFolder && (
                    <>
                    <Button variant="outline-secondary"
                        size="sm"
                        className="p-1 d-flex align-items-center justify-content-center"
                        title="new child file"
                        onClick={() => onCreateFile(node.id ?? null)}
                    >
                        <FilePlus size={14} />
                    </Button>

                    <Button variant="outline-secondary"
                        size="sm"
                        className="p-1 d-flex align-items-center justify-content-center"
                        title="New Child Folder"
                        onClick={() => onCreateFolder(node.id ?? null)}
                    >
                        <FolderPlus size={14} />
                    </Button>

                    <Button variant="outline-success"
                        size="sm"
                        className="p-1 d-flex align-items-center justify-content-center"
                        title="Importer un fichier dans ce dossier"
                        onClick={handleImportClick}
                    >
                        <Download size={14} />
                    </Button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".md,text/markdown"
                        multiple
                        style={{ display: "none" }}
                        onChange={onFilesPicked}
                    />
                    </>
                )}

                <Button variant="outline-primary"
                    size="sm"
                    className="p-1 d-flex align-items-center justify-content-center"
                    title="Renommer"
                    onClick={() => {
                        setEditing(true);
                        setTempTitle(node.title || "");
                    }}
                >
                    <Edit2 size={14} />
                </Button>

                <Button variant="outline-danger"
                    size="sm"
                    className="p-1 d-flex align-items-center justify-content-center"
                    title="Supprimer"
                    onClick={confirmDelete}
                >
                    <Trash2 size={14} />
                </Button>
                </div>
            </div>
        </div>
    );
}