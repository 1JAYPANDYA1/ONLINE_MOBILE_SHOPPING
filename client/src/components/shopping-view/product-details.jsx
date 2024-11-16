import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog"; // Import DialogTitle
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import axios from "axios";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  const [count, setCount] = useState(1);
  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [mainImg, setMainImg] = useState(null);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
          description: "Thank you for sharing your feedback.",
        });
      } else {
        toast({
          title: "Review Submission Failed",
          description: "There was an error submitting your review.",
        });
      }
    });
  }

  const fetchFirst = async () => {
    const response = await axios.get(`http://localhost:5000/api/shop/products/${productDetails?._id}`);
    const { product, images, specs } = response.data;
    setProductDetails(product);
    setImages(images);
    setSpecifications(specs);
    setMainImg(images.length > 0 ? images[0].img : null);
  };
  useEffect(() => {
    if (open && productDetails) {
      dispatch(getReviews(productDetails._id));
      fetchFirst();
    }
  }, [open, productDetails, dispatch]);


  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
      : 0;


  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        {/* Accessible title for screen readers */}
        <DialogTitle className="sr-only">Product Details</DialogTitle> {/* VisuallyHidden class */}

        {/* Image Gallery */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={mainImg}
            alt={productDetails?.phone_brand}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
          <div className="flex justify-center mt-5 space-x-4 p-8 border-2 border-black">
            {images.map((img, index) => (
              <img
                key={index}
                src={img.img}
                alt={`Product ${index + 1}`}
                className="w-1/4 cursor-pointer hover:opacity-75 p-1"
                onClick={() => setMainImg(img.img)}
              />
            ))}
          </div>
        </div>

        <div className="">
          {/* Product Details */}
          <h1 className="text-3xl font-extrabold">{productDetails?.phone_brand}</h1>
          <p className="text-muted-foreground text-2xl mb-5 mt-4">
            RAM  :  {productDetails?.ram} GB & STORAGE : {productDetails?.storage} GB
          </p>
          <p className="text-muted-foreground text-2xl mb-5 mt-4">
           Processor :  {specifications.processor} 
          </p>
          <p className="text-muted-foreground text-2xl mb-5 mt-4">
            CAMERA :  {specifications?.camera_mp}MP ({specifications?.camera_sensor})
          </p>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">  
            {productDetails?.phone_name}
            </p>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${productDetails?.saleprice > 0 ? "line-through" : ""}`}
            >
              ${productDetails?.originalprice}
            </p>
            {productDetails?.saleprice > 0 && (
              <p className="text-2xl font-bold text-muted-foreground">${productDetails?.saleprice}</p>
            )}

          </div>

          <Separator />

          {/* Review Section */}
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, index) => (
                  <div key={index} className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>

            {/* Write a Review */}
            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ""}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
