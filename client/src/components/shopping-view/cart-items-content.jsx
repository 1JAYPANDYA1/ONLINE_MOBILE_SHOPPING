import React from 'react';
import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus" && getCartItem.quantity + 1 > getCartItem.stock) {
      toast({
        title: `Only ${getCartItem.stock} quantity available for this item`,
        variant: "destructive",
      });
      return;
    }
    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem.phoneId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem.quantity + 1
            : getCartItem.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem.phoneId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center space-x-4">
        <img src={cartItem.phone_img} alt={cartItem.phone_name} className="w-16 h-16 object-cover" />
        <div>
          <h3 className="font-semibold">{cartItem.phone_brand} {cartItem.phone_name}</h3>
          <p className="text-sm text-gray-500">{cartItem.ram}GB RAM, {cartItem.storage}GB Storage, {cartItem.color}</p>
          <p className="text-sm font-medium">${cartItem.amount}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleUpdateQuantity(cartItem, "minus")}
          disabled={cartItem.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-medium">{cartItem.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleUpdateQuantity(cartItem, "plus")}
          disabled={cartItem.quantity >= cartItem.stock}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer text-red-500 ml-4"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;