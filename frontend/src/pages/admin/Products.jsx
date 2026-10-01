import { useEffect, useState } from "react";
import {
    Package,
    Search,
    Plus,
    Edit3,
    Trash2,
    RefreshCw,
    AlertTriangle,
    X
} from "lucide-react";

import api from "../../services/api";

function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    costPrice: "",
    stock: "",
    tax: "",
    description: ""
});

const [saving, setSaving] = useState(false);

    const loadProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get("/products", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProducts(response.data.products || []);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load products"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadProducts();
    }, []);


    const filteredProducts = products.filter((product) => {

        const text = search.toLowerCase();

        return (
            product.name?.toLowerCase().includes(text) ||
            product.sku?.toLowerCase().includes(text) ||
            product.category?.toLowerCase().includes(text)
        );

    });


    const deleteProduct = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {

            const token = localStorage.getItem("token");

            await api.delete(`/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            loadProducts();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to delete product"
            );

        }
    };

    const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
        ...previous,
        [name]: value
    }));
};


const handleCreateProduct = async (e) => {
    e.preventDefault();

    try {

        setSaving(true);

        const token = localStorage.getItem("token");

        await api.post(
            "/products",
            {
                ...formData,
                price: Number(formData.price),
                costPrice: Number(formData.costPrice),
                stock: Number(formData.stock || 0),
                tax: Number(formData.tax || 0)
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setShowModal(false);

        setFormData({
            name: "",
            sku: "",
            category: "",
            price: "",
            costPrice: "",
            stock: "",
            tax: "",
            description: ""
        });

        await loadProducts();

    } catch (err) {

        alert(
            err.response?.data?.message ||
            "Failed to create product"
        );

    } finally {

        setSaving(false);

    }
};

const handleEditProduct = (product) => {
    setEditingProduct(product);

    setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "",
        price: product.price ?? "",
        costPrice: product.costPrice ?? "",
        stock: product.stock ?? "",
        tax: product.tax ?? "",
        description: product.description || ""
    });

    setShowModal(true);
};

const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {

        setSaving(true);

        const token = localStorage.getItem("token");

        await api.put(
            `/products/${editingProduct._id}`,
            {
                ...formData,
                price: Number(formData.price),
                costPrice: Number(formData.costPrice),
                stock: Number(formData.stock || 0),
                tax: Number(formData.tax || 0)
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setShowModal(false);
        setEditingProduct(null);

        setFormData({
            name: "",
            sku: "",
            category: "",
            price: "",
            costPrice: "",
            stock: "",
            tax: "",
            description: ""
        });

        await loadProducts();

    } catch (err) {

        alert(
            err.response?.data?.message ||
            "Failed to update product"
        );

    } finally {

        setSaving(false);

    }
};

    if (loading) {

        return (
            <div className="page-loading">
                <div className="spinner-border text-primary" />
                <p>Loading products...</p>
            </div>
        );

    }


    return (
        <div className="dashboard-page">

            {/* HEADER */}

            <div className="page-header">

                <div>

                    <span className="page-eyebrow">
                        INVENTORY
                    </span>

                    <h1>Products</h1>

                    <p>
                        Manage your products, pricing and stock.
                    </p>

                </div>

                <button
                    className="primary-action"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Add Product
                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="dashboard-error mb-3">

                    <AlertTriangle size={20} />

                    <span>{error}</span>

                    <button
                        className="refresh-button"
                        onClick={loadProducts}
                    >
                        <RefreshCw size={16} />
                    </button>

                </div>

            )}


            {/* PRODUCTS PANEL */}

            <div className="dashboard-panel products-panel">

                {/* TOOLBAR */}

                <div className="products-toolbar">

                    <div className="search-box">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <div className="products-count">

                        {filteredProducts.length} products

                    </div>

                </div>


                {/* DESKTOP TABLE */}

                <div className="products-table-wrapper">

                    <table className="products-table">

                        <thead>

                            <tr>

                                <th>PRODUCT</th>

                                <th>SKU</th>

                                <th>CATEGORY</th>

                                <th>PRICE</th>

                                <th>STOCK</th>

                                <th>STATUS</th>

                                <th>ACTIONS</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredProducts.map((product) => (

                                <tr key={product._id}>

                                    <td>

                                        <div className="product-name-cell">

                                            <div className="product-icon">
                                                <Package size={18} />
                                            </div>

                                            <div>

                                                <strong>
                                                    {product.name}
                                                </strong>

                                                <small>
                                                    {product.description ||
                                                        "No description"}
                                                </small>

                                            </div>

                                        </div>

                                    </td>


                                    <td>
                                        <span className="sku-badge">
                                            {product.sku}
                                        </span>
                                    </td>


                                    <td>
                                        {product.category}
                                    </td>


                                    <td>
                                        <strong>
                                            ₹{Number(
                                                product.price || 0
                                            ).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2
                                            })}
                                        </strong>
                                    </td>


                                    <td>

                                        <span
                                            className={
                                                product.stock <= 10
                                                    ? "stock-badge low"
                                                    : "stock-badge"
                                            }
                                        >
                                            {product.stock}
                                        </span>

                                    </td>


                                    <td>

                                        <span
                                            className={
                                                product.isActive
                                                    ? "status-badge active"
                                                    : "status-badge inactive"
                                            }
                                        >
                                            {product.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                    </td>


                                    <td>

                                        <div className="action-buttons">

                                            <button
                                                className="icon-action edit"
                                                title="Edit"
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                <Edit3 size={16} />
                                            </button>

                                            <button
                                                className="icon-action delete"
                                                title="Delete"
                                                onClick={() =>
                                                    deleteProduct(
                                                        product._id
                                                    )
                                                }
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {/* EMPTY */}

                {filteredProducts.length === 0 && (

                    <div className="products-empty">

                        <Package size={38} />

                        <h5>No products found</h5>

                        <p>
                            Try another search or add a new product.
                        </p>

                    </div>

                )}

            </div>
            {showModal && (

    <div className="modal-overlay">

        <div className="product-modal">

            <div className="modal-header">

                <div>
                   <h4>
                    {editingProduct ? "Edit Product" : "Add Product"}
                </h4>

                <p>
                    {editingProduct
                        ? "Update product information and inventory."
                        : "Add a new product to your inventory."
                    }
                </p>
                </div>

                <button
                    className="modal-close"
                    onClick={() => {
                        setShowModal(false);
                        setEditingProduct(null);

                        setFormData({
                            name: "",
                            sku: "",
                            category: "",
                            price: "",
                            costPrice: "",
                            stock: "",
                            tax: "",
                            description: ""
                        });
                    }}
                >
                    <X size={20} />
                </button>

            </div>


            <form
                onSubmit={
                    editingProduct
                        ? handleUpdateProduct
                        : handleCreateProduct
                }
            >

                <div className="row g-3">

                    <div className="col-12">

                        <label className="form-label">
                            Product Name
                        </label>

                        <input
                            className="form-control modern-form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            required
                        />

                    </div>


                    <div className="col-12 col-md-6">

                        <label className="form-label">
                            SKU
                        </label>

                        <input
                            className="form-control modern-form-control"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            placeholder="e.g. SHIRT003"
                            required
                        />

                    </div>


                    <div className="col-12 col-md-6">

                        <label className="form-label">
                            Category
                        </label>

                        <input
                            className="form-control modern-form-control"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g. Shirts"
                            required
                        />

                    </div>


                    <div className="col-12 col-md-6">

                        <label className="form-label">
                            Selling Price
                        </label>

                        <input
                            type="number"
                            min="0"
                            className="form-control modern-form-control"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                        />

                    </div>


                    <div className="col-12 col-md-6">

                        <label className="form-label">
                            Cost Price
                        </label>

                        <input
                            type="number"
                            min="0"
                            className="form-control modern-form-control"
                            name="costPrice"
                            value={formData.costPrice}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                        />

                    </div>


                    <div className="col-12 col-md-6">

                        <label className="form-label">
                            Stock
                        </label>

                        <input
                            type="number"
                            min="0"
                            className="form-control modern-form-control"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="0"
                        />

                    </div>


                    <div className="col-12 col-md-6">

                        <label className="form-label">
                            Tax (%)
                        </label>

                        <input
                            type="number"
                            min="0"
                            className="form-control modern-form-control"
                            name="tax"
                            value={formData.tax}
                            onChange={handleChange}
                            placeholder="0"
                        />

                    </div>


                    <div className="col-12">

                        <label className="form-label">
                            Description
                        </label>

                        <textarea
                            className="form-control modern-form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Optional product description"
                        />

                    </div>

                </div>


                <div className="modal-footer">

                    <button
                        type="button"
                        className="secondary-action"
                        onClick={() => {
                            setShowModal(false);
                            setEditingProduct(null);

                            setFormData({
                                name: "",
                                sku: "",
                                category: "",
                                price: "",
                                costPrice: "",
                                stock: "",
                                tax: "",
                                description: ""
                            });
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-action"
                        disabled={saving}
                    >
                        {saving ? (
                            "Saving..."
                        ) : (
                            <>
                                {editingProduct ? (
                                    <Edit3 size={17} />
                                ) : (
                                    <Plus size={17} />
                                )}

                                {editingProduct
                                    ? "Update Product"
                                    : "Create Product"
                                }
                            </>
                        )}
                    </button>

                </div>

            </form>

        </div>

    </div>

)}

        </div>
    );
}

export default Products;