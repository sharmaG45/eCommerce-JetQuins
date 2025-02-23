'use client'

import React, { useState, useRef, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { fireStore } from "@/app/_components/firebase/config";
import styles from './Slider.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { doc, getDoc, updateDoc, getDocs, collection, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import Cartwidget from "../_components/Cart-widget/page";
import { CartContext } from "../_components/CartContext/page";

const HomePage = () => {

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isReadMore, setIsReadMore] = useState(false);
    const [isMore, setIsMore] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const router = useRouter();
    const sliderRef = useRef(null);

    const [products, setProducts] = useState([]);
    const { data, dispatch } = useContext(CartContext);


    const [categories, setCategories] = useState([]);

    // Fetch product counts from Firestore
    const fetchCategories = async () => {
        try {
            const categoryList = [
                {
                    "id": 1,
                    "title": "Bitdefender",
                    "image": "https://i5.walmartimages.com/seo/Bitdefender-Total-Security-5-Device-1-Yr-Digital_1a407fd8-9970-4ffb-bf56-d2f8b8963db3.ada7a9d6fd2f67ec79882d3318055244.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",

                },
                {
                    "id": 3,
                    "title": "Norton",
                    "image": "https://i5.walmartimages.com/seo/Norton-360-Deluxe-2024-5-Devices-1-Year-with-Auto-Renewal-Key-Card_16dd5627-b7e3-4a9a-bb10-709971d7d5c5.929fd473fef625a2ecb2092be61131b8.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",

                },
                {
                    "id": 4,
                    "title": "McAfee",
                    "image": "https://i5.walmartimages.com/seo/McAfee-Total-Protection-1-Year-3-Device-Windows-Mac-OS-Android-iOS_70e71e2b-8db1-4a9a-85e2-ce28fe7618cf.5c2db64fe8db3d923858f3818e74baf3.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",

                },
                {
                    "id": 5,
                    "title": "Webroot",
                    "image": "https://i5.walmartimages.com/seo/Webroot-Antivirus-Software-for-3-Devices-1-Year-Subscription-Windows-MacOS-Digital-Download_df6e22e9-5d09-42ff-8fb8-1507135f0499.d5ed9e35406fb9d744d561acb19cb71b.png?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",

                },
                {
                    "id": 6,
                    "title": "Avast",
                    "image": "https://m.media-amazon.com/images/I/61NeJOKAuHL._SX679_.jpg",

                },
                {
                    "id": 7,
                    "title": "Trend Micro",
                    "image": "https://i5.walmartimages.com/seo/Trend-Micro-Maximum-Security-5-Users-1-year-subscription-Digital-Download_33e1cc2f-de35-4408-bc30-7ac26e1cd9ff.3c6f62692c3c439ef3fd35f69f1ca7a8.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF",

                },
                {
                    "id": 8,
                    "title": "AVG",
                    "image": "https://i5.walmartimages.com/seo/AVG-Internet-Security-2-Year-3-Devices-Windows_4f294575-37f4-49b8-b1f7-ee461065f99c.d012a07562f963bf202f5e6a02fac810.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",

                }
            ];

            const updatedCategories = await Promise.all(
                categoryList.map(async (category) => {
                    const q = query(
                        collection(fireStore, 'create_Product'),
                        where('productData.attribute.Brands', '==', category.title)
                    );
                    const querySnapshot = await getDocs(q);
                    return {
                        ...category,
                        productsCount: querySnapshot.size,
                        link: `/home/productCategory?title=${encodeURIComponent(category.title)}`// Added dynamic category link
                    };
                })
            );

            setCategories(updatedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);


    const handleAddToWishlist = async (e, offer) => {
        e.preventDefault(); // Prevent default behavior

        // Get user data from localStorage
        const user = JSON.parse(localStorage.getItem("currentUser"));

        // Fallback data for missing fields
        const staticData = {
            product_url: "/",
            image_url: "https://via.placeholder.com/2000x2000?text=No+Image",
            brand: "Unknown Brand",
            productId: "00000",
            productName: "Default Product",
            productSku: "DEFAULTSKU",
            price: 0.0,
            discount: 0,
            quantity: 1,
            rating: 0,
            description: "No description available.",
            how_product_works: "Not available.",
            other_details: {
                compatibility: "Unknown",
                free_trial: "Not available",
                subscription_model: "Not specified"
            },
            faq: []
        };

        // Merge offer data with fallback values
        const offerData = {
            product_url: offer.product_url || staticData.product_url,
            image_url: offer.productData.productImages[0] || staticData.image_url,
            brand: offer.productData.attribute.Brands || staticData.brand,
            productId: offer.id || staticData.productId,
            productName: offer.productData.productInfo.productName || staticData.productName,
            productSku: offer.id || staticData.productSku,
            price: offer.productData.priceInfo.Price || staticData.price,
            discount: offer.productData.priceInfo.discount_Price || staticData.discount,
            quantity: 1, // Always adding 1 item initially
            rating: offer.productData.productInfo.rating || staticData.rating,
            description: offer.description || staticData.description,
            how_product_works: offer.how_product_works || staticData.how_product_works,
            other_details: offer.other_details || staticData.other_details,
            faq: offer.faq || staticData.faq
        };

        console.log("Final Offer Data:", offerData);


        if (!user || !user.uid) {
            console.log("No user logged in. Saving to guest wishlist.");

            const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

            // Check if product already exists
            if (guestWishlist.some(item => item.productId === offerData.productId)) {
                toast.success("Product is already in your wishlist!");
                return;
            }

            // Add to guest wishlist
            guestWishlist.push({ ...offerData, timestamp: new Date() });
            localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));

            toast.success("Product added to your wishlist!");
            return;
        }

        try {
            const userId = user.uid;
            const userRef = doc(fireStore, "users", userId);

            // Fetch only the wishlist from Firestore
            const userDoc = await getDoc(userRef);
            let userWishlist = userDoc.exists() ? userDoc.data().wishlist || [] : [];

            // Check if product exists
            if (userWishlist.some(item => item.productId === offerData.productId)) {
                toast.success("Product is already in your wishlist!");
                return;
            }

            // Add new product to wishlist
            userWishlist.push({
                product_url: offerData.product_url,
                image_url: offerData.image_url,
                brand: offerData.brand,
                productId: offerData.productId,
                productName: offerData.productName,
                productSku: offerData.productSku,
                price: offerData.price,
                discount: offerData.discount,
                timestamp: new Date()
            });

            // Update Firestore
            await updateDoc(userRef, { wishlist: userWishlist });

            console.log("Wishlist updated for user:", userId);
            toast.success("Product added to your wishlist!");

        } catch (error) {
            console.error("Error adding product to wishlist:", error);
            toast.error("Error adding product to wishlist.");
        }
    };

    const handleCategoryClick = (category) => {
        const router = useRouter();
        router.push(`/home/productCategory?title=${encodeURIComponent(category.title)}`);
    };

    const handleProductDetails = (brandDetails) => {
        router.push(`/home/productDetails?brand=${brandDetails}`);
    }

    // Function to open the Cart Modal

    const openCart = async (e, offer) => {
        e.preventDefault(); // Prevent default behavior

        const user = JSON.parse(localStorage.getItem("currentUser"));

        console.log("Offer:", offer.productData);

        // Fallback data for missing fields
        const staticData = {
            product_url: "/",
            image_url: "https://via.placeholder.com/2000x2000?text=No+Image",
            brand: "Unknown Brand",
            productId: "00000",
            productName: "Default Product",
            productSku: "DEFAULTSKU",
            price: 0.0,
            discount: 0,
            quantity: 1,
            rating: 0,
            description: "No description available.",
            how_product_works: "Not available.",
            other_details: {
                compatibility: "Unknown",
                free_trial: "Not available",
                subscription_model: "Not specified"
            },
            faq: []
        };

        // Merge offer data with fallback values
        const offerData = {
            product_url: offer.product_url || staticData.product_url,
            image_url: offer.productData.productImages[0] || staticData.image_url,
            brand: offer.productData.attribute.Brands || staticData.brand,
            productId: offer.id || staticData.productId,
            productName: offer.productData.productInfo.productName || staticData.productName,
            productSku: offer.id || staticData.productSku,
            price: offer.productData.priceInfo.Price || staticData.price,
            discount: offer.productData.priceInfo.discount_Price || staticData.discount,
            quantity: 1, // Always adding 1 item initially
            rating: offer.productData.productInfo.rating || staticData.rating,
            description: offer.description || staticData.description,
            how_product_works: offer.how_product_works || staticData.how_product_works,
            other_details: offer.other_details || staticData.other_details,
            faq: offer.faq || staticData.faq
        };

        console.log("Final Offer Data:", offerData);

        if (!user || !user.uid) {
            console.log("User not logged in. Saving to guest cart.");

            // Get guest cart from Context
            let guestCart = [...data]; // Use existing context state

            // Check if product already exists
            const existingIndex = guestCart.findIndex(item => item.productId === offerData.productId);

            if (existingIndex !== -1) {
                // If exists, update quantity
                guestCart[existingIndex] = {
                    ...guestCart[existingIndex],
                    quantity: guestCart[existingIndex].quantity + 1
                };
                toast.success("Product quantity updated in your cart!");
            } else {
                // Add new product to the cart
                guestCart.push({ ...offerData });
                toast.success("Product added to your cart!");
            }

            // Dispatch updated cart state
            dispatch({ type: "Update", payload: guestCart });

            setIsCartOpen(true); // Open the cart
            return;
        }

        // Handle logged-in users (Firestore integration)
        try {
            const userRef = doc(fireStore, "users", user.uid);

            // Fetch existing cart data from Firestore
            const userDoc = await getDoc(userRef);
            let userCart = userDoc.exists() ? userDoc.data().cart || [] : [];

            // Check if product exists in Firestore cart
            const existingIndex = userCart.findIndex(item => item.productId === offerData.productId);

            if (existingIndex !== -1) {
                // If exists, update quantity
                userCart[existingIndex] = {
                    ...userCart[existingIndex],
                    quantity: userCart[existingIndex].quantity + 1
                };
                toast.success("Product quantity updated in your cart!");
            } else {
                // Add new product
                userCart.push({ ...offerData });
                toast.success("Product added to your cart!");
            }

            // Update Firestore cart
            await updateDoc(userRef, { cart: userCart });

            // Dispatch updated cart state
            dispatch({ type: "Update", payload: userCart });

            console.log("Cart updated for user:", user.uid);
            setIsCartOpen(true); // Open the cart
        } catch (error) {
            console.error("Error adding product to cart:", error);
            toast.error("Error adding product to cart.");
        }
    };

    const closeCart = () => {
        setIsCartOpen(false);
    };

    useEffect(() => {
        // Fetch the current user's cart items
        const fetchCart = async () => {
            try {
                // Get user data from localStorage
                const userData = localStorage.getItem("currentUser");

                // If no user data, exit early
                if (!userData) {
                    console.log("No user logged in. Skipping cart fetch.");
                    return;
                }

                const user = JSON.parse(userData);

                // Validate user object
                if (!user || !user.uid) {
                    console.error("Invalid user data.");
                    return;
                }

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

    // Slider
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 20000,
        adaptiveHeight: true,
        arrows: false,
    };

    const goToNext = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    const goToPrev = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    const PRODUCTS_PER_PAGE = 5;
    const PRODUCTS_PER_PAGE2 = 4;
    const PRODUCTS_PER_PAGE3 = 5;
    const [visibleProducts, setVisibleProducts] = useState(PRODUCTS_PER_PAGE);
    const [visibleProducts2, setVisibleProducts2] = useState(PRODUCTS_PER_PAGE2);
    const [visibleProducts3, setVisibleProducts3] = useState(PRODUCTS_PER_PAGE3);

    const handleShowMore = () => {
        // Show the next batch of products
        setVisibleProducts((prev) => prev + PRODUCTS_PER_PAGE);
    };

    const handleShowMore2 = () => {
        // Show the next batch of products
        setVisibleProducts2((prev) => prev + PRODUCTS_PER_PAGE2);
    };

    const handleShowMore3 = () => {
        // Show the next batch of products
        setVisibleProducts3((prev) => prev + PRODUCTS_PER_PAGE3);
    };

    const bestOffers = products.slice(0, visibleProducts);
    const bestOffers2 = products.slice(0, visibleProducts2);
    const bestOffers3 = products.slice(0, visibleProducts3);

    const handleReadMore = () => {
        setIsReadMore(!isReadMore);
    }

    const handleMore = () => {
        setIsMore(!isMore);
    }

    useEffect(() => {
        // Create a function to fetch data
        const fetchProducts = async () => {
            try {
                // Reference to the 'createProduct' collection
                const productsRef = collection(fireStore, "create_Product");
                const querySnapshot = await getDocs(productsRef);

                // Map through the documents and return the data
                const products = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                console.log("Fetched Products: ", products);
                // localStorage.setItem('product', JSON.stringify(products));
                setProducts(products);
            } catch (error) {
                console.error("Error fetching products: ", error);
            }
        };

        // Call the async function
        fetchProducts();
    }, []);

    return (
        <>
            <div className="wd-page-content main-page-wrapper">
                <main
                    className="wd-content-layout content-layout-wrapper container"
                    role="main"
                >
                    <div className="wd-content-area site-content">
                        <article
                            id="post-15"
                            className="entry-content post-15 page type-page status-publish has-post-thumbnail hentry"
                        >
                            <div className="wpb-content-wrapper">
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1668613203662 wd-rs-63750447ba1c2">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-12 vc_col-md-12 wd-rs-637503f5909fc">
                                        <div className="vc_column-inner vc_custom_1668613113545">
                                            <div className="wpb_wrapper">

                                                <div className={styles.sliderContainer}>
                                                    <Slider ref={sliderRef} {...sliderSettings}>

                                                        {/* Slide-1 */}
                                                        <div
                                                            className={styles.slide}
                                                            style={{ width: "100%" }}

                                                        >
                                                            {/* Optionally, uncomment this image element for an image fallback */}
                                                            {/* <img src="/assets/Images/backgound-1.jpg" alt="image loaded" /> */}

                                                            <div style={{
                                                                backgroundImage: "url('/assets/Images/backgound-1.jpg')", // Ensure path is correct
                                                                backgroundSize: "cover",
                                                                backgroundPosition: "center",
                                                                minHeight: "400px",
                                                                width: "100%",
                                                                height: "460px",
                                                                objectfit: "contain",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "#fff",
                                                                fontSize: "24px",
                                                                fontWeight: "bold",
                                                                width: "100%"
                                                            }} className={styles.content}>
                                                                <h4 className={styles.title}>Norton Antivirus Shopping</h4>
                                                                <p className={styles.description}>
                                                                    Shop great deals on Deluxe,Platinum,AntiVirus Plus and more.
                                                                </p>
                                                                <a href="/" className={styles.button} target="_blank" rel="noopener noreferrer" onClick={() => handleCategoryClick(Norton)}>
                                                                    Shop Now
                                                                </a>
                                                            </div>
                                                        </div>

                                                        {/* Slide-2 */}
                                                        <div
                                                            className={styles.slide}
                                                            style={{ width: "100%" }}

                                                        >
                                                            {/* Optionally, uncomment this image element for an image fallback */}
                                                            {/* <img src="/assets/Images/backgound-1.jpg" alt="image loaded" /> */}

                                                            <div style={{
                                                                backgroundImage: "url('/assets/Images/backgound-2.jpg')", // Ensure path is correct
                                                                backgroundSize: "cover",
                                                                backgroundPosition: "center",
                                                                minHeight: "400px",
                                                                width: "100%",
                                                                height: "460px",
                                                                objectfit: "contain",  /* Ensures the full image is visible */
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "#fff",
                                                                fontSize: "24px",
                                                                fontWeight: "bold",
                                                                width: "100%"
                                                            }} className={styles.content}>
                                                                <h4 className={styles.title}>Webroot Antivirus Shopping</h4>
                                                                <p className={styles.description}>
                                                                    Shop great deals on Antivirus and more.
                                                                </p>
                                                                <a href="/" className={styles.button} target="_blank" rel="noopener noreferrer" onClick={() => handleCategoryClick(webroot)}>
                                                                    Shop Now
                                                                </a>
                                                            </div>
                                                        </div>

                                                        {/* Slide-3 */}
                                                        <div
                                                            className={styles.slide}
                                                            style={{ width: "100%" }}

                                                        >
                                                            {/* Optionally, uncomment this image element for an image fallback */}
                                                            {/* <img src="/assets/Images/backgound-1.jpg" alt="image loaded" /> */}

                                                            <div style={{
                                                                backgroundImage: "url('/assets/Images/backgound-3.jpg')", // Ensure path is correct
                                                                backgroundSize: "cover",
                                                                backgroundPosition: "center",
                                                                minHeight: "400px",
                                                                width: "100%",
                                                                height: "460px",
                                                                objectfit: "contain",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "#fff",
                                                                fontSize: "24px",
                                                                fontWeight: "bold",
                                                                width: "100%"
                                                            }} className={styles.content}>
                                                                <h4 className={styles.title}>Bitdefender Antivirus Shopping</h4>
                                                                <p className={styles.description}>
                                                                    Shop great deals on Total Security and more.
                                                                </p>
                                                                <a href="/" className={styles.button} target="_blank" rel="noopener noreferrer" onClick={() => handleCategoryClick(Bitdefender)}>
                                                                    Shop Now
                                                                </a>
                                                            </div>
                                                        </div>

                                                    </Slider>
                                                    <button className={styles.prevButton} onClick={goToPrev}>
                                                        Previous
                                                    </button>

                                                    <button className={styles.nextButton} onClick={goToNext}>
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1666183160320 wd-rs-634fefed87ae9">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-634fefd25f329">
                                        <div className="vc_column-inner vc_custom_1666183127613">
                                            <div className="wpb_wrapper">
                                                <div
                                                    id="wd-634d675b41324"
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-634d675b41324 wd-title-color-default wd-title-style-default text-left vc_custom_1666017138726 wd-underline-colored"
                                                >
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-xl">
                                                            Popular Categories
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div
                                                    id="wd-678497ab2fe96"
                                                    className="products woocommerce wd-carousel-container wd-cats-element wd-rs-637e42d972764 wd-wpb wd-img-width wd-cats"
                                                >

                                                    <div className="wd-carousel-inner">

                                                        <div
                                                            className="wd-carousel wd-grid wd-initialized wd-horizontal wd-watch-progress wd-backface-hidden"
                                                            data-scroll_per_page="yes"
                                                            style={{
                                                                "--wd-col-lg": "7",
                                                                "--wd-col-md": "4",
                                                                "--wd-col-sm": "2",
                                                                "--wd-gap-lg": "20px",
                                                                "--wd-gap-sm": "10px",
                                                            }}
                                                        >

                                                            <div
                                                                className="wd-carousel-wrap"
                                                                style={{
                                                                    WebkitTransitionDuration: "0ms",
                                                                    transitionDuration: "0ms",
                                                                    WebkitTransitionDelay: "0ms",
                                                                    transitionDelay: "0ms",
                                                                    WebkitTransform: "translate3d(0px, 0px, 0px)",
                                                                    msTransform: "translate3d(0px, 0px, 0px)",
                                                                    transform: "translate3d(0px, 0px, 0px)",
                                                                }}
                                                            >
                                                                {/* {categories.map((category) => (
                                                                    <div
                                                                        key={category.id}
                                                                        className="wd-carousel-item wd-slide-visible wd-full-visible wd-active"
                                                                        style={{ width: "190px", cursor: "pointer" }}
                                                                        onClick={() => handleCategoryClick(category)}
                                                                    >
                                                                        <div className="category-grid-item wd-cat cat-design-alt wd-with-subcat product-category product first" data-loop={1}>
                                                                            <div className="wrapp-category">
                                                                                <div className="category-image-wrapp">
                                                                                    <a className="category-image" aria-label="Category image">
                                                                                        <picture decoding="async" className="attachment-200 size-200">
                                                                                            <img
                                                                                                decoding="async"
                                                                                                src={category.image}
                                                                                                alt={category.title}
                                                                                            />
                                                                                        </picture>
                                                                                    </a>
                                                                                </div>
                                                                                <div className="hover-mask">
                                                                                    <h3 className="wd-entities-title">
                                                                                        {category.title} <mark className="count">({category.productsCount})</mark>
                                                                                    </h3>
                                                                                    <div className="more-products">
                                                                                        <a >
                                                                                            {category.productsCount} products
                                                                                        </a>
                                                                                    </div>
                                                                                </div>
                                                                                <a

                                                                                    className="category-link wd-fill"
                                                                                    aria-label={`Product category ${category.title}`}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))} */}

                                                                {categories.map((category) => (
                                                                    <div key={category.id} className="wd-carousel-item wd-slide-visible wd-full-visible wd-active"
                                                                        style={{ width: "190px", cursor: "pointer" }}
                                                                        onClick={() => handleCategoryClick(category)}>
                                                                        <div className="category-grid-item wd-cat product-category">
                                                                            <div className="wrapp-category">
                                                                                <div className="category-image-wrapp">
                                                                                    <a href={category.link} className="category-image" aria-label="Category image">
                                                                                        <img src={category.image} alt={category.title} className="attachment-200" />
                                                                                    </a>
                                                                                </div>
                                                                                <div className="hover-mask">
                                                                                    <h3 className="wd-entities-title">
                                                                                        {category.title} <mark className="count">({category.productsCount})</mark>
                                                                                    </h3>
                                                                                    <div className="more-products">
                                                                                        <a href={category.link}>{category.productsCount} products</a>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                            </div>
                                                        </div>
                                                        <div className="wd-nav-arrows wd-pos-sep wd-hover-1 wd-icon-1">
                                                            <div className="wd-btn-arrow wd-prev wd-disabled wd-lock">
                                                                <div className="wd-arrow-inner" />
                                                            </div>
                                                            <div className="wd-btn-arrow wd-next wd-lock wd-disabled">
                                                                <div className="wd-arrow-inner" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1666183170575 wd-rs-634feff906542">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-634ff2b59ca25">
                                        <div className="vc_column-inner vc_custom_1666183867410">
                                            <div className="wpb_wrapper">
                                                <div
                                                    id="wd-634ff2ae7a84a"
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-634ff2ae7a84a wd-enabled-width wd-title-color-default wd-title-style-default text-left vc_custom_1666183861337 wd-underline-colored"
                                                >
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-xl">
                                                            The Best Offers
                                                        </h4>
                                                    </div>
                                                </div>
                                                {visibleProducts < products.length && (
                                                    <div
                                                        id="wd-63e123a3abd83"
                                                        className=" wd-rs-63e123a3abd83 vc_custom_1675699148725 wd-button-wrapper text-center inline-element"
                                                    >
                                                        <button

                                                            title="Outlet"
                                                            className="btn btn-style-default btn-shape-round btn-size-default btn-icon-pos-right"
                                                            onClick={handleShowMore}
                                                        >
                                                            More Products
                                                            <span className="wd-btn-icon">
                                                                <img
                                                                    decoding="async"
                                                                    src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-primary.svg"
                                                                    title="chevron-right-primary"
                                                                    width={14}
                                                                    height={14}
                                                                    data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-primary.svg"
                                                                    data-ll-status="loaded"
                                                                    className="entered lazyloaded"
                                                                />

                                                            </span>
                                                        </button>
                                                    </div>
                                                )}

                                                <div
                                                    id
                                                    className="wd-products-element wd-rs-63e1023d7a64b wd-wpb"
                                                >
                                                    <div
                                                        className="products wd-products  grid-columns-5 elements-grid wd-grid-g title-line-one wd-stretch-cont-lg wd-products-with-bg"
                                                        data-paged={1}
                                                        data-atts='{"post_type":"ids","spacing":"20","include":"182, 2435, 1476, 2564, 3110","items_per_page":"5","columns":"5","columns_tablet":"3","sale_countdown":"0","stock_progress_bar":"0","highlighted_products":"0","products_bordered_grid":"0","products_with_background":"1","products_shadow":"0","orderby":"post__in","img_size":"large","woodmart_css_id":"63e1023d7a64b","force_not_ajax":"no"}'
                                                        data-source="shortcode"
                                                        data-columns={5}
                                                        data-grid-gallery='{"grid_gallery":"1","grid_gallery_control":"hover","grid_gallery_enable_arrows":"arrows"}'
                                                        style={{
                                                            "--wd-col-lg": "5",
                                                            "--wd-col-md": "3",
                                                            "--wd-col-sm": "2",
                                                            "--wd-gap-lg": "20px",
                                                            "--wd-gap-sm": "10px",
                                                        }}
                                                    >
                                                        {bestOffers.map((offer, index) => (
                                                            <div
                                                                className="wd-product wd-with-labels wd-hover-fw-button wd-hover-with-fade wd-col product-grid-item product"
                                                                data-loop={index}
                                                                data-id={offer.id} // Assuming you have unique IDs for each product
                                                                key={offer.id} // Use a unique key for each product
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                <div className="product-wrapper">
                                                                    <div className="content-product-imagin" style={{ marginBottom: "-112px" }} />
                                                                    <div className="product-element-top wd-quick-shop">
                                                                        <a className="product-image-link" onClick={() => handleProductDetails(offer.productData.productInfo.productName)}>
                                                                            <div className="wd-product-grid-slider wd-fill" />
                                                                            <div className="wd-product-grid-slider-nav wd-fill wd-hover-enabled">
                                                                                <div className="wd-prev" />
                                                                                <div className="wd-next" />
                                                                            </div>
                                                                            <div className="wd-product-grid-slider-pagin" />
                                                                            <div className="product-labels labels-rounded-sm">
                                                                                <span className="onsale product-label">{offer.productData.priceInfo.discount_Price}%</span> {/* Assuming you have discount info */}
                                                                            </div>
                                                                            <picture decoding="async" className="attachment-large size-large">
                                                                                <source
                                                                                    type="image/webp"
                                                                                    data-lazy-srcset={`${offer.productData.productImages[0]} 700w, ${offer.productData.productImages[0]} 263w`}
                                                                                    srcSet={`${offer.productData.productImages[0]} 700w, ${offer.productData.productImages[0]} 263w`}
                                                                                    sizes="(max-width: 700px) 100vw, 700px"
                                                                                />
                                                                                <img
                                                                                    decoding="async"
                                                                                    width={700}
                                                                                    height={800}
                                                                                    src={offer.productData.productImages[0]}
                                                                                    data-lazy-srcset={`${offer.productData.productImages[0]} 700w, ${offer.productData.productImages[0]} 263w`}
                                                                                    data-lazy-sizes="(max-width: 700px) 100vw, 700px"
                                                                                    className="entered lazyloaded"
                                                                                    sizes="(max-width: 700px) 100vw, 700px"
                                                                                    srcSet={`${offer.productData.productImages[0]} 700w, ${offer.productData.productImages[0]} 263w`}
                                                                                />
                                                                            </picture>
                                                                        </a>
                                                                        <div className="wd-buttons wd-pos-r-t">
                                                                            <div className="wd-compare-btn product-compare-button wd-action-btn wd-style-icon wd-compare-icon">
                                                                                <a
                                                                                    href="#"
                                                                                    data-id={offer.id}
                                                                                    rel="nofollow"
                                                                                    data-added-text="Compare products"
                                                                                >
                                                                                    <span>Compare</span>
                                                                                </a>
                                                                            </div>
                                                                            <div className="quick-view wd-action-btn wd-style-icon wd-quick-view-icon">
                                                                                <a className="open-quick-view quick-view-button" rel="nofollow" data-id={offer.id}>
                                                                                    Quick view
                                                                                </a>
                                                                            </div>
                                                                            <div className="wd-wishlist-btn wd-action-btn wd-style-icon wd-wishlist-icon">
                                                                                <a
                                                                                    onClick={(e) => handleAddToWishlist(e, offer)}
                                                                                    href="#"
                                                                                    data-key={offer.id}
                                                                                    data-product-id={offer.id}
                                                                                    rel="nofollow"
                                                                                    data-added-text="Browse Wishlist"
                                                                                >
                                                                                    <span>{isAdded ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="product-element-bottom">
                                                                        <h3 className="wd-entities-title">
                                                                            <a href={offer.product_url}>
                                                                                {offer.productData.productInfo.productName}
                                                                            </a>
                                                                        </h3>
                                                                        <div className="wd-product-cats">
                                                                            <a href={offer.productData.attribute.category_url} rel="tag">
                                                                                {offer.productData.attribute.category}
                                                                            </a>
                                                                        </div>
                                                                        <div className="star-rating" role="img" aria-label={`Rated ${offer.rating} out of 5`}>
                                                                            <span style={{ width: `${(offer.rating / 5) * 100}%` }}>
                                                                                Rated <strong className="rating">{offer.rating}</strong> out of 5
                                                                            </span>
                                                                        </div>
                                                                        <p className="wd-product-stock stock wd-style-default in-stock">
                                                                            {offer.stockStatus}
                                                                        </p>
                                                                        <div className="wrap-price">
                                                                            <span className="price">
                                                                                <del aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {offer.productData.priceInfo.costPrice}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </del>
                                                                                <span className="screen-reader-text">
                                                                                    Original price was: {offer.productData.priceInfo.costPrice}.
                                                                                </span>
                                                                                <ins aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {offer.productData.priceInfo.Price}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </ins>
                                                                                <span className="screen-reader-text">
                                                                                    Current price is: $ {offer.productData.priceInfo.Price}.
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        <div className="wd-add-btn wd-add-btn-replace">
                                                                            <a
                                                                                href="#"
                                                                                aria-describedby="woocommerce_loop_add_to_cart_link_describedby_2435"
                                                                                data-quantity={1}
                                                                                className="button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-loop"
                                                                                data-product_id={offer.id}
                                                                                data-product_sku={offer.productCode}
                                                                                aria-label={`Add to cart: ${offer.productName}`}
                                                                                rel="nofollow"
                                                                                onClick={(e) => openCart(e, offer)}
                                                                            >
                                                                                <span>Add to cart</span>
                                                                            </a>
                                                                            <span id="woocommerce_loop_add_to_cart_link_describedby_2435" className="screen-reader-text"></span>
                                                                        </div>
                                                                        <div className="wd-product-detail wd-product-sku">
                                                                            <span className="wd-label">SKU: </span>
                                                                            <span>{offer.id}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1669208804222 wd-rs-637e1ae2b109c">
                                    <div className="wpb_column vc_column_container vc_col-sm-3 vc_hidden-sm vc_hidden-xs wd-rs-637502f36f06d">
                                        <div className="vc_column-inner vc_custom_1668612856492">
                                            <div className="wpb_wrapper">

                                                <div className="promo-banner-wrapper  wd-rs-63d90c213c7b6 ">
                                                    <div
                                                        id="wd-63d90c213c7b6"
                                                        className="promo-banner  banner- banner-hover-zoom color-scheme-light banner-btn-size-default banner-btn-style-default  with-btn banner-btn-position-static wd-underline-colored"
                                                    >
                                                        <div className="main-wrapp-img">
                                                            <div className="banner-image wd-bg-position-center">
                                                                <img
                                                                    decoding="async"
                                                                    width={600}
                                                                    height={720}
                                                                    src="https://i5.walmartimages.com/seo/Bitdefender-Total-Security-5-Device-1-Yr-Digital_1a407fd8-9970-4ffb-bf56-d2f8b8963db3.ada7a9d6fd2f67ec79882d3318055244.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF"
                                                                    className="attachment-600x720 size-600x720 entered lazyloaded"
                                                                    alt=""
                                                                    data-lazy-src="https://i5.walmartimages.com/seo/Bitdefender-Total-Security-5-Device-1-Yr-Digital_1a407fd8-9970-4ffb-bf56-d2f8b8963db3.ada7a9d6fd2f67ec79882d3318055244.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF"
                                                                    data-ll-status="loaded"
                                                                />

                                                            </div>
                                                        </div>
                                                        <div className="wrapper-content-banner wd-fill  wd-items-top wd-justify-center">
                                                            <div className="content-banner  text-center">
                                                                {/* <div className="banner-subtitle subtitle-color-default subtitle-style-default wd-fontsize-xs wd-font-weight-700 font-alt" style={{color:'black'}}>
                                                                    AT A GOOD PRICE
                                                                </div>
                                                                <h4 className="banner-title wd-font-weight- wd-fontsize-l" style={{color:'black'}}>
                                                                   Webroot Antivirus
                                                                </h4> */}
                                                                <div className="banner-btn-wrapper">
                                                                    <div
                                                                        id="wd-678497ab4ec69"
                                                                        className="  wd-button-wrapper text-center"
                                                                    >
                                                                        {/* <a className="btn btn-color-primary btn-style-default btn-shape-semi-round btn-size-default">
                                                                            Buy Now
                                                                        </a> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-9 vc_col-md-9 wd-enabled-flex wd-rs-637502fa312e0">
                                        <div className="vc_column-inner vc_custom_1668612867432">
                                            <div className="wpb_wrapper">
                                                <div
                                                    id="wd-634ff240c9859"
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-634ff240c9859 wd-enabled-width wd-title-color-default wd-title-style-default text-left vc_custom_1666183754887 wd-underline-colored"
                                                >
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-xl">
                                                            New Goods
                                                        </h4>
                                                    </div>
                                                </div>
                                                {visibleProducts2 < products.length && (
                                                    <div
                                                        id="wd-63e123a3abd83"
                                                        className=" wd-rs-63e123a3abd83 vc_custom_1675699148725 wd-button-wrapper text-center inline-element"
                                                    >
                                                        <button

                                                            title="Outlet"
                                                            className="btn btn-style-default btn-shape-round btn-size-default btn-icon-pos-right"
                                                            onClick={handleShowMore2}
                                                        >
                                                            More Products
                                                            <span className="wd-btn-icon">
                                                                <img
                                                                    decoding="async"
                                                                    src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-primary.svg"
                                                                    title="chevron-right-primary"
                                                                    width={14}
                                                                    height={14}
                                                                    data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-primary.svg"
                                                                    data-ll-status="loaded"
                                                                    className="entered lazyloaded"
                                                                />

                                                            </span>
                                                        </button>
                                                    </div>
                                                )}
                                                <div
                                                    id
                                                    className="wd-products-element wd-rs-63ca986f2aaee wd-wpb"
                                                >
                                                    <div
                                                        className="products wd-products  grid-columns-4 elements-grid wd-grid-g title-line-one wd-stretch-cont-lg wd-products-with-bg"
                                                        data-paged={1}
                                                        data-atts='{"spacing":"20","items_per_page":"4","columns_tablet":"3","sale_countdown":"0","stock_progress_bar":"0","highlighted_products":"0","products_bordered_grid":"0","products_with_background":"1","products_shadow":"0","img_size":"large","woodmart_css_id":"63ca986f2aaee","force_not_ajax":"no"}'
                                                        data-source="shortcode"
                                                        data-columns={4}
                                                        data-grid-gallery='{"grid_gallery":"1","grid_gallery_control":"hover","grid_gallery_enable_arrows":"arrows"}'
                                                        style={{
                                                            "--wd-col-lg": "4",
                                                            "--wd-col-md": "3",
                                                            "--wd-col-sm": "2",
                                                            "--wd-gap-lg": "20px",
                                                            "--wd-gap-sm": "10px",
                                                        }}
                                                    >
                                                        {/* Addd */}

                                                        {bestOffers2.map((offer, index) => (
                                                            <div
                                                                className="wd-product wd-with-labels wd-hover-fw-button wd-hover-with-fade wd-col product-grid-item product"
                                                                data-loop={index}
                                                                data-id={offer.id} // Assuming you have unique IDs for each product
                                                                key={offer.id} // Use a unique key for each product
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                <div className="product-wrapper">
                                                                    <div className="content-product-imagin" style={{ marginBottom: "-112px" }} />
                                                                    <div className="product-element-top wd-quick-shop">
                                                                        <a className="product-image-link" onClick={() => handleProductDetails(offer.productData.productInfo.productName)}>
                                                                            <div className="wd-product-grid-slider wd-fill" />
                                                                            <div className="wd-product-grid-slider-nav wd-fill wd-hover-enabled">
                                                                                <div className="wd-prev" />
                                                                                <div className="wd-next" />
                                                                            </div>
                                                                            <div className="wd-product-grid-slider-pagin" />
                                                                            <div className="product-labels labels-rounded-sm">
                                                                                <span className="onsale product-label">{offer.productData.priceInfo.discount_Price}%</span> {/* Assuming you have discount info */}
                                                                            </div>
                                                                            <picture decoding="async" className="attachment-large size-large">
                                                                                <source
                                                                                    type="image/webp"
                                                                                    data-lazy-srcset={`${offer.productData.productImages[0]} 700w, ${offer.productData.productImages[0]} 263w`}
                                                                                    srcSet={`${offer.productData.productImages[0]} 700w, ${offer.productData.productImages[0]} 263w`}
                                                                                    sizes="(max-width: 700px) 100vw, 700px"
                                                                                />
                                                                                <img
                                                                                    decoding="async"
                                                                                    width={700}
                                                                                    height={800}
                                                                                    src={offer.productData.productImages[0]}
                                                                                    data-lazy-srcset={`${offer.productData.productImages[0]} 700w, ${offer.productData.productImages[0]} 263w`}
                                                                                    data-lazy-sizes="(max-width: 700px) 100vw, 700px"
                                                                                    className="entered lazyloaded"
                                                                                    sizes="(max-width: 700px) 100vw, 700px"
                                                                                    srcSet={`${offer.productData.productImages[0]} 700w, ${offer.productData.productImages[0]} 263w`}
                                                                                />
                                                                            </picture>
                                                                        </a>
                                                                        <div className="wd-buttons wd-pos-r-t">
                                                                            <div className="wd-compare-btn product-compare-button wd-action-btn wd-style-icon wd-compare-icon">
                                                                                <a
                                                                                    href="#"
                                                                                    data-id={offer.id}
                                                                                    rel="nofollow"
                                                                                    data-added-text="Compare products"
                                                                                >
                                                                                    <span>Compare</span>
                                                                                </a>
                                                                            </div>
                                                                            <div className="quick-view wd-action-btn wd-style-icon wd-quick-view-icon">
                                                                                <a className="open-quick-view quick-view-button" rel="nofollow" data-id={offer.id}>
                                                                                    Quick view
                                                                                </a>
                                                                            </div>
                                                                            <div className="wd-wishlist-btn wd-action-btn wd-style-icon wd-wishlist-icon">
                                                                                <a
                                                                                    onClick={(e) => handleAddToWishlist(e, offer)}
                                                                                    href="#"
                                                                                    data-key={offer.id}
                                                                                    data-product-id={offer.id}
                                                                                    rel="nofollow"
                                                                                    data-added-text="Browse Wishlist"
                                                                                >
                                                                                    <span>{isAdded ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="product-element-bottom">
                                                                        <h3 className="wd-entities-title">
                                                                            <a href={offer.product_url}>
                                                                                {offer.productData.productInfo.productName}
                                                                            </a>
                                                                        </h3>
                                                                        <div className="wd-product-cats">
                                                                            <a href={offer.productData.attribute.category_url} rel="tag">
                                                                                {offer.productData.attribute.category}
                                                                            </a>
                                                                        </div>
                                                                        <div className="star-rating" role="img" aria-label={`Rated ${offer.rating} out of 5`}>
                                                                            <span style={{ width: `${(offer.rating / 5) * 100}%` }}>
                                                                                Rated <strong className="rating">{offer.rating}</strong> out of 5
                                                                            </span>
                                                                        </div>
                                                                        <p className="wd-product-stock stock wd-style-default in-stock">
                                                                            {offer.stockStatus}
                                                                        </p>
                                                                        <div className="wrap-price">
                                                                            <span className="price">
                                                                                <del aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {offer.productData.priceInfo.costPrice}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </del>
                                                                                <span className="screen-reader-text">
                                                                                    Original price was: {offer.productData.priceInfo.costPrice}.
                                                                                </span>
                                                                                <ins aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {offer.productData.priceInfo.Price}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </ins>
                                                                                <span className="screen-reader-text">
                                                                                    Current price is: $ {offer.productData.priceInfo.Price}.
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        <div className="wd-add-btn wd-add-btn-replace">
                                                                            <a
                                                                                href="#"
                                                                                aria-describedby="woocommerce_loop_add_to_cart_link_describedby_2435"
                                                                                data-quantity={1}
                                                                                className="button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-loop"
                                                                                data-product_id={offer.id}
                                                                                data-product_sku={offer.productCode}
                                                                                aria-label={`Add to cart: ${offer.productName}`}
                                                                                rel="nofollow"
                                                                                onClick={(e) => openCart(e, offer)}
                                                                            >
                                                                                <span>Add to cart</span>
                                                                            </a>
                                                                            <span id="woocommerce_loop_add_to_cart_link_describedby_2435" className="screen-reader-text"></span>
                                                                        </div>
                                                                        <div className="wd-product-detail wd-product-sku">
                                                                            <span className="wd-label">SKU: </span>
                                                                            <span>{offer.id}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="vc_row wpb_row vc_row-fluid vc_custom_1669208808246 vc_row-has-fill wd-bg-center-center wd-rs-637e1ae60fd2e wd-section-stretch"
                                    data-rocket-lazy-bg-495a8d3f-ea3f-41fb-84e1-9971610dfbe8="loaded"
                                >
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-634ff34d0b9f1">
                                        <div className="vc_column-inner vc_custom_1666184018278">
                                            <div className="wpb_wrapper">
                                                <div className="vc_row wpb_row vc_inner vc_row-fluid vc_row-o-content-middle vc_row-flex wd-rs-637257b9e47aa">
                                                    <div className="wpb_column vc_column_container vc_col-sm-5 wd-rs-634ff56bbfb53">
                                                        <div className="vc_column-inner vc_custom_1666184560776">
                                                            <div className="wpb_wrapper">

                                                                <div
                                                                    id="wd-63d90af56021f"
                                                                    className="wd-image wd-wpb wd-rs-63d90af56021f text-left vc_custom_1675168504439"
                                                                >
                                                                    <img
                                                                        decoding="async"
                                                                        width={580}
                                                                        height={365}
                                                                        src="/assets/Images/media-vpn.avif"
                                                                        className="attachment-580x365 size-580x365 entered lazyloaded"
                                                                        alt
                                                                        data-lazy-srcset="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img.png 580w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-400x252.png 400w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-100x63.png 100w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-430x271.png 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-180x113.png 180w"
                                                                        data-lazy-sizes="(max-width: 580px) 100vw, 580px"
                                                                        data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-580x365.png"
                                                                        data-ll-status="loaded"
                                                                        sizes="(max-width: 580px) 100vw, 580px"
                                                                        srcSet="/assets/Images/media-vpn.avif"
                                                                    />

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="wpb_column vc_column_container vc_col-sm-7 wd-rs-634ff570a667b">
                                                        <div className="vc_column-inner vc_custom_1666184565547">
                                                            <div className="wpb_wrapper">
                                                                <div
                                                                    id="wd-6375053b71efb"
                                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-6375053b71efb wd-title-color-default wd-title-style-default text-left vc_custom_1668613440554 wd-underline-colored"
                                                                >
                                                                    <div className="liner-continer">
                                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-l">
                                                                            Network Security and Antivirus Protection Sale
                                                                        </h4>
                                                                    </div>
                                                                    <div className="title-after_title reset-last-child  wd-fontsize-xs">
                                                                        Stay Safe Online with Top Network Security and Antivirus Protection – Discounts Up to 25%!
                                                                    </div>
                                                                </div>
                                                                <div className="wd-countdown-timer  color-scheme-dark text-left wd-rs- ">
                                                                    <div
                                                                        className="wd-timer wd-size-large wd-style-standard"
                                                                        data-end-date="2026-01-01 00:00"
                                                                        data-timezone="GMT"
                                                                        data-hide-on-finish="no"
                                                                    >
                                                                        <span className="wd-timer-days">
                                                                            <span className="wd-timer-value">352 </span>
                                                                            <span className="wd-timer-text">days</span>
                                                                        </span>
                                                                        <span className="wd-timer-hours">
                                                                            <span className="wd-timer-value">13 </span>
                                                                            <span className="wd-timer-text">hr</span>
                                                                        </span>
                                                                        <span className="wd-timer-min">
                                                                            <span className="wd-timer-value">21 </span>
                                                                            <span className="wd-timer-text">min</span>
                                                                        </span>
                                                                        <span className="wd-timer-sec">
                                                                            <span className="wd-timer-value">17 </span>
                                                                            <span className="wd-timer-text">sc</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    id="wd-63e50c013d15f"
                                                                    className=" wd-rs-63e50c013d15f vc_custom_1675955206512 wd-button-wrapper text-left"
                                                                >
                                                                    <a
                                                                        href="/home/productCategory"
                                                                        title
                                                                        className="btn btn-color-primary btn-style-default btn-shape-semi-round btn-size-default btn-icon-pos-right"
                                                                    >
                                                                        Go Shopping
                                                                        <span className="wd-btn-icon">
                                                                            <img
                                                                                decoding="async"
                                                                                src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-white.svg"
                                                                                alt="image not found"
                                                                                title="chevron-right-white"
                                                                                width={14}
                                                                                height={14}
                                                                                data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-white.svg"
                                                                                data-ll-status="loaded"
                                                                                className="entered lazyloaded"
                                                                            />
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    id="carousel-521"
                                                    className="wd-carousel-container  wd-wpb wd-rs-64e4cbd0da5b4  wd-products-element wd-products products wd-products-with-bg title-line-one"
                                                >
                                                    <div className="wd-carousel-inner">
                                                        <div
                                                            className="wd-carousel wd-grid wd-initialized wd-horizontal wd-watch-progress wd-backface-hidden"
                                                            data-scroll_per_page="yes"
                                                            style={{
                                                                "--wd-col-lg": "5",
                                                                "--wd-col-md": "4",
                                                                "--wd-col-sm": "1",
                                                                "--wd-gap-lg": "20px",
                                                                "--wd-gap-sm": "10px",
                                                            }}
                                                        >
                                                            <div
                                                                className="wd-carousel-wrap"
                                                                style={{ cursor: "grab" }}
                                                            >
                                                                {/* <Slider {...settings} >
                                                                  
                                                                </Slider> */}

                                                                {bestOffers.slice(0, 5).map((product) => (
                                                                    <div
                                                                        key={product.id}
                                                                        className="wd-carousel-item wd-slide-visible wd-full-visible wd-active"
                                                                        style={{ width: '262.6px' }}
                                                                    >
                                                                        <div className="wd-product wd-hover-small product-grid-item product type-product post-662 status-publish instock">
                                                                            <div className="product-wrapper">
                                                                                <div className="product-element-top">
                                                                                    <a href={product.product_url} className="product-image-link">
                                                                                        <img
                                                                                            decoding="async"
                                                                                            width={80}
                                                                                            height={80}
                                                                                            src={`${product.productData.productImages[0]}`}
                                                                                            alt={product.productData.productInfo.productName}
                                                                                        />
                                                                                    </a>
                                                                                </div>
                                                                                <div className="product-element-bottom">
                                                                                    <h3 className="wd-entities-title">
                                                                                        <a href={product.product_url}>${product.productData.priceInfo.costPrice}</a>
                                                                                    </h3>
                                                                                    <div className="star-rating" role="img" aria-label={`Rated ${product.rating} out of 5`}>
                                                                                        <span style={{ width: `${(product.rating / 5) * 100}%` }}>
                                                                                            Rated <strong className="rating">{product.rating}</strong> out of 5
                                                                                        </span>
                                                                                    </div>
                                                                                    <span className="price">
                                                                                        <span className="woocommerce-Price-amount amount">
                                                                                            <bdi>
                                                                                                <span className="woocommerce-Price-currencySymbol">$</span>{product.productData.priceInfo.costPrice}
                                                                                            </bdi>
                                                                                        </span>
                                                                                        {product.discount > 0 && (
                                                                                            <span className="woocommerce-Price-amount amount">
                                                                                                <bdi>
                                                                                                    <span className="woocommerce-Price-currencySymbol">$</span>
                                                                                                    {(product.price - product.discount).toFixed(2)}
                                                                                                </bdi>
                                                                                            </span>
                                                                                        )}
                                                                                    </span>
                                                                                    {/* <p>{product.description}</p> */}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                            </div>
                                                        </div>
                                                        <div className="wd-nav-arrows wd-pos-sep wd-hover-1 wd-icon-1">
                                                            <div className="wd-btn-arrow wd-prev wd-disabled">
                                                                <div className="wd-arrow-inner" />
                                                            </div>
                                                            <div className="wd-btn-arrow wd-next">
                                                                <div className="wd-arrow-inner" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1669208817052 wd-rs-637e1aefc8b3e">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-63ca97f31e225">
                                        <div className="vc_column-inner vc_custom_1674221560298">
                                            <div className="wpb_wrapper">
                                                <div
                                                    id="wd-63ca97e116739"
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-63ca97e116739 wd-enabled-width wd-title-color-default wd-title-style-default text-left vc_custom_1674221541822 wd-underline-colored"
                                                >
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-xl">
                                                            Home Appliance
                                                        </h4>
                                                    </div>
                                                </div>
                                                {visibleProducts3 < products.length && (
                                                    <div
                                                        id="wd-63e123a3abd83"
                                                        className=" wd-rs-63e123a3abd83 vc_custom_1675699148725 wd-button-wrapper text-center inline-element"
                                                    >
                                                        <button

                                                            title="Outlet"
                                                            className="btn btn-style-default btn-shape-round btn-size-default btn-icon-pos-right"
                                                            onClick={handleShowMore3}
                                                        >
                                                            More Products
                                                            <span className="wd-btn-icon">
                                                                <img
                                                                    decoding="async"
                                                                    src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-primary.svg"
                                                                    title="chevron-right-primary"
                                                                    width={14}
                                                                    height={14}
                                                                    data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-primary.svg"
                                                                    data-ll-status="loaded"
                                                                    className="entered lazyloaded"
                                                                />

                                                            </span>
                                                        </button>
                                                    </div>
                                                )}
                                                <div
                                                    id
                                                    className="wd-products-element wd-rs-63ca97d62665c wd-wpb"
                                                >
                                                    <div
                                                        className="products wd-products  grid-columns-5 elements-grid wd-grid-g title-line-one wd-stretch-cont-lg wd-products-with-bg"
                                                        data-paged={1}
                                                        data-atts='{"spacing":"20","taxonomies":"274","items_per_page":"5","columns":"5","columns_tablet":"3","sale_countdown":"0","stock_progress_bar":"0","highlighted_products":"0","products_bordered_grid":"0","products_with_background":"1","products_shadow":"0","img_size":"large","woodmart_css_id":"63ca97d62665c","force_not_ajax":"no"}'
                                                        data-source="shortcode"
                                                        data-columns={5}
                                                        data-grid-gallery='{"grid_gallery":"1","grid_gallery_control":"hover","grid_gallery_enable_arrows":"arrows"}'
                                                        style={{
                                                            "--wd-col-lg": "5",
                                                            "--wd-col-md": "3",
                                                            "--wd-col-sm": "2",
                                                            "--wd-gap-lg": "20px",
                                                            "--wd-gap-sm": "10px",
                                                        }}
                                                    >
                                                        {bestOffers3.map((offer, index) => (
                                                            <div
                                                                className="wd-product wd-with-labels wd-hover-fw-button wd-hover-with-fade wd-col product-grid-item product"
                                                                data-loop={index}
                                                                data-id={offer.id} // Assuming you have unique IDs for each product
                                                                key={offer.id} // Use a unique key for each product
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                <div className="product-wrapper">
                                                                    <div className="content-product-imagin" style={{ marginBottom: "-112px" }} />
                                                                    <div className="product-element-top wd-quick-shop">
                                                                        <a className="product-image-link" onClick={() => handleProductDetails(offer.productData.productInfo.productName)}>
                                                                            <div className="wd-product-grid-slider wd-fill" />
                                                                            <div className="wd-product-grid-slider-nav wd-fill wd-hover-enabled">
                                                                                <div className="wd-prev" />
                                                                                <div className="wd-next" />
                                                                            </div>
                                                                            <div className="wd-product-grid-slider-pagin" />
                                                                            <div className="product-labels labels-rounded-sm">
                                                                                <span className="onsale product-label">{offer.productData.priceInfo.discount_Price}%</span> {/* Assuming you have discount info */}
                                                                            </div>
                                                                            <picture decoding="async" className="attachment-large size-large">
                                                                                <source
                                                                                    type="image/webp"
                                                                                    data-lazy-srcset={`${offer.productData.productImages[0]} 700w, ${offer.productData.productImages[0]} 263w`}
                                                                                    srcSet={`${offer.productData.productImages[0]} 700w, ${offer.productData.productImages[0]} 263w`}
                                                                                    sizes="(max-width: 700px) 100vw, 700px"
                                                                                />
                                                                                <img
                                                                                    decoding="async"
                                                                                    width={700}
                                                                                    height={800}
                                                                                    src={offer.productData.productImages[0]}
                                                                                    data-lazy-srcset={`${offer.productData.productImages[0]} 700w, ${offer.productData.productImages[0]} 263w`}
                                                                                    data-lazy-sizes="(max-width: 700px) 100vw, 700px"
                                                                                    className="entered lazyloaded"
                                                                                    sizes="(max-width: 700px) 100vw, 700px"
                                                                                    srcSet={`${offer.productData.productImages[0]} 700w, ${offer.productData.productImages[0]} 263w`}
                                                                                />
                                                                            </picture>
                                                                        </a>
                                                                        <div className="wd-buttons wd-pos-r-t">
                                                                            <div className="wd-compare-btn product-compare-button wd-action-btn wd-style-icon wd-compare-icon">
                                                                                <a
                                                                                    href="#"
                                                                                    data-id={offer.id}
                                                                                    rel="nofollow"
                                                                                    data-added-text="Compare products"
                                                                                >
                                                                                    <span>Compare</span>
                                                                                </a>
                                                                            </div>
                                                                            <div className="quick-view wd-action-btn wd-style-icon wd-quick-view-icon">
                                                                                <a className="open-quick-view quick-view-button" rel="nofollow" data-id={offer.id}>
                                                                                    Quick view
                                                                                </a>
                                                                            </div>
                                                                            <div className="wd-wishlist-btn wd-action-btn wd-style-icon wd-wishlist-icon">
                                                                                <a
                                                                                    onClick={(e) => handleAddToWishlist(e, offer)}
                                                                                    href="#"
                                                                                    data-key={offer.id}
                                                                                    data-product-id={offer.id}
                                                                                    rel="nofollow"
                                                                                    data-added-text="Browse Wishlist"
                                                                                >
                                                                                    <span>{isAdded ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="product-element-bottom">
                                                                        <h3 className="wd-entities-title">
                                                                            <a href={offer.product_url}>
                                                                                {offer.productData.productInfo.productName}
                                                                            </a>
                                                                        </h3>
                                                                        <div className="wd-product-cats">
                                                                            <a href={offer.productData.attribute.category_url} rel="tag">
                                                                                {offer.productData.attribute.category}
                                                                            </a>
                                                                        </div>
                                                                        <div className="star-rating" role="img" aria-label={`Rated ${offer.rating} out of 5`}>
                                                                            <span style={{ width: `${(offer.rating / 5) * 100}%` }}>
                                                                                Rated <strong className="rating">{offer.rating}</strong> out of 5
                                                                            </span>
                                                                        </div>
                                                                        <p className="wd-product-stock stock wd-style-default in-stock">
                                                                            {offer.stockStatus}
                                                                        </p>
                                                                        <div className="wrap-price">
                                                                            <span className="price">
                                                                                <del aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {offer.productData.priceInfo.costPrice}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </del>
                                                                                <span className="screen-reader-text">
                                                                                    Original price was: {offer.productData.priceInfo.costPrice}.
                                                                                </span>
                                                                                <ins aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {offer.productData.priceInfo.Price}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </ins>
                                                                                <span className="screen-reader-text">
                                                                                    Current price is: $ {offer.productData.priceInfo.Price}.
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        <div className="wd-add-btn wd-add-btn-replace">
                                                                            <a
                                                                                href="#"
                                                                                aria-describedby="woocommerce_loop_add_to_cart_link_describedby_2435"
                                                                                data-quantity={1}
                                                                                className="button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-loop"
                                                                                data-product_id={offer.id}
                                                                                data-product_sku={offer.productCode}
                                                                                aria-label={`Add to cart: ${offer.productName}`}
                                                                                rel="nofollow"
                                                                                onClick={(e) => openCart(e, offer)}
                                                                            >
                                                                                <span>Add to cart</span>
                                                                            </a>
                                                                            <span id="woocommerce_loop_add_to_cart_link_describedby_2435" className="screen-reader-text"></span>
                                                                        </div>
                                                                        <div className="wd-product-detail wd-product-sku">
                                                                            <span className="wd-label">SKU: </span>
                                                                            <span>{offer.id}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1668612970168 vc_row-has-fill wd-rs-6375035fb3c7d">
                                    <div className={`wpb_column vc_column_container vc_col-sm-12 wd-rs-63ca988e4d43a wd-collapsible-content ${isReadMore ? 'wd-opened' : ''}`}>
                                        <div className="vc_column-inner vc_custom_1674221725280">
                                            <div className="wpb_wrapper">
                                                <div
                                                    id="wd-638768520bd96"
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-638768520bd96 wd-title-color-default wd-title-style-default text-left vc_custom_1669818470753 wd-underline-colored"
                                                >
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-xl">
                                                            Online store of household appliances and electronics
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div
                                                    id="wd-63da1f44d7fc6"
                                                    className="wd-text-block wd-wpb reset-last-child wd-rs-63da1f44d7fc6 text-left "
                                                >
                                                    <p>
                                                        Then the question arises: where’s the content? Not there
                                                        yet? That’s not so bad, there’s dummy copy to the rescue.
                                                        But worse, what if the fish doesn’t fit in the can, the
                                                        foot’s to big for the boot? Or to small? To short
                                                        sentences, to many headings, images too large for the
                                                        proposed design, or too small, or they fit in but it looks
                                                        iffy for reasons.
                                                    </p>
                                                    <p>
                                                        A client that’s unhappy for a reason is a problem, a
                                                        client that’s unhappy though he or her can’t quite put a
                                                        finger on it is worse. Chances are there wasn’t
                                                        collaboration, communication, and checkpoints, there
                                                        wasn’t a process agreed upon or specified with the
                                                        granularity required. It’s content strategy gone awry
                                                        right from the start. If that’s what you think how bout
                                                        the other way around? How can you evaluate content without
                                                        design? No typography, no colors, no layout, no styles,
                                                        all those things that convey the important signals that go
                                                        beyond the mere textual, hierarchies of information,
                                                        weight, emphasis, oblique stresses, priorities, all those
                                                        subtle cues that also have visual and emotional appeal to
                                                        the reader.
                                                    </p>
                                                </div>
                                                <div
                                                    id="wd-63c1303864fc7"
                                                    className="wd-rs-63c1303864fc7  wd-button-wrapper text-left wd-collapsible-button"
                                                >
                                                    <a className="btn btn-style-default btn-shape-semi-round btn-size-small btn-icon-pos-right" onClick={handleReadMore}>
                                                        Read More
                                                        <span className="wd-btn-icon">
                                                            <img
                                                                decoding="async"
                                                                src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-down-black.svg"
                                                                title="chevron-down-black"
                                                                width={14}
                                                                height={14}
                                                                data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-down-black.svg"
                                                                data-ll-status="loaded"
                                                                className="entered lazyloaded"
                                                            />

                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </main>
            </div>

            {/* Cart Modal */}

            <Cartwidget isCartOpen={isCartOpen} closeCart={closeCart} setIsCartOpen={setIsCartOpen} />
            <div className={`wd-close-side wd-fill ${isCartOpen ? 'wd-close-side-opened' : ''}`} />

        </>
    )
}

export default HomePage;