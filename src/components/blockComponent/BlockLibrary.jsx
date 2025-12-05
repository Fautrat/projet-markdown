
import { useSelector, useDispatch } from "react-redux";
// import {removeBlocklocal,updateBlocklocal,} from "../../store/slices/blockSlice.js";
// import { deleteBlock, updateBlock } from "../../services/blockService.js";


function BlockLibrary() {
  const dispatch = useDispatch();
  const blocks = useSelector((state) => state.blocks.items || []);
  return (
    <>
    {blocks.map((block) => (
          <div key={block.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{block.title}</h5>
                <h5 className="card-title">{block.content}</h5>
                <h5 className="card-title">{block.shortcut}</h5>
                <div className="mt-auto d-flex justify-content-between">
                  {/* <button className="btn btn-sm btn-warning" onClick={() => handleEdit(img.id)}>
                    ✏️
 Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(img.id)}>
                    🗑️
 Delete
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        ))}
     </>
  )
}

export default BlockLibrary