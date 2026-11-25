
import { useEffect, useMemo, useState } from "react";
import {
    Coffee,
    LayoutDashboard,
    Package,
    ShoppingBag,
    UserRound,
    LogOut,
    Search,
    Plus,
    Minus,
    Pencil,
    Trash2,
    TrendingUp,
    Clock,
    CheckCircle2,
    Truck,
    AlertTriangle,
    X,
    Menu,
    ChevronRight,
    CircleDollarSign,
    Boxes,
    ClipboardList
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./AdminDashboard.css";

const starterProducts = [
    { id: 1, name: "Caramel Macchiato", category: "Coffee", price: 145, stock: 25 },
    { id: 2, name: "Iced Spanish Latte", category: "Coffee", price: 155, stock: 18 },
    { id: 3, name: "Matcha Latte", category: "Non-Coffee", price: 140, stock: 15 },
    { id: 4, name: "Chocolate Frappe", category: "Non-Coffee", price: 150, stock: 20 },
    { id: 5, name: "Butter Croissant", category: "Pastries", price: 85, stock: 12 },
    { id: 6, name: "Chocolate Muffin", category: "Pastries", price: 75, stock: 8 },
    { id: 7, name: "Loaded Fries", category: "Snacks", price: 120, stock: 10 },
    { id: 8, name: "Chicken Sandwich", category: "Meals", price: 135, stock: 14 }
];

const orderStatuses = [
    "Pending",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
];

const money = (amount) =>
    `₱${Number(amount || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

function readStorage(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}

function AdminDashboard() {
    const { user, logout } = useAuth();

    const [activeTab, setActiveTab] = useState("home");
    const [products, setProducts] = useState(() =>
        readStorage("cafego_products", starterProducts)
    );
    const [orders, setOrders] = useState(() =>
        readStorage("cafego_orders", [])
    );
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notice, setNotice] = useState("");

    const [productForm, setProductForm] = useState({
        name: "",
        category: "Coffee",
        price: "",
        stock: ""
    });

    useEffect(() => {
        localStorage.setItem("cafego_products", JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem("cafego_orders", JSON.stringify(orders));
    }, [orders]);

    // Refresh orders when the admin returns to the page.
    useEffect(() => {
        const refreshOrders = () => {
            setOrders(readStorage("cafego_orders", []));
        };

        window.addEventListener("focus", refreshOrders);
        return () => window.removeEventListener("focus", refreshOrders);
    }, []);

    const categories = [
        "All",
        "Coffee",
        "Non-Coffee",
        "Pastries",
        "Snacks",
        "Meals"
    ];

    const pendingOrders = orders.filter(
        (order) => order.status === "Pending"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.status === "Delivered"
    ).length;

    const totalSales = orders
        .filter((order) => order.status === "Delivered")
        .reduce((total, order) => total + Number(order.total || 0), 0);

    const lowStockProducts = products.filter(
        (product) => Number(product.stock) <= 5
    );

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesCategory =
                category === "All" || product.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, category]);

    const customers = [
        ...new Set(
            orders
                .map((order) =>
                    typeof order.customer === "string"
                        ? order.customer
                        : order.customer?.name || order.customer?.email
                )
                .filter(Boolean)
        )
    ];

    function showNotice(message) {
        setNotice(message);
        window.setTimeout(() => setNotice(""), 2500);
    }

    function openAddProduct() {
        setEditingProduct(null);
        setProductForm({
            name: "",
            category: "Coffee",
            price: "",
            stock: ""
        });
        setShowProductForm(true);
    }

    function openEditProduct(product) {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock
        });
        setShowProductForm(true);
    }

    function saveProduct(event) {
        event.preventDefault();

        const newProduct = {
            id: editingProduct?.id || Date.now(),
            name: productForm.name.trim(),
            category: productForm.category,
            price: Number(productForm.price),
            stock: Number(productForm.stock)
        };

        if (!newProduct.name || newProduct.price < 0 || newProduct.stock < 0) {
            showNotice("Please enter valid product details.");
            return;
        }

        if (editingProduct) {
            setProducts((current) =>
                current.map((product) =>
                    product.id === editingProduct.id ? newProduct : product
                )
            );
            showNotice("Product updated successfully.");
        } else {
            setProducts((current) => [...current, newProduct]);
            showNotice("New product added successfully.");
        }

        setShowProductForm(false);
    }

    function deleteProduct(productId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        setProducts((current) =>
            current.filter((product) => product.id !== productId)
        );
        showNotice("Product deleted.");
    }

    function updateOrderStatus(orderId, newStatus) {
        const updatedOrders = orders.map((order) =>
            order.id === orderId
                ? { ...order, status: newStatus }
                : order
        );

        setOrders(updatedOrders);
        showNotice("Order status updated.");
    }

    function getCustomerName(order) {
        if (typeof order.customer === "string") return order.customer;
        return (
            order.customer?.name ||
            order.customer?.email ||
            order.name ||
            "Customer"
        );
    }

    function getOrderItems(order) {
        return Array.isArray(order.items) ? order.items : [];
    }

    function getOrderItemNames(order) {
        return getOrderItems(order)
            .map((item) => `${item.name || item.title || "Product"} × ${item.quantity || 1}`)
            .join(", ");
    }

    function getOrderDate(order) {
        if (!order.date) return "Date unavailable";

        const date = new Date(order.date);
        return Number.isNaN(date.getTime())
            ? order.date
            : date.toLocaleString();
    }

    function getStatusClass(status) {
        return (status || "Pending")
            .toLowerCase()
            .replaceAll(" ", "-");
    }

    function navigate(tab) {
        setActiveTab(tab);
        setMobileMenuOpen(false);
        setSearch("");
        setCategory("All");
    }

    const navigation = [
        { id: "home", label: "Home", icon: LayoutDashboard },
        { id: "cafe", label: "Café & Inventory", icon: Coffee },
        { id: "orders", label: "Orders", icon: ShoppingBag },
        { id: "profile", label: "Profile", icon: UserRound }
    ];

    return (
        <div className="admin-app">
            <aside className={`admin-sidebar ${mobileMenuOpen ? "open" : ""}`}>
                <div className="admin-logo">
                    <div className="admin-logo-icon">
                        <Coffee size={25} />
                    </div>
                    <div>
                        <h2>CAFÉGO<span>.</span></h2>
                        <p>ADMIN PANEL</p>
                    </div>
                    <button
                        className="admin-close-menu"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="admin-nav-heading">MENU</p>

                <nav className="admin-side-nav">
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                className={activeTab === item.id ? "active" : ""}
                                onClick={() => navigate(item.id)}
                            >
                                <Icon size={19} />
                                <span>{item.label}</span>
                                {item.id === "orders" && pendingOrders > 0 && (
                                    <small>{pendingOrders}</small>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="admin-sidebar-bottom">
                    <div className="admin-sidebar-user">
                        <div className="admin-avatar">
                            {(user?.name || "A").charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <strong>{user?.name || "Administrator"}</strong>
                            <span>Administrator</span>
                        </div>
                    </div>

                    <button className="admin-logout" onClick={logout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {mobileMenuOpen && (
                <button
                    className="admin-menu-backdrop"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close navigation"
                />
            )}

            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <button
                            className="admin-menu-toggle"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>
                        <div>
                            <span className="admin-topbar-label">CAFÉGO MANAGEMENT</span>
                            <h2>
                                {navigation.find((item) => item.id === activeTab)?.label}
                            </h2>
                        </div>
                    </div>

                    <div className="admin-topbar-profile">
                        <div className="admin-topbar-avatar">
                            {(user?.name || "A").charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <strong>{user?.name || "Administrator"}</strong>
                            <span>Admin</span>
                        </div>
                    </div>
                </header>

                <div className="admin-page-content">
                    {activeTab === "home" && (
                        <section>
                            <div className="admin-welcome">
                                <div>
                                    <span className="admin-eyebrow">OVERVIEW</span>
                                    <h1>Welcome back, {user?.name || "Admin"}!</h1>
                                    <p>Here's what's happening at your café today.</p>
                                </div>
                                <div className="admin-welcome-icon">
                                    <Coffee size={34} />
                                </div>
                            </div>

                            <div className="admin-stat-grid">
                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon brown">
                                        <Boxes size={22} />
                                    </div>
                                    <span>Total Products</span>
                                    <strong>{products.length}</strong>
                                    <small>Items in your inventory</small>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon orange">
                                        <Clock size={22} />
                                    </div>
                                    <span>Pending Orders</span>
                                    <strong>{pendingOrders}</strong>
                                    <small>Need your attention</small>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon green">
                                        <CheckCircle2 size={22} />
                                    </div>
                                    <span>Delivered Orders</span>
                                    <strong>{deliveredOrders}</strong>
                                    <small>Successfully delivered</small>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon gold">
                                        <CircleDollarSign size={22} />
                                    </div>
                                    <span>Delivered Sales</span>
                                    <strong>{money(totalSales)}</strong>
                                    <small>From delivered orders</small>
                                </div>
                            </div>

                            <div className="admin-home-grid">
                                <div className="admin-panel">
                                    <div className="admin-panel-heading">
                                        <div>
                                            <h3>Recent Orders</h3>
                                            <p>Latest customer transactions</p>
                                        </div>
                                        <button
                                            className="admin-text-button"
                                            onClick={() => navigate("orders")}
                                        >
                                            View all <ChevronRight size={16} />
                                        </button>
                                    </div>

                                    {orders.length === 0 ? (
                                        <div className="admin-empty">
                                            <ShoppingBag size={30} />
                                            <strong>No orders yet</strong>
                                            <span>Customer orders will appear here.</span>
                                        </div>
                                    ) : (
                                        <div className="admin-recent-orders">
                                            {[...orders].slice(-5).reverse().map((order, index) => (
                                                <div className="admin-recent-order" key={order.id || index}>
                                                    <div className="admin-order-icon">
                                                        <ShoppingBag size={18} />
                                                    </div>
                                                    <div className="admin-recent-info">
                                                        <strong>{getCustomerName(order)}</strong>
                                                        <span>{getOrderItemNames(order) || "Order items"}</span>
                                                    </div>
                                                    <div className="admin-recent-total">
                                                        <strong>{money(order.total)}</strong>
                                                        <span className={`admin-status ${getStatusClass(order.status)}`}>
                                                            {order.status || "Pending"}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="admin-panel">
                                    <div className="admin-panel-heading">
                                        <div>
                                            <h3>Inventory Alerts</h3>
                                            <p>Products running low on stock</p>
                                        </div>
                                        <AlertTriangle size={20} className="admin-alert-icon" />
                                    </div>

                                    {lowStockProducts.length === 0 ? (
                                        <div className="admin-empty compact">
                                            <CheckCircle2 size={28} />
                                            <strong>All stocked up!</strong>
                                            <span>No products have low stock.</span>
                                        </div>
                                    ) : (
                                        lowStockProducts.map((product) => (
                                            <div className="admin-low-stock" key={product.id}>
                                                <div>
                                                    <strong>{product.name}</strong>
                                                    <span>{product.category}</span>
                                                </div>
                                                <b>{product.stock} left</b>
                                            </div>
                                        ))
                                    )}

                                    <button
                                        className="admin-outline-button"
                                        onClick={() => navigate("cafe")}
                                    >
                                        Manage inventory <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === "cafe" && (
                        <section>
                            <div className="admin-section-heading">
                                <div>
                                    <span className="admin-eyebrow">PRODUCT MANAGEMENT</span>
                                    <h1>Café Inventory</h1>
                                    <p>Manage your menu, prices, stock, and availability.</p>
                                </div>
                                <button className="admin-primary-button" onClick={openAddProduct}>
                                    <Plus size={18} /> Add Product
                                </button>
                            </div>

                            <div className="admin-inventory-summary">
                                <div><Package size={20} /><span>{products.length} Products</span></div>
                                <div><CheckCircle2 size={20} /><span>{products.filter(p => Number(p.stock) > 0).length} Available</span></div>
                                <div><AlertTriangle size={20} /><span>{lowStockProducts.length} Low Stock</span></div>
                            </div>

                            <div className="admin-panel admin-inventory-panel">
                                <div className="admin-inventory-toolbar">
                                    <div className="admin-search">
                                        <Search size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={search}
                                            onChange={(event) => setSearch(event.target.value)}
                                        />
                                    </div>
                                    <select
                                        value={category}
                                        onChange={(event) => setCategory(event.target.value)}
                                    >
                                        {categories.map((item) => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="admin-table-wrap">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th>Availability</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.map((product) => (
                                                <tr key={product.id}>
                                                    <td>
                                                        <div className="admin-product-name">
                                                            <div className="admin-product-thumb">
                                                                <Coffee size={18} />
                                                            </div>
                                                            <strong>{product.name}</strong>
                                                        </div>
                                                    </td>
                                                    <td>{product.category}</td>
                                                    <td>{money(product.price)}</td>
                                                    <td>
                                                        <strong className={Number(product.stock) <= 5 ? "stock-low" : ""}>
                                                            {product.stock}
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        <span className={`admin-status ${Number(product.stock) > 0 ? "delivered" : "cancelled"}`}>
                                                            {Number(product.stock) > 0 ? "Available" : "Out of Stock"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="admin-action-buttons">
                                                            <button onClick={() => openEditProduct(product)} title="Edit product">
                                                                <Pencil size={16} />
                                                            </button>
                                                            <button className="delete" onClick={() => deleteProduct(product.id)} title="Delete product">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {filteredProducts.length === 0 && (
                                        <div className="admin-empty">
                                            <Package size={30} />
                                            <strong>No products found</strong>
                                            <span>Try another search or category.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === "orders" && (
                        <section>
                            <div className="admin-section-heading">
                                <div>
                                    <span className="admin-eyebrow">CUSTOMER TRANSACTIONS</span>
                                    <h1>Customer Orders</h1>
                                    <p>Review orders and update their delivery progress.</p>
                                </div>
                            </div>

                            <div className="admin-order-summary">
                                <div><ClipboardList size={20} /><span>{orders.length} Total Orders</span></div>
                                <div><Clock size={20} /><span>{pendingOrders} Pending</span></div>
                                <div><Truck size={20} /><span>{orders.filter(o => o.status === "Out for Delivery").length} Out for Delivery</span></div>
                            </div>

                            <div className="admin-panel admin-orders-panel">
                                {orders.length === 0 ? (
                                    <div className="admin-empty">
                                        <ShoppingBag size={34} />
                                        <strong>No customer orders yet</strong>
                                        <span>Orders placed through the customer app will appear here.</span>
                                    </div>
                                ) : (
                                    <div className="admin-orders-list">
                                        {[...orders].reverse().map((order, index) => (
                                            <article className="admin-order-card" key={order.id || index}>
                                                <div className="admin-order-card-top">
                                                    <div>
                                                        <span className="admin-order-number">
                                                            ORDER #{order.id || index + 1}
                                                        </span>
                                                        <h3>{getCustomerName(order)}</h3>
                                                        <p>{getOrderDate(order)}</p>
                                                    </div>
                                                    <span className={`admin-status ${getStatusClass(order.status)}`}>
                                                        {order.status || "Pending"}
                                                    </span>
                                                </div>

                                                <div className="admin-order-items">
                                                    <strong>Order items</strong>
                                                    {getOrderItems(order).map((item, itemIndex) => (
                                                        <div key={item.id || itemIndex}>
                                                            <span>{item.name || item.title} × {item.quantity || 1}</span>
                                                            <b>{money(Number(item.price || 0) * Number(item.quantity || 1))}</b>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="admin-order-details">
                                                    <span>Payment: <strong>{order.payment || "Not specified"}</strong></span>
                                                    <span>Total: <strong>{money(order.total)}</strong></span>
                                                </div>

                                                <div className="admin-order-update">
                                                    <label htmlFor={`status-${order.id || index}`}>Update order status</label>
                                                    <select
                                                        id={`status-${order.id || index}`}
                                                        value={order.status || "Pending"}
                                                        onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                                                    >
                                                        {orderStatuses.map((status) => (
                                                            <option key={status} value={status}>{status}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === "profile" && (
                        <section>
                            <div className="admin-section-heading">
                                <div>
                                    <span className="admin-eyebrow">ACCOUNT SETTINGS</span>
                                    <h1>Admin Profile</h1>
                                    <p>View your administrator account information.</p>
                                </div>
                            </div>

                            <div className="admin-profile-card">
                                <div className="admin-profile-cover">
                                    <div className="admin-profile-avatar">
                                        {(user?.name || "A").charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="admin-profile-info">
                                    <span className="admin-profile-role">CAFÉGO ADMINISTRATOR</span>
                                    <h2>{user?.name || "Administrator"}</h2>
                                    <p>{user?.email || "No email available"}</p>

                                    <div className="admin-profile-details">
                                        <div>
                                            <span>Full Name</span>
                                            <strong>{user?.name || "Administrator"}</strong>
                                        </div>
                                        <div>
                                            <span>Email Address</span>
                                            <strong>{user?.email || "Not available"}</strong>
                                        </div>
                                        <div>
                                            <span>Account Role</span>
                                            <strong>Administrator</strong>
                                        </div>
                                        <div>
                                            <span>System</span>
                                            <strong>CaféGo Management</strong>
                                        </div>
                                    </div>

                                    <button className="admin-primary-button admin-profile-logout" onClick={logout}>
                                        <LogOut size={18} /> Logout Account
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <nav className="admin-mobile-nav">
                {navigation.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            className={activeTab === item.id ? "active" : ""}
                            onClick={() => navigate(item.id)}
                        >
                            <Icon size={21} />
                            <span>{item.id === "cafe" ? "Café" : item.label}</span>
                            {item.id === "orders" && pendingOrders > 0 && (
                                <i>{pendingOrders}</i>
                            )}
                        </button>
                    );
                })}
            </nav>

            {showProductForm && (
                <div className="admin-modal-backdrop" onClick={() => setShowProductForm(false)}>
                    <div className="admin-product-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="admin-modal-heading">
                            <div>
                                <span className="admin-eyebrow">INVENTORY</span>
                                <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                            </div>
                            <button onClick={() => setShowProductForm(false)} aria-label="Close">
                                <X size={21} />
                            </button>
                        </div>

                        <form onSubmit={saveProduct}>
                            <label>Product Name</label>
                            <input
                                required
                                value={productForm.name}
                                onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
                                placeholder="Enter product name"
                            />

                            <label>Category</label>
                            <select
                                value={productForm.category}
                                onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
                            >
                                {categories.filter((item) => item !== "All").map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>

                            <div className="admin-form-row">
                                <div>
                                    <label>Price (₱)</label>
                                    <input
                                        required
                                        min="0"
                                        type="number"
                                        value={productForm.price}
                                        onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label>Stock Quantity</label>
                                    <input
                                        required
                                        min="0"
                                        type="number"
                                        value={productForm.stock}
                                        onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <button className="admin-primary-button admin-save-product" type="submit">
                                {editingProduct ? "Save Changes" : "Add Product"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {notice && <div className="admin-toast">{notice}</div>}
        </div>
    );
}

export default AdminDashboard;
