import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.saleprice > 0
            ? currentItem?.saleprice
            : currentItem?.originalprice) *
          currentItem?.quantity,
        0
      )
      : 0;

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      {/* Increase the max-height to display more phones at once */}
      <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => (
            <UserCartItemsContent key={item.phoneId} cartItem={item} />
          ))
          : <p>Your Cart is empty</p>}
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total</span>
          <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
        </div>
        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="w-full"
        >
          Checkout
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
