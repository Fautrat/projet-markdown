import { useEffect, useState } from "react";
import { marked } from "marked";
import { useSelector } from "react-redux";
import { renderMarkdown } from "./renderMarkdown";
import DOMPurify from "dompurify";

export default function MarkdownPreview({ value }) {
    const [html, setHtml] = useState("");
    const images = useSelector((state) => state.images.items || []);

    useEffect(() => {
        let cancelled = false;

        function process() {
            renderMarkdown(value, images).then((safe) => {
                if (!cancelled) {
                    setHtml(safe);
                }
            });
        }

        process();

        return () => { cancelled = true };
    }, [value, images]); 

    return <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: html }} />;
}
