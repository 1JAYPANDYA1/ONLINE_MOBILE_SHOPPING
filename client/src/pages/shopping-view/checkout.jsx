import Address from "@/components/shopping-view/address";
import img from "../../assets/i1.png";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.saleprice > 0
            ? currentItem?.saleprice
            : currentItem?.originalprice) *
          currentItem?.quantity,
        0
      )
      : 0;

  // Create Razorpay Order and open the payment gateway
  async function handleInitiateRazorPayPayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    // Prepare order data to send to backend
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.phoneId,
        amount: singleCartItem?.amount,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      totalAmount: totalCartAmount,
    };

    try {
      // Dispatch the order to create and get Razorpay order ID from backend
      const response = await dispatch(createNewOrder(orderData)).unwrap();

      if (response?.success) {
        setIsPaymentStart(true);
        openRazorpayPayment(response.razorpayOrderId);
      } else {
        setIsPaymentStart(false);
        toast({
          title: "Order creation failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      setIsPaymentStart(false);
      toast({
        title: "Error processing payment.",
        variant: "destructive",
      });
    }
  }

  // Open Razorpay Payment Gateway
  const openRazorpayPayment = (razorpayOrderId) => {
    const options = {
      key: "rzp_test_pVMPiZnpHDsa6g", // Replace with your Razorpay test/live key
      amount: totalCartAmount * 100, // Amount in paise
      currency: "INR",
      name: "Your Company Name",
      description: "Test Transaction",
      order_id: razorpayOrderId,
      handler: (response) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

        // Handle the payment response (e.g., updating UI or notifying the user)
        toast({
          title: "Payment successful!",
          variant: "success",
        });
        setIsPaymentStart(false)

        // If required, you can send this payment data to your backend here.
      },
      prefill: {
        name: user?.name || "Your Name",
        email: user?.email || "email@example.com",
        contact: currentSelectedAddress?.phone || "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          className="h-full w-full object-cover object-center"
          alt="Product Image"
        />
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
              <UserCartItemsContent cartItem={item} key={item.phoneId} />
            ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiateRazorPayPayment} className="w-full">
              {isPaymentStart
                ? "Processing RazorPay Payment..."
                : "Proceed to Payment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
