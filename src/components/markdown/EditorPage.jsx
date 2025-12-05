import { useEffect, useState } from "react";
import { getNode, updateFileContent } from "./markdownStorage";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownPreview from "./MarkdownPreview";
import ImagesModal from "./ImagesModal";
import BlocksModal from "./BlocksModal";

export default function EditorPage({ fileId }) {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [showImageModal, setShowImageModal] = useState(false);
    const [showBlocksModal, setShowBlocksModal] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!fileId) return;
            const node = await getNode(fileId);
            if (!cancelled && node) {
                setContent(node.content || "");
                setTitle(node.title || "");
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [fileId]);

    function handleInsertImage(name, id) {
        const mdLine = `![${name}](img:${id})`;

        setContent(prev => {
            const newContent = (prev ? prev + "\n\n" : "") + mdLine;
            updateFileContent(fileId, newContent).catch(console.error);
            return newContent;
        });
    }



    function handleChange(md) {
        setContent(md);
        updateFileContent(fileId, md).catch((e) => console.error(e));
    }

    function exportCurrentFile() {
        const blob = new Blob([content || ""], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = title || "export.md";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
                <h5 className="mb-0">{title}</h5>
                <div>
                    <button className="btn btn-outline-primary btn-sm" onClick={exportCurrentFile}>
                        Export file
                    </button>
                </div>
            </div>

            <div style={{ display: "flex", gap: 12, height: "calc(100vh - 120px)" }}>
                <div style={{ flex: 1 }}>
                    <div className="card h-100">
                        <div className="card-header">
                            Editor
                            <button className="ms-4 btn btn-outline-secondary btn-sm"  onClick={() => setShowImageModal(true)}>
                                📷 Insert Image
                            </button>
                            <button className="ms-1 btn btn-outline-secondary btn-sm"  onClick={() => setShowBlocksModal(true)}>
                                Insert Block
                            </button>
                        </div>
                        

                        <div className="card-body p-0">
                            <MarkdownEditor value={content} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1.4 }}>
                    <div className="card h-100">
                        <div className="card-header">Preview</div>
                        <div className="card-body p-0">
                            <MarkdownPreview value={content} />
                        </div>
                    </div>
                </div>
                <ImagesModal
                    show={showImageModal}
                    onClose={() => setShowImageModal(false)}
                    onSelect={(img) => {
                        handleInsertImage(img.name, img.id);
                        setShowImageModal(false);
                    }}
                />
                <BlocksModal
                    show={showBlocksModal}
                    onClose={() => setShowBlocksModal(false)}
                    onSelect={(block) => {
                        setContent(prev => {
                            const newContent = (prev ? prev + "\n\n" : "") + block.content;
                            updateFileContent(fileId, newContent).catch(console.error);
                            return newContent;
                        });
                        setShowBlocksModal(false);
                    }}
                />
            </div>
        </div>
    );
}
