import { Link, useNavigate } from "react-router-dom";
import { Zap, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import UserData from "./userData";
import { getCartItemCount } from "../utils/cart";

export default function Header(){
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [cartItemCount, setCartItemCount] = useState(0)
    
    // Update cart count when component mounts or cart changes
    useEffect(() => {
        const updateCartCount = () => {
            setCartItemCount(getCartItemCount())
        }
        
        updateCartCount()
        
        // Listen for storage changes to update cart count when cart is modified
        window.addEventListener('storage', updateCartCount)
        
        // Custom event listener for cart updates within the same tab
        window.addEventListener('cartUpdated', updateCartCount)
        
        return () => {
            window.removeEventListener('storage', updateCartCount)
            window.removeEventListener('cartUpdated', updateCartCount)
        }
    }, [])
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }
    
    return(
        <header className="sticky top-0 z-50 w-full h-[60px] sm:h-[70px] lg:h-[80px] bg-white shadow-xl border-b border-gray-200 backdrop-blur-sm">
            <div className="flex items-center justify-between h-full px-4 sm:px-6">
                {/* Logo Section */}
                <div className="flex items-center cursor-pointer group" onClick={() => navigate("/")}>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-700 to-blue-800 rounded-full flex items-center justify-center mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300 p-1">
                        <img 
                            src="/logo.png" 
                            alt="R.S. Electricals Logo" 
                            className="w-full h-full object-contain rounded-full"
                        />
                    </div>
                    <div className="text-gray-800">
                        <h1 className="text-base sm:text-lg lg:text-xl font-bold">R.S. Electricals</h1>
                    </div>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex flex-1 justify-center items-center space-x-8">
                    <Link 
                        to="/" 
                        className="text-gray-800 hover:text-blue-600 text-lg font-semibold transition-all duration-300 relative group"
                    >
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link 
                        to="/products" 
                        className="text-gray-800 hover:text-blue-600 text-lg font-semibold transition-all duration-300 relative group"
                    >
                        Products
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link 
                        to="/about" 
                        className="text-gray-800 hover:text-blue-600 text-lg font-semibold transition-all duration-300 relative group"
                    >
                        About
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link 
                        to="/contact" 
                        className="text-gray-800 hover:text-blue-600 text-lg font-semibold transition-all duration-300 relative group"
                    >
                        Contact
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                </nav>

                {/* Right Section - Cart and Auth */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Cart Button */}
                    <button 
                        onClick={() => navigate('/cart')}
                        className="relative group p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300"
                    >
                        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold">
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </span>
                        )}
                    </button>
                    
                    {/* Desktop Auth Buttons */}
                    <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
                        {/* Sign In Button */}
                        <Link 
                            to="/signin"
                            className="text-gray-800 hover:text-blue-600 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg transition-all duration-300 font-medium text-sm lg:text-base"
                        >
                            Sign In
                        </Link>
                        
                        {/* Sign Up Button */}
                        <Link 
                            to="/signup"
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 lg:px-6 lg:py-2 rounded-full font-semibold transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 text-sm lg:text-base"
                        >
                            Sign Up
                        </Link>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <button 
                        onClick={toggleMenu}
                        className="lg:hidden p-2 text-gray-800 hover:text-blue-600 transition-colors duration-300"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-200 z-40">
                    <nav className="flex flex-col py-4">
                        <Link 
                            to="/" 
                            className="text-gray-800 hover:text-blue-600 px-6 py-3 font-semibold transition-all duration-300 hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/products" 
                            className="text-gray-800 hover:text-blue-600 px-6 py-3 font-semibold transition-all duration-300 hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Products
                        </Link>
                        <Link 
                            to="/about" 
                            className="text-gray-800 hover:text-blue-600 px-6 py-3 font-semibold transition-all duration-300 hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link 
                            to="/contact" 
                            className="text-gray-800 hover:text-blue-600 px-6 py-3 font-semibold transition-all duration-300 hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>
                        
                        {/* Mobile Auth Buttons */}
                        <div className="flex flex-col sm:hidden mt-4 px-6 space-y-3">
                            <Link 
                                to="/signin"
                                className="text-center text-gray-800 hover:text-blue-600 px-4 py-2 border border-gray-300 rounded-lg transition-all duration-300 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/signup"
                                className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:from-blue-700 hover:to-blue-800"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}