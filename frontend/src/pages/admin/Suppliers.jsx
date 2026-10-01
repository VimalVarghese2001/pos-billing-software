import { useEffect, useState } from "react";

import {
    Truck,
    Search,
    Plus,
    Edit3,
    Trash2,
    X,
    Mail,
    Phone,
    MapPin,
    AlertTriangle,
    RefreshCw
} from "lucide-react";

import api from "../../services/api";


function Suppliers() {

    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: ""
    });


    const loadSuppliers = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get("/suppliers", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSuppliers(response.data.suppliers || []);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load suppliers"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadSuppliers();
    }, []);


    const filteredSuppliers = suppliers.filter((supplier) => {

        const text = search.toLowerCase();

        return (
            supplier.name?.toLowerCase().includes(text) ||
            supplier.contactPerson?.toLowerCase().includes(text) ||
            supplier.email?.toLowerCase().includes(text) ||
            supplier.phone?.toLowerCase().includes(text)
        );

    });


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    const openAddModal = () => {

        setEditingSupplier(null);

        setFormData({
            name: "",
            contactPerson: "",
            email: "",
            phone: "",
            address: ""
        });

        setShowModal(true);

    };


    const handleEditSupplier = (supplier) => {

        setEditingSupplier(supplier);

        setFormData({
            name: supplier.name || "",
            contactPerson: supplier.contactPerson || "",
            email: supplier.email || "",
            phone: supplier.phone || "",
            address: supplier.address || ""
        });

        setShowModal(true);

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            const token = localStorage.getItem("token");

            if (editingSupplier) {

                await api.put(
                    `/suppliers/${editingSupplier._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

            } else {

                await api.post(
                    "/suppliers",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

            }

            closeModal();

            await loadSuppliers();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to save supplier"
            );

        } finally {

            setSaving(false);

        }

    };


    const handleDeleteSupplier = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this supplier?"
        );

        if (!confirmed) return;

        try {

            const token = localStorage.getItem("token");

            await api.delete(`/suppliers/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await loadSuppliers();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to delete supplier"
            );

        }

    };


    const closeModal = () => {

        setShowModal(false);
        setEditingSupplier(null);

        setFormData({
            name: "",
            contactPerson: "",
            email: "",
            phone: "",
            address: ""
        });

    };


    if (loading) {

        return (
            <div className="page-loading">
                <div className="spinner-border text-primary" />
                <p>Loading suppliers...</p>
            </div>
        );

    }


    return (

        <div className="dashboard-page">

            <div className="page-header">

                <div>

                    <span className="page-eyebrow">
                        SUPPLY CHAIN
                    </span>

                    <h1>Suppliers</h1>

                    <p>
                        Manage your suppliers and contact information.
                    </p>

                </div>


                <button
                    className="primary-action"
                    onClick={openAddModal}
                >
                    <Plus size={18} />
                    Add Supplier
                </button>

            </div>


            {error && (

                <div className="dashboard-error mb-3">

                    <AlertTriangle size={20} />

                    <span>{error}</span>

                    <button
                        className="refresh-button"
                        onClick={loadSuppliers}
                    >
                        <RefreshCw size={16} />
                    </button>

                </div>

            )}


            <div className="dashboard-panel staff-panel">

                <div className="products-toolbar">

                    <div className="search-box">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <div className="products-count">

                        {filteredSuppliers.length} suppliers

                    </div>

                </div>


                <div className="staff-table-wrapper">

                    <table className="staff-table">

                        <thead>

                            <tr>

                                <th>SUPPLIER</th>
                                <th>CONTACT PERSON</th>
                                <th>EMAIL</th>
                                <th>PHONE</th>
                                <th>ADDRESS</th>
                                <th>ACTIONS</th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredSuppliers.map((supplier) => (

                                <tr key={supplier._id}>

                                    <td>

                                        <div className="staff-name-cell">

                                            <div className="staff-avatar">

                                                <Truck size={17} />

                                            </div>

                                            <div>

                                                <strong>
                                                    {supplier.name}
                                                </strong>

                                                <small>
                                                    Supplier
                                                </small>

                                            </div>

                                        </div>

                                    </td>


                                    <td>
                                        {supplier.contactPerson || "—"}
                                    </td>


                                    <td>

                                        <div className="staff-contact">

                                            <Mail size={14} />

                                            {supplier.email || "—"}

                                        </div>

                                    </td>


                                    <td>

                                        <div className="staff-contact">

                                            <Phone size={14} />

                                            {supplier.phone || "—"}

                                        </div>

                                    </td>


                                    <td>

                                        <div className="staff-contact">

                                            <MapPin size={14} />

                                            {supplier.address || "—"}

                                        </div>

                                    </td>


                                    <td>

                                        <div className="action-buttons">

                                            <button
                                                className="icon-action edit"
                                                title="Edit"
                                                onClick={() =>
                                                    handleEditSupplier(
                                                        supplier
                                                    )
                                                }
                                            >
                                                <Edit3 size={16} />
                                            </button>


                                            <button
                                                className="icon-action delete"
                                                title="Delete"
                                                onClick={() =>
                                                    handleDeleteSupplier(
                                                        supplier._id
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


                    {filteredSuppliers.length === 0 && (

                        <div className="products-empty">

                            <Truck size={40} />

                            <h5>No suppliers found</h5>

                            <p>
                                Add a supplier to get started.
                            </p>

                        </div>

                    )}

                </div>

            </div>


            {showModal && (

                <div className="modal-overlay">

                    <div className="product-modal staff-modal">

                        <div className="modal-header">

                            <div>

                                <h4>
                                    {editingSupplier
                                        ? "Edit Supplier"
                                        : "Add Supplier"}
                                </h4>

                                <p>
                                    {editingSupplier
                                        ? "Update supplier information."
                                        : "Add a new supplier to your business."
                                    }
                                </p>

                            </div>


                            <button
                                className="modal-close"
                                onClick={closeModal}
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <form onSubmit={handleSubmit}>

                            <div className="row g-3">

                                <div className="col-12">

                                    <label className="form-label">
                                        Supplier Name
                                    </label>

                                    <input
                                        className="form-control modern-form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter supplier name"
                                        required
                                    />

                                </div>


                                <div className="col-12">

                                    <label className="form-label">
                                        Contact Person
                                    </label>

                                    <input
                                        className="form-control modern-form-control"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        placeholder="Enter contact person"
                                    />

                                </div>


                                <div className="col-12 col-md-6">

                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control modern-form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="supplier@example.com"
                                    />

                                </div>


                                <div className="col-12 col-md-6">

                                    <label className="form-label">
                                        Phone
                                    </label>

                                    <input
                                        className="form-control modern-form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                    />

                                </div>


                                <div className="col-12">

                                    <label className="form-label">
                                        Address
                                    </label>

                                    <textarea
                                        className="form-control modern-form-control"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter supplier address"
                                        rows="3"
                                    />

                                </div>

                            </div>


                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="secondary-action"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-action"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingSupplier
                                            ? "Update Supplier"
                                            : "Create Supplier"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );
}


export default Suppliers;