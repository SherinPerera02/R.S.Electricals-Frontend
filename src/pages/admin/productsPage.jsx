import { useEffect, useState } from "react";
import { sampleProducts } from "../../assets/sampleData";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";;
export default function AdminProductsPage() {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const navigate = useNavigate();

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = () => {
		setIsLoading(true);
		axios
			.get(import.meta.env.VITE_BACKEND_URL + "/api/products")
			.then((res) => {
				console.log("Fetched products:", res.data);
				setProducts(res.data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching products:", error);
				toast.error("Failed to load products");
				setProducts(sampleProducts); // Fallback to sample data
				setIsLoading(false);
			});
	};

	function deleteProduct(productId) {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("Please login first");
			return;
		}
		axios
			.delete(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(() => {
				toast.success("Product deleted successfully");
				fetchProducts(); // Refresh the products list
			})
			.catch((e) => {
				toast.error(e.response?.data?.message || "Failed to delete product");
			});
	}

	return (
		<div className="relative w-full h-full max-h-full overflow-y-auto p-4 font-[var(--font-main)]">
			<Link
				to="/admin/add-product"
				className="fixed bottom-10 right-8 bg-blue-600 hover:bg-gray-900 text-white hover:text-white py-4 px-6 rounded-full shadow-lg transition duration-300 z-10"
				style={{ margin: '16px' }}
			>
				+ Add Product
			</Link>

			{isLoading ? (
				<div className="w-full h-full flex justify-center items-center">
					<div className="w-16 h-16 border-4 border-gray-300 border-t-[var(--color-accent)] rounded-full animate-spin"></div>
				</div>
			) : (
				<div className="overflow-x-auto">
					
					<table className="w-full text-center border border-gray-200 shadow-md rounded-lg overflow-hidden">
						<thead className="bg-[var(--color-accent)] text-gray-900">
							<tr>
								<th className="py-3 px-2 font-semibold">Product ID</th>
								<th className="py-3 px-2 font-semibold">Name</th>
								<th className="py-3 px-2 font-semibold">Image</th>
								<th className="py-3 px-2 font-semibold">Labelled Price</th>
								<th className="py-3 px-2 font-semibold">Price</th>
								<th className="py-3 px-2 font-semibold">Stock</th>
								<th className="py-3 px-2 font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{products.map((item, index) => (
								<tr
									
									key={index}
									className={`${
										index % 2 === 0
											? "bg-[var(--color-primary)]"
											: "bg-gray-100"
									} hover:bg-gray-200 transition`}
								>
									<td className="py-2 px-2 font-normal text-gray-900">{item.productId}</td>
									<td className="py-2 px-2 font-normal">{item.name}</td>
									<td className="py-2 px-2 font-normal">
										<img
											src={item.images[0]}
											alt={item.name}
											className="w-12 h-12 object-cover rounded"
										/>
									</td>
									<td className="py-2 px-2 font-normal">{item.labelledPrice}</td>
									<td className="py-2 px-2 font-normal">{item.price}</td>
									<td className="py-2 px-2 font-normal">{item.stock}</td>
									<td className="py-2 px-2">
										<div className="flex justify-center space-x-3">
											<button
												onClick={() => deleteProduct(item.productId)}
												className="text-red-500 hover:text-red-700 transition"
											>
												<FaTrash size={18} />
											</button>
											<button
												onClick={() =>
													navigate("/admin/edit-product", {
														state: item,
													})
												}
												className="text-gray-900 hover:text-shadow-gray-500 transition"
											>
												<FaEdit size={18} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}