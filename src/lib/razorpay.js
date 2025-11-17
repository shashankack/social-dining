// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Open Razorpay payment modal
export const openRazorpayCheckout = async (paymentData, onSuccess, onFailure) => {
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    console.error("Failed to load Razorpay SDK");
    onFailure("Failed to load payment gateway. Please try again.");
    return;
  }

  const options = {
    key: paymentData.razorpayKeyId, // Razorpay Key ID from backend
    amount: paymentData.amount, // Amount in paise
    currency: paymentData.currency || "INR",
    name: paymentData.activityName || "Event Registration",
    description: paymentData.description || "Event registration payment",
    order_id: paymentData.orderId, // Order ID from backend
    handler: function (response) {
      // Payment successful
      console.log("Payment successful:", response);
      onSuccess(response);
    },
    prefill: {
      name: paymentData.userName,
      email: paymentData.userEmail,
      contact: paymentData.userPhone,
    },
    theme: {
      color: "#E25517", // Your brand color
    },
    modal: {
      ondismiss: function () {
        console.log("Payment cancelled by user");
        onFailure("Payment cancelled");
      },
    },
  };

  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.open();
};
