import { useState, useEffect } from "react";
import { getAllBlocks, addBlock, deleteBlock, updateBlock } from "../services/blockService.js";

export function useBlocks() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    async function fetchBlocks() {
      const blocks = await getAllBlocks();
      console.log("Fetched blocks:", blocks);
      setBlocks(blocks);
    }
    fetchBlocks();
  }, []);

  const add = async (data) => {
    await addBlock(data);
    const blocks = await getAllBlocks();
    setBlocks(blocks);
  };

  const remove = async (id) => {
    await deleteBlock(id);
    const blocks = await getAllBlocks();
    setBlocks(blocks);
  };

  const update = async (id, updatedData) => {
    await updateBlock(id, updatedData);
    const blocks = await getAllBlocks();
    setBlocks(blocks);
  };

  return { blocks, add, remove, update };
}
