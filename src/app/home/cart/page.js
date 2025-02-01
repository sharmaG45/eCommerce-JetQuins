'use client';

import bestOffer from "../../assets/scraped_products.json";
import { useEffect, useState, useContext } from "react";
import { getFirestore, doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { auth, fireStore } from "@/app/_components/firebase/config";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cartwidget from "@/app/_components/Cart-widget/page";
import { CartContext } from "@/app/_components/CartContext/page";

// Hello

const cart = () => {

    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const router = useRouter();
    const { data, dispatch } = useContext(CartContext);

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
    };

    const [user, setUser] = useState(null);  // State to store the current user

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser && currentUser.uid) {
            setUser(currentUser); // Set the user in the state
        }
    }, []);

    const closeCart = () => {
        setIsCartOpen(false);
    };

    useEffect(() => {
        // Fetch the current user's cart items
        const fetchCart = async () => {
            const userData = localStorage.getItem('currentUser');
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

    const handleRemoveItem = async (e, productId) => {
        e.preventDefault();
        const userData = localStorage.getItem('currentUser');

        const user = JSON.parse(userData); // Parse the user data from localStorage
// Addd
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
    }

    const handleQuantityChange = async (productId, newQuantity, e) => {
        e.preventDefault();
        if (newQuantity < 1) {

            toast.error("Quantity cannot be less than 1.")
            return;
        }

        const userData = localStorage.getItem('currentUser');


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
    }

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const handleAddToWishlist = async (e, offer) => {
        e.preventDefault(); // Prevent the default link behavior
        const user = JSON.parse(localStorage.getItem('currentUser')); // Assuming user info is stored in localStorage

        // Log the offer object to see if it's structured correctly
        console.log('Offer:', offer);

        // Static fallback data in case some fields are missing
        const staticData = {
            product_url: 'https://defaultproducturl.com',
            image_urls: [
                "https://via.placeholder.com/430x491?text=Image+1",
                "https://via.placeholder.com/430x491?text=Image+2",
                "https://via.placeholder.com/430x491?text=Image+3",
                "https://via.placeholder.com/430x491?text=Image+4"
            ],
            brand: 'Default Brand',
            productId: '00000',
            productName: 'Default Product',
            productSku: 'DEFAULTSKU',
            price: 99.99,
            discount: 0
        };

        // Use static data if any required fields are missing
        const offerData = {
            product_url: offer.product_url || staticData.product_url,
            image_urls: offer.image_urls && offer.image_urls.length > 0 ? offer.image_urls : staticData.image_urls,
            productId: offer.productId || staticData.productId,
            productName: offer.productName || staticData.productName,
            productSku: offer.productSku || staticData.productSku,
            price: offer.price || staticData.price,
            discount: offer.discount || staticData.discount,
        };

        // Log the final offer data (either user-provided or static)
        console.log('Final Offer Data:', offerData);

        try {
            // Get the user's ID
            const userId = user.uid;

            // Reference to the user document in the 'users' collection
            const userRef = doc(fireStore, "users", userId);

            // Fetch the current user data to check if the wishlist exists
            const userDoc = await getDoc(userRef);
            let userWishlist = userDoc.exists() ? userDoc.data().wishlist || [] : [];

            // Check if the product is already in the wishlist
            const existingProductIndex = userWishlist.findIndex(item => item.productId === offerData.productId);

            if (existingProductIndex !== -1) {
                // If the product is found, notify the user that it's already in the wishlist
                toast.success("Product is already in your wishlist!");
                // Optionally, redirect to the wishlist page if you want to
                // router.push('/home/wishlist');
            } else {
                // If the product is not in the wishlist, add it as a new item
                userWishlist.push({
                    productUrls: offerData.product_url,
                    productId: offerData.productId,
                    productName: offerData.productName,
                    productSku: offerData.productSku,
                    imageUrls: offerData.image_urls,
                    price: offerData.price,
                    discount: offerData.discount,
                    timestamp: new Date(),
                });

                // Update the user's wishlist document with the new product
                await updateDoc(userRef, { wishlist: userWishlist });

                console.log("Product added to wishlist for user:", userId);
                toast.success("Product added to your wishlist!");
            }

            // Optionally open the wishlist after adding
            // setIsWishlistOpen(true); // Set state to show the wishlist modal or component

        } catch (error) {
            console.error("Error adding product to wishlist:", error);
            toast.error("Error adding product to wishlist.");
        }
    };

    const openCart = async (e, offer) => {
        e.preventDefault(); // Prevent default behavior

        const user = JSON.parse(localStorage.getItem("currentUser"));

        // Log the offer object to verify structure
        console.log("Offer:", offer);

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
            image_url: offer.image_url || staticData.image_url,
            brand: offer.brand || staticData.brand,
            productId: offer.productId || staticData.productId,
            productName: offer.productName || staticData.productName,
            productSku: offer.productSku || staticData.productSku,
            price: offer.price || staticData.price,
            discount: offer.discount || staticData.discount,
            quantity: offer.quantity || staticData.quantity,
            rating: offer.rating || staticData.rating,
            description: offer.description || staticData.description,
            how_product_works: offer.how_product_works || staticData.how_product_works,
            other_details: offer.other_details || staticData.other_details,
            faq: offer.faq || staticData.faq
        };

        console.log("Final Offer Data:", offerData);

        if (!user || !user.uid) {
            console.log("User not logged in. Saving to guest cart.");

            // Get guest cart from Context (avoid localStorage usage)
            let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

            // Check if the product already exists in the guest cart
            const existingIndex = guestCart.findIndex(item => item.productId === offerData.productId);

            if (existingIndex !== -1) {
                // If product exists, update quantity
                guestCart[existingIndex].quantity += 1;
                dispatch({ type: "Update", payload: guestCart });
                toast.success("Product quantity updated in your cart!");
            } else {
                // Add new product to the cart
                guestCart.push({ ...offerData, timestamp: new Date() });
                dispatch({ type: "Add", payload: offerData });
                localStorage.setItem("guestCart", JSON.stringify(guestCart));
                toast.success("Product added to your cart!");
            }

            // Save updated cart to Context and localStorage (no duplicates)
            localStorage.setItem("guestCart", JSON.stringify(guestCart));

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
                userCart[existingIndex].quantity += 1;
                toast.success("Product quantity updated in your cart!");
            } else {
                // Add new product
                userCart.push({ ...offerData, timestamp: new Date() });
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

    return (
        <>
            <div className="wd-page-content main-page-wrapper">
                <main
                    className="wd-content-layout content-layout-wrapper container wd-builder-on"
                    role="main">
                    <div className="wd-content-area site-content">
                        <div className="woocommerce entry-content">
                            <style
                                dangerouslySetInnerHTML={{
                                    __html:
                                        ".vc_custom_1673606996547{margin-top: -20px !important;margin-bottom: 40px !important;}.vc_custom_1668168534424{padding-top: 0px !important;}.vc_custom_1674055550871{margin-bottom: 0px !important;border-radius: 10px !important;}.vc_custom_1668169108705{padding-top: 0px !important;}.vc_custom_1674480219010{padding-top: 0px !important;}.vc_custom_1668170068200{margin-bottom: 20px !important;padding-top: 20px !important;padding-right: 20px !important;padding-bottom: 20px !important;padding-left: 20px !important;background-color: #ffffff !important;border-radius: 10px !important;}.vc_custom_1668168942159{padding-top: 20px !important;padding-right: 20px !important;padding-bottom: 20px !important;padding-left: 20px !important;background-color: #ffffff !important;border-radius: 10px !important;}.vc_custom_1668170675705{margin-right: 0px !important;margin-bottom: 20px !important;margin-left: -5px !important;padding-top: 20px !important;padding-right: 5px !important;padding-bottom: 20px !important;padding-left: 5px !important;background-color: #ffffff !important;border-radius: 10px !important;}.vc_custom_1670856699156{margin-right: 0px !important;margin-left: -5px !important;padding-top: 20px !important;padding-right: 5px !important;padding-bottom: 0px !important;padding-left: 5px !important;background-color: #ffffff !important;border-radius: 10px !important;}.vc_custom_1645456482508{padding-top: 0px !important;}.vc_custom_1668169726583{margin-bottom: 10px !important;}.vc_custom_1668169695365{margin-bottom: 0px !important;}.vc_custom_1645456482508{padding-top: 0px !important;}.vc_custom_1670856705742{margin-bottom: 0px !important;}.vc_custom_1674227228977{margin-bottom: 0px !important;}.wd-rs-65d5f82529fd1 .wd-products-with-bg, .wd-rs-65d5f82529fd1.wd-products-with-bg, .wd-rs-65d5f82529fd1 .wd-products-with-bg .wd-product, .wd-rs-65d5f82529fd1.wd-products-with-bg .wd-product{--wd-prod-bg:rgb(255,255,255); --wd-bordered-bg:rgb(255,255,255);}@media (max-width: 767px) { .wd-rs-65d5f82529fd1 .wd-el-title{font-size: 20px;} }@media (max-width: 1199px) {html .wd-rs-636e3d91315f1 > .vc_column-inner{padding-right:15px !important;}html .wd-rs-63ce8a5629e72 > .vc_column-inner{padding-left:15px !important;}html .wd-rs-636e43af13313{margin-left:0px !important;}html .wd-rs-63973ff6c9ef6{margin-left:0px !important;}}",
                                }}
                                data-type="vc_shortcodes-custom-css"
                            />
                            <div className="wpb-content-wrapper">
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1673606996547 wd-rs-63c137511572e">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-636e3b51eb0db">
                                        <div className="vc_column-inner vc_custom_1668168534424">
                                            <div className="wpb_wrapper">

                                                <div className="wd-page-title-el wd-wpb wd-rs-63c80f7a9b872 vc_custom_1674055550871">
                                                    <div
                                                        className="wd-page-title page-title  page-title-default title-size-default title-design-centered color-scheme-light"
                                                        style={{}}>
                                                        <div className="container">
                                                            <ul className="wd-checkout-steps">
                                                                <li className="step-cart step-active">
                                                                    <a href="/">
                                                                        <span>Shopping cart</span>
                                                                    </a>
                                                                </li>
                                                                <li className="step-checkout step-inactive">
                                                                    <a href="/">
                                                                        <span>Checkout</span>
                                                                    </a>
                                                                </li>
                                                                <li className="step-complete step-inactive">
                                                                    <span>Order complete</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_row-o-equal-height vc_row-flex wd-rs-63ce8a515610b">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-8 vc_col-xs-12 wd-rs-636e3d91315f1">
                                        <div className="vc_column-inner vc_custom_1668169108705">
                                            <div className="wpb_wrapper">
                                                <div className="wd-wc-notices wd-wpb wd-rs-6213ac3af2f6f">
                                                    <div className="woocommerce-notices-wrapper" />
                                                </div>
                                                <div className="wd-shipping-progress-bar wd-wpb wd-rs-636e4147e6142 vc_custom_1668170068200 text-left wd-style-default">
                                                    <div className="wd-progress-bar wd-free-progress-bar">
                                                        <div className="progress-msg">
                                                            Add
                                                            <span className="woocommerce-Price-amount amount">
                                                                <span className="woocommerce-Price-currencySymbol">
                                                                    $
                                                                </span>
                                                                2,153.00
                                                            </span>
                                                            to cart and get free shipping!
                                                        </div>
                                                        <div className="progress-area">
                                                            <div
                                                                className="progress-bar"
                                                                style={{
                                                                    width: "38%",
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="wd-cart-table wd-wpb wd-rs-636e3ce8f3c24 vc_custom_1668168942159">
                                                    <form
                                                        action="https://woodmart.xtemos.com/mega-electronics/home/cart/"
                                                        className="woocommerce-cart-form"
                                                        method="post">
                                                        <table className="shop_table shop_table_responsive shop-table-with-img cart woocommerce-cart-form__contents">
                                                            <thead>
                                                                <tr>
                                                                    <th className="product-remove"></th>
                                                                    <th className="product-thumbnail"></th>
                                                                    <th className="product-name">Product</th>
                                                                    <th className="product-price">Price</th>
                                                                    <th className="product-quantity">Quantity</th>
                                                                    <th className="product-subtotal">Subtotal</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                {/* Added */}

                                                                {data.length > 0 ? (
                                                                    data.map((item) => (
                                                                        <tr key={item.productId} className="cart_item">
                                                                            <td className="product-remove">
                                                                                <button

                                                                                    className="remove"
                                                                                    onClick={(e) => handleRemoveItem(item.productId, e)}
                                                                                >
                                                                                    ×
                                                                                </button>
                                                                            </td>
                                                                            <td className="product-thumbnail">
                                                                                <a href={item.productUrl}>
                                                                                    <img
                                                                                        src={item.image_url}
                                                                                        alt={item.productName}
                                                                                        width="430"
                                                                                        height="491"
                                                                                    />
                                                                                </a>
                                                                            </td>
                                                                            <td className="product-name" data-title="Product">
                                                                                <a href={item.productUrl}>{item.productName}</a>
                                                                            </td>
                                                                            <td className="product-price" data-title="Price">
                                                                                <span className="woocommerce-Price-amount amount">
                                                                                    <bdi>
                                                                                        <span className="woocommerce-Price-currencySymbol">
                                                                                            $
                                                                                        </span>
                                                                                        {item.price}
                                                                                    </bdi>
                                                                                </span>
                                                                            </td>
                                                                            <td className="product-quantity" data-title="Quantity">
                                                                                <div className="quantity">
                                                                                    <button
                                                                                        className="minus btn"
                                                                                        onClick={(e) => handleQuantityChange(item.productId, item.quantity - 1, e)}
                                                                                    >
                                                                                        -
                                                                                    </button>
                                                                                    <input
                                                                                        type="number"
                                                                                        value={item.quantity}
                                                                                        onChange={(e) =>
                                                                                            handleQuantityChange(item.productId, parseInt(e.target.value))
                                                                                        }
                                                                                        min="1"
                                                                                        max="99"
                                                                                        className="input-text qty text"
                                                                                    />
                                                                                    <button
                                                                                        className="plus btn"
                                                                                        onClick={(e) => handleQuantityChange(item.productId, item.quantity + 1, e)}
                                                                                    >
                                                                                        +
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                            <td className="product-subtotal" data-title="Subtotal">
                                                                                <span className="woocommerce-Price-amount amount">
                                                                                    <bdi>
                                                                                        <span className="woocommerce-Price-currencySymbol">
                                                                                            $
                                                                                        </span>
                                                                                        {(item.price * item.quantity).toFixed(2)}
                                                                                    </bdi>
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <li>No items in your cart</li>
                                                                )}



                                                                {/* Adeed end */}

                                                                <tr className="wd-cart-action-row">
                                                                    <td className="actions" colSpan="12">
                                                                        <div className="cart-actions">
                                                                            <div className="coupon wd-coupon-form">
                                                                                <label
                                                                                    className="screen-reader-text"
                                                                                    htmlFor="coupon_code">
                                                                                    Coupon:
                                                                                </label>
                                                                                <input
                                                                                    className="input-text"
                                                                                    defaultValue=""
                                                                                    id="coupon_code"
                                                                                    name="coupon_code"
                                                                                    placeholder="Coupon code"
                                                                                    type="text"
                                                                                />
                                                                                <button
                                                                                    className="button"
                                                                                    name="apply_coupon"
                                                                                    type="submit"
                                                                                    value="Apply coupon">
                                                                                    Apply coupon
                                                                                </button>
                                                                            </div>
                                                                            <button
                                                                                className="button  wd-hide"
                                                                                disabled
                                                                                name="update_cart"
                                                                                type="submit"
                                                                                value="Update cart">
                                                                                Update cart
                                                                            </button>
                                                                            <input
                                                                                defaultValue="1770aa9f52"
                                                                                id="woocommerce-cart-nonce"
                                                                                name="woocommerce-cart-nonce"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="/mega-electronics/home/cart/"
                                                                                name="_wp_http_referer"
                                                                                type="hidden"
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </form>
                                                </div>
                                                <div
                                                    className="wd-carousel-container  wd-wpb with-title wd-rs-65d5f82529fd1  wd-products-element wd-products products wd-products-with-bg wd-stretch-cont-lg title-line-one"
                                                    id="carousel-208">
                                                    <h4 className="wd-el-title title slider-title element-title">
                                                        <span>You May Be Interested In…</span>
                                                    </h4>
                                                    <div className="wd-carousel-inner">
                                                        <div
                                                            className="wd-carousel wd-grid wd-stretch-cont-lg wd-initialized wd-horizontal wd-watch-progress wd-backface-hidden"
                                                            data-grid-gallery='{"grid_gallery":"1","grid_gallery_control":"hover","grid_gallery_enable_arrows":"arrows"}'
                                                            data-scroll_per_page="yes"
                                                            style={{
                                                                "--wd-col-lg": "3",
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
                                                                {bestOffer.slice(0, 3).map((offer, index) => (
                                                                    <div
                                                                        className="wd-carousel-item wd-slide-visible wd-full-visible wd-active"
                                                                        key={offer.productId}
                                                                        data-loop={index}
                                                                        style={{
                                                                            width: "294.333px",
                                                                        }}>

                                                                        <div
                                                                            className="wd-product wd-hover-fw-button wd-hover-with-fade wd-fade-off product-grid-item product type-product post-340 status-publish instock product_cat-business-laptop has-post-thumbnail shipping-taxable purchasable product-type-simple"
                                                                            data-id="340"
                                                                            data-loop="1">

                                                                            <div className="product-wrapper">
                                                                                <div className="content-product-imagin" style={{ marginBottom: "-112px" }} />

                                                                                <div className="product-element-top wd-quick-shop">
                                                                                    <a className="product-image-link" >
                                                                                        <div className="wd-product-grid-slider wd-fill" onClick={() => handleProductDetails(offer.productName)}>
                                                                                            {/* {offer.image_urls.map((url, imageIndex) => (
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
                                                                                            {/* {offer.image_urls.map((_, imageIndex) => (
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
                                                                                                href="/"
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
                                                                                            {offer.discount > 0 && (
                                                                                                <del aria-hidden="true">
                                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                                        <bdi>
                                                                                                            <span className="woocommerce-Price-currencySymbol">$</span>
                                                                                                            {offer.originalPrice}
                                                                                                        </bdi>
                                                                                                    </span>
                                                                                                </del>
                                                                                            )}
                                                                                            {/* <span className="screen-reader-text">
                                                                                                Original price was: $499.00.
                                                                                            </span> */}
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
                                                                                            {/* <span className="screen-reader-text">
                                                                                                Current price is: $449.00.
                                                                                            </span> */}
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
                                                                                        <span>{offer.productSku}</span>
                                                                                    </div>
                                                                                    {/* Add new data */}
                                                                                </div>
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
                                    <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-4 vc_col-xs-12 woodmart-sticky-column wd_sticky_offset_150 wd-rs-63ce8a5629e72">
                                        <div
                                            className="vc_column-inner vc_custom_1674480219010"
                                            style={{
                                                position: "relative",
                                            }}>
                                            <div className="wpb_wrapper" style={{}}>
                                                <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1668170675705 vc_row-has-fill wd-rs-636e43af13313">
                                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-6213ac5daaf9d">
                                                        <div className="vc_column-inner vc_custom_1645456482508">
                                                            <div className="wpb_wrapper">

                                                                <div className="wd-cart-totals wd-wpb wd-rs-636e3fbf5a17a vc_custom_1668169695365 wd-btn-align-full-width">
                                                                    <div className="cart_totals ">
                                                                        <div className="cart-totals-inner wd-set-mb reset-last-child wd-layout-1">
                                                                            <h2>Cart totals</h2>
                                                                            <table
                                                                                cellSpacing="0"
                                                                                className="shop_table shop_table_responsive">
                                                                                <tbody>
                                                                                    <tr className="cart-subtotal">
                                                                                        <th>Subtotal</th>
                                                                                        <td data-title="Subtotal">
                                                                                            <span className="woocommerce-Price-amount amount">
                                                                                                <bdi>
                                                                                                    <span className="woocommerce-Price-currencySymbol">
                                                                                                        $
                                                                                                    </span>
                                                                                                    {calculateSubtotal()}
                                                                                                </bdi>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-shipping-totals shipping">
                                                                                        <th>Shipping</th>
                                                                                        <td data-title="Shipping">
                                                                                            <ul
                                                                                                className="woocommerce-shipping-methods"
                                                                                                id="shipping_method">
                                                                                                <li>
                                                                                                    <input
                                                                                                        className="shipping_method"
                                                                                                        data-index="0"
                                                                                                        defaultChecked
                                                                                                        defaultValue="flat_rate:1"
                                                                                                        id="shipping_method_0_flat_rate1"
                                                                                                        name="shipping_method[0]"
                                                                                                        type="radio"
                                                                                                    />
                                                                                                    <label htmlFor="shipping_method_0_flat_rate1">
                                                                                                        Flat rate:
                                                                                                        <span className="woocommerce-Price-amount amount">
                                                                                                            <bdi>
                                                                                                                <span className="woocommerce-Price-currencySymbol">
                                                                                                                    $
                                                                                                                </span>
                                                                                                                20.00
                                                                                                            </bdi>
                                                                                                        </span>
                                                                                                    </label>
                                                                                                </li>
                                                                                                <li>
                                                                                                    <input
                                                                                                        className="shipping_method"
                                                                                                        data-index="0"
                                                                                                        defaultValue="local_pickup:4"
                                                                                                        id="shipping_method_0_local_pickup4"
                                                                                                        name="shipping_method[0]"
                                                                                                        type="radio"
                                                                                                    />
                                                                                                    <label htmlFor="shipping_method_0_local_pickup4">
                                                                                                        Local pickup:
                                                                                                        <span className="woocommerce-Price-amount amount">
                                                                                                            <bdi>
                                                                                                                <span className="woocommerce-Price-currencySymbol">
                                                                                                                    $
                                                                                                                </span>
                                                                                                                25.00
                                                                                                            </bdi>
                                                                                                        </span>
                                                                                                    </label>
                                                                                                </li>
                                                                                            </ul>
                                                                                            <p className="woocommerce-shipping-destination">
                                                                                                Shipping options will be updated
                                                                                                during checkout.
                                                                                            </p>
                                                                                            <form
                                                                                                action="https://woodmart.xtemos.com/mega-electronics/home/cart/"
                                                                                                className="woocommerce-shipping-calculator"
                                                                                                method="post">
                                                                                                <a
                                                                                                    className="shipping-calculator-button"
                                                                                                >
                                                                                                    Calculate shipping
                                                                                                </a>
                                                                                                <section
                                                                                                    className="shipping-calculator-form"
                                                                                                    style={{
                                                                                                        display: "none",
                                                                                                    }}>
                                                                                                    <p
                                                                                                        className="form-row form-row-wide"
                                                                                                        id="calc_shipping_country_field">
                                                                                                        <label
                                                                                                            className="screen-reader-text"
                                                                                                            htmlFor="calc_shipping_country">
                                                                                                            Country / region:
                                                                                                        </label>
                                                                                                        <select
                                                                                                            className="country_to_state country_select"
                                                                                                            id="calc_shipping_country"
                                                                                                            name="calc_shipping_country"
                                                                                                            rel="calc_shipping_state">
                                                                                                            <option value="default">
                                                                                                                Select a country / region…
                                                                                                            </option>
                                                                                                        </select>
                                                                                                    </p>
                                                                                                    <p
                                                                                                        className="form-row form-row-wide validate-required"
                                                                                                        id="calc_shipping_state_field">
                                                                                                        <label
                                                                                                            className="screen-reader-text"
                                                                                                            htmlFor="calc_shipping_state">
                                                                                                            State / County
                                                                                                            <abbr
                                                                                                                className="required"
                                                                                                                title="required">
                                                                                                                *
                                                                                                            </abbr>
                                                                                                        </label>
                                                                                                        <input
                                                                                                            className="input-text"
                                                                                                            defaultValue=""
                                                                                                            id="calc_shipping_state"
                                                                                                            name="calc_shipping_state"
                                                                                                            placeholder="State / County"
                                                                                                            type="text"
                                                                                                        />
                                                                                                    </p>
                                                                                                    <p
                                                                                                        className="form-row form-row-wide validate-required"
                                                                                                        id="calc_shipping_city_field">
                                                                                                        <label
                                                                                                            className="screen-reader-text"
                                                                                                            htmlFor="calc_shipping_city">
                                                                                                            Town / City
                                                                                                            <abbr
                                                                                                                className="required"
                                                                                                                title="required">
                                                                                                                *
                                                                                                            </abbr>
                                                                                                        </label>
                                                                                                        <input
                                                                                                            className="input-text"
                                                                                                            defaultValue=""
                                                                                                            id="calc_shipping_city"
                                                                                                            name="calc_shipping_city"
                                                                                                            placeholder="City"
                                                                                                            type="text"
                                                                                                        />
                                                                                                    </p>
                                                                                                    <p
                                                                                                        className="form-row form-row-wide validate-required"
                                                                                                        id="calc_shipping_postcode_field">
                                                                                                        <label
                                                                                                            className="screen-reader-text"
                                                                                                            htmlFor="calc_shipping_postcode">
                                                                                                            Postcode / ZIP
                                                                                                            <abbr
                                                                                                                className="required"
                                                                                                                title="required">
                                                                                                                *
                                                                                                            </abbr>
                                                                                                        </label>
                                                                                                        <input
                                                                                                            className="input-text"
                                                                                                            defaultValue=""
                                                                                                            id="calc_shipping_postcode"
                                                                                                            name="calc_shipping_postcode"
                                                                                                            placeholder="Postcode / ZIP"
                                                                                                            type="text"
                                                                                                        />
                                                                                                    </p>
                                                                                                    <p>
                                                                                                        <button
                                                                                                            className="button"
                                                                                                            name="calc_shipping"
                                                                                                            type="submit"
                                                                                                            value="1">
                                                                                                            Update
                                                                                                        </button>
                                                                                                    </p>
                                                                                                    <input
                                                                                                        defaultValue="d25f67d70d"
                                                                                                        id="woocommerce-shipping-calculator-nonce"
                                                                                                        name="woocommerce-shipping-calculator-nonce"
                                                                                                        type="hidden"
                                                                                                    />
                                                                                                    <input
                                                                                                        defaultValue="/mega-electronics/home/cart/"
                                                                                                        name="_wp_http_referer"
                                                                                                        type="hidden"
                                                                                                    />
                                                                                                </section>
                                                                                            </form>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="order-total">
                                                                                        <th>Total</th>
                                                                                        <td data-title="Total">
                                                                                            <strong>
                                                                                                <span className="woocommerce-Price-amount amount">
                                                                                                    <bdi>
                                                                                                        <span className="woocommerce-Price-currencySymbol">
                                                                                                            $
                                                                                                        </span>
                                                                                                        {calculateSubtotal()}
                                                                                                    </bdi>
                                                                                                </span>
                                                                                            </strong>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <div className="wc-proceed-to-checkout">
                                                                                <a
                                                                                    className="checkout-button button alt wc-forward"
                                                                                    onClick={() => handleCheckout(e)}
                                                                                    href="#">
                                                                                    Proceed to checkout
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1670856699156 vc_row-has-fill wd-rs-63973ff6c9ef6">
                                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-6213ac5daaf9d">
                                                        <div className="vc_column-inner vc_custom_1645456482508">
                                                            <div className="wpb_wrapper">
                                                                <div
                                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-63973ffc71ebd wd-title-color-default wd-title-style-default text-left vc_custom_1670856705742 wd-underline-colored"
                                                                    id="wd-63973ffc71ebd">
                                                                    <div className="liner-continer">
                                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-l">
                                                                            Delivery & Return
                                                                        </h4>
                                                                    </div>
                                                                </div>

                                                                <div
                                                                    className="wd-accordion wd-wpb wd-rs-63caae15ba090 vc_custom_1674227228977 wd-style-default wd-border-off wd-titles-left wd-opener-pos-right wd-opener-style-arrow wd-inited"
                                                                    data-state="first"
                                                                    id="wd-63caae15ba090">
                                                                    <div className="wd-accordion-item">
                                                                        <div
                                                                            className="wd-accordion-title wd-active font-primary wd-fontsize-s wd-font-weight-600"
                                                                            data-accordion-index="0">
                                                                            <div className="wd-accordion-title-text">
                                                                                <span>
                                                                                    My order hasn't arrived yet. Where is it?
                                                                                </span>
                                                                            </div>
                                                                            <span className="wd-accordion-opener" />
                                                                        </div>
                                                                        <div
                                                                            className="wd-accordion-content wd-entry-content wd-active"
                                                                            data-accordion-index="0"
                                                                            style={{
                                                                                display: "block",
                                                                            }}>
                                                                            <p>
                                                                                How can you evaluate content without design?
                                                                                No typography, no colors, no layout, no
                                                                                styles, all those things that convey the
                                                                                important signals that go beyond the mere
                                                                                textual, hierarchies of information, weight.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="wd-accordion-item">
                                                                        <div
                                                                            className="wd-accordion-title font-primary wd-fontsize-s wd-font-weight-600"
                                                                            data-accordion-index="1">
                                                                            <div className="wd-accordion-title-text">
                                                                                <span>
                                                                                    Do you deliver on public holidays?
                                                                                </span>
                                                                            </div>
                                                                            <span className="wd-accordion-opener" />
                                                                        </div>
                                                                        <div
                                                                            className="wd-accordion-content wd-entry-content"
                                                                            data-accordion-index="1">
                                                                            <p>
                                                                                To short sentences, to many headings, images
                                                                                too large for the proposed design, or too
                                                                                small, or they fit in but it looks iffy for
                                                                                reasons the folks in the meeting can’t quite
                                                                                tell right now, but they’re unhappy, somehow.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="wd-accordion-item">
                                                                        <div
                                                                            className="wd-accordion-title font-primary wd-fontsize-s wd-font-weight-600"
                                                                            data-accordion-index="2">
                                                                            <div className="wd-accordion-title-text">
                                                                                <span>Do you deliver to my postcode?</span>
                                                                            </div>
                                                                            <span className="wd-accordion-opener" />
                                                                        </div>
                                                                        <div
                                                                            className="wd-accordion-content wd-entry-content"
                                                                            data-accordion-index="2">
                                                                            <p>
                                                                                How can you evaluate content without design?
                                                                                No typography, no colors, no layout, no
                                                                                styles, all those things that convey the
                                                                                important signals that go beyond the mere
                                                                                textual, hierarchies of information, weight.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="wd-accordion-item">
                                                                        <div
                                                                            className="wd-accordion-title font-primary wd-fontsize-s wd-font-weight-600"
                                                                            data-accordion-index="3">
                                                                            <div className="wd-accordion-title-text">
                                                                                <span>
                                                                                    Is next-day delivery available on all
                                                                                    orders?
                                                                                </span>
                                                                            </div>
                                                                            <span className="wd-accordion-opener" />
                                                                        </div>
                                                                        <div
                                                                            className="wd-accordion-content wd-entry-content"
                                                                            data-accordion-index="3">
                                                                            <p>
                                                                                To short sentences, to many headings, images
                                                                                too large for the proposed design, or too
                                                                                small, or they fit in but it looks iffy for
                                                                                reasons the folks in the meeting can’t quite
                                                                                tell right now, but they’re unhappy, somehow.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="wd-accordion-item">
                                                                        <div
                                                                            className="wd-accordion-title font-primary wd-fontsize-s wd-font-weight-600"
                                                                            data-accordion-index="4">
                                                                            <div className="wd-accordion-title-text">
                                                                                <span>
                                                                                    Do I need to be there to sign for delivery?
                                                                                </span>
                                                                            </div>
                                                                            <span className="wd-accordion-opener" />
                                                                        </div>
                                                                        <div
                                                                            className="wd-accordion-content wd-entry-content"
                                                                            data-accordion-index="4">
                                                                            <p>
                                                                                How can you evaluate content without design?
                                                                                No typography, no colors, no layout, no
                                                                                styles, all those things that convey the
                                                                                important signals that go beyond the mere
                                                                                textual, hierarchies of information, weight.
                                                                            </p>
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
                </main>
            </div>

            {/* Cart Modal */}

            <Cartwidget isCartOpen={isCartOpen} closeCart={closeCart} setIsCartOpen={setIsCartOpen} />

            <div className={`wd-close-side wd-fill ${isCartOpen ? 'wd-close-side-opened' : ''}`} />
        </>
    )
}

export default cart;