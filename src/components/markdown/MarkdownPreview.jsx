import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({ gfm: true, breaks: true });

export default function MarkdownPreview({ value }) {
    const html = DOMPurify.sanitize(marked.parse(value || ""));
    return (
        <div className="p-3" style={{ height: "100%", overflowY: "auto", background: "white" }} dangerouslySetInnerHTML={{ __html: html }}/>
    );
}
