import { useEffect, useState } from "react";

import {
    Users,
    Search,
    Plus,
    Edit3,
    Trash2,
    X,
    RefreshCw,
    AlertTriangle,
    Phone,
    Mail
} from "lucide-react";

import api from "../../services/api";


function Staff() {

    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });


    // LOAD STAFF
    const loadStaff = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get("/staff", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setStaff(response.data.staff || []);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load staff"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadStaff();
    }, []);


    // SEARCH
    const filteredStaff = staff.filter((person) => {

        const text = search.toLowerCase();

        return (
            person.name?.toLowerCase().includes(text) ||
            person.email?.toLowerCase().includes(text) ||
            person.phone?.toLowerCase().includes(text)
        );

    });


    // FORM CHANGE
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // OPEN ADD MODAL
    const openAddModal = () => {

        setEditingStaff(null);

        setFormData({
            name: "",
            email: "",
            password: "",
            phone: ""
        });

        setShowModal(true);

    };


    // OPEN EDIT MODAL
    const handleEditStaff = (person) => {

        setEditingStaff(person);

        setFormData({
            name: person.name || "",
            email: person.email || "",
            password: "",
            phone: person.phone || ""
        });

        setShowModal(true);

    };


    // CREATE STAFF
    const handleCreateStaff = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            const token = localStorage.getItem("token");

            await api.post(
                "/staff",
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            closeModal();

            await loadStaff();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to create staff"
            );

        } finally {

            setSaving(false);

        }

    };


    // UPDATE STAFF
    const handleUpdateStaff = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            const token = localStorage.getItem("token");

            const data = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            };

            if (formData.password) {
                data.password = formData.password;
            }

            await api.put(
                `/staff/${editingStaff._id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            closeModal();

            await loadStaff();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to update staff"
            );

        } finally {

            setSaving(false);

        }

    };


    // DELETE STAFF
    const handleDeleteStaff = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this staff member?"
        );

        if (!confirmed) return;

        try {

            const token = localStorage.getItem("token");

            await api.delete(`/staff/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await loadStaff();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to delete staff"
            );

        }

    };


    // CLOSE MODAL
    const closeModal = () => {

        setShowModal(false);
        setEditingStaff(null);

        setFormData({
            name: "",
            email: "",
            password: "",
            phone: ""
        });

    };


    if (loading) {

        return (
            <div className="page-loading">

                <div className="spinner-border text-primary" />

                <p>Loading staff...</p>

            </div>
        );

    }


    return (

        <div className="dashboard-page">

            {/* HEADER */}

            <div className="page-header">

                <div>

                    <span className="page-eyebrow">
                        TEAM
                    </span>

                    <h1>Staff</h1>

                    <p>
                        Manage your staff members and access.
                    </p>

                </div>


                <button
                    className="primary-action"
                    onClick={openAddModal}
                >
                    <Plus size={18} />

                    Add Staff
                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="dashboard-error mb-3">

                    <AlertTriangle size={20} />

                    <span>{error}</span>

                    <button
                        className="refresh-button"
                        onClick={loadStaff}
                    >
                        <RefreshCw size={16} />
                    </button>

                </div>

            )}


            {/* STAFF PANEL */}

            <div className="dashboard-panel staff-panel">

                {/* TOOLBAR */}

                <div className="products-toolbar">

                    <div className="search-box">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search staff..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <div className="products-count">

                        {filteredStaff.length} staff

                    </div>

                </div>


                {/* STAFF TABLE */}

                <div className="staff-table-wrapper">

                    <table className="staff-table">

                        <thead>

                            <tr>

                                <th>STAFF</th>

                                <th>EMAIL</th>

                                <th>PHONE</th>

                                <th>ROLE</th>

                                <th>STATUS</th>

                                <th>ACTIONS</th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredStaff.map((person) => (

                                <tr key={person._id}>

                                    <td>

                                        <div className="staff-name-cell">

                                            <div className="staff-avatar">

                                                {person.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}

                                            </div>


                                            <div>

                                                <strong>
                                                    {person.name}
                                                </strong>

                                                <small>
                                                    Staff member
                                                </small>

                                            </div>

                                        </div>

                                    </td>


                                    <td>

                                        <div className="staff-contact">

                                            <Mail size={14} />

                                            {person.email}

                                        </div>

                                    </td>


                                    <td>

                                        <div className="staff-contact">

                                            <Phone size={14} />

                                            {person.phone || "—"}

                                        </div>

                                    </td>


                                    <td>

                                        <span className="role-badge">

                                            {person.role || "staff"}

                                        </span>

                                    </td>


                                    <td>

                                        <span
                                            className={
                                                person.isActive
                                                    ? "status-badge active"
                                                    : "status-badge inactive"
                                            }
                                        >
                                            {person.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                    </td>


                                    <td>

                                        <div className="action-buttons">

                                            <button
                                                className="icon-action edit"
                                                title="Edit"
                                                onClick={() =>
                                                    handleEditStaff(person)
                                                }
                                            >
                                                <Edit3 size={16} />
                                            </button>


                                            <button
                                                className="icon-action delete"
                                                title="Delete"
                                                onClick={() =>
                                                    handleDeleteStaff(
                                                        person._id
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


                    {filteredStaff.length === 0 && (

                        <div className="products-empty">

                            <Users size={40} />

                            <h5>No staff found</h5>

                            <p>
                                Add a staff member to get started.
                            </p>

                        </div>

                    )}

                </div>

            </div>


            {/* STAFF MODAL */}

            {showModal && (

                <div className="modal-overlay">

                    <div className="product-modal staff-modal">

                        <div className="modal-header">

                            <div>

                                <h4>
                                    {editingStaff
                                        ? "Edit Staff"
                                        : "Add Staff"}
                                </h4>

                                <p>
                                    {editingStaff
                                        ? "Update staff account information."
                                        : "Create a new staff account."
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


                        <form
                            onSubmit={
                                editingStaff
                                    ? handleUpdateStaff
                                    : handleCreateStaff
                            }
                        >

                            <div className="row g-3">

                                <div className="col-12">

                                    <label className="form-label">
                                        Full Name
                                    </label>

                                    <input
                                        className="form-control modern-form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter staff name"
                                        required
                                    />

                                </div>


                                <div className="col-12">

                                    <label className="form-label">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control modern-form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="staff@example.com"
                                        required
                                    />

                                </div>


                                <div className="col-12 col-md-6">

                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control modern-form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder={
                                            editingStaff
                                                ? "Leave blank to keep current"
                                                : "Enter password"
                                        }
                                        required={!editingStaff}
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
                                        : editingStaff
                                            ? "Update Staff"
                                            : "Create Staff"
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


export default Staff;