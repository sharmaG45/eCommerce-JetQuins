'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import SignIn from '../SignIn/page';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { fireStore, auth } from '../../_components/firebase/config';
import { signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import Cartwidget from '../Cart-widget/page';
import { CartContext } from "../CartContext/page";

const Navbar = () => {

    const menuItems = [
        { id: "menu-mobile-categories-mega-electronics", label: "Menu", link: "#" },
        { id: "menu-mobile-menu-mega-electronics", label: "Categories", link: "#" },
    ];

    const products = [
        {
            id: 1,
            name: "Bitdefender Antivirus",
            url: "/home/productCategory?title=Bitdefender" // Assuming the product URL for Bitdefender
        },
        {
            id: 2,
            name: "McAfee Antivirus",
            url: "/home/productCategory?title=McAfee" // Assuming the product URL for McAfee
        },
        {
            id: 3,
            name: "Trend Micro",
            url: "/home/productCategory?title=Trend Micro" // Assuming the product URL for Trend Micro
        },
        {
            id: 4,
            name: "Norton Antivirus",
            url: "/home/productCategory?title=Norton" // Assuming the product URL for Norton

        },
        {
            id: 5,
            name: "Webroot Antivirus",
            url: "/home/productCategory?title=Webroot" // Assuming the product URL for Norton
        }
    ];

    const productItems = [
        {
            id: 1,
            name: "Bitdefender Antivirus",
            imgAlt: "Bitdefender",
            imgSrc: "https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Laptops-Tablets-PC.svg",
            url: "/home/productCategory?title=Bitdefender" // Assuming the product URL for Bitdefender
        },
        {
            id: 2,
            name: "McAfee Antivirus",
            imgAlt: "McAfee",
            imgSrc: "https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Hardware-Components.svg",
            url: "/home/productCategory?title=McAfee" // Assuming the product URL for McAfee
        },
        {
            id: 3,
            name: "Trend Micro",
            imgAlt: "Trend Micro",
            imgSrc: "https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/TV-HIFI.svg",
            url: "/home/productCategory?title=Trend Micro" // Assuming the product URL for Trend Micro
        },
        {
            id: 4,
            name: "Norton Antivirus",
            imgAlt: "Norton",
            imgSrc: "https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Computer-Office.svg",
            url: "/home/productCategory?title=Norton" // Assuming the product URL for Norton

        },
        {
            id: 5,
            name: "Webroot Antivirus",
            imgAlt: "",
            imgSrc: "https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Smartphones.svg",
            url: "/home/productCategory?title=Webroot" // Assuming the product URL for Norton
        },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isShopOpen, setShopOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(menuItems[0]?.id);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0.0);
    const [bestOffer, setBestOffer] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { data, dispatch } = useContext(CartContext);
    const router = useRouter();

    // console.log(cartItems, "Carts Items");

    useEffect(() => {

        const userData = localStorage.getItem('currentUser');
        const user = JSON.parse(userData);
        if (user) {
            setIsUserLoggedIn(true); // true or false based on your logic
        }
        setUser(user);
    }, []);

    const handleSignOut = (e) => {
        e.preventDefault();
        signOut(auth)
            .then(() => {
                // Remove user session info from sessionStorage
                localStorage.removeItem("currentUser");
                setIsUserLoggedIn(false);

                // Show success toast message
                toast.success("You have successfully signed out.");
            })
            .catch((error) => {
                // Show error message if sign-out fails
                console.error("Sign-out error: ", error);
                toast.error("An error occurred while signing out. Please try again.");
            });
    }

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

    // Function to open the My Account Mobile View
    const openMobileModal = (e) => {
        e.preventDefault();
        router.push('/myAccount');
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

    // Funstion to open Sidebar
    const handleSidebar = (e) => {

    }

    const handleMenuClick = (id) => {
        setActiveSection((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = localStorage.getItem("currentUser");

                if (storedUser) {

                    const user = JSON.parse(storedUser);
                    if (!user || !user.uid) {
                        console.log("Invalid user data.");
                        return;
                    }

                    const userRef = doc(fireStore, "users", user.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();


                        setWishlistCount(userData.wishlist?.length || 0);

                        const cartItems = userData.cart || [];
                        setCartCount(cartItems.length);
                        setCartTotal(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
                        dispatch({ type: "Update", payload: cartItems });
                    }
                } else {
                    // 🔹 User is NOT logged in - Fetch from localStorage
                    console.log("User not logged in. Fetching from localStorage...");

                    // Get wishlist from localStorage
                    const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
                    setWishlistCount(localWishlist.length);

                    setCartCount(data.length);
                    setCartTotal(data.reduce((acc, item) => acc + item.price * item.quantity, 0));
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [data]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsRef = collection(fireStore, "create_Product");
                const querySnapshot = await getDocs(productsRef);

                const products = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                console.log("Firestore products:", products);
                setBestOffer(products); // Store products in state
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []); // Runs only once

    // Filter products whenever `searchQuery` changes
    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = bestOffer.filter((product) =>
                product.productData.productInfo.productName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setFilteredProducts([]);
            setShowSuggestions(false);
        }
    }, [searchQuery, bestOffer]);

    const handleProductClick = (productUrl) => {
        router.push(`${productUrl}`)
        setShopOpen(false);
    }

    // Handle form submit (Search button click)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/home/productCategory?title=${encodeURIComponent(searchQuery)}`);
        }
        setShowSuggestions(false);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        router.push("/home/wishlist");
    }

    const handleProductDetails = (brandDetails, e) => {
        e.preventDefault();
        router.push(`/home/productDetails?brand=${brandDetails}`);
        setShowSuggestions(false);
    }

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
                                            src="/assets/Images/Logo-3.png"
                                            className="attachment-full size-full"
                                            alt=""
                                            style={{ maxWidth: 200 }}
                                            decoding="async"
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className="whb-column whb-col-center whb-visible-lg">
                                <div className="whb-space-element " style={{ width: "20px" }} />
                                <div className="wd-search-form wd-header-search-form wd-display-form whb-1yjd6g8pvqgh79uo6oce">
                                    <form
                                        role="search"
                                        className="searchform wd-style-with-bg-2 wd-cat-style-default woodmart-ajax-search"
                                        onSubmit={handleSubmit}
                                    >
                                        <input
                                            type="text"
                                            className="s"
                                            placeholder="Search for products"
                                            value={searchQuery}
                                            onChange={(event) => setSearchQuery(event.target.value)}
                                            name="s"
                                            aria-label="Search"
                                            title="Search for products"
                                            required
                                        />
                                        <input type="hidden" name="post_type" value="product" />
                                        <span className="wd-clear-search" />

                                        <button type="submit" className="searchsubmit">
                                            <span>Search</span>
                                        </button>
                                    </form>

                                    {showSuggestions && (
                                        <div className="search-results-wrapper">
                                            <div className={`wd-dropdown-results wd-scroll wd-dropdown ${showSuggestions ? 'wd-opened' : ''}`}>
                                                <div className="wd-scroll-content">
                                                    <div className="autocomplete-suggestions">
                                                        {filteredProducts.map((product, index) => (
                                                            <div className="autocomplete-suggestion" key={index} onClick={(e) => handleProductDetails(product.productData.productInfo.productName, e)} // Add the click handler
                                                                style={{ cursor: "pointer" }}>
                                                                <div className="suggestion-thumb">
                                                                    <img
                                                                        width={430}
                                                                        height={491}
                                                                        src={product.productData.productImages[0]}
                                                                        className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                                                                        alt={product.productData.productInfo.productName}
                                                                        decoding="async"
                                                                        loading="lazy"
                                                                        srcSet={product.productData.productImages[0]}
                                                                        sizes="auto, (max-width: 430px) 100vw, 430px"
                                                                    />

                                                                </div>
                                                                <div className="suggestion-content wd-set-mb reset-last-child">
                                                                    <h4 className="wd-entities-title">{product.productData.productInfo.productName}</h4>
                                                                    <p className="price">
                                                                        <span className="woocommerce-Price-amount amount">
                                                                            <bdi>
                                                                                <span className="woocommerce-Price-currencySymbol">$</span>{product.productData.priceInfo.costPrice}
                                                                            </bdi>
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
                                            <a className="info-box-inner reset-last-child" href="tel:+1(888) 267-5955">
                                                <h6 style={{ marginBottom: 0, fontSize: 14 }}>
                                                    24 Support
                                                </h6>
                                                <p>
                                                    <span style={{ color: "#1c61e7", fontSize: 14 }}>
                                                        +1 (805) 507-0321
                                                    </span>
                                                </p>
                                            </a>
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
                                        href="/home"
                                        className="wd-logo wd-main-logo"
                                        rel="home"
                                        aria-label="Site logo"
                                    >
                                        <img
                                            src="/assets/Images/Logo-3.png"
                                            className="attachment-full size-full"
                                            alt=""

                                            decoding="async"
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className="whb-column whb-mobile-right whb-hidden-lg">
                                <div className="wd-header-my-account wd-tools-element wd-event-hover wd-design-1 wd-account-style-icon login-side-opener whb-hehq7b9i6crxiw1rjzt3" onClick={(e) => openMobileModal(e)} style={{ cursor: "pointer" }}>
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
                            <div className="whb-column whb-col-left whb-visible-lg" onClick={(e) => handleSidebar(e)}>
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
                                                href="/home/AboutUs"

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
                                                    setShopOpen(false);
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
                                                        minWidth: "200px",
                                                        zIndex: 1000,
                                                    }}
                                                >
                                                    <li style={{ padding: "10px 20px" }}>
                                                        <a
                                                            href="/home/terms-and-policy"
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
                                                            href="/home/privacy-policy"
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
                                                            href="/home/refund-and-cancellation"
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
                                                    setIsOpen(false);
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
                                                        minWidth: "200px",
                                                        zIndex: 1000,
                                                    }}
                                                >
                                                    {products.map((product) => (
                                                        <li key={product.id} style={{ padding: "10px 20px" }}>
                                                            <a
                                                                href="#"
                                                                style={{
                                                                    textDecoration: "none",
                                                                    color: "#333",
                                                                    display: "block",
                                                                }}
                                                                onClick={(e) => {
                                                                    e.preventDefault(); // Prevent default link behavior
                                                                    handleProductClick(product.url); // Redirect to the product URL
                                                                }}
                                                            >
                                                                {product.name}
                                                            </a>
                                                        </li>
                                                    ))}
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
                                <div className="wd-header-my-account wd-tools-element wd-event-hover wd-design-7 wd-account-style-icon whb-7qrb5r43fmh57lkx4dry">
                                    {isUserLoggedIn ? (
                                        <>
                                            <a href="/">
                                                <span className="wd-tools-icon"></span>
                                                <span className="wd-tools-text">My Account</span>
                                            </a>
                                            <div className="wd-dropdown wd-dropdown-menu wd-dropdown-my-account wd-design-default">
                                                <ul className="wd-sub-menu">
                                                    <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--dashboard is-active">
                                                        <a href="/myAccount">
                                                            <span>Dashboard</span>
                                                        </a>
                                                    </li>
                                                    <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--orders">
                                                        <a href="/">
                                                            <span>Orders</span>
                                                        </a>
                                                    </li>
                                                    <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--downloads">
                                                        <a href="/">
                                                            <span>Downloads</span>
                                                        </a>
                                                    </li>
                                                    <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--edit-address">
                                                        <a href="/">
                                                            <span>Addresses</span>
                                                        </a>
                                                    </li>
                                                    <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--edit-account">
                                                        <a href="/">
                                                            <span>Account details</span>
                                                        </a>
                                                    </li>
                                                    <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--wishlist">
                                                        <a href="/home/wishlist">
                                                            <span>Wishlist</span>
                                                        </a>
                                                    </li>
                                                    <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--customer-logout">
                                                        <a href='/' onClick={(e) => handleSignOut(e)}>
                                                            <span>Logout</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="wd-header-my-account wd-tools-element wd-event-hover wd-design-7 wd-account-style-icon login-side-opener whb-7qrb5r43fmh57lkx4dry" onClick={openModal}>
                                            <a title="My account" style={{ cursor: "pointer" }}>
                                                <span className="wd-tools-icon"></span>
                                                <span className="wd-tools-text">Login / Register</span>
                                            </a>
                                        </div>
                                    )}
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
                                        href="#"
                                        onClick={(e) => { handleWishlist(e) }}
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
                                        style={{ cursor: "pointer" }}
                                    >
                                        <span className="wd-tools-icon">
                                            <span className="wd-cart-number wd-tools-count" >
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
                                        className="searchform wd-style-with-bg-2 wd-cat-style-default woodmart-ajax-search"
                                        onSubmit={handleSubmit}
                                    >
                                        <input
                                            type="text"
                                            className="s"
                                            placeholder="Search for products"
                                            value={searchQuery}
                                            onChange={(event) => setSearchQuery(event.target.value)}
                                            name="s"
                                            aria-label="Search"
                                            title="Search for products"
                                            required
                                        />
                                        <input type="hidden" name="post_type" value="product" />
                                        <span className="wd-clear-search" />

                                        <button type="submit" className="searchsubmit">
                                            <span>Search</span>
                                        </button>
                                    </form>

                                    {showSuggestions && (
                                        <div className="search-results-wrapper">
                                            <div className={`wd-dropdown-results wd-scroll wd-dropdown ${showSuggestions ? 'wd-opened' : ''}`}>
                                                <div className="wd-scroll-content">
                                                    <div className="autocomplete-suggestions">
                                                        {filteredProducts.map((product, index) => (
                                                            <div className="autocomplete-suggestion" key={index} onClick={(e) => handleProductDetails(product.productData.productInfo.productName, e)} // Add the click handler
                                                                style={{ cursor: "pointer" }}>
                                                                <div className="suggestion-thumb">
                                                                    <img
                                                                        width={430}
                                                                        height={491}
                                                                        src={product.productData.productImages[0]}
                                                                        className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                                                                        alt={product.productData.productInfo.productName}
                                                                        decoding="async"
                                                                        loading="lazy"
                                                                    />
                                                                </div>
                                                                <div className="suggestion-content wd-set-mb reset-last-child">
                                                                    <h4 className="wd-entities-title">{product.productData.productInfo.productName}</h4>
                                                                    <p className="price">
                                                                        <span className="woocommerce-Price-amount amount">
                                                                            <bdi>
                                                                                <span className="woocommerce-Price-currencySymbol">$</span>{product.productData.priceInfo.costPrice}
                                                                            </bdi>
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {/* Mobile view Bottom*/}

        <div className="wd-toolbar wd-toolbar-label-show">
            <div className="wd-header-mobile-nav whb-wd-header-mobile-nav mobile-style-icon wd-tools-element">
                <a href="#" onClick={(e) => openMobileMenu(e)}>
                    <span className="wd-tools-icon" />
                    <span className="wd-toolbar-label">Menu </span>
                </a>
            </div>
            <div
                className="wd-header-wishlist wd-tools-element wd-design-5"
                title="My wishlist"
            >
                <a href="#" onClick={(e) => handleWishlist(e)}>
                    <span className="wd-tools-icon">
                        <span className="wd-tools-count">{wishlistCount}</span>
                    </span>
                    <span className="wd-toolbar-label">Wishlist </span>
                </a>
            </div>
            <div
                className="wd-header-cart wd-tools-element wd-design-5 cart-widget-opener"
                title="My cart"
            >
                <a onClick={(e) => openCart(e)} style={{ cursor: "pointer" }}>
                    <span className="wd-tools-icon">
                        <span className="wd-cart-number wd-tools-count">
                            {cartCount} <span>items</span>
                        </span>
                    </span>
                    <span className="wd-toolbar-label">Cart </span>
                </a>
            </div>
            <div className="wd-header-my-account wd-tools-element wd-style-icon  login-side-opener">
                <a onClick={(e) => openModal(e)} style={{ cursor: "pointer" }}>
                    <span className="wd-tools-icon" />
                    <span className="wd-toolbar-label">My account </span>
                </a>
            </div>
        </div>

        {/* My-Account  Modal */}
        <SignIn
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            setIsModalOpen={setIsModalOpen}
        />

        {/* Cart Modal */}

        <Cartwidget isCartOpen={isCartOpen} closeCart={closeCart} setIsCartOpen={setIsCartOpen} />

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
                {productItems.map((item) => (
                    <li
                        key={item.id}
                        className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children item-level-0"
                    >
                        <a className="woodmart-nav-link" onClick={() => { handleProductClick(item.url) }}>
                            <img
                                src={item.image}
                                title={item.title}
                                loading="lazy"
                                className="wd-nav-img"
                                width={18}
                                height={18}
                                alt={item.title}
                            />
                            <span className="nav-link-text">{item.name}</span>
                        </a>
                    </li>
                ))}

            </ul>
            <ul
                id="menu-mobile-categories-mega-electronics"
                className={`mobile-categories-menu menu wd-nav wd-nav-mobile wd-layout-drilldown wd-drilldown-slide ${activeSection === "menu-mobile-categories-mega-electronics" ? "wd-active" : "wd-hidden"
                    }`}
            >

                <li
                    id="menu-item-4623"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-4623 item-level-0"
                >
                    <a
                        href="/home/AboutUs"
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
                        href="/home/privacy-policy"
                        className="woodmart-nav-link"
                    >
                        <span className="nav-link-text">Privacy & Policy</span>
                    </a>
                </li>
                <li
                    id="menu-item-4624"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-4624 item-level-0"
                >
                    <a
                        href="/home/terms-and-policy"
                        className="woodmart-nav-link"
                    >
                        <span className="nav-link-text">Terms & Conditions</span>
                    </a>
                </li>
                <li
                    id="menu-item-4624"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-4624 item-level-0"
                >
                    <a
                        href="/home/refund-and-cancellation"
                        className="woodmart-nav-link"
                    >
                        <span className="nav-link-text">Refund & cancellation</span>
                    </a>
                </li>
                <li
                    id="menu-item-4625"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-4625 item-level-0"
                >
                    <a
                        href="/home/ourContact"
                        className="woodmart-nav-link"
                    >
                        <span className="nav-link-text">Our Contacts</span>
                    </a>
                </li>

                <li className="menu-item menu-item-wishlist wd-with-icon item-level-0">

                    <a
                        href="#"
                        onClick={(e) => handleWishlist(e)}
                        className="woodmart-nav-link"
                    >
                        <span className="nav-link-text">Wishlist</span>
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