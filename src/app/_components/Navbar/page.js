'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignIn from '../SignIn/page';
import { doc, getDoc, arrayRemove, updateDoc } from 'firebase/firestore';
import { fireStore } from '../../_components/firebase/config';

const Navbar = () => {

    const menuItems = [
        { id: "menu-mobile-categories-mega-electronics", label: "Menu", link: "#" },
        { id: "menu-mobile-menu-mega-electronics", label: "Categories", link: "#" },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isShopOpen, setShopOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [activeSection, setActiveSection] = useState(menuItems[0]?.id);
    
    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0.0);
    const router = useRouter();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const shopDropdown = () => {
        setShopOpen(!isShopOpen);
    };

    // Function to open the My Account Modal
    const openModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Function to open the Cart Modal
    const openCart = (e) => {
        e.preventDefault();
        setIsCartOpen(true);
    };

    const closeCart = () => {
        setIsCartOpen(false);
    };

    // Function to open Mobile Menu Modal
    const openMobileMenu = (e) => {
        e.preventDefault();
        setIsMenuOpen(true);
    };

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
    };

    const handleMenuClick = (id) => {
        setActiveSection((prev) => (prev === id ? null : id));
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        router.push('/home/checkout');
        setIsCartOpen(false);
    };

    const handleViewCart = (e) => {
        e.preventDefault();
        router.push('/home/cart');
        setIsCartOpen(false);
    }

    useEffect(() => {
        // Fetch the current user's cart items
        const fetchCart = async () => {
            const userData = localStorage.getItem('currentUser');

            if (!userData) {
                alert("Please log in first.");
                return; // Exit if no user is logged in
            }

            const user = JSON.parse(userData); // Parse the user data from localStorage

            try {
                // Get the user's cart data from Firestore
                const userRef = doc(fireStore, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const cartData = userDoc.data().cart || []; // Retrieve the cart data from the user document
                    setCartItems(cartData); // Set the cart items to state
                } else {
                    console.log("User document not found.");
                }
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        };

        fetchCart(); // Call the fetchCart function to retrieve cart items
    }, []);

    const removeFromCart = async (productId) => {
        const userData = localStorage.getItem('currentUser');
        if (!userData) {
            alert("Please log in first.");
            return;
        }

        const user = JSON.parse(userData); // Parse the user data from localStorage

        try {
            // Get user document reference
            const userRef = doc(fireStore, "users", user.uid);

            // Remove item from cart array in Firestore
            await updateDoc(userRef, {
                cart: arrayRemove({ productId }) // Remove item by productId from the cart array
            });

            // Update local state
            setCartItems(cartItems.filter(item => item.productId !== productId));

            console.log(`Removed item with productId: ${productId}`);
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const changeQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            alert("Quantity cannot be less than 1.");
            return;
        }

        const userData = localStorage.getItem('currentUser');
        if (!userData) {
            alert("Please log in first.");
            return;
        }

        const user = JSON.parse(userData); // Parse the user data from localStorage

        try {
            // Get user document reference
            const userRef = doc(fireStore, "users", user.uid);

            // Find the item to update
            const updatedCart = cartItems.map(item =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            );

            // Update Firestore with new quantity
            await updateDoc(userRef, {
                cart: updatedCart
            });

            // Update local state
            setCartItems(updatedCart);

            console.log(`Updated quantity of item with productId: ${productId} to ${newQuantity}`);
        } catch (error) {
            console.error("Error updating quantity in cart:", error);
        }
    };

    // Header wishlist count and cart count

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (user && user.uid) {
            const userId = user.uid;

            const fetchUserData = async () => {
                try {
                    // Fetch user data from Firestore
                    const userRef = doc(fireStore, "users", userId);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();

                        // Set the wishlist count
                        const wishlistItems = userData.wishlist || [];
                        setWishlistCount(wishlistItems.length);

                        // Set the cart count and total price
                        const cartItems = userData.cart || [];
                        setCartCount(cartItems.length);

                        const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
                        setCartTotal(total);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchUserData();
        }
    }, []); 

    return <>
        <header className="whb-header whb-header_469459 whb-sticky-shadow whb-scroll-stick whb-sticky-real whb-hide-on-scroll whb-sticky-prepared">
            <div className="whb-main-header">
                <div className="whb-row whb-general-header whb-not-sticky-row whb-without-bg whb-without-border whb-color-dark whb-flex-flex-middle">
                    <div className="container">
                        <div className="whb-flex-row whb-general-header-inner">
                            <div className="whb-column whb-col-left whb-visible-lg">
                                <div className="site-logo">
                                    <a
                                        href='/home'

                                        className="wd-logo wd-main-logo"
                                        rel="home"
                                        aria-label="Site logo"
                                    >
                                        <img
                                            src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/mega-electronics-logo.svg"
                                            className="attachment-full size-full"
                                            alt=""
                                            style={{ maxWidth: 200 }}
                                            decoding="async"
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className="whb-column whb-col-center whb-visible-lg">
                                <div className="whb-space-element " style={{ width: 20 }} />
                                <div className="wd-search-form wd-header-search-form wd-display-form whb-1yjd6g8pvqgh79uo6oce">
                                    <form
                                        role="search"
                                        method="get"
                                        className="searchform  wd-style-with-bg-2 wd-cat-style-default woodmart-ajax-search"
                                        action="https://woodmart.xtemos.com/mega-electronics/"
                                        data-thumbnail={1}
                                        data-price={1}
                                        data-post_type="product"
                                        data-count={20}
                                        data-sku={0}
                                        data-symbols_count={3}
                                    >
                                        <input
                                            type="text"
                                            className="s"
                                            placeholder="Search for products"
                                            defaultValue=""
                                            name="s"
                                            aria-label="Search"
                                            title="Search for products"
                                            required=""
                                        />
                                        <input type="hidden" name="post_type" defaultValue="product" />
                                        <button type="submit" className="searchsubmit">
                                            <span>Search </span>
                                        </button>
                                    </form>
                                    <div className="search-results-wrapper">
                                        <div className="wd-dropdown-results wd-scroll wd-dropdown">
                                            <div className="wd-scroll-content" />
                                        </div>
                                    </div>
                                </div>
                                <div className="whb-space-element " style={{ width: 20 }} />
                            </div>
                            <div className="whb-column whb-col-right whb-visible-lg">
                                <div className="info-box-wrapper  whb-wgrc3rpz50z01cc4ap2o">
                                    <div
                                        id="wd-6780f8eb9126a"
                                        className=" wd-info-box text-left box-icon-align-left box-style-base color-scheme- wd-bg-none wd-items-middle "
                                    >
                                        <div className="box-icon-wrapper  box-with-icon box-icon-simple">
                                            <div className="info-box-icon">
                                                <div
                                                    className="info-svg-wrapper"
                                                    style={{ width: 35, height: 35 }}
                                                >
                                                    <img
                                                        src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/02/support.svg"
                                                        title="support"
                                                        width={35}
                                                        height={35}
                                                        data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/02/support.svg"
                                                        data-ll-status="loaded"
                                                        className="entered lazyloaded"
                                                    />
                                                    
                                                </div>
                                            </div>
                                        </div>
                                        <div className="info-box-content">
                                            <div className="info-box-inner reset-last-child">
                                                <h6 style={{ marginBottom: 0, fontSize: 14 }}>
                                                    24 Support
                                                </h6>
                                                <p>
                                                    <span style={{ color: "#1c61e7", fontSize: 14 }}>
                                                        +1 212-334-0212
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="whb-space-element " style={{ width: 20 }} />
                                <div className="info-box-wrapper  whb-qb4njeyuiye2my4ln8v6">
                                    <div
                                        id="wd-6780f8eb9178a"
                                        className=" wd-info-box text-left box-icon-align-left box-style-base color-scheme- wd-bg-none wd-items-middle "
                                    >
                                        <div className="box-icon-wrapper  box-with-icon box-icon-simple">
                                            <div className="info-box-icon">
                                                <div
                                                    className="info-svg-wrapper"
                                                    style={{ width: 35, height: 35 }}
                                                >
                                                    <img
                                                        src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/02/worldwide.svg"
                                                        title="worldwide"
                                                        width={35}
                                                        height={35}
                                                        data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/02/worldwide.svg"
                                                        data-ll-status="loaded"
                                                        className="entered lazyloaded"
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                        <div className="info-box-content">
                                            <div className="info-box-inner reset-last-child">
                                                <h6 style={{ marginBottom: 0, fontSize: 14 }}>Worldwide</h6>
                                                <p>
                                                    <span style={{ color: "#1c61e7", fontSize: 14 }}>
                                                        Free Shipping
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="whb-column whb-mobile-left whb-hidden-lg">
                                <div className="wd-tools-element wd-header-mobile-nav wd-style-icon wd-design-1 whb-2pcq59rrgv7khz6hxoix" onClick={openMobileMenu} >
                                    <a rel="nofollow" aria-label="Open mobile menu">
                                        <span className="wd-tools-icon"></span>
                                        <span className="wd-tools-text">Menu</span>
                                    </a>
                                </div>
                            </div>
                            <div className="whb-column whb-mobile-center whb-hidden-lg">
                                <div className="site-logo">
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/"
                                        className="wd-logo wd-main-logo"
                                        rel="home"
                                        aria-label="Site logo"
                                    >
                                        <img
                                            src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/mega-electronics-logo.svg"
                                            className="attachment-full size-full"
                                            alt=""
                                            style={{ maxWidth: 180 }}
                                            decoding="async"
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className="whb-column whb-mobile-right whb-hidden-lg">
                                <link
                                    rel="stylesheet"
                                    id="wd-woo-mod-login-form-css"
                                    href="https://woodmart.xtemos.com/mega-electronics/wp-content/themes/woodmart/css/parts/woo-mod-login-form.min.css?ver=8.0.4"
                                    type="text/css"
                                    media="all"
                                />
                                <div className="wd-header-my-account wd-tools-element wd-event-hover wd-design-1 wd-account-style-icon login-side-opener whb-hehq7b9i6crxiw1rjzt3" onClick={openModal}>
                                    <a

                                        title="My account"
                                    >
                                        <span className="wd-tools-icon"></span>
                                        <span className="wd-tools-text">Login / Register </span>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="whb-row whb-header-bottom whb-sticky-row whb-with-bg whb-without-border whb-color-dark whb-flex-flex-middle">
                    <div className="container">
                        <div className="whb-flex-row whb-header-bottom-inner">
                            <div className="whb-column whb-col-left whb-visible-lg">
                                <div className="wd-tools-element wd-header-sticky-nav wd-style-text wd-design-8 wd-close-menu-mouseout whb-07amklogpjd7r42vt1ip">
                                    <a rel="nofollow" aria-label="Open sticky navigation">
                                        <span className="wd-tools-inner">
                                            <span className="wd-tools-icon"></span>
                                            <span className="wd-tools-text">All Categories</span>
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div className="whb-column whb-col-center whb-visible-lg">
                                <div
                                    className="wd-header-nav wd-header-main-nav text-left wd-design-1"
                                    role="navigation"
                                    aria-label="Main navigation"
                                >
                                    <ul
                                        id="menu-main-menu-mega-electronics"
                                        className="menu wd-nav wd-nav-main wd-style-bg wd-gap-s wd-offsets-calculated"
                                    >

                                        <li
                                            id="menu-item-87"
                                            className="menu-item menu-item-type-post_type menu-item-object-page menu-item-87 item-level-0 menu-simple-dropdown wd-event-hover"
                                        >
                                            <a
                                                href="/home/stores"

                                                className="woodmart-nav-link"
                                            >
                                                <span className="nav-link-text">About Us</span>
                                            </a>
                                        </li>

                                        <li
                                            id="menu-item-88"
                                            className="menu-item menu-item-type-post_type menu-item-object-page menu-item-88 item-level-0 menu-simple-dropdown wd-event-hover"
                                            style={{
                                                position: "relative",
                                                display: "inline-block",
                                                margin: "0 10px",
                                            }}
                                        >
                                            {/* Dropdown Toggle */}
                                            <a
                                                href="#"
                                                className="woodmart-nav-link"
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent default anchor behavior
                                                    toggleDropdown();
                                                }}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "#333",
                                                    fontSize: "16px",
                                                    padding: "10px 15px",
                                                    background: "#f8f9fa",
                                                    borderRadius: "5px",
                                                    display: "inline-block",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <span className="nav-link-text">Site Policies</span>
                                            </a>

                                            {/* Dropdown Menu */}
                                            {isOpen && (
                                                <ul
                                                    className="dropdown-menu"
                                                    style={{
                                                        position: "absolute",
                                                        top: "100%",
                                                        left: "0",
                                                        background: "#fff",
                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                        borderRadius: "5px",
                                                        listStyleType: "none",
                                                        margin: "5px 0 0 0",
                                                        padding: "10px 0",
                                                        minWidth: "150px",
                                                        zIndex: 1000,
                                                    }}
                                                >
                                                    <li style={{ padding: "10px 20px" }}>
                                                        <a
                                                            href="/home/terms"
                                                            style={{
                                                                textDecoration: "none",
                                                                color: "#333",
                                                                display: "block",
                                                            }}
                                                        >
                                                            Terms of Service
                                                        </a>
                                                    </li>
                                                    <li style={{ padding: "10px 20px" }}>
                                                        <a
                                                            href="/home/privacy"
                                                            style={{
                                                                textDecoration: "none",
                                                                color: "#333",
                                                                display: "block",
                                                            }}
                                                        >
                                                            Privacy Policy
                                                        </a>
                                                    </li>
                                                    <li style={{ padding: "10px 20px" }}>
                                                        <a
                                                            href="/home/return"
                                                            style={{
                                                                textDecoration: "none",
                                                                color: "#333",
                                                                display: "block",
                                                            }}
                                                        >
                                                            Return Policy
                                                        </a>
                                                    </li>
                                                </ul>
                                            )}
                                        </li>

                                        <li
                                            id="menu-item-88"
                                            className="menu-item menu-item-type-post_type menu-item-object-page menu-item-88 item-level-0 menu-simple-dropdown wd-event-hover"
                                            style={{
                                                position: "relative",
                                                display: "inline-block",
                                                margin: "0 10px",
                                            }}
                                        >
                                            {/* Dropdown Toggle */}
                                            <a
                                                href="#"
                                                className="woodmart-nav-link"
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent default anchor behavior
                                                    shopDropdown();
                                                }}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "#333",
                                                    fontSize: "16px",
                                                    padding: "10px 15px",
                                                    background: "#f8f9fa",
                                                    borderRadius: "5px",
                                                    display: "inline-block",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <span className="nav-link-text">Shop</span>
                                            </a>

                                            {/* Dropdown Menu */}
                                            {isShopOpen && (
                                                <ul
                                                    className="dropdown-menu"
                                                    style={{
                                                        position: "absolute",
                                                        top: "100%",
                                                        left: "0",
                                                        background: "#fff",
                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                        borderRadius: "5px",
                                                        listStyleType: "none",
                                                        margin: "5px 0 0 0",
                                                        padding: "10px 0",
                                                        minWidth: "150px",
                                                        zIndex: 1000,
                                                    }}
                                                >
                                                    <li style={{ padding: "10px 20px" }}>
                                                        <a
                                                            href="/home/terms"
                                                            style={{
                                                                textDecoration: "none",
                                                                color: "#333",
                                                                display: "block",
                                                            }}
                                                        >
                                                            Bitdefender Antivirus
                                                        </a>
                                                    </li>
                                                    <li style={{ padding: "10px 20px" }}>
                                                        <a
                                                            href="/home/privacy"
                                                            style={{
                                                                textDecoration: "none",
                                                                color: "#333",
                                                                display: "block",
                                                            }}
                                                        >
                                                            Mcafee Antivirus
                                                        </a>
                                                    </li>
                                                    <li style={{ padding: "10px 20px" }}>
                                                        <a
                                                            href="/home/return"
                                                            style={{
                                                                textDecoration: "none",
                                                                color: "#333",
                                                                display: "block",
                                                            }}
                                                        >
                                                            Trend Micro
                                                        </a>
                                                    </li>
                                                    <li style={{ padding: "10px 20px" }}>
                                                        <a
                                                            href="/home/return"
                                                            style={{
                                                                textDecoration: "none",
                                                                color: "#333",
                                                                display: "block",
                                                            }}
                                                        >
                                                            Norton Antivirus
                                                        </a>
                                                    </li>
                                                </ul>
                                            )}
                                        </li>

                                        <li
                                            id="menu-item-89"
                                            className="menu-item menu-item-type-post_type menu-item-object-page menu-item-89 item-level-0 menu-simple-dropdown wd-event-hover"
                                        >
                                            <a
                                                href="/home/ourContact"
                                                className="woodmart-nav-link"
                                            >
                                                <span className="nav-link-text">Our Contacts</span>
                                            </a>
                                        </li>

                                        <li
                                            id="menu-item-91"
                                            className="menu-item menu-item-type-post_type menu-item-object-page menu-item-91 item-level-0 menu-simple-dropdown wd-event-hover"
                                        >
                                            <a
                                                href="/home/FAQ"
                                                className="woodmart-nav-link"
                                            >
                                                <span className="nav-link-text">FAQ</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="whb-column whb-col-right whb-visible-lg">
                                <div
                                    className="wd-header-nav wd-header-secondary-nav text-left"
                                    role="navigation"
                                    aria-label="Secondary navigation"
                                >
                                    
                                </div>
                                <div className="wd-header-my-account wd-tools-element wd-event-hover wd-design-7 wd-account-style-icon login-side-opener whb-7qrb5r43fmh57lkx4dry" onClick={openModal}>
                                    <a

                                        title="My account"
                                    >
                                        <span className="wd-tools-icon"></span>
                                        <span className="wd-tools-text">Login / Register </span>
                                    </a>
                                </div>
                                <div className="wd-header-compare wd-tools-element wd-style-icon wd-with-count wd-design-7 whb-efvne7ivyjilpk6crr69">
                                    <a

                                        title="Compare products"
                                    >
                                        <span className="wd-tools-icon">
                                            <span className="wd-tools-count">0</span>
                                        </span>
                                        <span className="wd-tools-text">Compare </span>
                                    </a>
                                </div>
                                <div
                                    className="wd-header-wishlist wd-tools-element wd-style-icon wd-with-count wd-design-7 whb-j9nqf397yrj3s8c855md"
                                    title="My Wishlist"
                                >
                                    <a
                                        href="/home/wishlist"
                                        title="Wishlist products"
                                    >
                                        <span className="wd-tools-icon">
                                            <span className="wd-tools-count">{wishlistCount}</span>
                                        </span>
                                        <span className="wd-tools-text">Wishlist </span>
                                    </a>
                                </div>
                                <div className="wd-header-cart wd-tools-element wd-design-7 cart-widget-opener wd-style-text whb-eyi35wj5v52my2hec8de" onClick={openCart}>
                                    <a

                                        title="Shopping cart"
                                    >
                                        <span className="wd-tools-icon">
                                            <span className="wd-cart-number wd-tools-count">
                                                {cartCount} <span>items</span>
                                            </span>
                                        </span>
                                        <span className="wd-tools-text">
                                            <span className="wd-cart-subtotal">
                                                <span className="woocommerce-Price-amount amount">
                                                    <bdi>
                                                        <span className="woocommerce-Price-currencySymbol">
                                                            $
                                                        </span>
                                                        0.00
                                                    </bdi>
                                                </span>
                                            </span>
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div className="whb-column whb-col-mobile whb-hidden-lg">
                                <div className="wd-search-form wd-header-search-form-mobile wd-display-form whb-kv1cizir1p1hjpwwydal">
                                    <form
                                        role="search"
                                        method="get"
                                        className="searchform  wd-style-with-bg-2 wd-cat-style-bordered woodmart-ajax-search"
                                        action="https://woodmart.xtemos.com/mega-electronics/"
                                        data-thumbnail={1}
                                        data-price={1}
                                        data-post_type="product"
                                        data-count={20}
                                        data-sku={0}
                                        data-symbols_count={3}
                                    >
                                        <input
                                            type="text"
                                            className="s"
                                            placeholder="Search for products"
                                            defaultValue=""
                                            name="s"
                                            aria-label="Search"
                                            title="Search for products"
                                            required=""
                                        />
                                        <input type="hidden" name="post_type" defaultValue="product" />
                                        <button type="submit" className="searchsubmit">
                                            <span>Search </span>
                                        </button>
                                    </form>
                                    <div className="search-results-wrapper">
                                        <div className="wd-dropdown-results wd-scroll wd-dropdown">
                                            <div className="wd-scroll-content" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {/* My-Account  Modal */}

        <SignIn
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            setIsModalOpen={setIsModalOpen}
        />

        {/* Cart Modal */}

        <div className={`cart-widget-side wd-side-hidden wd-right ${isCartOpen ? 'wd-opened' : ''}`}>
            <div className="wd-heading">
                <span className="title">Shopping cart</span>
                <div className="close-side-widget wd-action-btn wd-style-text wd-cross-icon">
                    <a rel="nofollow" onClick={closeCart}>
                        Close
                    </a>
                </div>
            </div>
            <div className="widget woocommerce widget_shopping_cart">
                <div className="widget_shopping_cart_content">
                    <div className="shopping-cart-widget-body wd-scroll">
                        <div className="wd-scroll-content">
                            <ul className="cart_list product_list_widget woocommerce-mini-cart ">
                                {cartItems.length > 0 ? (
                                    cartItems.map((item, index) => (
                                        <li key={index} className="woocommerce-mini-cart-item mini_cart_item">
                                            <a href={item.product_url} className="cart-item-link wd-fill">
                                                Show
                                            </a>
                                            <a
                                                href="#"
                                                className="remove remove_from_cart_button"
                                                aria-label={`Remove ${item.productName} from cart`}
                                                onClick={() => removeFromCart(item.productId)} // Implement remove functionality
                                            >
                                                ×
                                            </a>
                                            <a href={item.product_url} className="cart-item-image">
                                                {/* Safe access to image_urls, with fallback to placeholder */}
                                                <img
                                                    width={430}
                                                    height={491}
                                                    src={item.image_urls && item.image_urls.length > 0 ? item.image_urls[0] : 'https://via.placeholder.com/430x491?text=No+Image'}
                                                    className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                                                    alt={item.productName}
                                                    decoding="async"
                                                />
                                            </a>
                                            <div className="cart-info">
                                                <span className="wd-entities-title">{item.productName}</span>
                                                <div className="wd-product-detail wd-product-sku">
                                                    <span className="wd-label">SKU: </span>
                                                    <span>{item.productSku}</span>
                                                </div>
                                                <div className="quantity">
                                                    <input
                                                        type="button"
                                                        defaultValue="-"
                                                        className="minus btn"
                                                        onClick={() => changeQuantity(item.productId, item.quantity - 1)} // Implement quantity change
                                                    />
                                                    <label
                                                        className="screen-reader-text"
                                                        htmlFor={`quantity_${item.productId}`}
                                                    >
                                                        {item.productName} quantity
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id={`quantity_${item.productId}`}
                                                        className="input-text qty text"
                                                        value={item.quantity}
                                                        aria-label="Product quantity"
                                                        min={0}
                                                        onChange={(e) => changeQuantity(item.productId, parseInt(e.target.value))}
                                                    />
                                                    <input
                                                        type="button"
                                                        defaultValue="+"
                                                        className="plus btn"
                                                        onClick={() => changeQuantity(item.productId, item.quantity + 1)} // Implement quantity change
                                                    />
                                                </div>
                                                <span className="quantity">
                                                    {item.quantity} ×
                                                    <span className="woocommerce-Price-amount amount">
                                                        <bdi>
                                                            <span className="woocommerce-Price-currencySymbol">$</span>
                                                            {item.price * item.quantity}
                                                        </bdi>
                                                    </span>
                                                </span>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li>No items in your cart</li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="shopping-cart-widget-footer">
                        <p className="woocommerce-mini-cart__total total">
                            <strong>Subtotal:</strong>
                            <span className="woocommerce-Price-amount amount">
                                <bdi>
                                    <span className="woocommerce-Price-currencySymbol">$</span>
                                    5,445.00
                                </bdi>
                            </span>
                        </p>
                        <div className="wd-progress-bar wd-free-progress-bar">
                            <div className="progress-msg">
                                Your order qualifies for free shipping!
                            </div>
                            <div className="progress-area">
                                <div className="progress-bar" style={{ width: "100%" }} />
                            </div>
                        </div>
                        <p className="woocommerce-mini-cart__buttons buttons">
                            <a
                                href="#"
                                className="button btn-cart wc-forward"
                                onClick={handleViewCart}
                            >
                                View cart
                            </a>
                            <a
                                href="#"
                                className="button checkout wc-forward"
                                onClick={handleCheckout}
                            >
                                Checkout
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Mobile Menu Bar */}

        <div className={isMenuOpen ? "mobile-nav wd-side-hidden wd-side-hidden-nav wd-left wd-opener-arrow wd-opened" : "mobile-nav wd-side-hidden wd-side-hidden-nav wd-left wd-opener-arrow"}
        >

            <ul className="wd-nav wd-nav-mob-tab wd-style-underline wd-swap">
                {menuItems.map((item) => (
                    <li
                        key={item.id}
                        className={`mobile-tab-title mobile-${item.id}-title ${activeSection === item.id ? "wd-active" : ""
                            }`}
                        data-menu={item.id}
                    >
                        <a
                            // href={item.link}
                            rel="nofollow noopener"
                            onClick={(e) => {
                                e.preventDefault();
                                handleMenuClick(item.id);
                            }}
                        >
                            <span className="nav-link-text">{item.label}</span>
                        </a>
                    </li>
                ))}
            </ul>
            <ul
                id="menu-mobile-menu-mega-electronics"
                className={`mobile-pages-menu menu wd-nav wd-nav-mobile wd-layout-drilldown wd-drilldown-slide ${activeSection === "menu-mobile-menu-mega-electronics" ? "wd-active" : "wd-hidden"
                    }`}
            >
                <li
                    id="menu-item-112"
                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children menu-item-112 item-level-0"
                >
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/"
                        className="woodmart-nav-link"
                    >
                        <img
                            src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Laptops-Tablets-PC.svg"
                            title="Laptops, Tablets & PC"
                            loading="lazy"
                            className="wd-nav-img"
                            width={18}
                            height={18}
                        />
                        <span className="nav-link-text">Laptops, Tablets &amp; PCs</span>
                    </a>
                    <ul className="wd-sub-menu">
                        <li className="wd-drilldown-back">
                            <span className="wd-nav-opener" />
                            <a >Back </a>
                        </li>
                        <li
                            id="menu-item-4684"
                            className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children menu-item-4684 item-level-1"
                        >
                            <a
                                href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/laptops/"
                                className="woodmart-nav-link"
                            >
                                Laptops
                            </a>
                            <ul className="sub-sub-menu">
                                <li className="wd-drilldown-back">
                                    <span className="wd-nav-opener" />
                                    <a >Back </a>
                                </li>
                                <li
                                    id="menu-item-4685"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4685 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/laptops/apple-macbook/"
                                        className="woodmart-nav-link"
                                    >
                                        Apple MacBook
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4686"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4686 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/laptops/business-laptop/"
                                        className="woodmart-nav-link"
                                    >
                                        Business Laptop
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4687"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4687 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/laptops/gaming-laptop/"
                                        className="woodmart-nav-link"
                                    >
                                        Gaming Laptop
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4688"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4688 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/laptops/ultrabook/"
                                        className="woodmart-nav-link"
                                    >
                                        Ultrabook
                                    </a>
                                </li>
                            </ul>
                            <span className="wd-nav-opener" />
                        </li>
                        <li
                            id="menu-item-4689"
                            className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children menu-item-4689 item-level-1"
                        >
                            <a
                                href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/tablets/"
                                className="woodmart-nav-link"
                            >
                                Tablets
                            </a>
                            <ul className="sub-sub-menu">
                                <li className="wd-drilldown-back">
                                    <span className="wd-nav-opener" />
                                    <a >Back </a>
                                </li>
                                <li
                                    id="menu-item-4690"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4690 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/tablets/apple-ipad/"
                                        className="woodmart-nav-link"
                                    >
                                        Apple Ipad
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4691"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4691 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/tablets/android-tablets/"
                                        className="woodmart-nav-link"
                                    >
                                        Android Tablets
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4692"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4692 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/tablets/windows-tablets/"
                                        className="woodmart-nav-link"
                                    >
                                        Windows Tablets
                                    </a>
                                </li>
                            </ul>
                            <span className="wd-nav-opener" />
                        </li>
                        <li
                            id="menu-item-4693"
                            className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children menu-item-4693 item-level-1"
                        >
                            <a
                                href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/pcs/"
                                className="woodmart-nav-link"
                            >
                                PCs
                            </a>
                            <ul className="sub-sub-menu">
                                <li className="wd-drilldown-back">
                                    <span className="wd-nav-opener" />
                                    <a >Back </a>
                                </li>
                                <li
                                    id="menu-item-4694"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4694 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/pcs/gaming-pcs/"
                                        className="woodmart-nav-link"
                                    >
                                        Gaming PCs
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4695"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4695 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/pcs/office-pcs/"
                                        className="woodmart-nav-link"
                                    >
                                        Office PCs
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4696"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4696 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/pcs/all-in-one/"
                                        className="woodmart-nav-link"
                                    >
                                        All in one
                                    </a>
                                </li>
                            </ul>
                            <span className="wd-nav-opener" />
                        </li>
                    </ul>
                    <span className="wd-nav-opener" />
                </li>
                <li
                    id="menu-item-108"
                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children menu-item-108 item-level-0"
                >
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/product-category/computer-office/"
                        className="woodmart-nav-link"
                    >
                        <img
                            src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Computer-Office.svg"
                            title="Computer & Office"
                            loading="lazy"
                            className="wd-nav-img"
                            width={18}
                            height={18}
                        />
                        <span className="nav-link-text">Computer &amp; Office</span>
                    </a>
                    <ul className="wd-sub-menu">
                        <li className="wd-drilldown-back">
                            <span className="wd-nav-opener" />
                            <a >Back </a>
                        </li>
                        <li
                            id="menu-item-4697"
                            className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4697 item-level-1"
                        >
                            <a
                                href="https://woodmart.xtemos.com/mega-electronics/product-category/computer-office/monitors/"
                                className="woodmart-nav-link"
                            >
                                Monitors
                            </a>
                        </li>
                        <li
                            id="menu-item-4698"
                            className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4698 item-level-1"
                        >
                            <a
                                href="https://woodmart.xtemos.com/mega-electronics/product-category/computer-office/printers-scanners/"
                                className="woodmart-nav-link"
                            >
                                Printers &amp; Scanners
                            </a>
                        </li>
                        <li
                            id="menu-item-4699"
                            className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4699 item-level-1"
                        >
                            <a
                                href="https://woodmart.xtemos.com/mega-electronics/product-category/computer-office/input-devices/"
                                className="woodmart-nav-link"
                            >
                                Input Devices
                            </a>
                        </li>
                    </ul>
                    <span className="wd-nav-opener" />
                </li>
                <li
                    id="menu-item-110"
                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children menu-item-110 item-level-0"
                >
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/product-category/hardware-components/"
                        className="woodmart-nav-link"
                    >
                        <img
                            src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Hardware-Components.svg"
                            title="Hardware & Components"
                            loading="lazy"
                            className="wd-nav-img"
                            width={18}
                            height={18}
                        />
                        <span className="nav-link-text">Hardware &amp; Components</span>
                    </a>
                    <ul className="wd-sub-menu">
                        <li className="wd-drilldown-back">
                            <span className="wd-nav-opener" />
                            <a >Back </a>
                        </li>
                        <li
                            id="menu-item-4700"
                            className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4700 item-level-1"
                        >
                            <a
                                href="https://woodmart.xtemos.com/mega-electronics/product-category/hardware-components/pc-components/"
                                className="woodmart-nav-link"
                            >
                                PC Components
                            </a>
                        </li>
                        <li
                            id="menu-item-4701"
                            className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4701 item-level-1"
                        >
                            <a
                                href="https://woodmart.xtemos.com/mega-electronics/product-category/hardware-components/cooling/"
                                className="woodmart-nav-link"
                            >
                                Cooling
                            </a>
                        </li>
                        <li
                            id="menu-item-4702"
                            className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4702 item-level-1"
                        >
                            <a
                                href="https://woodmart.xtemos.com/mega-electronics/product-category/hardware-components/hardware-other/"
                                className="woodmart-nav-link"
                            >
                                Hardware &amp; Other
                            </a>
                        </li>
                    </ul>
                    <span className="wd-nav-opener" />
                </li>
                <li
                    id="menu-item-114"
                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-114 item-level-0"
                >
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/product-category/smartphones/"
                        className="woodmart-nav-link"
                    >
                        <img
                            src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Smartphones.svg"
                            title="Smartphones"
                            loading="lazy"
                            className="wd-nav-img"
                            width={18}
                            height={18}
                        />
                        <span className="nav-link-text">Smartphones</span>
                    </a>
                </li>
                <li
                    id="menu-item-109"
                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-109 item-level-0"
                >
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/product-category/games-entertainment/"
                        className="woodmart-nav-link"
                    >
                        <img
                            src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Smartphones.svg"
                            title="Smartphones"
                            loading="lazy"
                            className="wd-nav-img"
                            width={18}
                            height={18}
                        />
                        <span className="nav-link-text">Games &amp; Entertainment</span>
                    </a>
                </li>
                <li
                    id="menu-item-115"
                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-115 item-level-0"
                >
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/product-category/tv-hifi/"
                        className="woodmart-nav-link"
                    >
                        <img
                            src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/TV-HIFI.svg"
                            title="TV & HIFI"
                            loading="lazy"
                            className="wd-nav-img"
                            width={18}
                            height={18}
                        />
                        <span className="nav-link-text">TV &amp; Hi-Fi</span>
                    </a>
                </li>
                <li
                    id="menu-item-113"
                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-113 item-level-0"
                >
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/product-category/photo-video/"
                        className="woodmart-nav-link"
                    >
                        <img
                            src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Photo-Video.svg"
                            title="Photo & Video"
                            loading="lazy"
                            className="wd-nav-img"
                            width={18}
                            height={18}
                        />
                        <span className="nav-link-text">Photo &amp; Video</span>
                    </a>
                </li>
                <li
                    id="menu-item-111"
                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-111 item-level-0"
                >
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/product-category/home-appliance/"
                        className="woodmart-nav-link"
                    >
                        <img
                            src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Home-Appliance.svg"
                            title="Home Appliance"
                            loading="lazy"
                            className="wd-nav-img"
                            width={18}
                            height={18}
                        />
                        <span className="nav-link-text">Home Appliance</span>
                    </a>
                </li>
            </ul>
            <ul
                id="menu-mobile-categories-mega-electronics"
                className={`mobile-categories-menu menu wd-nav wd-nav-mobile wd-layout-drilldown wd-drilldown-slide ${activeSection === "menu-mobile-categories-mega-electronics" ? "wd-active" : "wd-hidden"
                    }`}
            >
                <li
                    id="menu-item-4628"
                    className="xtemos-show-demos menu-item menu-item-type-custom menu-item-object-custom menu-item-4628 item-level-0"
                >
                    <a className="woodmart-nav-link">
                        <span className="nav-link-text">Demos</span>
                    </a>
                </li>
                <li
                    id="menu-item-4623"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-4623 item-level-0"
                >
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/promotions/"
                        className="woodmart-nav-link"
                    >
                        <span className="nav-link-text">About Us</span>
                    </a>
                </li>
                <li
                    id="menu-item-4624"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-4624 item-level-0"
                >
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/stores/"
                        className="woodmart-nav-link"
                    >
                        <span className="nav-link-text">Stores</span>
                    </a>
                </li>
                <li
                    id="menu-item-4625"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-4625 item-level-0"
                >
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/our-contacts/"
                        className="woodmart-nav-link"
                    >
                        <span className="nav-link-text">Our Contacts</span>
                    </a>
                </li>
                <li
                    id="menu-item-112"
                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children menu-item-112 item-level-0"
                >
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/"
                        className="woodmart-nav-link"
                    >
                        {/* <img
                            src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Laptops-Tablets-PC.svg"
                            title="Laptops, Tablets & PC"
                            loading="lazy"
                            className="wd-nav-img"
                            width={18}
                            height={18}
                        /> */}
                        <span className="nav-link-text">Products</span>
                    </a>
                    <ul className="wd-sub-menu">
                        <li className="wd-drilldown-back">
                            <span className="wd-nav-opener" />
                            <a >Back </a>
                        </li>
                        <li
                            id="menu-item-4684"
                            className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children menu-item-4684 item-level-1"
                        >
                            <a
                                href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/laptops/"
                                className="woodmart-nav-link"
                            >
                                Laptops
                            </a>
                            <ul className="sub-sub-menu">
                                <li className="wd-drilldown-back">
                                    <span className="wd-nav-opener" />
                                    <a >Back </a>
                                </li>
                                <li
                                    id="menu-item-4685"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4685 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/laptops/apple-macbook/"
                                        className="woodmart-nav-link"
                                    >
                                        Apple MacBook
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4686"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4686 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/laptops/business-laptop/"
                                        className="woodmart-nav-link"
                                    >
                                        Business Laptop
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4687"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4687 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/laptops/gaming-laptop/"
                                        className="woodmart-nav-link"
                                    >
                                        Gaming Laptop
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4688"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4688 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/laptops/ultrabook/"
                                        className="woodmart-nav-link"
                                    >
                                        Ultrabook
                                    </a>
                                </li>
                            </ul>
                            <span className="wd-nav-opener" />
                        </li>
                        {/* <li
                            id="menu-item-4689"
                            className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children menu-item-4689 item-level-1"
                        >
                            <a
                                href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/tablets/"
                                className="woodmart-nav-link"
                            >
                                Tablets
                            </a>
                            <ul className="sub-sub-menu">
                                <li className="wd-drilldown-back">
                                    <span className="wd-nav-opener" />
                                    <a >Back </a>
                                </li>
                                <li
                                    id="menu-item-4690"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4690 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/tablets/apple-ipad/"
                                        className="woodmart-nav-link"
                                    >
                                        Apple Ipad
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4691"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4691 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/tablets/android-tablets/"
                                        className="woodmart-nav-link"
                                    >
                                        Android Tablets
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4692"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4692 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/tablets/windows-tablets/"
                                        className="woodmart-nav-link"
                                    >
                                        Windows Tablets
                                    </a>
                                </li>
                            </ul>
                            <span className="wd-nav-opener" />
                        </li>
                        <li
                            id="menu-item-4693"
                            className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children menu-item-4693 item-level-1"
                        >
                            <a
                                href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/pcs/"
                                className="woodmart-nav-link"
                            >
                                PCs
                            </a>
                            <ul className="sub-sub-menu">
                                <li className="wd-drilldown-back">
                                    <span className="wd-nav-opener" />
                                    <a >Back </a>
                                </li>
                                <li
                                    id="menu-item-4694"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4694 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/pcs/gaming-pcs/"
                                        className="woodmart-nav-link"
                                    >
                                        Gaming PCs
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4695"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4695 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/pcs/office-pcs/"
                                        className="woodmart-nav-link"
                                    >
                                        Office PCs
                                    </a>
                                </li>
                                <li
                                    id="menu-item-4696"
                                    className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-4696 item-level-2"
                                >
                                    <a
                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/pcs/all-in-one/"
                                        className="woodmart-nav-link"
                                    >
                                        All in one
                                    </a>
                                </li>
                            </ul>
                            <span className="wd-nav-opener" />
                        </li> */}
                    </ul>
                    <span className="wd-nav-opener" />
                </li>
                <li
                    id="menu-item-4627"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-4627 item-level-0"
                >
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/outlet/"
                        className="woodmart-nav-link"
                    >
                        <span className="nav-link-text">Outlet</span>
                    </a>
                </li>
                <li className="menu-item menu-item-wishlist wd-with-icon item-level-0">

                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/home/wishlist/"
                        className="woodmart-nav-link"
                    >
                        <span className="nav-link-text">Wishlist</span>
                    </a>
                </li>
                <li className="menu-item menu-item-compare wd-with-icon item-level-0">
                    <a
                        href="https://woodmart.xtemos.com/mega-electronics/compare/"
                        className="woodmart-nav-link"
                    >
                        Compare
                    </a>
                </li>
            </ul>
        </div>

        <div className={`wd-close-side wd-fill ${isCartOpen ? 'wd-close-side-opened' : ''}`} />
        <div className={`wd-close-side wd-fill ${isModalOpen ? 'wd-close-side-opened' : ''}`} />
        <div className={`wd-close-side wd-fill ${isMenuOpen ? 'wd-close-side-opened' : ''}`} onClick={closeMobileMenu} />

    </>
}

export default Navbar;