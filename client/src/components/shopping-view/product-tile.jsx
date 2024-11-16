import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItems, addToCart } from "@/store/shop/cart-slice";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  toast,
}) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleAddtoCart = async (phoneId, quantity, price) => {
    setIsAddingToCart(true);
    const userId = user?.id;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shop/cart/add",
        {
          userId,
          phoneId,
          quantity,
          price,
        }
      );
      if (response.data.success) {
        toast({
          title: "Phone added to cart",
        });
        // Fetch updated cart items after adding to the cart
        dispatch(fetchCartItems(userId));
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      toast({
        title: "Error adding to cart",
        description: "There was a problem adding the phone to your cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative w-full h-48">
          <img
            src={product?.phone_img}
            alt={product?.phone_brand}
            className="w-full h-full object-contain"
          />
          {product?.stock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.stock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.stock} Left`}
            </Badge>
          ) : product?.saleprice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.phone_name]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.phone_brand]}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-2 mt-2">
            {`${product?.phone_brand || ""} ${product?.phone_name || ""}`}
          </h2>

          <div className="flex justify-between items-center mb-2">
            <span
              className={`${product?.saleprice > 0 ? "line-through" : ""
                } text-lg font-semibold text-primary`}
            >
              ${product?.originalprice}
            </span>
            {product?.saleprice > 0 ? (
              <span className="text-lg font-bold">${product?.saleprice}</span>
            ) : null}
          </div>
          <h2 className="text-sm font-bold mb-2 mt-2">
            {`(${product?.ram}GB RAM & ${product?.storage}GB STORAGE)`}
          </h2>
          <h2 className="text-base font-bold mb-2 mt-2">
            {"Color : " + product?.color}
          </h2>
        </CardContent>
      </div>
      <CardFooter>
        {product?.stock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() =>
              handleAddtoCart(
                product?._id,
                1,
                product?.saleprice > 0
                  ? product?.saleprice
                  : product?.originalprice
              )
            }
            className="w-full"
            disabled={isAddingToCart}
          >
            {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;