import { Link, Route, Routes, useLocation } from "react-router-dom";
import AddProductPage from "./admin/addProductPage";
import AdminProductsPage from "./admin/productsPage";
import EditProductPage from "./admin/editProductPage";
import AdminOrdersPage from "./admin/adminOrdersPage";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../components/loading";
import { clearUserCart } from "../utils/cart";
import { 
	Package, 
	Users, 
	ShoppingCart, 
	Star, 
	BarChart3, 
	Settings, 
	LogOut,
	Home,
	Zap 
} from "lucide-react";

export default function AdminPage() {
	const location = useLocation();
	const path = location.pathname;
	const [status, setStatus] = useState("loading");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			setStatus("unauthenticated");
			window.location.href = "/login";
		} else {
			axios
				.get(import.meta.env.VITE_BACKEND_URL + "/api/users/", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					if (response.data.role !== "admin") {
						setStatus("unauthorized");
						toast.error("You are not authorized to access this page");
						window.location.href = "/";
					} else {
						setStatus("authenticated");
					}
				})
				.catch((error) => {
					console.error(error);
					setStatus("unauthenticated");
					toast.error("You are not authenticated, please login");
					window.location.href = "/login";
				});
		}
	}, []); // Remove status dependency to prevent infinite loop

	function getClass(name) {
		if (path.includes(name)) {
			return "flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl mx-2 my-1 shadow-lg transform scale-105 transition-all duration-300";
		} else {
			return "flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 p-4 rounded-xl mx-2 my-1 transition-all duration-300 transform hover:scale-105";
		}
	}

	const handleLogout = () => {
		localStorage.removeItem("token");
		clearUserCart(); // Clear user-specific cart on logout
		toast.success("Logged out successfully");
		window.location.href = "/login";
	};

	return (
		<div className="w-full min-h-screen bg-gray-50 flex">
			{status == "loading" || status == "unauthenticated" ? 
				<Loading/> : 
				<>
					{/* Modern Sidebar */}
					<div className="fixed left-0 top-0 h-screen w-80 bg-white shadow-2xl border-r border-gray-200 flex flex-col z-40">
						{/* Header */}
						<div className="p-6 border-b border-gray-100">
							<div className="flex items-center space-x-3">
								<div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
									<img src="/logo.png" alt="R.S. Electricals" className="w-full h-full object-contain" />
								</div>
								<div>
									<h1 className="text-xl font-bold text-gray-800">R.S. Electricals</h1>
									<p className="text-sm text-gray-500">Admin Dashboard</p>
								</div>
							</div>
						</div>

						{/* Navigation Links */}
						<nav className="flex-1 p-4 space-y-2">
							<Link 
								className={getClass("products")} 
								to="/admin/products"
							>
								<Package className="w-5 h-5" />
								<span className="font-medium">Products</span>
							</Link>
							
							<Link 
								className={getClass("users")} 
								to="/admin/users"
							>
								<Users className="w-5 h-5" />
								<span className="font-medium">Users</span>
							</Link>
							
							<Link 
								className={getClass("orders")} 
								to="/admin/orders"
							>
								<ShoppingCart className="w-5 h-5" />
								<span className="font-medium">Orders</span>
							</Link>
							
							<Link 
								className={getClass("reviews")} 
								to="/admin/reviews"
							>
								<Star className="w-5 h-5" />
								<span className="font-medium">Reviews</span>
							</Link>

							<Link 
								className={getClass("analytics")} 
								to="/admin/analytics"
							>
								<BarChart3 className="w-5 h-5" />
								<span className="font-medium">Analytics</span>
							</Link>
						</nav>

						{/* Footer Actions */}
						<div className="p-4 border-t border-gray-100 space-y-2">
							<Link 
								to="/"
								className="flex items-center space-x-3 p-4 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
							>
								<Home className="w-5 h-5" />
								<span className="font-medium">Back to Site</span>
							</Link>
							
							<button 
								onClick={handleLogout}
								className="w-full flex items-center space-x-3 p-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
							>
								<LogOut className="w-5 h-5" />
								<span className="font-medium">Logout</span>
							</button>
						</div>
					</div>

					{/* Modern Main Content */}
					<div className="flex-1 flex flex-col ml-80">
						{/* Top Header Bar */}
						<header className="bg-white shadow-sm border-b border-gray-200 p-6">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-2xl font-bold text-gray-800">
										{path.includes('products') && 'Products Management'}
										{path.includes('users') && 'Users Management'}
										{path.includes('orders') && 'Orders Management'}
										{path.includes('reviews') && 'Reviews Management'}
										{path.includes('analytics') && 'Analytics Dashboard'}
										{path.includes('add-product') && 'Add New Product'}
										{path.includes('edit-product') && 'Edit Product'}
										{(!path.includes('products') && !path.includes('users') && !path.includes('orders') && !path.includes('reviews') && !path.includes('analytics') && !path.includes('add-product') && !path.includes('edit-product')) && 'Admin Dashboard'}
									</h2>
									<p className="text-gray-500 mt-1">Manage your R.S. Electricals business</p>
								</div>
								<div className="flex items-center space-x-4">
									<div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
										Welcome, Admin
									</div>
								</div>
							</div>
						</header>

						{/* Content Area */}
						<main className="flex-1 p-6 bg-gray-50 overflow-auto">
							<div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-full p-6">
								<Routes>
									<Route path="/products" element={<AdminProductsPage />} />
									<Route path="/users" element={
										<div className="text-center py-12">
											<Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
											<h3 className="text-xl font-semibold text-gray-600 mb-2">Users Management</h3>
											<p className="text-gray-500">Coming Soon...</p>
										</div>
									} />
									<Route path="/orders" element={<AdminOrdersPage />} />
									<Route path="/reviews" element={
										<div className="text-center py-12">
											<Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
											<h3 className="text-xl font-semibold text-gray-600 mb-2">Reviews Management</h3>
											<p className="text-gray-500">Coming Soon...</p>
										</div>
									} />
									<Route path="/analytics" element={
										<div className="text-center py-12">
											<BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
											<h3 className="text-xl font-semibold text-gray-600 mb-2">Analytics Dashboard</h3>
											<p className="text-gray-500">Coming Soon...</p>
										</div>
									} />
									<Route path="/add-product" element={<AddProductPage />} />
									<Route path="/edit-product" element={<EditProductPage />} />
									<Route path="/*" element={
										<div className="text-center py-12">
											<h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Admin Dashboard</h3>
											<p className="text-gray-500 mb-6">Manage your R.S. Electricals business efficiently</p>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
												<div className="bg-blue-50 p-6 rounded-xl text-center">
													<Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
													<h4 className="font-semibold text-gray-800">Products</h4>
													<p className="text-sm text-gray-600">Manage inventory</p>
												</div>
												<div className="bg-green-50 p-6 rounded-xl text-center">
													<Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
													<h4 className="font-semibold text-gray-800">Users</h4>
													<p className="text-sm text-gray-600">Customer management</p>
												</div>
												<div className="bg-purple-50 p-6 rounded-xl text-center">
													<ShoppingCart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
													<h4 className="font-semibold text-gray-800">Orders</h4>
													<p className="text-sm text-gray-600">Track sales</p>
												</div>
												<div className="bg-yellow-50 p-6 rounded-xl text-center">
													<Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
													<h4 className="font-semibold text-gray-800">Reviews</h4>
													<p className="text-sm text-gray-600">Customer feedback</p>
												</div>
											</div>
										</div>
									} />
								</Routes>
							</div>
						</main>
					</div>
				</>
			}
		</div>
	);
}