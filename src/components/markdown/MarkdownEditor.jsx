export default function MarkdownEditor({ value, onChange, onShortcut }) {
    return (
        <textarea
        className="form-control"
        style={{
            width: "100%",
            height: "100%",
            padding: "1rem",
            fontFamily: "monospace",
            fontSize: 15,
            border: "none",
            resize: "none",
            boxSizing: "border-box",
            overflowX: "hidden",
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
            if (onShortcut) onShortcut(e);
        }}
        />
    );
}
