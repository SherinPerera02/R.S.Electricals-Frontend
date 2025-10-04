import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Shield, CheckCircle } from "lucide-react"
import Loading from "../components/loading"

export default function ForgetPasswordPage(){
    const [otpSent, setotp] = useState(false)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isPasswordReset, setIsPasswordReset] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [errors, setErrors] = useState({})

    // Password validation
    const validatePassword = (password) => {
        const errors = {}
        if (password.length < 8) {
            errors.password = "Password must be at least 8 characters long"
        }
        if (!/(?=.*[a-z])/.test(password)) {
            errors.password = "Password must contain at least one lowercase letter"
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.password = "Password must contain at least one uppercase letter"
        }
        if (!/(?=.*\d)/.test(password)) {
            errors.password = "Password must contain at least one number"
        }
        return errors
    }

    // Email validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // Countdown timer for resend OTP
    const startCountdown = () => {
        setCountdown(60)
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }
    
    function sendOtp(){
        // Validate email
        if (!email || !validateEmail(email)) {
            setErrors({email: "Please enter a valid email address"})
            return
        }

        setLoading(true)
        setErrors({})

        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/send-otp", {
            email: email
        }).then((response)=>{
            setotp(true)
            startCountdown()
            toast.success("OTP sent to your email. Please check your inbox and spam folder!")
            console.log(response.data)
        }).catch((error)=>{
            console.error(error)
            if (error.response?.status === 404) {
                setErrors({email: "No account found with this email address"})
            } else if (error.response?.status === 400) {
                setErrors({email: error.response.data.message || "Invalid email format"})
            } else {
                toast.error("Failed to send OTP. Please try again.")
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    function verifyOtp(){
        // Validate inputs
        const newErrors = {}
        if (!otp || otp.length !== 6) {
            newErrors.otp = "Please enter a valid 6-digit OTP"
        }
        if (!newPassword) {
            newErrors.newPassword = "New password is required"
        } else {
            const passwordErrors = validatePassword(newPassword)
            if (passwordErrors.password) {
                newErrors.newPassword = passwordErrors.password
            }
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setLoading(true)
        setErrors({})

        const otpInNumberFormat = parseInt(otp, 10);
        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/reset-password", {
            email: email,
            otp: otpInNumberFormat,
            newPassword: newPassword,
        }).then((response)=>{
            setIsPasswordReset(true)
            toast.success("Password reset successfully!")
            console.log(response.data)
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                window.location.href = "/login"
            }, 3000)
        }).catch((error)=>{
            console.error(error)
            if (error.response?.status === 400) {
                const errorMessage = error.response.data.message || "Invalid or expired OTP"
                if (errorMessage.includes("expired")) {
                    setErrors({otp: "OTP has expired. Please request a new one."})
                } else if (errorMessage.includes("Invalid OTP")) {
                    setErrors({otp: "Invalid OTP. Please check and try again."})
                } else {
                    setErrors({otp: errorMessage})
                }
            } else if (error.response?.status === 404) {
                setErrors({otp: "User not found. Please try again."})
            } else {
                toast.error("Failed to reset password. Please try again.")
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    if (loading) {
        return <Loading />
    }

    return(
        <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('/login.jpg')] bg-center bg-cover"></div>
            </div>
            
            {/* Back to Login Link */}
            <Link 
                to="/login" 
                className="absolute top-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Login</span>
            </Link>

            <div className="relative z-10">
                {isPasswordReset ? (
                    // Success State
                    <div className="w-[400px] bg-white shadow-2xl rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successfully!</h2>
                        <p className="text-gray-600 mb-6">Your password has been updated. Redirecting to login...</p>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : otpSent ? (
                    // OTP Verification State
                    <div className="w-[450px] bg-white shadow-2xl rounded-2xl p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
                            <p className="text-gray-600">
                                We've sent a 6-digit code to <span className="font-semibold">{email}</span>
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* OTP Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter OTP
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Enter 6-digit OTP" 
                                    className={`w-full h-12 px-4 rounded-lg border ${errors.otp ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest`}
                                    value={otp} 
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                                        setOtp(value)
                                        setErrors(prev => ({...prev, otp: ''}))
                                    }}
                                    maxLength="6"
                                />
                                {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="Enter new password" 
                                        className={`w-full h-12 pl-10 pr-12 rounded-lg border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                        value={newPassword} 
                                        onChange={(e) => {
                                            setNewPassword(e.target.value)
                                            setErrors(prev => ({...prev, newPassword: ''}))
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        placeholder="Confirm new password" 
                                        className={`w-full h-12 pl-10 pr-12 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                        value={confirmPassword} 
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value)
                                            setErrors(prev => ({...prev, confirmPassword: ''}))
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                            </div>

                            {/* Verify Button */}
                            <button 
                                className="w-full h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium"
                                onClick={verifyOtp}
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "Reset Password"}
                            </button>

                            {/* Resend OTP */}
                            <div className="text-center">
                                {countdown > 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        Resend OTP in {countdown}s
                                    </p>
                                ) : (
                                    <button 
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        onClick={() => {
                                            setotp(false)
                                            setOtp("")
                                            setNewPassword("")
                                            setConfirmPassword("")
                                            setErrors({})
                                        }}
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Email Input State
                    <div className="w-[400px] bg-white shadow-2xl rounded-2xl p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
                            <p className="text-gray-600">
                                No worries! Enter your email and we'll send you a reset code.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email address" 
                                        className={`w-full h-12 pl-10 pr-4 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                        value={email} 
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            setErrors(prev => ({...prev, email: ''}))
                                        }}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <button 
                                className="w-full h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium"
                                onClick={sendOtp}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Reset Code"}
                            </button>

                            <div className="text-center">
                                <Link 
                                    to="/login" 
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Remember your password? Sign in
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}