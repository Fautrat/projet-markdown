import {useState} from 'react'

function Image() {

  return (
    <div>
        <div style={{display: 'flex', gap: '20px'}}>
            <ImageUpload/>
            <ImageLibrary/>
        </div>
    </div>
  )
}
export default Image



function ImageLibrary(){

        localStorage.getItem("uploadedImage");
        const image = JSON.parse(localStorage.getItem("uploadedImage"));
        console.log("Retrieved image from localStorage:", image);

    return (
        <div className="image-library">
            <h1>Image Library</h1>

            {
                image ? 
                            <h1>{image.name}</h1>
                : null
            }
            {image && <img src={image.data} alt="Uploaded" />}
        </div>
    )
}
// export default ImageLibrary;



function ImageUpload(){

    const [image, setImage] = useState({});

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            setImage({
                name: file.name,
                data: reader.result
            });
        };

        reader.readAsDataURL(file);
    }

    function SaveImage(){
        localStorage.setItem("uploadedImage", JSON.stringify({
            name: image.name,
            data: image.data
        }));
        alert("Image saved to library!");
    }


    return (
        <div className="image-upload">
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {image && (
                <img src={image.data} alt="preview" width="200" />
            )}

            <button onClick={() => SaveImage()}>Save image</button>
        </div>
    )
}

// export default ImageUpload;