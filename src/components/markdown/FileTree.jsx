import { useEffect, useState } from "react";
import { getTree, createFile, createFolder, renameNode, deleteNodeRecursive, moveNode} from "./markdownStorage";
import NodeItem from "./NodeItem";
import { Button } from "react-bootstrap";
import { FilePlus, FolderPlus, Download } from "lucide-react";

export default function FileTree({ onSelectFile, selectedId }) {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load();}, []);

    async function load() {
        setLoading(true);
        const tree = await getTree();
        // ordre : dossiers d'abord, puis par titre
        tree.sort((a, b) => {
            if ((a.parentId ?? null) === (b.parentId ?? null)) {
                if (a.type === b.type) return (a.title || "").localeCompare(b.title || "");
                return a.type === "folder" ? -1 : 1;
            }
            return 0;
        });
        setNodes(tree);
        setLoading(false);
    }

    function childrenOf(parentId) {
        return nodes.filter((n) => (n.parentId ?? null) === (parentId ?? null));
    }

    async function createFileAt(parentId = null) {
        const id = await createFile("new file.md", parentId, "");
        await load();
        if (onSelectFile) onSelectFile(id);
    }

    async function createFolderAt(parentId = null) {
        await createFolder("new folder", parentId);
        await load();
    }

    async function rename(id, newTitle) {
        await renameNode(id, newTitle);
        await load();
    }

    async function remove(id) {
        const idRemoved = await deleteNodeRecursive(id, selectedId);
        if (idRemoved && onSelectFile) onSelectFile(null);
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
            alert("Unable to move: " + err.message);
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
            alert("Unable to move: " + err.message);
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

    function renderLevel(parentId = null, depth = 0) {
        const children = childrenOf(parentId);
        return (
        <div className="position-relative">
            {children.map((node, index) => (
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
                    isLast={index === children.length - 1}
                />
                </div>

                {node.type === "folder" && renderLevel(node.id, depth + 1)}
            </div>
            ))}
        </div>
        );
    }

    return (
        <div className="d-flex flex-column border-end" style={{ width: 400, maxWidth: 480, minWidth: 320, height: "100vh", backgroundColor: "hsl(210, 40%, 98%)"}}>
            <div className="p-3 border-bottom" style={{ backgroundColor: "hsl(0, 0%, 100%)" }} >
                <h5 className="mb-3 fw-bold" style={{ color: "hsl(222, 47%, 11%)" }}>
                    📂 File Explorer
                </h5>

                <div className="d-flex gap-2">
                    <Button variant="primary" size="sm" className="d-flex align-items-center gap-1" onClick={() => createFileAt()}>
                        <FilePlus size={16} />
                        New File
                    </Button>

                    <Button variant="secondary" size="sm" className="d-flex align-items-center gap-1" onClick={() => createFolderAt()} >
                        <FolderPlus size={16} />
                        New Folder
                    </Button>

                    <label className="btn btn-outline-success btn-sm mb-0 d-flex align-items-center gap-1">
                        <Download size={16} />
                        Import
                        <input  type="file" accept=".md,text/markdown" multiple style={{ display: "none" }} onChange={(e) => importFiles(Array.from(e.target.files || []), null, false)} />
                    </label>
                </div>
            </div>

            <div className="px-3 pt-3">
                <div className="p-2 mb-2 small text-center rounded-2" onDragOver={onDragOver} onDrop={onDropOnRoot}
                style={{
                    background: "hsl(210, 40%, 96%)",
                    border: "2px dashed hsl(214, 32%, 85%)",
                    color: "hsl(215, 16%, 47%)",
                    transition: "all 0.2s ease",
                }}
                >
                ↑ Drag & Drop files here to move to root ↑
                </div>
            </div>

            <div className="flex-grow-1 px-3 pb-3" style={{ overflowY: "auto", overflowX: "hidden" }} >
                {loading ? (
                <div className="text-center py-4" style={{ color: "hsl(215, 16%, 47%)" }}>
                    Loading...
                </div>
                ) : nodes.length === 0 ? (
                <div className="text-center py-4" style={{ color: "hsl(215, 16%, 47%)" }}>
                    No files found. Create one!
                </div>
                ) : (
                    renderLevel(null)
                )}
            </div>
        </div>
    );
}
