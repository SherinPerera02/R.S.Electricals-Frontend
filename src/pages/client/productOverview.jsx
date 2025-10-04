import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";
import { addToCart, getCart } from "../../utils/cart";
import { Star, ShoppingCart, Zap, Shield, Truck, Award } from "lucide-react";

export default function ProductOverviewPage() {
	const params = useParams();
	const productId = params.id;
	const [status, setStatus] = useState("loading"); //loading , success , error
	const [product, setProduct] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId)
			.then((response) => {
				console.log(response.data);
				setProduct(response.data);
				setStatus("success");
			})
			.catch((error) => {
				console.log(error);
				setStatus("error");
				toast.error("Error fetching product details");
			});
	}, []);
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			{status == "success" && (
				<div className="max-w-7xl mx-auto px-4 py-8">
					{/* Breadcrumb */}
					<div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
						<span onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">Home</span>
						<span>/</span>
						<span onClick={() => navigate('/products')} className="hover:text-blue-600 cursor-pointer">Products</span>
						<span>/</span>
						<span className="text-gray-900 font-medium">{product.name}</span>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						{/* Image Section */}
						<div className="space-y-4">
							<div className="bg-white rounded-2xl shadow-lg p-6">
								<ImageSlider images={product.images} />
							</div>
						</div>

						{/* Product Info Section */}
						<div className="space-y-6">
							{/* Product Title */}
							<div className="bg-white rounded-2xl shadow-lg p-8">
								<div className="flex items-center gap-2 mb-2">
									<Award className="text-blue-600" size={20} />
									<span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
										Product ID: {product.productId}
									</span>
								</div>
								
								<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
									{product.name}
								</h1>
								
								{product.altNames && product.altNames.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-4">
										{product.altNames.map((altName, index) => (
											<span key={index} className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
												{altName}
											</span>
										))}
									</div>
								)}

								{/* Rating */}
								<div className="flex items-center gap-2 mb-4">
									<div className="flex items-center">
										{[...Array(5)].map((_, i) => (
											<Star key={i} className="text-yellow-400 fill-current" size={20} />
										))}
									</div>
									<span className="text-sm text-gray-600">(4.8/5 - 124 reviews)</span>
								</div>

								{/* Price */}
								<div className="flex items-center gap-4 mb-6">
									{product.labelledPrice > product.price ? (
										<>
											<span className="text-4xl font-bold text-green-600">
												Rs. {product.price.toLocaleString()}
											</span>
											<span className="text-2xl text-gray-500 line-through">
												Rs. {product.labelledPrice.toLocaleString()}
											</span>
											<span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
												{Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)}% OFF
											</span>
										</>
									) : (
										<span className="text-4xl font-bold text-gray-900">
											Rs. {product.price.toLocaleString()}
										</span>
									)}
								</div>

								{/* Stock Status */}
								<div className="flex items-center gap-2 mb-6">
									<div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
									<span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
										{product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
									</span>
								</div>

								{/* Action Buttons */}
								<div className="flex flex-col sm:flex-row gap-4">
									<button
										disabled={product.stock <= 0}
										className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
										onClick={() => {
											console.log("Old cart");
											console.log(getCart());
											addToCart(product, 1);
											console.log("New cart");
											console.log(getCart());
											toast.success("Added to cart!");
											// Navigate to cart page after adding item
											setTimeout(() => {
												navigate("/cart");
											}, 1000); // Small delay to show the success message
										}}
									>
										<ShoppingCart size={20} />
										Add to Cart
									</button>
									<button
										disabled={product.stock <= 0}
										className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
										onClick={() => {
											navigate("/checkout", {
												state: {
													cart: [
														{
															productId: product.productId,
															name: product.name,
															image: product.images[0],
															price: product.price,
															labelledPrice: product.labelledPrice,
															qty: 1,
														},
													],
												},
											});
										}}
									>
										<Zap size={20} />
										Buy Now
									</button>
								</div>
							</div>

							{/* Features */}
							<div className="bg-white rounded-2xl shadow-lg p-8">
								<h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose This Product?</h3>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
									<div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
										<Shield className="text-blue-600" size={24} />
										<div>
											<div className="font-semibold text-gray-900">Quality Assured</div>
											<div className="text-sm text-gray-600">2 Year Warranty</div>
										</div>
									</div>
									<div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
										<Truck className="text-green-600" size={24} />
										<div>
											<div className="font-semibold text-gray-900">Fast Delivery</div>
											<div className="text-sm text-gray-600">2-3 Business Days</div>
										</div>
									</div>
									<div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
										<Award className="text-purple-600" size={24} />
										<div>
											<div className="font-semibold text-gray-900">Certified</div>
											<div className="text-sm text-gray-600">CE Marked</div>
										</div>
									</div>
								</div>
							</div>

							{/* Description */}
							<div className="bg-white rounded-2xl shadow-lg p-8">
								<h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
								<p className="text-gray-700 leading-relaxed">
									{product.description}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
			{status == "loading" && <Loading />}
		</div>
	);
}