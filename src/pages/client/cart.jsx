import { useState, useEffect } from "react"
import { addToCart, getCart, getTotal, removeFromCart, clearCart } from "../../utils/cart"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import Header from "../../components/header"

export default function CartPage(){
    const [cart, setCart] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Load cart with a slight delay to show loading state
        setTimeout(() => {
            setCart(getCart())
            setIsLoading(false)
        }, 300)
    }, [])

    const handleQuantityChange = (item, change) => {
        addToCart(item, change)
        setCart(getCart())
        
        if (change > 0) {
            toast.success(`Added ${item.name} to cart`)
        } else if (item.qty + change <= 0) {
            toast.success(`Removed ${item.name} from cart`)
        } else {
            toast.success(`Updated ${item.name} quantity`)
        }
    }

    const handleRemoveItem = (item) => {
        removeFromCart(item.productId)
        setCart(getCart())
        toast.success(`Removed ${item.name} from cart`)
    }

    const handleClearCart = () => {
        clearCart()
        setCart([])
        toast.success("Cart cleared successfully")
    }

    const total = getTotal()
    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0)

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        )
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                <Header />
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="text-center py-16">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-12 h-12 text-gray-400" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Looks like you haven't added any items to your cart yet. 
                            Start shopping to fill it up!
                        </p>
                        <Link 
                            to="/products" 
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Header />
            
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                            <p className="text-gray-600">
                                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>
                        {cart.length > 0 && (
                            <button
                                onClick={handleClearCart}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear Cart
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.productId} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Product Image */}
                                    <div className="flex-shrink-0">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
                                                <p className="text-sm text-gray-500 mb-3">SKU: {item.productId}</p>
                                                
                                                {/* Price */}
                                                <div className="flex items-center gap-2">
                                                    {item.labelledPrice > item.price ? (
                                                        <>
                                                            <span className="text-lg font-bold text-blue-600">
                                                                Rs. {item.price.toFixed(2)}
                                                            </span>
                                                            <span className="text-sm text-gray-500 line-through">
                                                                Rs. {item.labelledPrice.toFixed(2)}
                                                            </span>
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                                {Math.round(((item.labelledPrice - item.price) / item.labelledPrice) * 100)}% OFF
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-lg font-bold text-blue-600">
                                                            Rs. {item.price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveItem(item)}
                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
                                                title="Remove item"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Quantity Controls and Subtotal */}
                                        <div className="flex justify-between items-center">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                                <button
                                                    onClick={() => handleQuantityChange(item, -1)}
                                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200"
                                                    disabled={item.qty <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">
                                                    {item.qty}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item, 1)}
                                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Item Subtotal */}
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    Rs. {(item.price * item.qty).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span>Rs. {total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>Rs. 0.00</span>
                                </div>
                                <hr className="border-gray-200" />
                                <div className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>Rs. {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link 
                                to="/checkout" 
                                state={{ cart: cart }}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mb-4"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <Link 
                                to="/products"
                                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Continue Shopping
                            </Link>

                            {/* Security Badge */}
                            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-center gap-2 text-green-700">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-medium">Secure Checkout</span>
                                </div>
                                <p className="text-xs text-green-600 mt-1">
                                    Your payment information is encrypted and secure
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}