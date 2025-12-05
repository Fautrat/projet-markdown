import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ImagesModal({ show, onClose, onSelect }) {
    const images = useSelector((state) => state.images.items || []);

    useEffect(() => {
        if (!show) return;
    }, [show]);

    if (!show) return null;

    return (
        <div className="image-modal-backdrop" onClick={onClose}
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
            <div  className="image-modal-dialog"
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
                    <h5 style={{ margin: 0 }}>Bibliothèque d'images</h5>
                </div>

                {images.length === 0 ? (
                <div className="text-muted">Aucune image dans la bibliothèque.</div>
                ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {images.map(img => (
                    <div key={img.id}
                        style={{
                            width: 120,
                            cursor: "pointer",
                            textAlign: "center",
                        }}
                        onClick={() => onSelect(img)}
                        title={img.name}
                    >
                        <div style={{
                            width: 120,
                            height: 80,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            borderRadius: 6,
                            border: "1px solid #e9e9e9",
                            background: "#fafafa"
                        }}>
                        {img.data ? (
                            <img
                            src={img.data}
                            alt={img.name}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <div className="text-muted small">No data</div>
                        )}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {img.name || `Image #${img.id}`}
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
