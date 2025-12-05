function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open("MarkdownDB", 1);
        req.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("files")) {
                db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function getTree() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("files", "readonly");
        const store = tx.objectStore("files");
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
    });
}

export async function getNode(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("files", "readonly");
        const store = tx.objectStore("files");
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function addNodeRaw(node) {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const tx = db.transaction("files", "readwrite");
        const store = tx.objectStore("files");
        const req = store.add(node);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function putNodeRaw(node) {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const tx = db.transaction("files", "readwrite");
        const store = tx.objectStore("files");
        const req = store.put(node);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function deleteNodeRaw(id) {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const tx = db.transaction("files", "readwrite");
        const store = tx.objectStore("files");
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

function formatNameAndExt(name) {
    const idx = name.lastIndexOf(".");
    if (idx > 0) {
        return { base: name.slice(0, idx), ext: name.slice(idx) };
    }
    return { base: name, ext: "" };
}

async function uniqueTitleAmongSiblings(title, parentId, type) {
    const all = await getTree();
    const siblings = all.filter((n) => (n.parentId ?? null) === (parentId ?? null) && n.type === type);

    const { base, ext } = formatNameAndExt(title);
    let candidate = title;
    let i = 1;
    const names = new Set(siblings.map((s) => s.title));
    while (names.has(candidate)) {
        i++;
        candidate = `${base}${i}${ext}`;
    }
    return candidate;
}

export async function createFile(title, parentId = null, content = "") {
    const unique = await uniqueTitleAmongSiblings(title, parentId, "file");
    const node = {
        title: unique,
        type: "file",
        parentId: parentId === undefined ? null : parentId,
        content: content ?? "",
        updatedAt: Date.now(),
    };
    return addNodeRaw(node);
}

export async function createFolder(title, parentId = null) {
    const unique = await uniqueTitleAmongSiblings(title, parentId, "folder");
    const node = {
        title: unique,
        type: "folder",
        parentId: parentId === undefined ? null : parentId,
        updatedAt: Date.now(),
    };
    return addNodeRaw(node);
}

export async function renameNode(id, newTitle) {
    const node = await getNode(id);
    if (!node) throw new Error("Node not found");

    const all = await getTree();
    const siblings = all.filter((n) => (n.parentId ?? null) === (node.parentId ?? null) && n.id !== id && n.type === node.type);
    const existing = new Set(siblings.map((s) => s.title));
    const { base, ext } = formatNameAndExt(newTitle);
    let candidate = newTitle;
    let i = 1;
    while (existing.has(candidate)) {
        i++;
        candidate = `${base}${i}${ext}`;
    }
    node.title = candidate;
    node.updatedAt = Date.now();
    return putNodeRaw(node);
}

export async function updateFileContent(id, content) {
    const node = await getNode(id);
    if (!node) throw new Error("Node not found");
    if (node.type !== "file") throw new Error("Not a file");
    node.content = content;
    node.updatedAt = Date.now();
    return putNodeRaw(node);
}

export async function moveNode(id, newParentId) {
    const all = await getTree();
    const descendants = getAllDescendants(all, id);
    if (descendants.some((d) => d.id === newParentId)) {
        throw new Error("Impossible de déplacer un dossier dans l'un de ses sous-dossiers.");
    }
    const node = await getNode(id);
    node.parentId = newParentId === undefined ? null : newParentId;
    node.updatedAt = Date.now();
    return putNodeRaw(node);
}

export async function deleteNodeRecursive(id, selectedId) {
    const all = await getTree();
    let idRemoved = false;
    const descendants = getAllDescendants(all, id);
    for (const d of descendants) {
        if (selectedId === d.id) idRemoved = true;
        await deleteNodeRaw(d.id);
    }
    await deleteNodeRaw(id);
    if (selectedId === id) idRemoved = true;
    return idRemoved;
}

function getAllDescendants(allNodes, id) {
    const res = [];
    const stack = [id];
    while (stack.length) {
        const current = stack.pop();
        for (const n of allNodes) {
            if ((n.parentId ?? null) === (current ?? null)) {
                res.push(n);
                stack.push(n.id);
            }
        }
    }
    return res;
}
