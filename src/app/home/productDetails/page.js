"use client";

import React, { useState, useEffect, useContext } from "react";
import bestOffer from "../../assets/scraped_products.json";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, fireStore } from "../../_components/firebase/config";
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import Cartwidget from "@/app/_components/Cart-widget/page";
import { CartContext } from "@/app/_components/CartContext/page";

const productDetails = () => {

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [bestOffers, setBestOffers] = useState([]);
    const [isAdded, setIsAdded] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data, dispatch } = useContext(CartContext);

    const accordionData = [
        { title: "Product details", content: "Detailed product description goes here." },
        { title: "About the brand", content: "Brand information goes here." },
        { title: "Specifications", content: "Product specifications are listed here." },
        { title: "Warranty", content: "Warranty details and coverage information." },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleAddToWishlist = async (e, offer) => {
        e.preventDefault(); // Prevent default behavior

        // Get user data from localStorage
        const userData = localStorage.getItem("currentUser");
        const user = userData ? JSON.parse(userData) : null;

        // Fallback data for missing fields
        const staticData = {
            product_url: "/",
            image_url: "https://via.placeholder.com/2000x2000?text=No+Image",
            brand: "Unknown Brand",
            productId: "00000",
            productName: "Default Product",
            productSku: "DEFAULTSKU",
            price: 0.0,
            discount: 0
        };

        // Merge offer data with fallback values
        const offerData = {
            product_url: offer.product_url || staticData.product_url,
            image_url: offer.image_url || staticData.image_url,
            brand: offer.brand || staticData.brand,
            productId: offer.productId || staticData.productId,
            productName: offer.productName || staticData.productName,
            productSku: offer.productSku || staticData.productSku,
            price: offer.price || staticData.price,
            discount: offer.discount || staticData.discount
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
        const fetchAndFilterProducts = async () => {
            try {
                // setLoading(true);
                const productName = searchParams.get("brand"); // Get product name from URL
                console.log("Product Name from URL:", productName);

                const productsRef = collection(fireStore, "create_Product");
                let q = productsRef; // Default: fetch all products

                if (productName) {
                    q = query(productsRef, where("productData.productInfo.productName", "==", productName));
                }

                const querySnapshot = await getDocs(q);
                const fetchedProducts = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                if (fetchedProducts.length === 0) {
                    console.warn("No matching products found.");
                }

                setFilteredProducts(fetchedProducts);
                setProducts(fetchedProducts);
                // setLoading(false);
            } catch (error) {
                console.error("Error fetching products from Firestore:", error);
                // setLoading(false);
            }
        };

        fetchAndFilterProducts();
    }, [searchParams]);

    // product from firebase
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
                localStorage.setItem('product', JSON.stringify(products));
                setBestOffers(products);
            } catch (error) {
                console.error("Error fetching products: ", error);
            }
        };

        // Call the async function
        fetchProducts();
    }, []);


    const changeQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            toast.error("Quantity cannot be less than 1.");
            return;
        }

        const userData = localStorage.getItem("currentUser");

        if (!userData) {
            console.log("No user logged in. Updating quantity in guest cart.");

            // Get guest cart from localStorage
            const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
            const updatedCart = guestCart.map(item =>
                item.id === productId
                    ? {
                        ...item, productData: {
                            ...item.productData,
                            productInfo: {
                                ...item.productData.productInfo,
                                quantity: newQuantity.toString()
                            }
                        }
                    }
                    : item
            );

            localStorage.setItem("guestCart", JSON.stringify(updatedCart));
            setCartItems(updatedCart);
            toast.success("Quantity updated!");
            return;
        }

        // Parse user data
        const user = JSON.parse(userData);
        const userId = user?.uid;

        if (userId) {
            try {
                const userRef = doc(fireStore, "create_Product", userId);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userCart = userDoc.data().cart || [];

                    // Update the quantity inside productData.productInfo.quantity
                    const updatedCart = userCart.map(item =>
                        item.id === productId
                            ? {
                                ...item, productData: {
                                    ...item.productData,
                                    productInfo: {
                                        ...item.productData.productInfo,
                                        quantity: newQuantity.toString() // Store as a string
                                    }
                                }
                            }
                            : item
                    );

                    await updateDoc(userRef, { cart: updatedCart });

                    // Fetch updated cart from Firestore
                    const refreshedDoc = await getDoc(userRef);
                    const refreshedCart = refreshedDoc.data().cart || [];

                    setCartItems(refreshedCart);

                    console.log(`Updated quantity of item with productId: ${productId} to ${newQuantity}`);
                    toast.success("Quantity updated!");
                } else {
                    console.log("User document not found.");
                }
            } catch (error) {
                console.error("Error updating quantity in cart:", error);
                toast.error("Error updating quantity.");
            }
        }
    };

    const handleCheckout = (e) => {
        e.preventDefault(); // Prevent the default link navigation
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            router.push('/home/checkout'); // Navigate to the checkout page
        } else {
            toast.error("Please log in to proceed to checkout.");
            router.push('/myAccount/SignUp');
        }
        setIsCartOpen(false); // Close the cart (if you have this state)
        // add new code
    };

    return (
        <>
            <div className="wd-page-content main-page-wrapper">
                <main
                    className="wd-content-layout content-layout-wrapper container wd-builder-on"
                    role="main">
                    <div className="wd-content-area site-content">
                        <div
                            className="single-product-page entry-content product type-product post-2435 status-publish first instock product_cat-vr-headsets has-post-thumbnail sale shipping-taxable purchasable product-type-simple"
                            id="product-2435">
                            <style
                                dangerouslySetInnerHTML={{
                                    __html:
                                        '.vc_custom_1674485730944{margin-top: -40px !important;margin-bottom: 20px !important;padding-top: 20px !important;padding-bottom: 20px !important;background-color: #ffffff !important;}.vc_custom_1673010868777{margin-right: -10px !important;margin-left: -10px !important;}.vc_custom_1731502193548{margin-right: 0px !important;margin-bottom: 80px !important;margin-left: 0px !important;padding-top: 20px !important;padding-right: 5px !important;padding-bottom: 20px !important;padding-left: 5px !important;background-color: #ffffff !important;border-radius: 10px !important;}.vc_custom_1669134772241{margin-bottom: 80px !important;}.vc_custom_1669135567733{padding-top: 0px !important;}.vc_custom_1664546082340{margin-bottom: 10px !important;}.vc_custom_1645191733973{margin-bottom: 10px !important;}.vc_custom_1674055430857{padding-top: 0px !important;}.vc_custom_1674142019727{padding-top: 0px !important;}.vc_custom_1661586460519{margin-bottom: 20px !important;}.vc_custom_1670425100192{margin-bottom: 15px !important;}.vc_custom_1666278566087{margin-right: 0px !important;margin-bottom: 20px !important;margin-left: 0px !important;padding-top: 20px !important;padding-right: 5px !important;padding-left: 5px !important;background-color: rgba(28,97,231,0.1) !important;*background-color: rgb(28,97,231) !important;border-radius: 10px !important;}.vc_custom_1666277599876{margin-bottom: 20px !important;}.vc_custom_1675763666068{margin-bottom: 20px !important;}.vc_custom_1644414902227{margin-bottom: 20px !important;}.vc_custom_1675240747389{margin-bottom: 10px !important;}.vc_custom_1666277662511{margin-bottom: 20px !important;}.vc_custom_1673620565601{padding-top: 0px !important;}.vc_custom_1666277043647{margin-bottom: 20px !important;}.vc_custom_1666277049247{margin-bottom: 20px !important;}.vc_custom_1666274584416{padding-top: 0px !important;}.vc_custom_1666278440432{margin-bottom: 20px !important;}.vc_custom_1675240275015{margin-right: 10% !important;margin-bottom: 20px !important;}.vc_custom_1673008596198{margin-bottom: 20px !important;border-top-width: 1px !important;border-right-width: 1px !important;border-bottom-width: 1px !important;border-left-width: 1px !important;padding-top: 8px !important;padding-right: 12px !important;padding-bottom: 8px !important;padding-left: 12px !important;border-left-color: #205acf !important;border-left-style: dotted !important;border-right-color: #205acf !important;border-right-style: dotted !important;border-top-color: #205acf !important;border-top-style: dotted !important;border-bottom-color: #205acf !important;border-bottom-style: dotted !important;border-radius: 5px !important;}.vc_custom_1674142174161{padding-top: 0px !important;}.vc_custom_1674056069124{margin-bottom: 20px !important;}.vc_custom_1674142114518{margin-left: 20px !important;}.vc_custom_1663078849081{padding-top: 0px !important;}.vc_custom_1663937059655{margin-right: 20px !important;margin-bottom: 12px !important;}.vc_custom_1663937064916{margin-bottom: 12px !important;}.vc_custom_1666277639691{margin-right: -6px !important;margin-bottom: 14px !important;}.vc_custom_1666275569983{padding-top: 0px !important;}.vc_custom_1666275537205{margin-right: 20px !important;margin-bottom: 10px !important;}.vc_custom_1666275533341{margin-bottom: 10px !important;}.vc_custom_1666272235114{padding-top: 0px !important;}.vc_custom_1671543649151{margin-bottom: 20px !important;padding-top: 20px !important;padding-right: 20px !important;padding-bottom: 20px !important;padding-left: 20px !important;background-color: #ffffff !important;border-radius: 10px !important;}.vc_custom_1673010898310{margin-bottom: 20px !important;padding-top: 20px !important;padding-right: 20px !important;padding-bottom: 20px !important;padding-left: 20px !important;background-color: #ffffff !important;border-radius: 10px !important;}.vc_custom_1673011002782{margin-bottom: 20px !important;padding-top: 0px !important;}.vc_custom_1666273659357{margin-bottom: 0px !important;}.vc_custom_1669135532348{padding-top: 20px !important;padding-right: 20px !important;padding-bottom: 20px !important;padding-left: 20px !important;background-color: #ffffff !important;border-radius: 10px !important;}.vc_custom_1670337531889{margin-bottom: 20px !important;border-bottom-width: 1px !important;padding-bottom: 20px !important;border-bottom-color: rgba(0,0,0,0.11) !important;border-bottom-style: solid !important;}.vc_custom_1670333298869{margin-bottom: 20px !important;border-bottom-width: 1px !important;padding-bottom: 20px !important;border-bottom-color: rgba(0,0,0,0.11) !important;border-bottom-style: solid !important;}.vc_custom_1670336845628{margin-bottom: 20px !important;border-bottom-width: 1px !important;padding-bottom: 20px !important;border-bottom-color: rgba(0,0,0,0.11) !important;border-bottom-style: solid !important;}.vc_custom_1670333571611{margin-bottom: 20px !important;border-bottom-width: 1px !important;padding-bottom: 20px !important;border-bottom-color: rgba(0,0,0,0.11) !important;border-bottom-style: solid !important;}.vc_custom_1670333722123{margin-bottom: 20px !important;border-bottom-width: 1px !important;padding-bottom: 20px !important;border-bottom-color: rgba(0,0,0,0.11) !important;border-bottom-style: solid !important;}.vc_custom_1670333839351{margin-bottom: 20px !important;border-bottom-width: 1px !important;padding-bottom: 20px !important;border-bottom-color: rgba(0,0,0,0.11) !important;border-bottom-style: solid !important;}.vc_custom_1670337097307{margin-bottom: 20px !important;border-bottom-width: 1px !important;padding-bottom: 20px !important;border-bottom-color: rgba(0,0,0,0.11) !important;border-bottom-style: solid !important;}.vc_custom_1670417619685{margin-bottom: 20px !important;border-bottom-width: 1px !important;padding-bottom: 20px !important;border-bottom-color: rgba(0,0,0,0.11) !important;border-bottom-style: solid !important;}.vc_custom_1670334919429{margin-bottom: 20px !important;border-bottom-width: 1px !important;padding-bottom: 20px !important;border-bottom-color: rgba(0,0,0,0.11) !important;border-bottom-style: solid !important;}.vc_custom_1670336370333{margin-bottom: 0px !important;}.vc_custom_1666274326663{padding-top: 0px !important;}.vc_custom_1675853585442{margin-bottom: 0px !important;}.vc_custom_1666277548917{padding-top: 0px !important;}.vc_custom_1703775910293{margin-bottom: 0px !important;}.wd-rs-637cfccdccfdd > .vc_column-inner > .wpb_wrapper{justify-content: space-between}.wd-rs-6336f520a769d{width: auto !important;max-width: auto !important;}.wd-rs-620fa22eda02d{width: auto !important;max-width: auto !important;}html .wd-rs-6390a9d10a24e.wd-single-title .product_title{font-size: 28px;}.wd-rs-6390a9d10a24e{width: 100% !important;max-width: 100% !important;}.wd-rs-635160d715add.wd-single-countdown .element-title{font-size: 14px;font-weight: 600;}.wd-rs-63c16c51d2bb9 > .vc_column-inner > .wpb_wrapper{justify-content: space-between}.wd-rs-63515eaf9ecf7{width: auto !important;max-width: auto !important;}.wd-rs-63515eb300c21{width: auto !important;max-width: auto !important;}.wd-rs-6351551373f96 > .vc_column-inner > .wpb_wrapper{align-items: center;}.wd-rs-63da234e04f15{width: auto !important;max-width: auto !important;}.wd-rs-63c961da69c5c > .vc_column-inner > .wpb_wrapper{align-items: center;}.wd-rs-63c811812f7ea .price, .wd-rs-63c811812f7ea .price del, .wd-rs-63c811812f7ea .amount{font-size: 34px;}.wd-rs-63c811812f7ea{width: auto !important;max-width: auto !important;}.wd-rs-63c9619e0428e{width: auto !important;max-width: auto !important;}.wd-rs-632091ba53b3e > .vc_column-inner > .wpb_wrapper{align-items: flex-end;}.wd-rs-632091d71eeaa > .vc_column-inner > .wpb_wrapper{justify-content: flex-end}.wd-rs-632daa1fc06be .wd-compare-btn[class*="wd-style-"] > a:before, .wd-rs-632daa1fc06be .wd-compare-btn[class*="wd-style-"] > a:after{font-size: 16px;}.wd-rs-632daa1fc06be{width: auto !important;max-width: auto !important;}.wd-rs-632daa24d1169 .wd-wishlist-btn[class*="wd-style-"] > a:before, .wd-rs-632daa24d1169 .wd-wishlist-btn[class*="wd-style-"] > a:after{font-size: 16px;}.wd-rs-632daa24d1169{width: auto !important;max-width: auto !important;}.wd-rs-635160fd64578{width: auto !important;max-width: auto !important;}.wd-rs-635158eae79ac > .vc_column-inner > .wpb_wrapper{align-items: center;}.wd-rs-635158c62aefd{--wd-brd-radius: 0px;}.wd-rs-638f53f6e14b5 .title-text{font-size: 18px;text-transform: capitalize;}.wd-rs-638f53f6e14b5 .shop_attributes{--wd-attr-col: 1;--wd-attr-v-gap: 20px;}.wd-rs-638f53f6e14b5 .woocommerce-product-attributes-item__value{font-weight: 600;color: #242424;}.wd-rs-638f434d1174d .title-text{font-size: 18px;text-transform: capitalize;}.wd-rs-638f434d1174d .shop_attributes{--wd-attr-col: 1;--wd-attr-v-gap: 20px;}.wd-rs-638f434d1174d .woocommerce-product-attributes-item__value{font-weight: 600;color: #242424;}.wd-rs-638f5145f016c .title-text{font-size: 18px;text-transform: capitalize;}.wd-rs-638f5145f016c .shop_attributes{--wd-attr-col: 1;--wd-attr-v-gap: 20px;}.wd-rs-638f5145f016c .woocommerce-product-attributes-item__value{font-weight: 600;color: #242424;}.wd-rs-638f447b5bee0 .title-text{font-size: 18px;text-transform: capitalize;}.wd-rs-638f447b5bee0 .shop_attributes{--wd-attr-col: 1;--wd-attr-v-gap: 20px;}.wd-rs-638f447b5bee0 .woocommerce-product-attributes-item__value{font-weight: 600;color: #242424;}.wd-rs-638f44f9955df .title-text{font-size: 18px;text-transform: capitalize;}.wd-rs-638f44f9955df .shop_attributes{--wd-attr-col: 1;--wd-attr-v-gap: 20px;}.wd-rs-638f44f9955df .woocommerce-product-attributes-item__value{font-weight: 600;color: #242424;}.wd-rs-638f4570d2550 .title-text{font-size: 18px;text-transform: capitalize;}.wd-rs-638f4570d2550 .shop_attributes{--wd-attr-col: 1;--wd-attr-v-gap: 20px;}.wd-rs-638f4570d2550 .woocommerce-product-attributes-item__value{font-weight: 600;color: #242424;}.wd-rs-638f5243ca063 .title-text{font-size: 18px;text-transform: capitalize;}.wd-rs-638f5243ca063 .shop_attributes{--wd-attr-col: 1;--wd-attr-v-gap: 20px;}.wd-rs-638f5243ca063 .woocommerce-product-attributes-item__value{font-weight: 600;color: #242424;}.wd-rs-63908cc0b5b60 .title-text{font-size: 18px;text-transform: capitalize;}.wd-rs-63908cc0b5b60 .shop_attributes{--wd-attr-col: 1;--wd-attr-v-gap: 20px;}.wd-rs-63908cc0b5b60 .woocommerce-product-attributes-item__value{font-weight: 600;color: #242424;}.wd-rs-638f49ba063d1 .title-text{font-size: 18px;text-transform: capitalize;}.wd-rs-638f49ba063d1 .shop_attributes{--wd-attr-col: 1;--wd-attr-v-gap: 20px;}.wd-rs-638f49ba063d1 .woocommerce-product-attributes-item__value{font-weight: 600;color: #242424;}.wd-rs-638f4f665e689 .title-text{font-size: 18px;text-transform: capitalize;}.wd-rs-638f4f665e689 .shop_attributes{--wd-attr-col: 1;--wd-attr-v-gap: 20px;}.wd-rs-638f4f665e689 .woocommerce-product-attributes-item__value{font-weight: 600;color: #242424;}.wd-rs-658d8ea1cfaf3 .wd-el-title{text-transform: capitalize;}.wd-rs-658d8ea1cfaf3 .wd-products-with-bg, .wd-rs-658d8ea1cfaf3.wd-products-with-bg, .wd-rs-658d8ea1cfaf3 .wd-products-with-bg .wd-product, .wd-rs-658d8ea1cfaf3.wd-products-with-bg .wd-product{--wd-prod-bg:rgb(255,255,255); --wd-bordered-bg:rgb(255,255,255);}.wd-rs-658d8ea799114 .wd-products-with-bg, .wd-rs-658d8ea799114.wd-products-with-bg, .wd-rs-658d8ea799114 .wd-products-with-bg .wd-product, .wd-rs-658d8ea799114.wd-products-with-bg .wd-product{--wd-prod-bg:rgb(255,255,255); --wd-bordered-bg:rgb(255,255,255);}@media (max-width: 1199px) { html .wd-rs-6390a9d10a24e.wd-single-title .product_title{font-size: 24px;}.wd-rs-635160d715add{width: 100% !important;max-width: 100% !important;}.wd-rs-63e21fb628f6d{width: 100% !important;max-width: 100% !important;}.wd-rs-63c811812f7ea .price, .wd-rs-63c811812f7ea .price del, .wd-rs-63c811812f7ea .amount{font-size: 28px;}.wd-rs-632091d71eeaa > .vc_column-inner > .wpb_wrapper{justify-content: flex-start} }@media (max-width: 767px) { html .wd-rs-6390a9d10a24e.wd-single-title .product_title{font-size: 22px;}.wd-rs-6390a9d10a24e{width: 100% !important;max-width: 100% !important;}.wd-rs-63c811812f7ea .price, .wd-rs-63c811812f7ea .price del, .wd-rs-63c811812f7ea .amount{font-size: 22px;}.wd-rs-635160fd64578{width: 100% !important;max-width: 100% !important;}.wd-rs-63a1bb5d0c6c4 .element-title{font-size: 20px;}.wd-rs-638f53f6e14b5 .shop_attributes{--wd-attr-col: 1;}.wd-rs-638f434d1174d .shop_attributes{--wd-attr-col: 1;}.wd-rs-638f5145f016c .shop_attributes{--wd-attr-col: 1;}.wd-rs-638f447b5bee0 .shop_attributes{--wd-attr-col: 1;}.wd-rs-638f44f9955df .shop_attributes{--wd-attr-col: 1;}.wd-rs-638f4570d2550 .shop_attributes{--wd-attr-col: 1;}.wd-rs-638f5243ca063 .shop_attributes{--wd-attr-col: 1;}.wd-rs-63908cc0b5b60 .shop_attributes{--wd-attr-col: 1;}.wd-rs-638f49ba063d1 .shop_attributes{--wd-attr-col: 1;}.wd-rs-638f4f665e689 .shop_attributes{--wd-attr-col: 1;}.wd-rs-658d8ea1cfaf3 .wd-el-title{font-size: 20px;}.wd-rs-658d8ea799114 .wd-el-title{font-size: 20px;} }#wd-63da234e04f15 .title-after_title{line-height:25px;font-size:15px;}#wd-63b815c9407f5.wd-text-block{line-height:23px;font-size:13px;}@media (max-width: 1199px) {html .wd-rs-6734a069c33ec{margin-bottom:60px !important;}html .wd-rs-637cf9ac381a5{margin-bottom:40px !important;}html .wd-rs-6351601d14a1e{margin-bottom:10px !important;}html .wd-rs-635164a092f94{padding-bottom:10px !important;}html .wd-rs-635160d715add{margin-bottom:15px !important;}html .wd-rs-63e21fb628f6d{margin-right:0px !important;}html .wd-rs-6351641f2eb53{margin-bottom:10px !important;}html .wd-rs-63da234e04f15{margin-right:0px !important;margin-bottom:10px !important;}html .wd-rs-632daa1fc06be{margin-bottom:20px !important;}html .wd-rs-632daa24d1169{margin-bottom:20px !important;}html .wd-rs-635160fd64578{margin-right:0px !important;margin-bottom:0px !important;}}@media (max-width: 767px) {html .wd-rs-6734a069c33ec{margin-bottom:40px !important;}html .wd-rs-637cf9ac381a5{margin-bottom:20px !important;}html .wd-rs-63b81ecbada64 > .vc_column-inner{margin-right:0px !important;}html .wd-rs-63b81f3631c2e > .vc_column-inner{margin-bottom:0px !important;}}',
                                }}
                                data-type="vc_shortcodes-custom-css"
                            />

                            <div className="wpb-content-wrapper">
                                <section className="vc_section vc_custom_1674485730944 vc_section-has-fill wd-rs-63ce9fdfb6cfd wd-section-stretch">
                                    <div className="vc_row wpb_row vc_row-fluid wd-rs-6351601d14a1e">
                                        <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-637cfccdccfdd">
                                            <div className="vc_column-inner vc_custom_1669135567733">
                                                <div className="wpb_wrapper">

                                                    <div className="wd-single-nav wd-wpb wd-rs-620fa22eda02d hidden-xs wd-enabled-width vc_custom_1645191733973 text-left">
                                                        <div className="wd-products-nav">

                                                            <a
                                                                className="wd-product-nav-btn wd-btn-back wd-tooltip"
                                                                href="/home/productCategoary">
                                                                <span>Back to products</span>
                                                            </a>

                                                        </div>
                                                    </div>
                                                    <div className="wd-wc-notices wd-wpb wd-rs-6203c27ca93ae">
                                                        <div className="woocommerce-notices-wrapper" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {filteredProducts.map((item, index) => (
                                        <div className="vc_row wpb_row vc_row-fluid vc_row-o-equal-height vc_row-flex wd-rs-63c961a47cbd5" key={index}>
                                            <div className="wpb_column vc_column_container vc_col-sm-6 vc_col-xs-12 woodmart-sticky-column wd_sticky_offset_150 wd-rs-63c80f01d23e4">
                                                <div
                                                    className="vc_column-inner vc_custom_1674055430857"
                                                    style={{
                                                        position: "relative",
                                                    }}>
                                                    <div
                                                        className="wpb_wrapper is_stuck"
                                                        style={{
                                                            position: "sticky",
                                                            top: "150px",
                                                        }}>
                                                        <div className="wd-single-gallery wd-wpb wd-rs-6309cbf997419 vc_custom_1661586460519">
                                                            <div
                                                                className="woocommerce-product-gallery woocommerce-product-gallery--with-images woocommerce-product-gallery--columns-4 images wd-has-thumb thumbs-position-left wd-thumbs-wrap images image-action-zoom"
                                                                style={{
                                                                    "--wd-thumbs-height": "594px",
                                                                    opacity: "1",
                                                                }}>
                                                                <div className="wd-carousel-container wd-gallery-images">
                                                                    <div className="wd-carousel-inner">

                                                                        <figure
                                                                            className="woocommerce-product-gallery__wrapper wd-carousel wd-grid wd-initialized wd-horizontal wd-backface-hidden"
                                                                            style={{
                                                                                "--wd-col-lg": "1",
                                                                                "--wd-col-md": "1",
                                                                                "--wd-col-sm": "1",
                                                                            }}>
                                                                            <div
                                                                                className="wd-carousel-wrap"
                                                                                style={{
                                                                                    cursor: "grab",
                                                                                }}>
                                                                                <div
                                                                                    className={`wd-carousel-item ${index === 0 ? "wd-active" : ""}`}
                                                                                    key={item.productId}
                                                                                    style={{
                                                                                        width: "431px",
                                                                                    }}
                                                                                >
                                                                                    <figure
                                                                                        className="woocommerce-product-gallery__image"
                                                                                        data-thumb={item.image_url || ""} // Dynamically set thumbnail URL (first image or empty string)
                                                                                        style={{
                                                                                            overflow: "hidden",
                                                                                            position: "relative",
                                                                                        }}
                                                                                    >
                                                                                        <a
                                                                                            data-elementor-open-lightbox="no"
                                                                                            href={item.image_url || "#"} // Link to the first image URL or fallback
                                                                                        >
                                                                                            <img
                                                                                                alt={item.productData.productInfo.productName || "Product Image"} // Dynamically set alt text from productName
                                                                                                className="wp-post-image imagify-no-webp wp-post-image"
                                                                                                decoding="async"
                                                                                                fetchPriority="high"
                                                                                                height="800"
                                                                                                sizes="(max-width: 700px) 100vw, 700px"
                                                                                                src={item.productData.productImages[0] || "https://via.placeholder.com/700x800?text=No+Image"} // Use first image URL or placeholder
                                                                                                title={item.productData.productInfo.productName || "Product Image"} // Dynamically set title
                                                                                                width="700"
                                                                                            />
                                                                                        </a>
                                                                                    </figure>
                                                                                </div>

                                                                            </div>
                                                                        </figure>

                                                                        <div className="product-additional-galleries">
                                                                            <div className="wd-show-product-gallery-wrap wd-action-btn wd-style-icon-bg-text wd-gallery-btn">
                                                                                <a
                                                                                    className="woodmart-show-product-gallery"

                                                                                    rel="nofollow">
                                                                                    <span>Click to enlarge</span>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="wpb_column vc_column_container vc_col-sm-6 vc_col-xs-12 woodmart-sticky-column wd_sticky_offset_150 wd-rs-63c9614087a6e">
                                                <div className="vc_column-inner vc_custom_1674142019727">
                                                    <div className="wpb_wrapper">
                                                        <div className="wd-single-title wd-wpb wd-rs-6390a9d10a24e wd-enabled-width vc_custom_1670425100192 text-left">
                                                            <h1 className="product_title entry-title wd-entities-title">
                                                                {item.productData.productInfo.productName}
                                                            </h1>
                                                        </div>
                                                        <div className="vc_row wpb_row vc_inner vc_row-fluid vc_row-o-content-middle vc_row-flex wd-rs-63c960dc91465">
                                                            <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-63c16c51d2bb9">
                                                                <div className="vc_column-inner vc_custom_1673620565601">
                                                                    <div className="wpb_wrapper">
                                                                        <div className="wd-single-rating wd-wpb wd-rs-63515eaf9ecf7 wd-enabled-width vc_custom_1666277043647 text-left">
                                                                            <div className="woocommerce-product-rating">
                                                                                <div className="star-rating" role="img" aria-label={`Rated ${item.rating} out of 5`}>
                                                                                    <span style={{ width: `${(item.rating / 5) * 100}%` }}>
                                                                                        Rated <strong className="rating">{item.rating}</strong> out of 5
                                                                                    </span>
                                                                                </div>
                                                                                <a
                                                                                    className="woocommerce-review-link"
                                                                                    href="#reviews"
                                                                                    rel="nofollow">
                                                                                    (<span className="count">2</span> customer
                                                                                    reviews)
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                        <div className="wd-single-meta wd-wpb wd-rs-63515eb300c21 wd-enabled-width vc_custom_1666277049247 text-left">
                                                                            <div className="product_meta wd-layout-inline">
                                                                                <span className="sku_wrapper">
                                                                                    <span className="meta-label">SKU:</span>
                                                                                    <span className="sku">{item.id}</span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1666278566087 vc_row-has-fill wd-rs-635164a092f94">
                                                            <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-6351551373f96">
                                                                <div className="vc_column-inner vc_custom_1666274584416">
                                                                    <div className="wpb_wrapper">
                                                                        <div
                                                                            className="wd-image wd-wpb wd-rs-6351641f2eb53 text-left vc_custom_1666278440432 inline-element"
                                                                            id="wd-6351641f2eb53">
                                                                            <img
                                                                                decoding="async"
                                                                                height="32"
                                                                                src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/promotions.svg"
                                                                                title="promotions"
                                                                                width="32"
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-63da234e04f15 wd-enabled-width wd-title-color-default wd-title-style-default text-left vc_custom_1675240275015 wd-underline-colored"
                                                                            id="wd-63da234e04f15">
                                                                            <div className="liner-continer">
                                                                                <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-m">
                                                                                    Apple Shopping Event
                                                                                </h4>
                                                                            </div>
                                                                            <div className="title-after_title reset-last-child  wd-fontsize-xs">
                                                                                Hurry and get discounts on all Apple devices up
                                                                                to 20%
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="wd-text-block wd-wpb reset-last-child inline-element wd-rs-63b815c9407f5 text-left wd-font-weight-600 color-primary wd-fontsize-custom vc_custom_1673008596198"
                                                                            id="wd-63b815c9407f5">
                                                                            <p>Sale_coupon_15</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="vc_row wpb_row vc_inner vc_row-fluid">
                                                            <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-63c961da69c5c">
                                                                <div className="vc_column-inner vc_custom_1674142174161">
                                                                    <div className="wpb_wrapper">
                                                                        <div className="wd-single-price wd-wpb wd-rs-63c811812f7ea wd-enabled-width vc_custom_1674056069124 text-left">
                                                                            <p className="price">
                                                                                <del aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {item.productData.priceInfo.Price}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </del>
                                                                                <span className="screen-reader-text">
                                                                                    Original price was: {item.productData.priceInfo.Price}.
                                                                                </span>
                                                                                <ins aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {item.productData.priceInfo.Price}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </ins>
                                                                                <span className="screen-reader-text">
                                                                                    {item.productData.priceInfo.Price}
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                        <div className="wd-single-stock-status wd-wpb wd-rs-63c9619e0428e wd-enabled-width vc_custom_1674142114518"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="wd-single-countdown wd-wpb wd-rs-635160d715add wd-enabled-width vc_custom_1666277599876 text-left" />
                                                        <div className="wd-single-add-cart wd-wpb wd-rs-63e21fb628f6d wd-enabled-width vc_custom_1675763666068 text-left wd-btn-design-full wd-design-default wd-swatch-layout-default wd-stock-status-off">
                                                            <form className="cart" >
                                                                <div className="quantity">
                                                                    <input type="button" defaultValue="-" className="minus btn" onClick={(e) => changeQuantity(item.id, parseInt(item.productData.productInfo.quantity, 10) - 1, e)} />
                                                                    <label className="screen-reader-text" htmlFor="quantity_679722f13d1f7">
                                                                        {item.productData.productInfo.productName}
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        id="quantity_679722f13d1f7"
                                                                        className="input-text qty text"

                                                                        value={item.productData.productInfo.quantity}

                                                                        onChange={(e) =>
                                                                            changeQuantity(

                                                                                item.id,
                                                                                parseInt(e.target.value),
                                                                                e
                                                                            )
                                                                        }
                                                                    />
                                                                    <input type="button" defaultValue="+" className="plus btn" onClick={(e) => changeQuantity(item.id, parseInt(item.productData.productInfo.quantity, 10) + 1, e)} />
                                                                </div>


                                                                <button
                                                                    className="single_add_to_cart_button button alt"
                                                                    name="add-to-cart"
                                                                    type="submit"
                                                                    value="2435"
                                                                    onClick={(e) => {
                                                                        e.preventDefault(); // Prevent form submission
                                                                        openCart(e, item);
                                                                    }}
                                                                >
                                                                    Add to cart
                                                                </button>

                                                                <button
                                                                    className="wd-buy-now-btn button alt"
                                                                    id="wd-add-to-cart"
                                                                    name="wd-add-to-cart"
                                                                    onClick={(e) => {
                                                                        e.preventDefault(); // Prevent form submission
                                                                        handleCheckout(e);
                                                                    }}
                                                                    type="button" // changed to "button" to prevent form submission
                                                                    value="2435"
                                                                >
                                                                    Buy now
                                                                </button>
                                                            </form>
                                                        </div>
                                                        <div className="vc_separator wpb_content_element vc_separator_align_center vc_sep_width_100 vc_sep_pos_align_center vc_separator_no_text vc_custom_1644414902227">
                                                            <span className="vc_sep_holder vc_sep_holder_l">
                                                                <span className="vc_sep_line" />
                                                            </span>
                                                            <span className="vc_sep_holder vc_sep_holder_r">
                                                                <span className="vc_sep_line" />
                                                            </span>
                                                        </div>
                                                        <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1675240747389 wd-rs-63da25268a823">
                                                            <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-7 wd-enabled-flex wd-rs-632091ba53b3e">
                                                                <div className="vc_column-inner vc_custom_1663078849081">
                                                                    <div className="wpb_wrapper">
                                                                        <div className="wd-single-action-btn wd-single-compare-btn wd-wpb wd-rs-632daa1fc06be wd-enabled-width vc_custom_1663937059655 text-left">
                                                                            <div className="wd-compare-btn product-compare-button wd-action-btn wd-compare-icon wd-style-text">
                                                                                <a
                                                                                    data-added-text="Compare products"
                                                                                    data-id="2435"
                                                                                    href="/"
                                                                                    rel="nofollow">
                                                                                    <span>Compare</span>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                        <div className="wd-single-action-btn wd-single-wishlist-btn wd-wpb wd-rs-632daa24d1169 wd-enabled-width vc_custom_1663937064916 text-left">
                                                                            <div className="wd-wishlist-btn wd-action-btn wd-wishlist-icon wd-style-text">
                                                                                <a
                                                                                    onClick={(e) => handleAddToWishlist(e, item)}
                                                                                    href="#"
                                                                                    data-key={item.productId}
                                                                                    data-product-id={item.productId}
                                                                                    rel="nofollow"
                                                                                    data-added-text="Browse Wishlist"
                                                                                >
                                                                                    <span>{isAdded ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-5 wd-enabled-flex wd-rs-632091d71eeaa">
                                                                <div className="vc_column-inner">
                                                                    <div className="wpb_wrapper">
                                                                        <div
                                                                            className=" wd-rs-635160fd64578 wd-enabled-width wd-social-icons vc_custom_1666277639691 wd-layout-inline wd-style-default wd-size-small social-share wd-shape-circle color-scheme-dark text-left"
                                                                            id="">
                                                                            <span className="wd-label">Share: </span>
                                                                            <a
                                                                                aria-label="Facebook social link"
                                                                                className=" wd-social-icon social-facebook"
                                                                                href="/"
                                                                                rel="noopener noreferrer nofollow"
                                                                                target="_blank">
                                                                                <span className="wd-icon" />
                                                                            </a>
                                                                            <a
                                                                                aria-label="X social link"
                                                                                className=" wd-social-icon social-twitter"
                                                                                href="/"
                                                                                rel="noopener noreferrer nofollow"
                                                                                target="_blank">
                                                                                <span className="wd-icon" />
                                                                            </a>
                                                                            <a
                                                                                aria-label="Pinterest social link"
                                                                                className=" wd-social-icon social-pinterest"
                                                                                href="/"
                                                                                rel="noopener noreferrer nofollow"
                                                                                target="_blank">
                                                                                <span className="wd-icon" />
                                                                            </a>
                                                                            <a
                                                                                aria-label="Linkedin social link"
                                                                                className=" wd-social-icon social-linkedin"
                                                                                href="/"
                                                                                rel="noopener noreferrer nofollow"
                                                                                target="_blank">
                                                                                <span className="wd-icon" />
                                                                            </a>
                                                                            <a
                                                                                aria-label="Telegram social link"
                                                                                className=" wd-social-icon social-tg"
                                                                                href="/"
                                                                                rel="noopener noreferrer nofollow"
                                                                                target="_blank">
                                                                                <span className="wd-icon" />
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="wd-product-info wd-visits-count wd-wpb wd-rs-63516115f0a98 vc_custom_1666277662511 wd-style-with-bg"
                                                            data-product-id="2435">
                                                            <span className="wd-info-icon" />
                                                            <span className="wd-info-number">18</span>
                                                            <span className="wd-info-msg">
                                                                People watching this product now!
                                                            </span>
                                                        </div>


                                                        <div className="vc_row wpb_row vc_inner vc_row-fluid wd-rs-635161cda23c7">
                                                            <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-635158eae79ac">
                                                                <div className="vc_column-inner vc_custom_1666275569983">
                                                                    <div className="wpb_wrapper">
                                                                        <div
                                                                            className="wd-text-block wd-wpb reset-last-child inline-element wd-rs-635158ccc1380 text-left wd-font-weight-600 color-title vc_custom_1666275537205"
                                                                            id="wd-635158ccc1380">
                                                                            <p>Payment Methods:</p>
                                                                        </div>
                                                                        <div
                                                                            className="wd-image wd-wpb wd-rs-635158c62aefd text-left vc_custom_1666275533341 inline-element"
                                                                            id="wd-635158c62aefd">
                                                                            <picture
                                                                                className="attachment-full size-full"
                                                                                decoding="async">
                                                                                <source
                                                                                    data-lazy-sizes="(max-width: 403px) 100vw, 403px"
                                                                                    data-lazy-srcset="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods.jpg.webp 403w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-400x26.jpg.webp 400w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-100x6.jpg.webp 100w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-180x12.jpg.webp 180w"
                                                                                    sizes="(max-width: 403px) 100vw, 403px"
                                                                                    srcSet="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods.jpg.webp 403w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-400x26.jpg.webp 400w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-100x6.jpg.webp 100w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-180x12.jpg.webp 180w"
                                                                                    type="image/webp"
                                                                                />
                                                                                <img
                                                                                    alt=""
                                                                                    className="entered lazyloaded"
                                                                                    data-lazy-sizes="(max-width: 403px) 100vw, 403px"
                                                                                    data-lazy-src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods.jpg"
                                                                                    data-lazy-srcset="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods.jpg 403w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-400x26.jpg 400w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-100x6.jpg 100w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-180x12.jpg 180w"
                                                                                    data-ll-status="loaded"
                                                                                    decoding="async"
                                                                                    height="26"
                                                                                    sizes="(max-width: 403px) 100vw, 403px"
                                                                                    src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods.jpg"
                                                                                    srcSet="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods.jpg 403w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-400x26.jpg 400w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-100x6.jpg 100w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-180x12.jpg 180w"
                                                                                    width="403"
                                                                                />
                                                                            </picture>
                                                                            <noscript>
                                                                                <picture
                                                                                    className="attachment-full size-full"
                                                                                    decoding="async">
                                                                                    <source
                                                                                        sizes="(max-width: 403px) 100vw, 403px"
                                                                                        srcSet="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods.jpg.webp 403w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-400x26.jpg.webp 400w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-100x6.jpg.webp 100w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-180x12.jpg.webp 180w"
                                                                                        type="image/webp"
                                                                                    />
                                                                                    <img
                                                                                        alt=""
                                                                                        decoding="async"
                                                                                        height="26"
                                                                                        sizes="(max-width: 403px) 100vw, 403px"
                                                                                        src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods.jpg"
                                                                                        srcSet="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods.jpg 403w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-400x26.jpg 400w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-100x6.jpg 100w, https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/payment-methods-180x12.jpg 180w"
                                                                                        width="403"
                                                                                    />
                                                                                </picture>
                                                                            </noscript>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </section>
                                <div className="vc_row wpb_row vc_row-fluid wd-rs-63a1bb62d1ae5">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-63514be4ee487">
                                        <div className="vc_column-inner vc_custom_1666272235114">
                                            <div className="wpb_wrapper">
                                                <div className="wd-single-fbt wd-wpb wd-rs-63a1bb5d0c6c4 vc_custom_1671543649151" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1673010868777 vc_column-gap-20 vc_row-o-equal-height vc_row-o-content-top vc_row-flex row-reverse-mobile wd-rs-63b81eae2486b">
                                    <div className="wpb_column vc_column_container vc_col-sm-7 vc_col-has-fill wd-rs-63b81ecbada64">
                                        <div className="vc_column-inner vc_custom_1673010898310">
                                            <div className="wpb_wrapper">
                                                <div
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-63516520354f3 wd-title-color-primary wd-title-style-default text-left  wd-underline-colored"
                                                    id="wd-63516520354f3">
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-l">
                                                            About this item
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div className="wd-single-content wd-wpb wd-rs-63515175a95d9 vc_custom_1666273659357">
                                                    <div className="wpb-content-wrapper">
                                                        <div className="vc_row wpb_row vc_row-fluid">
                                                            <div className="wpb_column vc_column_container vc_col-sm-12">
                                                                <div className="vc_column-inner">
                                                                    <div className="wpb_wrapper">
                                                                        <style
                                                                            dangerouslySetInnerHTML={{
                                                                                __html:
                                                                                    ".vc_custom_1669210741355{margin-bottom: 80px !important;}.vc_custom_1669037021051{margin-bottom: 60px !important;}.vc_custom_1669210349060{padding-top: 0px !important;}.vc_custom_1666272395956{padding-top: 0px !important;}.vc_custom_1669036882268{margin-bottom: 20px !important;}.vc_custom_1669036893045{margin-bottom: 20px !important;}.vc_custom_1669036907270{margin-right: -10px !important;margin-left: -10px !important;}.vc_custom_1669036912356{padding-top: 0px !important;padding-right: 10px !important;padding-left: 10px !important;}.vc_custom_1669036918822{padding-top: 0px !important;padding-right: 10px !important;padding-left: 10px !important;}.vc_custom_1669036924405{padding-top: 0px !important;padding-right: 10px !important;padding-left: 10px !important;}.vc_custom_1666272391679{padding-top: 0px !important;}.vc_custom_1669037049105{margin-bottom: 10px !important;}.vc_custom_1692715452533{margin-bottom: 0px !important;}.vc_custom_1692715447772{margin-bottom: 0px !important;padding-top: 20px !important;padding-right: 20px !important;padding-bottom: 20px !important;padding-left: 20px !important;background-color: #f6f6f6 !important;border-radius: 10px !important;}.vc_custom_1692715387161{margin-bottom: 0px !important;padding-top: 20px !important;padding-right: 20px !important;padding-bottom: 20px !important;padding-left: 20px !important;background-color: #f6f6f6 !important;border-radius: 10px !important;}.vc_custom_1692715390585{margin-bottom: 0px !important;padding-top: 20px !important;padding-right: 20px !important;padding-bottom: 20px !important;padding-left: 20px !important;background-color: #f6f6f6 !important;border-radius: 10px !important;}.wd-rs-6380b05382ab5{--wd-img-height: 680px;}.wd-rs-63c022c034eb0 .button-play{font-size: 70px;}.wd-rs-63c022c6af34b .button-play{font-size: 70px;}.wd-rs-63c022cb70b9c .button-play{font-size: 70px;}@media (max-width: 1199px) { .wd-rs-6380b05382ab5{--wd-img-height: 580px;} }@media (max-width: 767px) { .wd-rs-6380b05382ab5{--wd-img-height: 480px;} }#wd-6380b05382ab5 .banner-title{line-height:62px;font-size:52px;}#wd-6380b05382ab5 .banner-inner{line-height:44px;font-size:34px;}#wd-637b7be4f17e3 .woodmart-title-container{line-height:44px;font-size:34px;}#wd-637b7bfad3611.wd-text-block{line-height:34px;font-size:24px;}@media (max-width: 1199px) {.website-wrapper .wd-rs-637e226b50438{margin-bottom:60px !important;}.website-wrapper .wd-rs-637b7bd950bb2{margin-bottom:40px !important;}#wd-6380b05382ab5 .banner-title{line-height:44px;font-size:34px;}#wd-6380b05382ab5 .banner-inner{line-height:32px;font-size:22px;}#wd-637b7be4f17e3 .woodmart-title-container{line-height:34px;font-size:24px;}#wd-637b7bfad3611.wd-text-block{line-height:32px;font-size:22px;}}@media (max-width: 767px) {.website-wrapper .wd-rs-637e226b50438{margin-bottom:40px !important;}.website-wrapper .wd-rs-637b7bd950bb2{margin-bottom:20px !important;}#wd-6380b05382ab5 .banner-title{line-height:32px;font-size:22px;}#wd-6380b05382ab5 .banner-inner{line-height:28px;font-size:18px;}#wd-637b7be4f17e3 .woodmart-title-container{line-height:32px;font-size:22px;}#wd-637b7bfad3611.wd-text-block{line-height:30px;font-size:20px;}}",
                                                                            }}
                                                                            data-type="vc_shortcodes-custom-css"
                                                                        />
                                                                        <div className="wpb-content-wrapper">


                                                                            <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1670856699156 vc_row-has-fill wd-rs-63973ff6c9ef6">
                                                                                <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-6213ac5daaf9d">
                                                                                    <div className="vc_column-inner vc_custom_1645456482508">
                                                                                        <div className="wpb_wrapper">

                                                                                            <div
                                                                                                id="wd-63caae15ba090"
                                                                                                className="wd-accordion wd-wpb wd-rs-63caae15ba090 vc_custom_1674227228977 wd-style-default wd-border-off wd-titles-left wd-opener-pos-right wd-opener-style-arrow wd-inited"
                                                                                                data-state="first"
                                                                                            >
                                                                                                {accordionData.map((item, index) => (
                                                                                                    <div key={index} className="wd-accordion-item">
                                                                                                        <div
                                                                                                            className={`wd-accordion-title font-primary wd-fontsize-s wd-font-weight-600 ${openIndex === index ? "wd-active" : ""
                                                                                                                }`}
                                                                                                            onClick={() => toggleAccordion(index)}
                                                                                                        >
                                                                                                            <div className="wd-accordion-title-text">
                                                                                                                <span>{item.title}</span>
                                                                                                            </div>
                                                                                                            <span className="wd-accordion-opener" />
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="wd-accordion-content wd-entry-content"
                                                                                                            style={{ display: openIndex === index ? "block" : "none" }}
                                                                                                        >
                                                                                                            <p>{item.content}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="wpb_column vc_column_container vc_col-sm-5 woodmart-sticky-column wd_sticky_offset_150 wd-rs-63b81f3631c2e">
                                        <div
                                            className="vc_column-inner vc_custom_1673011002782"
                                            style={{
                                                position: "relative",
                                            }}>
                                            <div
                                                className="wpb_wrapper is_stuck"
                                                style={{
                                                    position: "sticky",
                                                    top: "150px",
                                                }}>
                                                <div className="vc_row wpb_row vc_inner vc_row-fluid wd-rs-637cfc6a79b8b">
                                                    <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-has-fill wd-rs-637cfca7ed7cb">
                                                        <div className="vc_column-inner vc_custom_1669135532348">
                                                            <div className="wpb_wrapper">
                                                                <div
                                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-635145516dd72 wd-title-color-primary wd-title-style-default text-left  wd-underline-colored"
                                                                    id="wd-635145516dd72">
                                                                    <div className="liner-continer">
                                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-l">
                                                                            Specification
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                                <div className="wd-single-attrs wd-wpb wd-rs-638f53f6e14b5 vc_custom_1670337531889 wd-layout-list wd-style-default">
                                                                    <h4 className="wd-el-title title element-title">
                                                                        <span className="title-icon">
                                                                            <img
                                                                                className="entered lazyloaded"
                                                                                data-lazy-src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/overview.svg"
                                                                                data-ll-status="loaded"
                                                                                decoding="async"
                                                                                height="24"
                                                                                src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/overview.svg"
                                                                                title="overview"
                                                                                width="24"
                                                                            />
                                                                            <noscript>
                                                                                <img
                                                                                    decoding="async"
                                                                                    height="24"
                                                                                    loading="lazy"
                                                                                    src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/overview.svg"
                                                                                    title="overview"
                                                                                    width="24"
                                                                                />
                                                                            </noscript>
                                                                        </span>
                                                                        <span className="title-text">Overview</span>
                                                                    </h4>
                                                                    <table
                                                                        aria-label="Product Details"
                                                                        className="woocommerce-product-attributes shop_attributes">
                                                                        <tbody>
                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_brand">
                                                                                <th
                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                    scope="row">
                                                                                    <span className="wd-attr-name">
                                                                                        <span className="wd-attr-name-label">
                                                                                            Brand
                                                                                        </span>
                                                                                    </span>
                                                                                </th>
                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                    <span className="wd-attr-term">
                                                                                        <p>Oki</p>
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_compatibility">
                                                                                <th
                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                    scope="row">
                                                                                    <span className="wd-attr-name">
                                                                                        <span className="wd-attr-name-label">
                                                                                            Compatibility
                                                                                        </span>
                                                                                    </span>
                                                                                </th>
                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                    <span className="wd-attr-term">
                                                                                        <p>PC</p>
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                <div className="wd-single-attrs wd-wpb wd-rs-638f4f665e689 vc_custom_1670336370333 wd-layout-list wd-style-default">
                                                                    <h4 className="wd-el-title title element-title">
                                                                        <span className="title-icon">
                                                                            <img
                                                                                className="entered lazyloaded"
                                                                                data-lazy-src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/general.svg"
                                                                                data-ll-status="loaded"
                                                                                decoding="async"
                                                                                height="24"
                                                                                src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/general.svg"
                                                                                title="general"
                                                                                width="24"
                                                                            />
                                                                            <noscript>
                                                                                <img
                                                                                    decoding="async"
                                                                                    height="24"
                                                                                    loading="lazy"
                                                                                    src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/10/general.svg"
                                                                                    title="general"
                                                                                    width="24"
                                                                                />
                                                                            </noscript>
                                                                        </span>
                                                                        <span className="title-text">General</span>
                                                                    </h4>
                                                                    <table
                                                                        aria-label="Product Details"
                                                                        className="woocommerce-product-attributes shop_attributes">
                                                                        <tbody>
                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_color">
                                                                                <th
                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                    scope="row">
                                                                                    <span className="wd-attr-name">
                                                                                        <span className="wd-attr-name-label">
                                                                                            Color
                                                                                        </span>
                                                                                    </span>
                                                                                </th>
                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                    <span className="wd-attr-term">
                                                                                        <p>White</p>
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_release-years">
                                                                                <th
                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                    scope="row">
                                                                                    <span className="wd-attr-name">
                                                                                        <span className="wd-attr-name-label">
                                                                                            Release years
                                                                                        </span>
                                                                                    </span>
                                                                                </th>
                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                    <span className="wd-attr-term">
                                                                                        <p>2021</p>
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_manufacturer-guarantee">
                                                                                <th
                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                    scope="row">
                                                                                    <span className="wd-attr-name">
                                                                                        <span className="wd-attr-name-label">
                                                                                            Manufacturer guarantee
                                                                                        </span>
                                                                                    </span>
                                                                                </th>
                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                    <span className="wd-attr-term">
                                                                                        <p>14 Days</p>
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1731502193548 vc_row-has-fill wd-rs-6734a069c33ec">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-635154111accb">
                                        <div className="vc_column-inner vc_custom_1666274326663">
                                            <div className="wpb_wrapper">
                                                <div
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-6351450f22f70 wd-title-color-primary wd-title-style-default text-left  wd-underline-colored"
                                                    id="wd-6351450f22f70">
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-l">
                                                            Customer Reviews
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div className="wd-single-reviews wd-wpb wd-rs-63e37f0b02251 vc_custom_1675853585442 wd-layout-two-column wd-form-pos-before">
                                                    <div
                                                        className="woocommerce-Reviews"
                                                        data-product-id="2435"
                                                        id="reviews">
                                                        <div className="wd-rating-summary-wrap">
                                                            <div className="wd-rating-summary wd-with-filter">
                                                                <div className="wd-rating-summary-heading">
                                                                    <div className="wd-rating-summary-main">5</div>
                                                                    <div
                                                                        aria-label="Rated 5 out of 5"
                                                                        className="star-rating"
                                                                        role="img">
                                                                        <span
                                                                            style={{
                                                                                width: "100%",
                                                                            }}>
                                                                            Rated <strong className="rating">5</strong> out
                                                                            of 5
                                                                        </span>
                                                                    </div>
                                                                    <div className="wd-rating-summary-total">
                                                                        2 reviews
                                                                    </div>
                                                                </div>
                                                                <div className="wd-rating-summary-cont">
                                                                    <div className="wd-rating-summary-item">
                                                                        <div className="wd-rating-label" data-rating="5">
                                                                            <div
                                                                                aria-label="Rated 5 out of 5"
                                                                                className="star-rating"
                                                                                role="img">
                                                                                <span
                                                                                    style={{
                                                                                        width: "100%",
                                                                                    }}>
                                                                                    Rated <strong className="rating">5</strong>
                                                                                    out of 5
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="wd-rating-progress-bar wd-progress-bar">
                                                                            <div className="progress-area">
                                                                                <div
                                                                                    className="progress-bar"
                                                                                    style={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="wd-rating-count">2</div>
                                                                    </div>
                                                                    <div className="wd-rating-summary-item wd-empty">
                                                                        <div className="wd-rating-label" data-rating="4">
                                                                            <div
                                                                                aria-label="Rated 4 out of 5"
                                                                                className="star-rating"
                                                                                role="img">
                                                                                <span
                                                                                    style={{
                                                                                        width: "80%",
                                                                                    }}>
                                                                                    Rated <strong className="rating">4</strong>
                                                                                    out of 5
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="wd-rating-progress-bar wd-progress-bar">
                                                                            <div className="progress-area">
                                                                                <div
                                                                                    className="progress-bar"
                                                                                    style={{
                                                                                        width: "0%",
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="wd-rating-count">0</div>
                                                                    </div>
                                                                    <div className="wd-rating-summary-item wd-empty">
                                                                        <div className="wd-rating-label" data-rating="3">
                                                                            <div
                                                                                aria-label="Rated 3 out of 5"
                                                                                className="star-rating"
                                                                                role="img">
                                                                                <span
                                                                                    style={{
                                                                                        width: "60%",
                                                                                    }}>
                                                                                    Rated <strong className="rating">3</strong>
                                                                                    out of 5
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="wd-rating-progress-bar wd-progress-bar">
                                                                            <div className="progress-area">
                                                                                <div
                                                                                    className="progress-bar"
                                                                                    style={{
                                                                                        width: "0%",
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="wd-rating-count">0</div>
                                                                    </div>
                                                                    <div className="wd-rating-summary-item wd-empty">
                                                                        <div className="wd-rating-label" data-rating="2">
                                                                            <div
                                                                                aria-label="Rated 2 out of 5"
                                                                                className="star-rating"
                                                                                role="img">
                                                                                <span
                                                                                    style={{
                                                                                        width: "40%",
                                                                                    }}>
                                                                                    Rated <strong className="rating">2</strong>
                                                                                    out of 5
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="wd-rating-progress-bar wd-progress-bar">
                                                                            <div className="progress-area">
                                                                                <div
                                                                                    className="progress-bar"
                                                                                    style={{
                                                                                        width: "0%",
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="wd-rating-count">0</div>
                                                                    </div>
                                                                    <div className="wd-rating-summary-item wd-empty">
                                                                        <div className="wd-rating-label" data-rating="1">
                                                                            <div
                                                                                aria-label="Rated 1 out of 5"
                                                                                className="star-rating"
                                                                                role="img">
                                                                                <span
                                                                                    style={{
                                                                                        width: "20%",
                                                                                    }}>
                                                                                    Rated <strong className="rating">1</strong>
                                                                                    out of 5
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="wd-rating-progress-bar wd-progress-bar">
                                                                            <div className="progress-area">
                                                                                <div
                                                                                    className="progress-bar"
                                                                                    style={{
                                                                                        width: "0%",
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="wd-rating-count">0</div>
                                                                    </div>
                                                                </div>
                                                                <div className="wd-loader-overlay wd-fill" />
                                                            </div>
                                                        </div>
                                                        <div id="comments">
                                                            <div className="wd-reviews-heading">
                                                                <div className="wd-reviews-tools">
                                                                    <h2 className="woocommerce-Reviews-title">
                                                                        2 reviews for <span>Oculus Quest 2</span>
                                                                    </h2>
                                                                    <a
                                                                        className="wd-reviews-sorting-clear wd-hide"
                                                                        rel="nofollow">
                                                                        Clear filters
                                                                    </a>
                                                                </div>
                                                                {/* <form className="wd-reviews-tools wd-reviews-filters">
                                                                    <div className="wd-with-image">
                                                                        <input
                                                                            id="wd-with-image-checkbox"
                                                                            name="only-image"
                                                                            type="checkbox"
                                                                        />
                                                                        <label htmlFor="wd-with-image-checkbox">
                                                                            Only with images
                                                                        </label>
                                                                    </div>
                                                                    <select
                                                                        aria-label="Select reviews sorting"
                                                                        className="wd-reviews-sorting-select"
                                                                        name="woodmart_reviews_sorting_select" value={selectedOption}
                                                                        onChange={handleChange}>
                                                                        <option selected value="default">
                                                                            Default
                                                                        </option>
                                                                        <option value="newest">Newest</option>
                                                                        <option value="oldest">Oldest</option>
                                                                        <option value="most_helpful">Most helpful</option>
                                                                        <option value="highest_rated">
                                                                            Highest rated
                                                                        </option>
                                                                        <option value="lowest_rated">Lowest rated</option>
                                                                    </select>
                                                                </form> */}
                                                            </div>
                                                            <div className="wd-reviews-content">
                                                                <ol
                                                                    className="commentlist wd-grid-g wd-active wd-in wd-review-style-2"
                                                                    data-reviews-columns='{"reviews_columns":"2","reviews_columns_tablet":"1","reviews_columns_mobile":"1"}'
                                                                    style={{
                                                                        "--wd-col-lg": "2",
                                                                        "--wd-col-md": "1",
                                                                        "--wd-col-sm": "1",
                                                                    }}>
                                                                    <li
                                                                        className="review byuser comment-author-ronnie-peterson even thread-even depth-1 wd-col"
                                                                        id="li-comment-58">
                                                                        <div
                                                                            className="comment_container"
                                                                            id="comment-58">
                                                                            <div className="comment-text">
                                                                                <p className="meta">
                                                                                    <strong className="woocommerce-review__author">
                                                                                        Oliwia Whitley
                                                                                    </strong>
                                                                                    <span className="woocommerce-review__dash">
                                                                                        –
                                                                                    </span>
                                                                                    <time
                                                                                        className="woocommerce-review__published-date"
                                                                                        dateTime="2022-11-29T12:59:11+00:00">
                                                                                        November 29, 2022
                                                                                    </time>
                                                                                </p>
                                                                                <div
                                                                                    aria-label="Rated 5 out of 5"
                                                                                    className="star-rating"
                                                                                    role="img">
                                                                                    <span
                                                                                        style={{
                                                                                            width: "100%",
                                                                                        }}>
                                                                                        Rated
                                                                                        <strong className="rating">5</strong> out
                                                                                        of 5
                                                                                    </span>
                                                                                </div>
                                                                                <div className="description">
                                                                                    <p>
                                                                                        If that’s what you think how bout the
                                                                                        other way around? How can you evaluate
                                                                                        content without design? No typography, no
                                                                                        colors, no layout, no styles, all those
                                                                                        things that convey the important signals
                                                                                        that go beyond the mere textual,
                                                                                        hierarchies of information, weight,
                                                                                        emphasis, oblique stresses, priorities,
                                                                                        all those subtle cues that also have
                                                                                        visual and emotional appeal to the reader.
                                                                                    </p>
                                                                                </div>
                                                                                <div className="wd-review-likes">
                                                                                    <div className="wd-action-btn wd-style-text wd-like wd-like-icon">
                                                                                        <a >
                                                                                            <span>2</span>
                                                                                        </a>
                                                                                    </div>
                                                                                    <div className="wd-action-btn wd-style-text wd-dislike wd-dislike-icon">
                                                                                        <a >
                                                                                            <span>0</span>
                                                                                        </a>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <ul className="children">
                                                                            <li
                                                                                className="comment byuser comment-author-zakhar bypostauthor odd alt depth-2 wd-col"
                                                                                id="li-comment-67">
                                                                                <div
                                                                                    className="comment_container"
                                                                                    id="comment-67">
                                                                                    <div className="comment-text">
                                                                                        <p className="meta">
                                                                                            <strong className="woocommerce-review__author">
                                                                                                <span className="wd-review-icon">
                                                                                                    <span className="wd-tooltip">
                                                                                                        Store manager
                                                                                                    </span>
                                                                                                </span>
                                                                                                Mr. Mackay
                                                                                            </strong>
                                                                                            <span className="woocommerce-review__dash">
                                                                                                –
                                                                                            </span>
                                                                                            <time
                                                                                                className="woocommerce-review__published-date"
                                                                                                dateTime="2022-11-29T13:03:11+00:00">
                                                                                                November 29, 2022
                                                                                            </time>
                                                                                        </p>
                                                                                        <div className="description">
                                                                                            <p>
                                                                                                Rigid proponents of content strategy
                                                                                                may shun the use of dummy copy but
                                                                                                then designers might want to ask them
                                                                                                to provide style sheets with the copy
                                                                                                decks they supply that are in tune
                                                                                                with the design direction they
                                                                                                require.
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </li>
                                                                    <li
                                                                        className="review byuser comment-author-emanorton even thread-odd thread-alt depth-1 wd-col"
                                                                        id="li-comment-79">
                                                                        <div
                                                                            className="comment_container"
                                                                            id="comment-79">
                                                                            <div className="comment-text">
                                                                                <p className="meta">
                                                                                    <strong className="woocommerce-review__author">
                                                                                        Ema Norton
                                                                                    </strong>
                                                                                    <span className="woocommerce-review__dash">
                                                                                        –
                                                                                    </span>
                                                                                    <time
                                                                                        className="woocommerce-review__published-date"
                                                                                        dateTime="2022-11-29T13:08:03+00:00">
                                                                                        November 29, 2022
                                                                                    </time>
                                                                                </p>
                                                                                <div
                                                                                    aria-label="Rated 5 out of 5"
                                                                                    className="star-rating"
                                                                                    role="img">
                                                                                    <span
                                                                                        style={{
                                                                                            width: "100%",
                                                                                        }}>
                                                                                        Rated
                                                                                        <strong className="rating">5</strong> out
                                                                                        of 5
                                                                                    </span>
                                                                                </div>
                                                                                <div className="description">
                                                                                    <p>
                                                                                        Usually, we prefer the real thing, wine
                                                                                        without sulfur based preservatives, real
                                                                                        butter, not margarine, and so we’d like
                                                                                        our layouts and designs to be filled with
                                                                                        real words, with thoughts that count,
                                                                                        information that has value.
                                                                                    </p>
                                                                                </div>
                                                                                <div className="wd-review-likes">
                                                                                    <div className="wd-action-btn wd-style-text wd-like wd-like-icon">
                                                                                        <a >
                                                                                            <span>3</span>
                                                                                        </a>
                                                                                    </div>
                                                                                    <div className="wd-action-btn wd-style-text wd-dislike wd-dislike-icon">
                                                                                        <a >
                                                                                            <span>0</span>
                                                                                        </a>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <ul className="children">
                                                                            <li
                                                                                className="comment byuser comment-author-zakhar bypostauthor odd alt depth-2 wd-col"
                                                                                id="li-comment-98">
                                                                                <div
                                                                                    className="comment_container"
                                                                                    id="comment-98">
                                                                                    <div className="comment-text">
                                                                                        <p className="meta">
                                                                                            <strong className="woocommerce-review__author">
                                                                                                <span className="wd-review-icon">
                                                                                                    <span className="wd-tooltip">
                                                                                                        Store manager
                                                                                                    </span>
                                                                                                </span>
                                                                                                Mr. Mackay
                                                                                            </strong>
                                                                                            <span className="woocommerce-review__dash">
                                                                                                –
                                                                                            </span>
                                                                                            <time
                                                                                                className="woocommerce-review__published-date"
                                                                                                dateTime="2022-11-29T13:13:07+00:00">
                                                                                                November 29, 2022
                                                                                            </time>
                                                                                        </p>
                                                                                        <div className="description">
                                                                                            <p>
                                                                                                Or else, an alternative route: set
                                                                                                checkpoints, networks, processes,
                                                                                                junctions between content and layout.
                                                                                                Depending on the state of affairs it
                                                                                                may be fine to concentrate either on
                                                                                                design or content, reversing gears
                                                                                                when needed.
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </li>
                                                                </ol>
                                                            </div>
                                                            <div className="wd-loader-overlay wd-fill" />
                                                        </div>
                                                        <div id="review_form_wrapper">
                                                            <div id="review_form">
                                                                <div id="respond" className="comment-respond">
                                                                    <span id="reply-title" className="comment-reply-title title">
                                                                        Add a review{" "}
                                                                        <small>
                                                                            <a
                                                                                rel="nofollow"
                                                                                id="cancel-comment-reply-link"
                                                                                href="/mega-electronics/product/apple-macbook-pro-16-m1-pro-2/#respond"
                                                                                style={{ display: "none" }}
                                                                            >
                                                                                Cancel reply
                                                                            </a>
                                                                        </small>
                                                                    </span>
                                                                    <form
                                                                        action="https://woodmart.xtemos.com/mega-electronics/wp-comments-post.php"
                                                                        method="post"
                                                                        id="commentform"
                                                                        className="comment-form"
                                                                        noValidate=""
                                                                        encType="multipart/form-data"
                                                                    >
                                                                        {" "}
                                                                        <div className="wd-review-criteria-wrap">
                                                                            <div className="comment-form-rating">
                                                                                <label htmlFor="rating">
                                                                                    Your rating &nbsp;<span className="required">*</span>
                                                                                </label>
                                                                                <p className="stars">
                                                                                    {" "}
                                                                                    <span>
                                                                                        {" "}
                                                                                        <a className="star-1" href="#">
                                                                                            1
                                                                                        </a>{" "}
                                                                                        <a className="star-2" href="#">
                                                                                            2
                                                                                        </a>{" "}
                                                                                        <a className="star-3" href="#">
                                                                                            3
                                                                                        </a>{" "}
                                                                                        <a className="star-4" href="#">
                                                                                            4
                                                                                        </a>{" "}
                                                                                        <a className="star-5" href="#">
                                                                                            5
                                                                                        </a>{" "}
                                                                                    </span>{" "}
                                                                                </p>
                                                                                <select
                                                                                    name="rating"
                                                                                    id="rating"
                                                                                    required=""
                                                                                    style={{ display: "none" }}
                                                                                >
                                                                                    <option value="">Rate… </option>
                                                                                    <option value={5}>Perfect </option>
                                                                                    <option value={4}>Good </option>
                                                                                    <option value={3}>Average </option>
                                                                                    <option value={2}>Not that bad </option>
                                                                                    <option value={1}>Very poor </option>
                                                                                </select>
                                                                            </div>
                                                                            <div
                                                                                className="wd-review-criteria comment-form-rating"
                                                                                data-criteria-id="value_for_money"
                                                                            >
                                                                                <label htmlFor="value_for_money">Value for money </label>
                                                                                <div className="stars">
                                                                                    <span>
                                                                                        <a className="star-1" href="#">
                                                                                            1
                                                                                        </a>
                                                                                        <a className="star-2" href="#">
                                                                                            2
                                                                                        </a>
                                                                                        <a className="star-3" href="#">
                                                                                            3
                                                                                        </a>
                                                                                        <a className="star-4" href="#">
                                                                                            4
                                                                                        </a>
                                                                                        <a className="star-5" href="#">
                                                                                            5
                                                                                        </a>
                                                                                    </span>
                                                                                </div>
                                                                                <select name="value_for_money" id="value_for_money" required="">
                                                                                    <option value="">Rate… </option>
                                                                                    <option value={5}>Perfect </option>
                                                                                    <option value={4}>Good </option>
                                                                                    <option value={3}>Average </option>
                                                                                    <option value={2}>Not that bad </option>
                                                                                    <option value={1}>Very poor </option>
                                                                                </select>
                                                                            </div>
                                                                            <div
                                                                                className="wd-review-criteria comment-form-rating"
                                                                                data-criteria-id="durability"
                                                                            >
                                                                                <label htmlFor="durability">Durability </label>
                                                                                <div className="stars">
                                                                                    <span>
                                                                                        <a className="star-1" href="#">
                                                                                            1
                                                                                        </a>
                                                                                        <a className="star-2" href="#">
                                                                                            2
                                                                                        </a>
                                                                                        <a className="star-3" href="#">
                                                                                            3
                                                                                        </a>
                                                                                        <a className="star-4" href="#">
                                                                                            4
                                                                                        </a>
                                                                                        <a className="star-5" href="#">
                                                                                            5
                                                                                        </a>
                                                                                    </span>
                                                                                </div>
                                                                                <select name="durability" id="durability" required="">
                                                                                    <option value="">Rate… </option>
                                                                                    <option value={5}>Perfect </option>
                                                                                    <option value={4}>Good </option>
                                                                                    <option value={3}>Average </option>
                                                                                    <option value={2}>Not that bad </option>
                                                                                    <option value={1}>Very poor </option>
                                                                                </select>
                                                                            </div>
                                                                            <div
                                                                                className="wd-review-criteria comment-form-rating"
                                                                                data-criteria-id="delivery_speed"
                                                                            >
                                                                                <label htmlFor="delivery_speed">Delivery speed </label>
                                                                                <div className="stars">
                                                                                    <span>
                                                                                        <a className="star-1" href="#">
                                                                                            1
                                                                                        </a>
                                                                                        <a className="star-2" href="#">
                                                                                            2
                                                                                        </a>
                                                                                        <a className="star-3" href="#">
                                                                                            3
                                                                                        </a>
                                                                                        <a className="star-4" href="#">
                                                                                            4
                                                                                        </a>
                                                                                        <a className="star-5" href="#">
                                                                                            5
                                                                                        </a>
                                                                                    </span>
                                                                                </div>
                                                                                <select name="delivery_speed" id="delivery_speed" required="">
                                                                                    <option value="">Rate… </option>
                                                                                    <option value={5}>Perfect </option>
                                                                                    <option value={4}>Good </option>
                                                                                    <option value={3}>Average </option>
                                                                                    <option value={2}>Not that bad </option>
                                                                                    <option value={1}>Very poor </option>
                                                                                </select>
                                                                            </div>
                                                                            <input
                                                                                type="hidden"
                                                                                name="summary_criteria_ids"
                                                                                defaultValue="value_for_money,durability,delivery_speed"
                                                                            />
                                                                        </div>
                                                                        <p className="comment-form-comment">
                                                                            <label htmlFor="comment">
                                                                                Your review&nbsp;<span className="required">*</span>
                                                                            </label>
                                                                            <textarea
                                                                                id="comment"
                                                                                name="comment"
                                                                                cols={45}
                                                                                rows={8}
                                                                                required=""
                                                                                defaultValue={""}
                                                                            />
                                                                        </p>
                                                                        <p className="comment-form-pros">
                                                                            <label htmlFor="pros">Pros</label>
                                                                            <input id="pros" name="pros" type="text" defaultValue="" size={30} />
                                                                        </p>
                                                                        <p className="comment-form-cons">
                                                                            <label htmlFor="cons">Cons</label>
                                                                            <input id="cons" name="cons" type="text" defaultValue="" size={30} />
                                                                        </p>{" "}

                                                                        <div className="comment-form-images">
                                                                            <div className="wd-add-img-btn-wrapper">
                                                                                <label htmlFor="wd-add-img-btn">Click to add images </label>
                                                                                <input
                                                                                    id="wd-add-img-btn"
                                                                                    name="woodmart_image[]"
                                                                                    type="file"
                                                                                    multiple=""
                                                                                />
                                                                                <div className="wd-add-img-msg wd-hint wd-tooltip">
                                                                                    <div className="wd-add-img-msg-text">
                                                                                        The maximum file size is 1 MB and you can upload up to 3 images.{" "}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="wd-add-img-count" />
                                                                            </div>
                                                                        </div>
                                                                        <p className="form-submit">
                                                                            <input
                                                                                name="submit"
                                                                                type="submit"
                                                                                id="submit"
                                                                                className="submit"
                                                                                defaultValue="Submit"
                                                                            />{" "}
                                                                            <input
                                                                                type="hidden"
                                                                                name="comment_post_ID"
                                                                                defaultValue={182}
                                                                                id="comment_post_ID"
                                                                            />
                                                                            <input
                                                                                type="hidden"
                                                                                name="comment_parent"
                                                                                id="comment_parent"
                                                                                defaultValue={0}
                                                                            />
                                                                        </p>
                                                                    </form>{" "}
                                                                </div>
                                                                {/* #respond */}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1669134772241 wd-rs-637cf9ac381a5">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-635160a7c0ec2">
                                        <div className="vc_column-inner vc_custom_1666277548917">
                                            <div className="wpb_wrapper">
                                                <div
                                                    className="wd-carousel-container  wd-wpb with-title wd-rs-658d8ea1cfaf3 vc_custom_1703775910293 wd-products-element wd-products products wd-products-with-bg wd-stretch-cont-lg title-line-one"
                                                    id="carousel-157">
                                                    <h4 className="wd-el-title title slider-title element-title">
                                                        <span>Related Products</span>
                                                    </h4>
                                                    <div className="wd-carousel-inner">
                                                        <div
                                                            className="wd-carousel wd-grid wd-stretch-cont-lg wd-initialized wd-horizontal wd-watch-progress wd-backface-hidden"
                                                            data-grid-gallery='{"grid_gallery":"1","grid_gallery_control":"hover","grid_gallery_enable_arrows":"arrows"}'
                                                            data-scroll_per_page="yes"
                                                            style={{
                                                                "--wd-col-lg": "5",
                                                                "--wd-col-md": "4",
                                                                "--wd-col-sm": "2",
                                                                "--wd-gap-lg": "20px",
                                                                "--wd-gap-sm": "10px",
                                                            }}>
                                                            <div
                                                                className="wd-carousel-wrap"
                                                                style={{
                                                                    cursor: "grab",
                                                                }}>
                                                                {bestOffer.slice(0, 5).map((offer, index) => (
                                                                    <div
                                                                        className="wd-product wd-with-labels wd-hover-fw-button wd-hover-with-fade wd-col product-grid-item product type-product post-2435 status-publish instock product_cat-vr-headsets has-post-thumbnail sale shipping-taxable purchasable product-type-simple hover-ready"
                                                                        data-loop={index}
                                                                        data-id={offer.productId} // Assuming you have unique IDs for each product
                                                                        key={offer.productId} // Use a unique key for each product
                                                                        style={{ cursor: "pointer" }}

                                                                    >
                                                                        <div className="product-wrapper">
                                                                            <div className="content-product-imagin" style={{ marginBottom: "-112px" }} />

                                                                            <div className="product-element-top wd-quick-shop">
                                                                                <a className="product-image-link" >
                                                                                    <div className="wd-product-grid-slider wd-fill" onClick={() => handleProductDetails(offer.productName)}>
                                                                                        {/* {offer.image_url.map((url, imageIndex) => (
                                                                                    <div
                                                                                        className="wd-product-grid-slide"
                                                                                        key={imageIndex}
                                                                                        data-image-url={url}
                                                                                        data-image-srcset={`${url} 700w, ${url.replace(".jpg", "-263x300.jpg")} 263w, ${url.replace(".jpg", "-88x100.jpg")} 88w, ${url.replace(".jpg", "-430x491.jpg")} 430w, ${url.replace(".jpg", "-180x206.jpg")} 180w`}
                                                                                        data-image-id={imageIndex}

                                                                                    />
                                                                                ))} */}
                                                                                    </div>
                                                                                    <div className="wd-product-grid-slider-nav wd-fill wd-hover-enabled">
                                                                                        <div className="wd-prev" />
                                                                                        <div className="wd-next" />
                                                                                    </div>
                                                                                    <div className="wd-product-grid-slider-pagin">
                                                                                        {/* {offer.image_url.map((_, imageIndex) => (
                                                                                    <div key={imageIndex} data-image-id={imageIndex} className="wd-product-grid-slider-dot" />
                                                                                ))} */}
                                                                                    </div>
                                                                                    <div className="product-labels labels-rounded-sm">
                                                                                        <span className="onsale product-label">{offer.discount}%</span> {/* Assuming you have discount info */}
                                                                                    </div>
                                                                                    <picture decoding="async" className="attachment-large size-large">
                                                                                        <source
                                                                                            type="image/webp"
                                                                                            data-lazy-srcset={`${offer.image_url}.webp 700w, ${offer.image_url}.webp 263w`}
                                                                                            srcSet={`${offer.image_url}.webp 700w, ${offer.image_url}.webp 263w`}
                                                                                            sizes="(max-width: 700px) 100vw, 700px"
                                                                                        />
                                                                                        <img
                                                                                            decoding="async"
                                                                                            width={700}
                                                                                            height={800}
                                                                                            src={offer.image_url}

                                                                                            data-lazy-srcset={`${offer.image_url} 700w, ${offer.image_url} 263w`}
                                                                                            data-lazy-sizes="(max-width: 700px) 100vw, 700px"
                                                                                            className="entered lazyloaded"
                                                                                            sizes="(max-width: 700px) 100vw, 700px"
                                                                                            srcSet={`${offer.image_url} 700w, ${offer.image_url} 263w`}
                                                                                        />
                                                                                    </picture>
                                                                                </a>
                                                                                <div className="wd-buttons wd-pos-r-t">
                                                                                    <div className="wd-compare-btn product-compare-button wd-action-btn wd-style-icon wd-compare-icon">
                                                                                        <a
                                                                                            href="#"
                                                                                            data-id={offer.productId}
                                                                                            rel="nofollow"
                                                                                            data-added-text="Compare products"
                                                                                        >
                                                                                            <span>Compare</span>
                                                                                        </a>
                                                                                    </div>
                                                                                    <div className="quick-view wd-action-btn wd-style-icon wd-quick-view-icon">
                                                                                        <a

                                                                                            className="open-quick-view quick-view-button"
                                                                                            rel="nofollow"
                                                                                            data-id={offer.productId}
                                                                                        >
                                                                                            Quick view
                                                                                        </a>
                                                                                    </div>
                                                                                    <div className="wd-wishlist-btn wd-action-btn wd-style-icon wd-wishlist-icon">
                                                                                        <a
                                                                                            onClick={(e) => handleAddToWishlist(e, offer)}
                                                                                            href="#"
                                                                                            data-key={offer.productId}
                                                                                            data-product-id={offer.productId}
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
                                                                                        {offer.productName}
                                                                                    </a>
                                                                                </h3>
                                                                                <div className="wd-product-cats">
                                                                                    <a href={offer.category_url} rel="tag">
                                                                                        {offer.category}
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
                                                                                                    {offer.price}
                                                                                                </bdi>
                                                                                            </span>
                                                                                        </del>
                                                                                        <span className="screen-reader-text">
                                                                                            Original price was:  {offer.originalPrice}.
                                                                                        </span>
                                                                                        <ins aria-hidden="true">
                                                                                            <span className="woocommerce-Price-amount amount">
                                                                                                <bdi>
                                                                                                    <span className="woocommerce-Price-currencySymbol">
                                                                                                        $
                                                                                                    </span>
                                                                                                    {offer.price}
                                                                                                </bdi>
                                                                                            </span>
                                                                                        </ins>
                                                                                        <span className="screen-reader-text">
                                                                                            Current price is: $ {offer.price}
                                                                                        </span>
                                                                                    </span>
                                                                                </div>
                                                                                <div className="wd-add-btn wd-add-btn-replace">
                                                                                    <a
                                                                                        href="#"
                                                                                        aria-describedby="woocommerce_loop_add_to_cart_link_describedby_2435"
                                                                                        data-quantity={1}
                                                                                        className="button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-loop"
                                                                                        data-product_id={2435}
                                                                                        data-product_sku={608069}
                                                                                        aria-label="Add to cart: Oculus Quest 2"
                                                                                        rel="nofollow"
                                                                                        onClick={(e) => openCart(e, offer)}
                                                                                    >
                                                                                        <span>Add to cart</span>
                                                                                    </a>
                                                                                    <span
                                                                                        id="woocommerce_loop_add_to_cart_link_describedby_2435"
                                                                                        className="screen-reader-text"
                                                                                    ></span>
                                                                                </div>
                                                                                <div className="wd-product-detail wd-product-sku">
                                                                                    <span className="wd-label">SKU: </span>
                                                                                    <span> <span>{offer.productSku}</span> </span>
                                                                                </div>
                                                                                {/* Add new data */}
                                                                            </div>
                                                                        </div>
                                                                    </div>))}

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
                                <div className="vc_row wpb_row vc_row-fluid wd-rs-637cf9b5d71a4">
                                    <div className="wpb_column vc_column_container vc_col-sm-12">
                                        <div className="vc_column-inner">
                                            <div className="wpb_wrapper">
                                                <div
                                                    className="wd-carousel-container  wd-wpb with-title wd-rs-658d8ea799114  wd-products-element wd-products products wd-products-with-bg title-line-one"
                                                    id="carousel-690">
                                                    <h4 className="wd-el-title title slider-title element-title">
                                                        <span>Recently Viewed</span>
                                                    </h4>
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
                                                            }}>
                                                            <div className="wd-carousel-wrap">
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
                                                                                            src={product.productData.productImages[0]}
                                                                                            alt={product.productData.productInfo.productName}
                                                                                        />
                                                                                    </a>
                                                                                </div>
                                                                                <div className="product-element-bottom">
                                                                                    <h3 className="wd-entities-title">
                                                                                        <a href={product.product_url}>{product.productName}</a>
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
                                                            <div className="wd-btn-arrow wd-prev wd-disabled wd-lock">
                                                                <div className="wd-arrow-inner" />
                                                            </div>
                                                            <div className="wd-btn-arrow wd-next wd-disabled wd-lock">
                                                                <div className="wd-arrow-inner" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>


            {/* Cart Modal */}

            <Cartwidget isCartOpen={isCartOpen} closeCart={closeCart} setIsCartOpen={setIsCartOpen} />
            <div className={`wd-close-side wd-fill ${isCartOpen ? 'wd-close-side-opened' : ''}`} />
        </>
    )
}

export default productDetails;