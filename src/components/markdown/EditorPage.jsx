import { useEffect, useState } from "react";
import { getNode, updateFileContent } from "./markdownStorage";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownPreview from "./MarkdownPreview";

export default function EditorPage({ fileId }) {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

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
                        Exporter le fichier
                    </button>
                </div>
            </div>

            <div style={{ display: "flex", gap: 12, height: "calc(100vh - 120px)" }}>
                <div style={{ flex: 1 }}>
                    <div className="card h-100">
                        <div className="card-header">Éditeur</div>
                        <div className="card-body p-0">
                            <MarkdownEditor value={content} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1.4 }}>
                    <div className="card h-100">
                        <div className="card-header">Prévisualisation</div>
                        <div className="card-body p-0">
                            <MarkdownPreview value={content} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
