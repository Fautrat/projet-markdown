import { marked } from "marked";
import DOMPurify from "dompurify";

export async function renderMarkdown(value, images = []) {
  const renderer = {
    image(hrefToken, title, text) {
      let href = "";
      if (typeof hrefToken === "string") href = hrefToken;
      else if (hrefToken && typeof hrefToken === "object" && "href" in hrefToken)
        href = hrefToken.href;
      else href = String(hrefToken || "");

      if (href.startsWith("img:")) {
          const id = href.split(":")[1];
          console.log(images);
          const img = images.find(img => img.id === Number(id));
          if (!img) {
              return `<div style="color:red">[Image introuvable: ${id}]</div>`;
          }
          return `<img src="${img.data}" alt="${img.name || "image"}" style="max-width:100%;" />`;
      }

      return `<img src="${href}" alt="${text || ""}" />`;
    },
  };

  marked.use({ renderer });

  const raw = marked.parse(value || "");
  const safe = DOMPurify.sanitize(raw);
  return safe;
}
