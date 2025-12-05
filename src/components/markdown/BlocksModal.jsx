import { useEffect, useState } from "react";
import { Download } from "lucide-react"; 

export default function BlocksModal({ show, onClose, onSelect }) {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!show) return;
        let cancelled = false;
        async function loadBlocks() {
            setLoading(true);
            try {
                const req = indexedDB.open("MarkdownDB", 1);
                    req.onupgradeneeded = () => {
                    const db = req.result;
                    if (!db.objectStoreNames.contains("blocks")) {
                        db.createObjectStore("blocks", { keyPath: "id", autoIncrement: true });
                    }
                };

                const db = await new Promise((resolve, reject) => {
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => reject(req.error);
                });

                const tx = db.transaction("blocks", "readonly");
                const store = tx.objectStore("blocks");
                const allReq = store.getAll();

                const results = await new Promise((resolve, reject) => {
                    allReq.onsuccess = () => resolve(allReq.result || []);
                    allReq.onerror = () => reject(allReq.error);
                });

                if (!cancelled) setBlocks(results);
            } catch (e) {
                console.error("BlocksModal load error", e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadBlocks();
        return () => { cancelled = true; };
    }, [show]);

    if (!show) return null;

    return (
        <div className="blocks-modal-backdrop" onClick={onClose}
        style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
        }}
        >
            <div  className="blocks-modal-dialog"
                style={{
                    width: "80%",
                    maxWidth: 1000,
                    maxHeight: "80%",
                    overflow: "auto",
                    background: "white",
                    borderRadius: 8,
                    padding: 16,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <h5 style={{ margin: 0 }}>Bibliothèque de block</h5>
                </div>

                {loading ? (
                <div>Chargement...</div>
                ) : blocks.length === 0 ? (
                <div className="text-muted">Aucun block dans la bibliothèque.</div>
                ) : (
                <div className="d-flex gap-4 flex-wrap" >
                    {blocks.map(block => (
                    <div key={block.id}
                        style={{
                            cursor: "pointer",
                            textAlign: "center",
                        }}
                        onClick={() => onSelect(block)}
                        title={block.title}
                    >
                        <div>
                            <Download size={16} />
                        </div>
                        <div style={{ marginTop: 6, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {block.title}
                        </div>
                    </div>
                    ))}
                </div>
                )}

                <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>Annuler</button>
                </div>
            </div>
        </div>
    );
}
