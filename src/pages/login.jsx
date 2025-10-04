import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"
import { useNavigate, Link } from "react-router-dom"
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
import Header from "../components/header"
import { migrateGuestCartToUser } from "../utils/cart"
import { useGoogleLogin } from "@react-oauth/google"
import { FcGoogle } from "react-icons/fc"

export default function LoginPage(){

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const googleLogin  = useGoogleLogin({
        onSuccess: (response)=>{
            const accessToken = response.access_token
            axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/login/google", {
                accessToken: accessToken
            }).then((response)=>{
                toast.success("Login Successful")
                const token = response.data.token
                localStorage.setItem("token", token)
                
                // Migrate guest cart to user cart after successful login
                migrateGuestCartToUser()
                
                if(response.data.role === "admin"){
                    navigate("/admin/")
                }
                else{
                    navigate("/products")
                }
            })
        }
    })


    async function handleLogin(){
        try{
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/login" , {
            
                email:email,
                password:password
            }
         )
            //alert("Login Successful")
            toast.success("Login Successful")
            console.log(response.data)
            localStorage.setItem("token",response.data.token)
            
            // Migrate guest cart to user cart after successful login
            migrateGuestCartToUser()
            
            if(response.data.role === "admin"){
                  navigate("/admin")
            }else{
                  navigate("/products")
            }

        }catch(e){
            //alert(e.response.data.message)
            toast.error(e.response.data.message)
        }
        

    }


    async function handleGoogleLoginSuccess(credentialResponse) {
        try {
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/users/login-with-google",
                { accessToken: credentialResponse.credential }
            );
            toast.success("Login Successful");
            localStorage.setItem("token", response.data.token);
            migrateGuestCartToUser();
            if (response.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/products");
            }
        } catch (e) {
            toast.error(e.response?.data?.message || "Google login failed");
        }
    }

    return(
        
        <div className="w-full min-h-screen bg-white">
            <Header />
            <div className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
                <div className="max-w-md w-full">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4"></div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your R.S. Electricals account</p>
                </div>

                {/* Google Login Button */}
                <div className="flex justify-center mb-6">
                    <button 
                        onClick={googleLogin} 
                        className="w-full max-w-md h-12 flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
                    >
                        <FcGoogle className="text-xl" />
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">Continue with Google</span>
                    </button>
                </div>
                {/* Login Form */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl mx-4 sm:mx-0">
                    <div className="space-y-6">
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

                        {/* Login Button */}
                        <button 
                            onClick={handleLogin}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
                        >
                            Sign In
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>

                        {/* Forgot Password */}
                        <div className="text-center">
                            <Link 
                                to="/forget-password" 
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link 
                            to="/signup" 
                            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300"
                        >
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
            </div>
        </div>
        
    )
}