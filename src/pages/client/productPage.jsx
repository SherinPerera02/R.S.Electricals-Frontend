import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../../components/productCard";
import { Search, Filter, Grid, List, SlidersHorizontal, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProductPage(){
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("name")
    const [filterBy, setFilterBy] = useState("all")
    const [viewMode, setViewMode] = useState("grid")

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products");
            setProducts(response.data);
            setFilteredProducts(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.altNames.some(alt => alt.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        // Filter by availability
        if (filterBy === "available") {
            filtered = filtered.filter(product => product.stock > 0);
        } else if (filterBy === "out-of-stock") {
            filtered = filtered.filter(product => product.stock <= 0);
        }

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "name":
                    return a.name.localeCompare(b.name);
                case "newest":
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                default:
                    return 0;
            }
        });

        setFilteredProducts(filtered);
    }, [products, searchTerm, sortBy, filterBy]);

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
                    <p className="text-lg text-gray-600">Discover our wide range of electrical products</p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters and Controls */}
                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Filter Dropdown */}
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    value={filterBy}
                                    onChange={(e) => setFilterBy(e.target.value)}
                                >
                                    <option value="all">All Products</option>
                                    <option value="available">In Stock</option>
                                    <option value="out-of-stock">Out of Stock</option>
                                </select>
                                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="newest">Newest First</option>
                                </select>
                                <SlidersHorizontal className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-colors ${
                                        viewMode === "grid" 
                                            ? "bg-white text-blue-600 shadow-sm" 
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    <Grid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-colors ${
                                        viewMode === "list" 
                                            ? "bg-white text-blue-600 shadow-sm" 
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing {filteredProducts.length} of {products.length} products
                            {searchTerm && ` for "${searchTerm}"`}
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="flex items-center gap-3 text-gray-600">
                            <Loader2 className="animate-spin" size={24} />
                            <span className="text-lg">Loading products...</span>
                        </div>
                    </div>
                )}

                {/* No Results */}
                {!isLoading && filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-gray-400 mb-4">
                            <Search size={64} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                        <p className="text-gray-500">
                            {searchTerm 
                                ? `No products match "${searchTerm}". Try a different search term.`
                                : "No products available at the moment."
                            }
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}

                {/* Products Grid */}
                {!isLoading && filteredProducts.length > 0 && (
                    <div className={`grid gap-6 ${
                        viewMode === "grid" 
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                            : "grid-cols-1"
                    }`}>
                        {filteredProducts.map((product) => (
                            <div key={product.productId} className="transform transition-transform hover:scale-105">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More Button (for future pagination) */}
                {!isLoading && filteredProducts.length > 0 && (
                    <div className="text-center mt-12">
                        <button className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                            Load More Products
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}