import { useState, useEffect } from "react";
import { getAllImages, addImage, deleteImage, updateImage } from "../services/imageService.js";

export function useImages() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const imgs = await getAllImages();
      console.log("Fetched images:", imgs);
      setImages(imgs);
    }
    fetchImages();
  }, []);

  const add = async (data) => {
    await addImage(data);
    const imgs = await getAllImages();
    setImages(imgs);
  };

  const remove = async (id) => {
    await deleteImage(id);
    const imgs = await getAllImages();
    setImages(imgs);
  };

  const update = async (id, updatedData) => {
    await updateImage(id, updatedData);
    const imgs = await getAllImages();
    setImages(imgs);
  };

  return { images, add, remove, update };
}
