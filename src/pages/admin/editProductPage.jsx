import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";

export default function EditProductPage() {
    const location = useLocation()
	const [productId, setProductId] = useState(location.state.productId);
	const [name, setName] = useState(location.state.name);
	const [altNames, setAltNames] = useState(location.state.altNames.join(","));
	const [description, setDescription] = useState(location.state.description);
	const [images, setImages] = useState([]);
	const [labelledPrice, setLabelledPrice] = useState(location.state.labelledPrice);
	const [price, setPrice] = useState(location.state.price);
	const [stock, setStock] = useState(location.state.stock);
    const navigate = useNavigate()

    console.log(location)

	async function updateProduct() {

        const token = localStorage.getItem("token")
        if(token == null){
            toast.error("Please login first")
            return
        }

		let imageUrls = location.state.images;

		const promisesArray = [];

		for (let i = 0; i < images.length; i++) {
			promisesArray[i] = mediaUpload(images[i]);
		}
		try {
            if(images.length > 0){
                imageUrls = await Promise.all(promisesArray);
            }
		    
			console.log(imageUrls);

            const altNamesArray = altNames.split(",")

            const product = {
                productId : productId,
                name : name,
                altNames : altNamesArray,
                description : description,
                images : imageUrls,
                labelledPrice : labelledPrice,
                price : price,
                stock : stock,
            }
            axios.put(import.meta.env.VITE_BACKEND_URL + "/api/products/"+productId, product , {
                headers : {
                    "Authorization" : "Bearer "+token
                }
            }).then(() => {
                toast.success("Product updated successfully")
                navigate("/admin/products")
            }).catch((e) => {
                toast.error(e.response.data.message)
            })

		} catch (e) {
			console.log(e);
		}
	}
	return (
		<div className="w-full p-4">
			<div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
				<div className="flex items-center space-x-4 mb-6">
					
					<h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
				</div>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Product ID </label>
						<input
							type="text"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
							value={productId}
							disabled
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
						<input
							type="text"
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
						<p className="text-xs text-gray-500 mt-1">Select multiple images for this product (leave empty to keep existing images)</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Labelled Price</label>
							<input
								type="number"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
								value={labelledPrice}
								onChange={(e) => setLabelledPrice(e.target.value)}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Selling Price</label>
							<input
								type="number"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
							<input
								type="number"
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
						onClick={updateProduct}
						className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
					>
						Update Product
					</button>
				</div>
				
			</div>
		</div>
	);
}