import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Truck, Shield, MapPin, Phone, User, ArrowLeft, Check, Building2, DollarSign } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";

export default function CheckoutPage() {
	const location = useLocation();
	const navigate = useNavigate();
	
	const [cart, setCart] = useState(location.state?.cart || []);
	const [customerInfo, setCustomerInfo] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		address: "",
		city: "",
		postalCode: "",
		country: "Sri Lanka"
	});
	const [paymentMethod, setPaymentMethod] = useState("cash");
	const [bankTransferDetails, setBankTransferDetails] = useState({
		accountHolder: "",
		bankName: "",
		accountNumber: "",
		referenceNumber: "",
		transferDate: ""
	});
	const [cardDetails, setCardDetails] = useState({
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		cardholderName: ""
	});
	const [isPlacingOrder, setIsPlacingOrder] = useState(false);
	const [orderStep, setOrderStep] = useState(1); // 1: Review, 2: Shipping, 3: Payment

	useEffect(() => {
		if (!cart || cart.length === 0) {
			navigate("/cart");
		}
	}, [cart, navigate]);

	function getTotal() {
		let total = 0;
		cart.forEach((item) => {
			total += item.price * item.qty;
		});
		return total;
	}

	function removeFromCart(index) {
		const newCart = cart.filter((item, i) => i !== index);
		setCart(newCart);
		toast.success("Item removed from cart");
	}

	function changeQty(index, qty) {
		const newQty = cart[index].qty + qty;
		if (newQty <= 0) {
			removeFromCart(index);
			return;
		} else {
			const newCart = [...cart];
			newCart[index].qty = newQty;
			setCart(newCart);
			toast.success("Quantity updated");
		}
	}

	async function placeOrder() {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("Please login to place order");
			navigate("/login");
			return;
		}

		// Validation
		if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.phoneNumber || !customerInfo.address) {
			toast.error("Please fill in all required fields");
			return;
		}

		// Bank transfer validation
		if (paymentMethod === "bank_transfer") {
			if (!bankTransferDetails.accountHolder || !bankTransferDetails.bankName || 
				!bankTransferDetails.accountNumber || !bankTransferDetails.referenceNumber) {
				toast.error("Please fill in all bank transfer details");
				return;
			}
		}

		// Card payment validation
		if (paymentMethod === "card") {
			if (!cardDetails.cardNumber || !cardDetails.cardholderName || 
				!cardDetails.expiryDate || !cardDetails.cvv) {
				toast.error("Please fill in all card details");
				return;
			}
			if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
				toast.error("Please enter a valid 16-digit card number");
				return;
			}
			if (cardDetails.expiryDate.length !== 5) {
				toast.error("Please enter a valid expiry date (MM/YY)");
				return;
			}
			if (cardDetails.cvv.length !== 3) {
				toast.error("Please enter a valid 3-digit CVV");
				return;
			}
		}

		setIsPlacingOrder(true);

		const orderInformation = {
			products: cart.map(item => ({
				productId: item.productId,
				qty: item.qty,
			})),
			phone: customerInfo.phoneNumber,
			address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}, ${customerInfo.country}`,
			customerInfo: customerInfo,
			paymentMethod: paymentMethod,
			bankTransferDetails: paymentMethod === "bank_transfer" ? bankTransferDetails : null,
			cardDetails: paymentMethod === "card" ? {
				...cardDetails,
				cardNumber: cardDetails.cardNumber.replace(/\s/g, '') // Remove spaces for backend
			} : null,
			total: getTotal()
		};

		try {
			const res = await axios.post(
				import.meta.env.VITE_BACKEND_URL + "/api/orders",
				orderInformation,
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);
			
			// Success! Navigate to success page with order data
			const orderData = {
				orderNumber: res.data.orderId || res.data.order?.orderId || 'ORD-UNKNOWN',
				total: total,
				paymentMethod: paymentMethod,
				address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}, ${customerInfo.country}`,
				customerInfo: customerInfo,
				items: cart,
				orderDate: new Date().toISOString()
			};
			
			toast.success("Order placed successfully!");
			
			// Clear cart and redirect to success page
			navigate("/order-success", { 
				state: { orderData },
				replace: true // Prevent going back to checkout
			});
			
		} catch (err) {
			console.error(err);
			toast.error(err.response?.data?.message || "Error placing order");
		} finally {
			setIsPlacingOrder(false);
		}
	}

	const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
	const subtotal = getTotal();
	const shipping = 250; // Shipping fee Rs. 250
	const codFee = paymentMethod === "cash" ? 30 : 0; // COD fee Rs. 30
	const tax = 0; // No tax for now
	const total = subtotal + shipping + codFee + tax;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
			<Header />
			
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				{/* Header Section */}
				<div className="mb-8">
					<div className="flex items-center gap-4 mb-6">
						<Link 
							to="/cart" 
							className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
						>
							<ArrowLeft className="w-5 h-5" />
							Back to Cart
						</Link>
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
					<p className="text-gray-600">
						Complete your order ({itemCount} {itemCount === 1 ? 'item' : 'items'})
					</p>
				</div>

				{/* Progress Steps */}
				<div className="mb-8">
					<div className="flex items-center justify-between max-w-md">
						{[
							{ step: 1, title: "Review", icon: ShoppingBag },
							{ step: 2, title: "Shipping", icon: Truck },
							{ step: 3, title: "Payment", icon: CreditCard }
						].map(({ step, title, icon: Icon }) => (
							<div key={step} className="flex items-center">
								<div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
									orderStep >= step 
										? 'bg-blue-600 border-blue-600 text-white' 
										: 'border-gray-300 text-gray-400'
								}`}>
									{orderStep > step ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
								</div>
								<span className={`ml-2 text-sm font-medium ${
									orderStep >= step ? 'text-blue-600' : 'text-gray-400'
								}`}>
									{title}
								</span>
								{step < 3 && <div className={`ml-4 w-8 h-0.5 ${
									orderStep > step ? 'bg-blue-600' : 'bg-gray-300'
								}`} />}
							</div>
						))}
					</div>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* Step 1: Order Review */}
						{orderStep === 1 && (
							<div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
								<h2 className="text-2xl font-bold text-gray-900 mb-6">Order Review</h2>
								<div className="space-y-4">
									{cart.map((item, index) => (
										<div key={item.productId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
											<img 
												src={item.image} 
												alt={item.name}
												className="w-20 h-20 object-cover rounded-lg"
											/>
											<div className="flex-grow">
												<h3 className="font-semibold text-gray-900">{item.name}</h3>
												<p className="text-sm text-gray-500">SKU: {item.productId}</p>
												<div className="flex items-center gap-2 mt-1">
													{item.labelledPrice > item.price ? (
														<>
															<span className="font-bold text-blue-600">Rs. {item.price.toFixed(2)}</span>
															<span className="text-sm text-gray-500 line-through">Rs. {item.labelledPrice.toFixed(2)}</span>
														</>
													) : (
														<span className="font-bold text-blue-600">Rs. {item.price.toFixed(2)}</span>
													)}
												</div>
											</div>
											<div className="flex items-center gap-2">
												<button
													onClick={() => changeQty(index, -1)}
													className="p-1 text-gray-600 hover:text-blue-600 hover:bg-white rounded"
													disabled={item.qty <= 1}
												>
													<Minus className="w-4 h-4" />
												</button>
												<span className="w-8 text-center font-semibold">{item.qty}</span>
												<button
													onClick={() => changeQty(index, 1)}
													className="p-1 text-gray-600 hover:text-blue-600 hover:bg-white rounded"
												>
													<Plus className="w-4 h-4" />
												</button>
											</div>
											<div className="text-right">
												<p className="font-bold text-gray-900">Rs. {(item.price * item.qty).toFixed(2)}</p>
											</div>
											<button
												onClick={() => removeFromCart(index)}
												className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									))}
								</div>
								<div className="mt-6 flex justify-end">
									<button
										onClick={() => setOrderStep(2)}
										className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
									>
										Continue to Shipping
									</button>
								</div>
							</div>
						)}

						{/* Step 2: Shipping Information */}
						{orderStep === 2 && (
							<div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
								<h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											<User className="inline w-4 h-4 mr-1" />
											First Name *
										</label>
										<input
											type="text"
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
											value={customerInfo.firstName}
											onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Last Name *
										</label>
										<input
											type="text"
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
											value={customerInfo.lastName}
											onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											<Phone className="inline w-4 h-4 mr-1" />
											Phone Number *
										</label>
										<input
											type="tel"
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
											value={customerInfo.phoneNumber}
											onChange={(e) => setCustomerInfo({...customerInfo, phoneNumber: e.target.value})}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Email
										</label>
										<input
											type="email"
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
											value={customerInfo.email}
											onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
										/>
									</div>
									<div className="md:col-span-2">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											<MapPin className="inline w-4 h-4 mr-1" />
											Address *
										</label>
										<textarea
											required
											rows={3}
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
											value={customerInfo.address}
											onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											City *
										</label>
										<input
											type="text"
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
											value={customerInfo.city}
											onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Postal Code
										</label>
										<input
											type="text"
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
											value={customerInfo.postalCode}
											onChange={(e) => setCustomerInfo({...customerInfo, postalCode: e.target.value})}
										/>
									</div>
								</div>
								<div className="mt-6 flex justify-between">
									<button
										onClick={() => setOrderStep(1)}
										className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
									>
										Back to Review
									</button>
									<button
										onClick={() => setOrderStep(3)}
										className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
									>
										Continue to Payment
									</button>
								</div>
							</div>
						)}

						{/* Step 3: Payment Method */}
						{orderStep === 3 && (
							<div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
								<h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
								<div className="space-y-4">
									{/* Cash on Delivery */}
									<div className={`border rounded-xl p-4 cursor-pointer transition-all ${
										paymentMethod === "cash" ? 'border-blue-500 bg-white' : 'border-gray-200 hover:border-gray-300'
									}`}>
										<label className="flex items-center gap-3 cursor-pointer">
											<input
												type="radio"
												name="payment"
												value="cash"
												checked={paymentMethod === "cash"}
												onChange={(e) => setPaymentMethod(e.target.value)}
												className="w-5 h-5 text-blue-600"
											/>
											<div className="flex-grow">
												<div className="font-semibold text-gray-900 flex items-center gap-2">
													<DollarSign className="w-5 h-5 text-green-600" />
													Cash on Delivery
												</div>
												<div className="text-sm text-gray-600 mt-1">
													Pay in cash when you receive your order. No advance payment required.
												</div>
											</div>
											<div className="w-12 h-8 bg-green-100 rounded-full flex items-center justify-center">
												<span className="text-green-600 text-sm font-bold">COD</span>
											</div>
										</label>
									</div>

									{/* Bank Transfer */}
									<div className={`border rounded-xl p-4 cursor-pointer transition-all ${
										paymentMethod === "bank_transfer" ? 'border-blue-500 bg-white' : 'border-gray-200 hover:border-gray-300'
									}`}>
										<label className="flex items-center gap-3 cursor-pointer">
											<input
												type="radio"
												name="payment"
												value="bank_transfer"
												checked={paymentMethod === "bank_transfer"}
												onChange={(e) => setPaymentMethod(e.target.value)}
												className="w-5 h-5 text-blue-600"
											/>
											<div className="flex-grow">
												<div className="font-semibold text-gray-900 flex items-center gap-2">
													<Building2 className="w-5 h-5 text-blue-600" />
													Bank Transfer
												</div>
												<div className="text-sm text-gray-600 mt-1">
													Transfer payment to our bank account. Order will be processed after payment verification.
												</div>
											</div>
											<div className="w-12 h-8 bg-blue-100 rounded-full flex items-center justify-center">
												<span className="text-blue-600 text-sm font-bold">BT</span>
											</div>
										</label>
									</div>

									{/* Card Payment */}
									<div className={`border rounded-xl p-4 cursor-pointer transition-all ${
										paymentMethod === "card" ? 'border-blue-500 bg-white' : 'border-gray-200 hover:border-gray-300'
									}`}>
										<label className="flex items-center gap-3 cursor-pointer">
											<input
												type="radio"
												name="payment"
												value="card"
												checked={paymentMethod === "card"}
												onChange={(e) => setPaymentMethod(e.target.value)}
												className="w-5 h-5 text-blue-600"
											/>
											<div className="flex-grow">
												<div className="font-semibold text-gray-900 flex items-center gap-2">
													<CreditCard className="w-5 h-5 text-purple-600" />
													Credit/Debit Card
												</div>
												<div className="text-sm text-gray-600 mt-1">
													Pay securely with your credit or debit card. Instant payment processing.
												</div>
											</div>
											<div className="w-12 h-8 bg-purple-100 rounded-full flex items-center justify-center">
												<span className="text-purple-600 text-sm font-bold">CARD</span>
											</div>
										</label>
									</div>

									{/* Card Payment Details Form */}
									{paymentMethod === "card" && (
										<div className="mt-6 p-6 bg-white rounded-xl border border-gray-200">
											<h3 className="text-lg font-semibold text-gray-900 mb-4">Card Details</h3>
											
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="md:col-span-2">
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Card Number *
													</label>
													<input
														type="text"
														required
														className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
														value={cardDetails.cardNumber}
														onChange={(e) => {
															// Format card number with spaces
															const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
															const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
															if (value.length <= 16) {
																setCardDetails({...cardDetails, cardNumber: formattedValue});
															}
														}}
														placeholder="1234 5678 9012 3456"
														maxLength="19"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Cardholder Name *
													</label>
													<input
														type="text"
														required
														className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
														value={cardDetails.cardholderName}
														onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
														placeholder="Name on card"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Expiry Date *
													</label>
													<input
														type="text"
														required
														className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
														value={cardDetails.expiryDate}
														onChange={(e) => {
															// Format MM/YY
															const value = e.target.value.replace(/\D/g, '');
															let formattedValue = value;
															if (value.length >= 2) {
																formattedValue = value.substring(0, 2) + '/' + value.substring(2, 4);
															}
															if (formattedValue.length <= 5) {
																setCardDetails({...cardDetails, expiryDate: formattedValue});
															}
														}}
														placeholder="MM/YY"
														maxLength="5"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														CVV *
													</label>
													<input
														type="text"
														required
														className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
														value={cardDetails.cvv}
														onChange={(e) => {
															const value = e.target.value.replace(/\D/g, '');
															if (value.length <= 3) {
																setCardDetails({...cardDetails, cvv: value});
															}
														}}
														placeholder="123"
														maxLength="3"
													/>
												</div>
											</div>

											<div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
												<p className="text-sm text-gray-800">
													<strong>Secure Payment:</strong> Your card details are processed securely using SSL encryption. 
													We do not store your card information on our servers.
												</p>
											</div>
										</div>
									)}

									{/* Bank Transfer Details Form */}
									{paymentMethod === "bank_transfer" && (
										<div className="mt-6 p-6 bg-white rounded-xl border border-gray-200">
											<h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Transfer Details</h3>
											
											{/* Our Bank Details */}
											<div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
												<h4 className="font-semibold text-gray-900 mb-3">Transfer To:</h4>
												<div className="space-y-2 text-sm">
													<div className="flex justify-between">
														<span className="text-gray-600">Bank Name:</span>
														<span className="font-semibold">Commercial Bank of Ceylon</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-600">Account Name:</span>
														<span className="font-semibold">R.S. Electricals (Pvt) Ltd</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-600">Account Number:</span>
														<span className="font-semibold">8001234567890</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-600">Branch:</span>
														<span className="font-semibold">Colombo Main</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-600">Amount:</span>
														<span className="font-bold text-blue-600">Rs. {total.toFixed(2)}</span>
													</div>
												</div>
											</div>

											{/* Customer Transfer Details Form */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Account Holder Name *
													</label>
													<input
														type="text"
														required
														className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
														value={bankTransferDetails.accountHolder}
														onChange={(e) => setBankTransferDetails({...bankTransferDetails, accountHolder: e.target.value})}
														placeholder="Name on your bank account"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Your Bank Name *
													</label>
													<input
														type="text"
														required
														className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
														value={bankTransferDetails.bankName}
														onChange={(e) => setBankTransferDetails({...bankTransferDetails, bankName: e.target.value})}
														placeholder="Bank you transferred from"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Your Account Number *
													</label>
													<input
														type="text"
														required
														className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
														value={bankTransferDetails.accountNumber}
														onChange={(e) => setBankTransferDetails({...bankTransferDetails, accountNumber: e.target.value})}
														placeholder="Your account number"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Transfer Reference Number *
													</label>
													<input
														type="text"
														required
														className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
														value={bankTransferDetails.referenceNumber}
														onChange={(e) => setBankTransferDetails({...bankTransferDetails, referenceNumber: e.target.value})}
														placeholder="Bank reference/receipt number"
													/>
												</div>
												<div className="md:col-span-2">
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Transfer Date
													</label>
													<input
														type="date"
														className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
														value={bankTransferDetails.transferDate}
														onChange={(e) => setBankTransferDetails({...bankTransferDetails, transferDate: e.target.value})}
														max={new Date().toISOString().split('T')[0]}
													/>
												</div>
											</div>

											<div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
												<p className="text-sm text-gray-800">
													<strong>Important:</strong> Your order will be processed only after we verify your payment. 
													This usually takes 1-2 business days. We'll contact you once payment is confirmed.
												</p>
											</div>
										</div>
									)}
								</div>
								<div className="mt-6 flex justify-between">
									<button
										onClick={() => setOrderStep(2)}
										className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors"
									>
										Back to Shipping
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Order Summary Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-4">
							<h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
							
							<div className="space-y-4 mb-6">
								<div className="flex justify-between text-gray-600">
									<span>Subtotal ({itemCount} items)</span>
									<span>Rs. {subtotal.toFixed(2)}</span>
								</div>
								<div className="flex justify-between text-gray-600">
									<span>Shipping</span>
									<span>Rs. {shipping.toFixed(2)}</span>
								</div>
								{paymentMethod === "cash" && (
									<div className="flex justify-between text-gray-600">
										<span>COD Fee</span>
										<span>Rs. {codFee.toFixed(2)}</span>
									</div>
								)}
								<div className="flex justify-between text-gray-600">
									<span>Tax</span>
									<span>Rs. {tax.toFixed(2)}</span>
								</div>
								<hr className="border-gray-200" />
								<div className="flex justify-between text-xl font-bold text-gray-900">
									<span>Total</span>
									<span>Rs. {total.toFixed(2)}</span>
								</div>
							</div>

							{/* Payment Method Summary */}
							{orderStep === 3 && paymentMethod && (
								<div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
									<h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
									{paymentMethod === "cash" ? (
										<div className="flex items-center gap-3">
											<DollarSign className="w-5 h-5 text-green-600" />
											<div>
												<p className="font-medium text-gray-900">Cash on Delivery</p>
												<p className="text-sm text-gray-600">Pay when you receive your order</p>
											</div>
										</div>
									) : paymentMethod === "bank_transfer" ? (
										<div className="flex items-center gap-3">
											<Building2 className="w-5 h-5 text-blue-600" />
											<div>
												<p className="font-medium text-gray-900">Bank Transfer</p>
												<p className="text-sm text-gray-600">Payment via bank transfer</p>
												{bankTransferDetails.accountHolder && (
													<p className="text-sm text-blue-600 mt-1">
														From: {bankTransferDetails.accountHolder}
													</p>
												)}
											</div>
										</div>
									) : paymentMethod === "card" ? (
										<div className="flex items-center gap-3">
											<CreditCard className="w-5 h-5 text-purple-600" />
											<div>
												<p className="font-medium text-gray-900">Credit/Debit Card</p>
												<p className="text-sm text-gray-600">Secure card payment</p>
												{cardDetails.cardNumber && (
													<p className="text-sm text-purple-600 mt-1">
														Card ending in {cardDetails.cardNumber.slice(-4)}
													</p>
												)}
											</div>
										</div>
									) : null}
								</div>
							)}

							{/* Place Order Button */}
							{orderStep === 3 && (
								<button
									onClick={placeOrder}
									disabled={
										isPlacingOrder || 
										!paymentMethod || 
										(paymentMethod === "bank_transfer" && (
											!bankTransferDetails.accountHolder || 
											!bankTransferDetails.bankName || 
											!bankTransferDetails.accountNumber || 
											!bankTransferDetails.referenceNumber
										)) ||
										(paymentMethod === "card" && (
											!cardDetails.cardNumber || 
											!cardDetails.cardholderName || 
											!cardDetails.expiryDate || 
											!cardDetails.cvv ||
											cardDetails.cardNumber.replace(/\s/g, '').length !== 16 ||
											cardDetails.expiryDate.length !== 5 ||
											cardDetails.cvv.length !== 3
										))
									}
									className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
								>
									{isPlacingOrder ? (
										<>
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
											Processing Order...
										</>
									) : (
										<>
											<CreditCard className="w-5 h-5" />
											{!paymentMethod ? "Select Payment Method" : "Place Order"}
										</>
									)}
								</button>
							)}

							{/* Security Badge */}
							<div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
								<div className="flex items-center gap-2 text-gray-700 mb-2">
									<Shield className="w-5 h-5" />
									<span className="font-semibold">Secure Checkout</span>
								</div>
								<ul className="text-sm text-gray-600 space-y-1">
									<li>• SSL encrypted transaction</li>
									<li>• Safe payment processing</li>
									<li>• Money-back guarantee</li>
								</ul>
							</div>

							{/* Order Items Summary */}
							<div className="mt-6">
								<h3 className="font-semibold text-gray-900 mb-3">Items in your order</h3>
								<div className="space-y-2 max-h-48 overflow-y-auto">
									{cart.map((item, index) => (
										<div key={item.productId} className="flex items-center gap-3 text-sm">
											<img 
												src={item.image} 
												alt={item.name}
												className="w-10 h-10 object-cover rounded-lg"
											/>
											<div className="flex-grow">
												<p className="font-medium text-gray-900 truncate">{item.name}</p>
												<p className="text-gray-500">Qty: {item.qty}</p>
											</div>
											<p className="font-semibold text-gray-900">Rs. {(item.price * item.qty).toFixed(2)}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}