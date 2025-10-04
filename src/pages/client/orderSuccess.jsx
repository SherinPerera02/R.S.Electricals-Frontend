import { useEffect, useState } from "react";
import { CheckCircle, Package, Truck, ArrowRight, Home, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Header from "../../components/header";
import { clearCart } from "../../utils/cart";

export default function OrderSuccessPage() {
    const location = useLocation();
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        // Get order data from navigation state
        const data = location.state?.orderData;
        if (data) {
            setOrderData(data);
            // Clear the cart after successful order
            clearCart();
        }
    }, [location.state]);

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // 3 days from now

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            <Header />
            
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-8">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center animate-pulse">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Order Placed Successfully! 
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        Thank you for your purchase!
                    </p>
                    <p className="text-gray-500">
                        We've received your order and will process it shortly.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Order Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
                            
                            {orderData && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                        <span className="text-gray-600">Order Number:</span>
                                        <span className="font-semibold text-gray-900">
                                            #{orderData.orderNumber || 'ORD-PENDING'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                        <span className="text-gray-600">Order Date:</span>
                                        <span className="font-semibold text-gray-900">
                                            {new Date().toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                        <span className="text-gray-600">Total Amount:</span>
                                        <span className="font-bold text-2xl text-green-600">
                                            Rs. {orderData.total?.toFixed(2) || '0.00'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                        <span className="text-gray-600">Payment Method:</span>
                                        <span className="font-semibold text-gray-900 capitalize">
                                            {orderData.paymentMethod || 'Cash on Delivery'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start pb-2">
                                        <span className="text-gray-600">Delivery Address:</span>
                                        <span className="font-semibold text-gray-900 text-right max-w-xs">
                                            {orderData.address || 'Address not provided'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Delivery Timeline */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Order Confirmed</h3>
                                        <p className="text-sm text-gray-600">Your order has been placed successfully</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Processing</h3>
                                        <p className="text-sm text-gray-600">We'll prepare your items for shipping</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                                        <Truck className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-700">Delivery</h3>
                                        <p className="text-sm text-gray-600">
                                            Expected by {estimatedDelivery.toLocaleDateString('en-US', { 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/products"
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Continue Shopping
                    </Link>
                    
                    <Link
                        to="/"
                        className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-white hover:border-gray-400 transition-all duration-300"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                </div>

                {/* Additional Information */}
                <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-800">
                        <div>
                            <h4 className="font-semibold mb-2">Order Tracking</h4>
                            <p>You'll receive SMS/email updates about your order status and delivery information.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Contact Support</h4>
                            <p>If you have any questions, feel free to contact our customer support team.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Return Policy</h4>
                            <p>Items can be returned within 7 days of delivery in original condition.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Payment Security</h4>
                            <p>Your payment information is secure and encrypted for your protection.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}