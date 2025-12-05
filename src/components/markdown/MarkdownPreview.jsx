import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

async function loadImagesFromDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open("MarkdownDB", 1);

        req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction("images", "readonly");
        const store = tx.objectStore("images");
        const getAll = store.getAll();

        getAll.onsuccess = () => {
            const map = {};
            for (const img of getAll.result) {
                map[img.id] = {'data' : img.data, 'name' : img.name};
            }
            resolve(map);
        };

        getAll.onerror = () => reject(getAll.error);
        };

        req.onerror = () => reject(req.error);
    });
}

export default function MarkdownPreview({ value }) {
    const [html, setHtml] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function process() {
            const imageDB = await loadImagesFromDB();
            if (cancelled) return;

            const renderer = {
                image(hrefToken, title, text) {
                    let href = "";

                    if (typeof hrefToken === "string") {
                        href = hrefToken;
                    } else if (hrefToken && typeof hrefToken === "object" && "href" in hrefToken) {
                        href = hrefToken.href;
                    } else {
                        href = String(hrefToken || "");
                    }

                    if (href.startsWith("img:")) {
                        const id = href.split(":")[1];
                        const base64 = imageDB[id]['data'] ||  "";
                        const alt = imageDB[id]['name'] ||  "";

                        if (!base64) {
                            return `<div style="color:red">[Image introuvable: ${id}]</div>`;
                        }

                        return `<img src="${base64}" alt="${alt}" style="max-width:100%;" />`;
                    }
                    return `<img src="${href}" alt="${text || ""}" />`;
                }
            };

            marked.use({ renderer });

            const raw = marked.parse(value || "");
            const safe = DOMPurify.sanitize(raw);
            setHtml(safe);
        }

        process();

        return () => {
        cancelled = true;
        };
    }, [value]);

    return (
        <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: html }} />
    );
}
