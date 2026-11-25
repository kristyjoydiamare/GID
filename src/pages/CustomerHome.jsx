
import { useState } from "react";
import {
    Home, Coffee, Receipt, UserRound, Search, ShoppingBag,
    Plus, Minus, Trash2, ArrowRight, Star, LogOut,
    ChevronRight, MapPin, CreditCard, Wallet, Banknote,
    Package, Clock, CheckCircle, X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./CustomerHome.css";

const products = [
    {
        id: 1,
        name: "Caramel Macchiato",
        category: "Coffee",
        price: 145,
        description: "Espresso, milk and caramel",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700"
    },
    {
        id: 2,
        name: "Iced Spanish Latte",
        category: "Coffee",
        price: 155,
        description: "Creamy espresso with sweet milk",
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=700"
    },
    {
        id: 3,
        name: "Matcha Latte",
        category: "Non-Coffee",
        price: 140,
        description: "Smooth and earthy matcha",
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=700"
    },
    {
        id: 4,
        name: "Chocolate Frappe",
        category: "Non-Coffee",
        price: 150,
        description: "Rich chocolate blended drink",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700"
    },
    {
        id: 5,
        name: "Butter Croissant",
        category: "Pastries",
        price: 85,
        description: "Flaky and freshly baked",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=700"
    },
    {
        id: 6,
        name: "Chocolate Muffin",
        category: "Pastries",
        price: 75,
        description: "Soft muffin with chocolate",
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=700"
    },
    {
        id: 7,
        name: "Loaded Fries",
        category: "Snacks",
        price: 120,
        description: "Crispy fries with cheesy sauce",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700"
    },
    {
        id: 8,
        name: "Chicken Sandwich",
        category: "Meals",
        price: 135,
        description: "Grilled chicken sandwich",
        image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=700"
    }
];

const categories = [
    "All", "Coffee", "Non-Coffee", "Pastries", "Snacks", "Meals"
];

const money = (amount) =>
    `₱${Number(amount).toFixed(2)}`;

function CustomerHome() {
    const { user, logout } = useAuth();

    const [activeTab, setActiveTab] = useState("home");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [cart, setCart] = useState(() =>
        JSON.parse(localStorage.getItem("cafego_cart") || "[]")
    );
    const [orders, setOrders] = useState(() =>
        JSON.parse(localStorage.getItem("cafego_orders") || "[]")
    );
    const [payment, setPayment] = useState("Cash");
    const [showCheckout, setShowCheckout] = useState(false);
    const [notice, setNotice] = useState("");

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            category === "All" || product.category === category;

        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );
    const deliveryFee = cart.length > 0 ? 30 : 0;
    const total = subtotal + deliveryFee;

    const saveCart = (updatedCart) => {
        setCart(updatedCart);
        localStorage.setItem("cafego_cart", JSON.stringify(updatedCart));
    };

    const addToCart = (product) => {
        const existing = cart.find((item) => item.id === product.id);

        let updatedCart;

        if (existing) {
            updatedCart = cart.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [...cart, { ...product, quantity: 1 }];
        }

        saveCart(updatedCart);
        setNotice(`${product.name} added to your cart!`);
        setTimeout(() => setNotice(""), 2200);
    };

    const changeQuantity = (id, amount) => {
        const updatedCart = cart
            .map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + amount }
                    : item
            )
            .filter((item) => item.quantity > 0);

        saveCart(updatedCart);
    };

    const removeFromCart = (id) => {
        saveCart(cart.filter((item) => item.id !== id));
    };

    const placeOrder = () => {
        if (cart.length === 0) return;

        const newOrder = {
            id: `CG-${Date.now().toString().slice(-7)}`,
            customer: user?.name || "Customer",
            items: cart,
            subtotal,
            deliveryFee,
            total,
            payment,
            status: "Pending",
            date: new Date().toLocaleString()
        };

        const updatedOrders = [newOrder, ...orders];

        setOrders(updatedOrders);
        localStorage.setItem("cafego_orders", JSON.stringify(updatedOrders));

        saveCart([]);
        setShowCheckout(false);
        setActiveTab("orders");
        setNotice("Your demo order has been placed!");
        setTimeout(() => setNotice(""), 3000);
    };

    const openCafe = () => {
        setSearch("");
        setCategory("All");
        setActiveTab("cafe");
    };

    const ProductCard = ({ product }) => (
        <article className="cg-product-card">
            <div className="cg-product-image">
                <img src={product.image} alt={product.name} />
                <span className="cg-product-tag">{product.category}</span>
            </div>
            <div className="cg-product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="cg-product-bottom">
                    <strong>{money(product.price)}</strong>
                    <button
                        className="cg-add-button"
                        onClick={() => addToCart(product)}
                        aria-label={`Add ${product.name} to cart`}
                    >
                        <Plus size={19} />
                    </button>
                </div>
            </div>
        </article>
    );

    return (
        <div className="cg-app">
            <header className="cg-header">
                <div className="cg-brand">
                    <div className="cg-brand-icon"><Coffee size={22} /></div>
                    <div>
                        <h2>CAFÉGO<span>.</span></h2>
                        <small>YOUR COFFEE, YOUR WAY</small>
                    </div>
                </div>

                <button
                    className="cg-header-cart"
                    onClick={() => setActiveTab("orders")}
                    aria-label="Open orders and cart"
                >
                    <ShoppingBag size={21} />
                    {cartCount > 0 && <span>{cartCount}</span>}
                </button>
            </header>

            <main className="cg-main">

                {activeTab === "home" && (
                    <section className="cg-page">
                        <div className="cg-greeting">
                            <div>
                                <span className="cg-eyebrow">WELCOME TO CAFÉGO</span>
                                <h1>Hello, {user?.name?.split(" ")[0] || "Coffee Lover"}!</h1>
                                <p>What are you craving today?</p>
                            </div>
                            <div className="cg-greeting-icon">☕</div>
                        </div>

                        <div className="cg-search">
                            <Search size={20} />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onFocus={() => setActiveTab("cafe")}
                                placeholder="Search coffee, snacks and more..."
                            />
                        </div>

                        <div className="cg-hero">
                            <div className="cg-hero-content">
                                <span>YOUR DAILY PICK-ME-UP</span>
                                <h2>Good days<br />start with coffee.</h2>
                                <p>Freshly made, just the way you like it.</p>
                                <button onClick={openCafe}>
                                    Explore menu <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="cg-section-heading">
                            <div>
                                <span className="cg-eyebrow">EXPLORE</span>
                                <h2>What are you craving?</h2>
                            </div>
                        </div>

                        <div className="cg-category-grid">
                            {[
                                { name: "Coffee", emoji: "☕" },
                                { name: "Non-Coffee", emoji: "🥤" },
                                { name: "Pastries", emoji: "🥐" },
                                { name: "Snacks", emoji: "🍟" }
                            ].map((item) => (
                                <button
                                    className="cg-category-card"
                                    key={item.name}
                                    onClick={() => {
                                        setCategory(item.name);
                                        setActiveTab("cafe");
                                    }}
                                >
                                    <span>{item.emoji}</span>
                                    <strong>{item.name}</strong>
                                </button>
                            ))}
                        </div>

                        <div className="cg-section-heading">
                            <div>
                                <span className="cg-eyebrow">HANDPICKED FOR YOU</span>
                                <h2>Featured favorites</h2>
                            </div>
                            <button className="cg-text-button" onClick={openCafe}>
                                See all <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="cg-product-grid">
                            {products.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === "cafe" && (
                    <section className="cg-page">
                        <div className="cg-page-title">
                            <span className="cg-eyebrow">MADE FRESH FOR YOU</span>
                            <h1>Our Menu</h1>
                            <p>Find your next favorite drink or bite.</p>
                        </div>

                        <div className="cg-search">
                            <Search size={20} />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search the menu..."
                            />
                            {search && (
                                <button onClick={() => setSearch("")}>
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        <div className="cg-filter-row">
                            {categories.map((item) => (
                                <button
                                    key={item}
                                    className={category === item ? "active" : ""}
                                    onClick={() => setCategory(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        <div className="cg-menu-count">
                            <h2>{category === "All" ? "All items" : category}</h2>
                            <span>{filteredProducts.length} products</span>
                        </div>

                        <div className="cg-product-grid">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="cg-empty">
                                <Coffee size={38} />
                                <h3>No products found</h3>
                                <p>Try another search or category.</p>
                            </div>
                        )}
                    </section>
                )}

                {activeTab === "orders" && (
                    <section className="cg-page">
                        <div className="cg-page-title">
                            <span className="cg-eyebrow">YOUR SELECTION</span>
                            <h1>My Orders</h1>
                            <p>Your cart and order history.</p>
                        </div>

                        <div className="cg-order-section">
                            <div className="cg-section-heading">
                                <h2>Your cart ({cartCount})</h2>
                                <ShoppingBag size={21} />
                            </div>

                            {cart.length === 0 ? (
                                <div className="cg-empty">
                                    <ShoppingBag size={40} />
                                    <h3>Your cart is empty</h3>
                                    <p>Discover something delicious today.</p>
                                    <button onClick={openCafe}>Browse menu</button>
                                </div>
                            ) : (
                                <>
                                    <div className="cg-cart-list">
                                        {cart.map((item) => (
                                            <div className="cg-cart-item" key={item.id}>
                                                <img src={item.image} alt={item.name} />
                                                <div className="cg-cart-details">
                                                    <h3>{item.name}</h3>
                                                    <span>{money(item.price)}</span>
                                                    <div className="cg-quantity">
                                                        <button onClick={() => changeQuantity(item.id, -1)}>
                                                            <Minus size={14} />
                                                        </button>
                                                        <strong>{item.quantity}</strong>
                                                        <button onClick={() => changeQuantity(item.id, 1)}>
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    className="cg-remove"
                                                    onClick={() => removeFromCart(item.id)}
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="cg-summary">
                                        <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                                        <div><span>Delivery fee</span><strong>{money(deliveryFee)}</strong></div>
                                        <div className="cg-total"><span>Total</span><strong>{money(total)}</strong></div>
                                        <button
                                            className="cg-primary-button"
                                            onClick={() => setShowCheckout(true)}
                                        >
                                            Proceed to checkout <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="cg-order-section">
                            <div className="cg-section-heading">
                                <h2>Order history</h2>
                                <Receipt size={21} />
                            </div>

                            {orders.length === 0 ? (
                                <p className="cg-no-history">Your placed orders will appear here.</p>
                            ) : (
                                <div className="cg-history-list">
                                    {orders.map((order) => (
                                        <div className="cg-history-card" key={order.id}>
                                            <div className="cg-history-top">
                                                <div>
                                                    <span className="cg-eyebrow">ORDER {order.id}</span>
                                                    <h3>{money(order.total)}</h3>
                                                </div>
                                                <span className="cg-status">{order.status}</span>
                                            </div>
                                            <p>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</p>
                                            <div className="cg-history-bottom">
                                                <span><Clock size={14} /> {order.date}</span>
                                                <span>{order.payment}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === "profile" && (
                    <section className="cg-page">
                        <div className="cg-page-title">
                            <span className="cg-eyebrow">YOUR ACCOUNT</span>
                            <h1>My Profile</h1>
                            <p>Manage your CaféGo account.</p>
                        </div>

                        <div className="cg-profile-card">
                            <div className="cg-avatar">
                                {(user?.name || "C").charAt(0).toUpperCase()}
                            </div>
                            <h2>{user?.name || "Customer"}</h2>
                            <p>{user?.email || "customer@example.com"}</p>
                            <span className="cg-member-label">CAFÉGO CUSTOMER</span>
                        </div>

                        <div className="cg-profile-menu">
                            <div>
                                <span><UserRound size={19} /></span>
                                <div><strong>Full name</strong><small>{user?.name}</small></div>
                            </div>
                            <div>
                                <span><MapPin size={19} /></span>
                                <div><strong>Email address</strong><small>{user?.email}</small></div>
                            </div>
                            <button onClick={() => setActiveTab("orders")}>
                                <span><Receipt size={19} /></span>
                                <div><strong>My orders</strong><small>View your order history</small></div>
                                <ChevronRight size={19} />
                            </button>
                        </div>

                        <button className="cg-logout-button" onClick={logout}>
                            <LogOut size={19} /> Log out
                        </button>

                        <p className="cg-demo-note">CaféGo Demo App · Your Coffee, Your Way</p>
                    </section>
                )}
            </main>

            <nav className="cg-bottom-nav">
                <button
                    className={activeTab === "home" ? "active" : ""}
                    onClick={() => setActiveTab("home")}
                >
                    <Home size={22} />
                    <span>Home</span>
                </button>
                <button
                    className={activeTab === "cafe" ? "active" : ""}
                    onClick={() => setActiveTab("cafe")}
                >
                    <Coffee size={22} />
                    <span>Café</span>
                </button>
                <button
                    className={activeTab === "orders" ? "active" : ""}
                    onClick={() => setActiveTab("orders")}
                >
                    <span className="cg-nav-icon">
                        <Receipt size={22} />
                        {cartCount > 0 && <i>{cartCount}</i>}
                    </span>
                    <span>Orders</span>
                </button>
                <button
                    className={activeTab === "profile" ? "active" : ""}
                    onClick={() => setActiveTab("profile")}
                >
                    <UserRound size={22} />
                    <span>Profile</span>
                </button>
            </nav>

            {notice && <div className="cg-toast"><CheckCircle size={18} /> {notice}</div>}

            {showCheckout && (
                <div className="cg-modal-overlay" onClick={() => setShowCheckout(false)}>
                    <div className="cg-checkout-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cg-modal-heading">
                            <div>
                                <span className="cg-eyebrow">ALMOST THERE</span>
                                <h2>Checkout</h2>
                            </div>
                            <button onClick={() => setShowCheckout(false)}><X /></button>
                        </div>

                        <h3 className="cg-payment-title">Choose payment method</h3>

                        <div className="cg-payment-options">
                            {[
                                { name: "Cash", icon: <Banknote size={21} />, detail: "Cash on delivery" },
                                { name: "GCash", icon: <Wallet size={21} />, detail: "Demo selection only" },
                                { name: "Card", icon: <CreditCard size={21} />, detail: "Demo selection only" }
                            ].map((method) => (
                                <button
                                    key={method.name}
                                    className={payment === method.name ? "selected" : ""}
                                    onClick={() => setPayment(method.name)}
                                >
                                    {method.icon}
                                    <span><strong>{method.name}</strong><small>{method.detail}</small></span>
                                    <span className="cg-radio">{payment === method.name ? "✓" : ""}</span>
                                </button>
                            ))}
                        </div>

                        <div className="cg-checkout-total">
                            <span>Total to pay</span>
                            <strong>{money(total)}</strong>
                        </div>

                        <p className="cg-demo-disclaimer">
                            This is a demo checkout. No actual payment will be collected.
                        </p>

                        <button className="cg-primary-button" onClick={placeOrder}>
                            Place demo order <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerHome;
