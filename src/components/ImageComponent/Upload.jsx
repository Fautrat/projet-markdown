import { useState } from "react";
import {useImages} from "../../hooks/useImages.js";

function Upload() {

    const { add } = useImages();
    const [newImage, setNewImage] = useState(null);

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setNewImage({
                name: file.name,
                data: reader.result,
            });
        };
        reader.readAsDataURL(file);
    }

    function saveImage() {
        if (!newImage) {
            alert("No image to save!");
            return;
        }

        add(newImage);
        setNewImage(null);
        alert("Oh yeah baby! Image saved successfully.");
    }

    return (
        <div className="image-upload container py-4">
            <input type="file" accept="image/*" onChange={handleFileChange} className="form-control mb-3" />
            {newImage && <img src={newImage.data} alt={newImage.name} width="200" className="img-thumbnail mb-3" />}
            <button className="btn btn-success" onClick={saveImage}>💾 Save image</button>
        </div>
    );
}

export default Upload;
