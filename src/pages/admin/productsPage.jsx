import { useEffect, useState } from "react";
import { sampleProducts } from "../../assets/sampleData";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";;

export default function AdminProductsPage() {
	
	if (typeof document !== 'undefined') {
		Modal.setAppElement('#root');
	}

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [productToDelete, setProductToDelete] = useState(null);
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
				setProducts(sampleProducts); 
				setIsLoading(false);
			});
	};

	function deleteProduct(productId) {
	
		const prod = products.find((p) => p.productId === productId) || { productId };
		setProductToDelete(prod);
		setIsDeleteModalOpen(true);
	}

	async function confirmDelete() {
		if (!productToDelete) return;
		const productId = productToDelete.productId;
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("Please login first");
			setIsDeleteModalOpen(false);
			return;
		}
		try {
			await axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId, {
				headers: { Authorization: "Bearer " + token },
			});
			toast.success("Product deleted successfully");
			setIsDeleteModalOpen(false);
			setProductToDelete(null);
			fetchProducts();
		} catch (e) {
			toast.error(e.response?.data?.message || "Failed to delete product");
			setIsDeleteModalOpen(false);
			setProductToDelete(null);
		}
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
					{/* Delete confirmation modal */}
					<Modal
						isOpen={isDeleteModalOpen}
						onRequestClose={() => setIsDeleteModalOpen(false)}
						className="bg-white rounded-lg shadow-lg max-w-md mx-auto my-10 p-6 outline-none"
						overlayClassName="fixed inset-0 bg-[#00000040] flex justify-center items-center"
					>
						{productToDelete && (
							<div className="space-y-4 text-left">
								<h3 className="text-lg font-semibold">Confirm delete</h3>
								<p className="text-sm text-gray-600">Are you sure you want to delete <span className="font-medium">{productToDelete.name || productToDelete.productId}</span> (ID: {productToDelete.productId})? This action cannot be undone.</p>
								<div className="flex justify-end space-x-3 mt-4">
									<button onClick={() => { setIsDeleteModalOpen(false); setProductToDelete(null); }} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Cancel</button>
									<button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
								</div>
							</div>
						)}
					</Modal>
					
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