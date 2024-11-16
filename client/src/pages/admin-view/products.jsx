import React, { Fragment, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";

const initialFormData = {
  brand: "",
  mobilename: "",
  phone_img: "",
  display: "",
  processor: "",
  antutu: "",
  sensor: "",
  mp: "",
  battery: "",
  rr: "",
  speaker: "",
  ram: "",
  storage: "",
  color: "",
  price: "",
  saleprice: "",
  totalStock: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleImageUpload = useCallback((urls) => {
    console.log("Uploaded URLs  dekh:", urls); // Check if URLs are logged here
    setUploadedImageUrls(urls);
    setImageLoadingState(false);
  }, []);


  function onSubmit(event) {
    console.log("my form data is : ",formData)
    event.preventDefault();
    // Transform formData to match API structure
    const transformedData = {
      phone_brand: formData.brand,
      phone_name: formData.mobilename,
      phone_img: formData.phone_img,
      specs: {
        display_type: formData.display,
        processor: formData.processor,
        antutuscore: formData.antutu,
        camera_sensor: formData.sensor,
        camera_mp: formData.mp,
        battery_cap: formData.battery,
        refresh_rate: formData.rr,
        speaker: formData.speaker
      },
      ram: formData.ram,
      storage: formData.storage,
      color: formData.color,
      originalprice: formData.price,
      saleprice: formData.saleprice,
      stock: formData.totalStock,
      additionalImages: uploadedImageUrls.slice(1),
    };

    if (currentEditedId !== null) {
      dispatch(editProduct({
        id: currentEditedId,
        formData: transformedData,
      })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          resetForm();
          toast({
            title: "Product updated successfully",
          });
        }
      });
    } else {
      dispatch(addNewProduct(transformedData)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          resetForm();
          toast({
            title: "Product added successfully",
          });
        }
      });
    }
  }

  function resetForm() {
    setFormData(initialFormData);
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setImageFiles([]);
    setUploadedImageUrls([]);
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Product deleted successfully",
        });
      }
    });
  }

  function isFormValid() {
    const requiredFields = Object.keys(formData);
    const allFieldsFilled = requiredFields.every(key => formData[key] !== "");
    const hasImages = uploadedImageUrls.length > 0;

    console.log("Required fields filled:", allFieldsFilled);
    console.log("Has images:", hasImages);
    console.log("Uploaded Image URLs:", uploadedImageUrls);
    console.log("Form Data:", formData);

    return allFieldsFilled && hasImages;
  }


  function handleEdit(product) {
    // Extract all the specs fields
    const specs = product.specs[0] || {};
    const images = product.images || [];

    // Create an array of image URLs from the `images` array
    const additionalImages = images.map(image => image.img);

    // Combine `product.phone_img` with `additionalImages`
    const allImages = [product.phone_img, ...additionalImages].filter(Boolean);

    // Create the mapped form data
    const mappedFormData = {
      // Basic fields
      brand: product.phone_brand || "",
      mobilename: product.phone_name || "",
      phone_img: product.phone_img || "",

      // Specs fields
      display: specs.display_type || "",
      processor: specs.processor || "",
      antutu: specs.antutuscore || specs.antutu || "",
      sensor: specs.camera_sensor || specs.sensor || "",
      mp: specs.camera_mp || specs.mp || "",
      battery: specs.battery_cap || specs.battery || "",
      rr: specs.refresh_rate || specs.rr || "",
      speaker: specs.speaker || "",

      // Other direct fields
      ram: product.ram || "",
      storage: product.storage || "",
      color: product.color || "",
      price: product.originalprice || product.price || "",
      saleprice: product.saleprice || "",
      totalStock: product.stock || product.totalStock || ""
    };

    setCurrentEditedId(product._id);
    setFormData(mappedFormData);

    // Set combined image URLs
    setUploadedImageUrls(allImages);

    setOpenCreateProductsDialog(true);
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => {
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setImageFiles([]);
          setUploadedImageUrls([]);
          setOpenCreateProductsDialog(true);
        }}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              product={productItem}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
          }
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={handleImageUpload}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;