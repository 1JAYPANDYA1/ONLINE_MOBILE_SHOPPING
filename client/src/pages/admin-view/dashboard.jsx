import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addThumbnailImage, getThumbnailImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  // Define state for image files and URLs
  const [imageFiles, setImageFiles] = useState([]); // <-- Changed to imageFiles (plural)
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null); // Initialize currentEditedId state
  const dispatch = useDispatch();
  const { ThumbnailImageList } = useSelector((state) => state.commonThumbnail);

  console.log(uploadedImageUrls, "uploadedImageUrls");

  function handleUploadThumbnailImage() {
    dispatch(addThumbnailImage(uploadedImageUrls[0])) // Use the first image URL
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getThumbnailImages());
          setImageFiles([]); // Clear the selected files
          setUploadedImageUrls([]); // Clear the uploaded URLs
        }
      });
  }

  useEffect(() => {
    dispatch(getThumbnailImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFiles={imageFiles} // <-- Pass imageFiles as a prop
        setImageFiles={setImageFiles} // <-- Pass setImageFiles as a prop
        uploadedImageUrls={uploadedImageUrls}
        setUploadedImageUrls={setUploadedImageUrls}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        isEditMode={currentEditedId !== null}
      />
      <Button onClick={handleUploadThumbnailImage} className="mt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {ThumbnailImageList && ThumbnailImageList.length > 0
          ? ThumbnailImageList.map((ThumbnailImgItem) => (
            <div className="w-full h-48" key={ThumbnailImgItem.id}>
              <img
                src={ThumbnailImgItem.image}
                className="w-full h-full object-contain"
              />
            </div>
          ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
