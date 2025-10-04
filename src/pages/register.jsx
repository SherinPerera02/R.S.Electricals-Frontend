import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"
import { useNavigate, Link } from "react-router-dom"
import { Zap, User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
import Header from "../components/header"

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    
    const navigate = useNavigate()

    async function handleRegister() {
        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        try {
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users", {
                firstName,
                lastName,
                email,
                password
            })

            toast.success("Registration Successful")
            navigate("/login")
        } catch (e) {
            toast.error(e.response?.data?.message || "Registration Failed")
        }
    }

    return (
        <div className="w-full min-h-screen bg-white">
            <Header />
            <div className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
                <div className="max-w-md w-full">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join R.S. Electricals today</p>
                </div>

                {/* Register Form */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl mx-4 sm:mx-0">
                    <div className="space-y-6">
                        {/* First Name Input */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text"
                                    placeholder="Enter your first name"
                                    onChange={(e) => setFirstName(e.target.value)}
                                    value={firstName}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Last Name Input */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text"
                                    placeholder="Enter your last name"
                                    onChange={(e) => setLastName(e.target.value)}
                                    value={lastName}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="email"
                                    placeholder="Enter your email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Register Button */}
                        <button 
                            onClick={handleRegister}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
                        >
                            Create Account
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Sign In Link */}
                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link 
                            to="/signin" 
                            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
            </div>
        </div>
    )
}
