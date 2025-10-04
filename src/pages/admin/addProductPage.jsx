import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";

export default function AddProductPage() {
	/*
    
const productSchema = mongoose.Schema({
	productId : {
		type : String,
		required : true,
		unique : true
	},
	name : {
		type : String,
		required : true
	},
	altNames : [
		{type : String}
	],
	description : {
		type : String,
		required : true
	},
	images : [
		{type : String}
	],
	labelledPrice : {
		type : Number,
		required : true
	},
	price : {
		type : Number,
		required : true
	},
	stock : {
		type : Number,
		required : true
	},
	isAvailable : {
		type : Boolean,
		required : true,
		default : true
	},
});
    */
	const [productId, setProductId] = useState("");
	const [name, setName] = useState("");
	const [altNames, setAltNames] = useState("");
	const [description, setDescription] = useState("");
	const [images, setImages] = useState([]);
	const [labelledPrice, setLabelledPrice] = useState(0);
	const [price, setPrice] = useState(0);
	const [stock, setStock] = useState(0);
    const navigate = useNavigate()

	// Function to generate auto product ID with date and time
	const generateProductId = () => {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');
		
		// Format: RSE-YYYYMMDD-HHMMSS
		return `RSE-${year}${month}${day}-${hours}${minutes}${seconds}`;
	};

	// Auto-generate product ID when component mounts
	useEffect(() => {
		setProductId(generateProductId());
	}, []);

	async function AddProduct() {
		console.log("Starting AddProduct function...");

        const token = localStorage.getItem("token")
        if(token == null){
            toast.error("Please login first")
            return
        }

		// Validate required fields
		if (!name.trim()) {
			toast.error("Product name is required");
			return;
		}

		if (!description.trim()) {
			toast.error("Product description is required");
			return;
		}

		if (!labelledPrice || parseFloat(labelledPrice) <= 0) {
			toast.error("Please enter a valid labelled price");
			return;
		}

		if (!price || parseFloat(price) <= 0) {
			toast.error("Please enter a valid selling price");
			return;
		}

		if (!stock || parseInt(stock) < 0) {
			toast.error("Please enter a valid stock quantity");
			return;
		}

		if (images.length <= 0) {
			toast.error("Please select at least one image");
			return;
		}

		console.log("All validations passed. Uploading images...");

		const promisesArray = [];

		for (let i = 0; i < images.length; i++) {
			promisesArray[i] = mediaUpload(images[i]);
		}
		
		try {
			const imageUrls = await Promise.all(promisesArray);
			console.log("Image upload successful:", imageUrls);

			// Check if any image upload failed (returned undefined or null)
			const validImageUrls = imageUrls.filter(url => url && url !== undefined && url !== null);
			
			if (validImageUrls.length === 0) {
				toast.error("Failed to upload images. Please try again.");
				return;
			}

			if (validImageUrls.length < imageUrls.length) {
				console.warn("Some images failed to upload. Proceeding with valid ones:", validImageUrls);
				toast.warning(`${imageUrls.length - validImageUrls.length} image(s) failed to upload. Proceeding with ${validImageUrls.length} image(s).`);
			}

            const altNamesArray = altNames.trim() ? altNames.split(",").map(name => name.trim()) : [];

            const product = {
                productId : productId,
                name : name.trim(),
                altNames : altNamesArray,
                description : description.trim(),
                images : validImageUrls,
                labelledPrice : parseFloat(labelledPrice),
                price : parseFloat(price),
                stock : parseInt(stock),
            }

			console.log("Product data to be sent:", product);

            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/products", product , {
                headers : {
                    "Authorization" : "Bearer "+token,
					"Content-Type": "application/json"
                }
            });

			console.log("Product added successfully:", response.data);
			toast.success("Product added successfully");
			navigate("/admin/products");

		} catch (e) {
			console.error("Error in AddProduct:", e);
			
			// Check if this is an image upload error
			if (e.message && e.message.includes("uploading")) {
				toast.error("Failed to upload images: " + e.message);
				return;
			}
			
			if (e.response) {
				// Server responded with error status
				console.error("Server error response:", e.response.data);
				toast.error(e.response.data.message || "Failed to add product");
			} else if (e.request) {
				// Request was made but no response received
				console.error("No response from server:", e.request);
				toast.error("No response from server. Please check your connection.");
			} else {
				// Error in setting up request
				console.error("Request setup error:", e.message);
				toast.error("Failed to add product: " + e.message);
			}
		}
	}
	return (
		<div className="w-full p-4">
			<div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
				<div className="flex items-center space-x-4 mb-6">
					
					<h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
				</div>
				
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Product ID </label>
						<input
							type="text"
							placeholder="Auto-generated ID"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
							value={productId}
							disabled={true}
							readOnly={true}
						/>
						<p className="text-xs text-gray-500 mt-1">ID is automatically generated with current date and time</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
						<input
							type="text"
							placeholder="Enter product name"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Alternative Names</label>
						<input
							type="text"
							placeholder="Enter alternative names (comma separated)"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
							value={altNames}
							onChange={(e) => setAltNames(e.target.value)}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
						<textarea
							placeholder="Enter product description"
							rows="4"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
						<input
							type="file"
							multiple
							accept="image/*"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
							onChange={(e) => setImages(e.target.files)}
						/>
						<p className="text-xs text-gray-500 mt-1">Select multiple images for this product</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Labelled Price</label>
							<input
								type="number"
								placeholder="0.00"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
								value={labelledPrice}
								onChange={(e) => setLabelledPrice(e.target.value)}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Selling Price</label>
							<input
								type="number"
								placeholder="0.00"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
							<input
								type="number"
								placeholder="0"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
								value={stock}
								onChange={(e) => setStock(e.target.value)}
							/>
						</div>
					</div>
				</div>

				<div className="flex justify-end space-x-4 mt-8">
					<Link
						to="/admin/products"
						className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
					>
						Cancel
					</Link>
					<button
						onClick={AddProduct}
						className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
					>
						Add Product
					</button>
				</div>
			</div>
		</div>
	);
}