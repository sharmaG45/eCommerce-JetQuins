"use client";

import { useEffect, useState, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { fireStore } from "@/app/_components/firebase/config";
import Cartwidget from "@/app/_components/Cart-widget/page";
import { toast } from "react-toastify";
import { CartContext } from "../../_components/CartContext/page";

const wishlist = () => {

    const [wishlist, setWishlist] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { data, dispatch } = useContext(CartContext);

    // Make sure user is set properly

    useEffect(() => {
        const fetchWishlist = async (userId) => {
            try {
                const userRef = doc(fireStore, "users", userId);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const wishlistData = userDoc.data().wishlist || [];
                    setWishlist(wishlistData);
                } else {
                    console.log("No wishlist found for the user.");
                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
        };

        const userData = localStorage.getItem("currentUser");

        if (!userData) {
            console.log("No user logged in. Fetching wishlist from localStorage.");

            try {
                // Fetch wishlist from localStorage safely
                const guestWishlist = localStorage.getItem("guestWishlist");
                setWishlist(guestWishlist ? JSON.parse(guestWishlist) : []);
            } catch (error) {
                console.error("Error parsing guest wishlist:", error);
                setWishlist([]); // Reset wishlist if error occurs
            }
            return;
        }

        // Parse user data
        const user = JSON.parse(userData);
        if (user?.uid) {
            fetchWishlist(user.uid); // Fetch Firestore wishlist for logged-in users
        }
    }, []);


    useEffect(() => {
        console.log(" Updated wishlist state:", wishlist);
    }, [wishlist]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            const userData = localStorage.getItem("currentUser");

            if (!userData) {
                console.log("No user logged in. Removing from guest wishlist.");

                // Get guest wishlist from localStorage
                const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

                // Remove the item from guest wishlist
                const updatedWishlist = guestWishlist.filter(item => item.productId !== productId);

                // Update localStorage and state
                localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
                setWishlist(updatedWishlist);

                toast.success("Removed from wishlist")
                return;
            }

            // Parse user data
            const user = JSON.parse(userData);
            const userId = user?.uid;

            if (userId) {
                const userRef = doc(fireStore, "users", userId);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userWishlist = userDoc.data().wishlist || [];

                    // Remove the item from the wishlist
                    const updatedWishlist = userWishlist.filter(item => item.productId !== productId);

                    // Update the wishlist in Firestore
                    await updateDoc(userRef, { wishlist: updatedWishlist });

                    // Update local state
                    setWishlist(updatedWishlist);

                    toast.success("Removed from wishlist");
                } else {
                    console.log("User document not found.");
                }
            }
        } catch (error) {
            console.error("Error removing product from wishlist:", error);
            toast.success("Error removing product.");
        }
    };

    const openCart = async (e, offer) => {
        e.preventDefault(); // Prevent default behavior

        const user = JSON.parse(localStorage.getItem("currentUser"));

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
            price: parseFloat(offer.price) || staticData.price,
            discount: parseFloat(offer.discount) || staticData.discount,
            quantity: 1, // Always adding 1 item initially
            rating: offer.rating || staticData.rating,
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

    // Function to close the modal
    const closeCart = () => {
        setIsCartOpen(false);
    };

    return (
        <>
            <div className="wd-page-content main-page-wrapper">
                <main
                    className="wd-content-layout content-layout-wrapper container"
                    role="main"
                >
                    <div className="wd-content-area site-content">
                        <article
                            className="entry-content post-30 page type-page status-publish hentry"
                            id="post-30"
                        >
                            {wishlist.length === 0 ? (
                                <div className="wd-wishlist-content">
                                    <p className="wd-empty-wishlist wd-empty-page">This wishlist is empty.</p>
                                    <div className="wd-empty-page-text">
                                        You don't have any products in the wishlist yet. <br />
                                        You will find a lot of interesting products on our "Shop" page.
                                    </div>
                                    <p className="return-to-shop">
                                        <a className="button" href="/home/productCategory">
                                            Return to shop
                                        </a>
                                    </p>
                                </div>
                            ) : (
                                <div className="wd-wishlist-content">
                                    <div className="wd-wishlist-head">
                                        <h4 className="title">Your products wishlist</h4>
                                    </div>

                                    <div className="wd-products-element wd-wpb">
                                        <div
                                            className="products wd-products grid-columns-3 elements-grid pagination-links wd-grid-g title-line-one wd-stretch-cont-lg wd-products-with-bg"
                                            style={{
                                                '--wd-col-lg': '3',
                                                '--wd-col-md': '3',
                                                '--wd-col-sm': '2',
                                                '--wd-gap-lg': '20px',
                                                '--wd-gap-sm': '10px',
                                            }}
                                        >
                                            {wishlist.map((offer, index) => (
                                                <div
                                                    className="wd-product wd-with-labels wd-hover-fw-button wd-hover-with-fade wd-col product-grid-item"
                                                    data-id={offer.productId}
                                                    data-loop="1"
                                                    key={index}
                                                >
                                                    <div className="wd-wishlist-product-actions">
                                                        <div className="wd-wishlist-product-remove wd-action-btn wd-style-text wd-cross-icon">
                                                            <a onClick={() => handleRemoveFromWishlist(offer.productId)}>Remove</a>
                                                        </div>
                                                    </div>

                                                    <div className="product-wrapper">
                                                        <div className="content-product-imagin" style={{ marginBottom: '-112px' }} />
                                                        <div className="product-element-top wd-quick-shop">
                                                            <a href={`/home/productDetails?brand=${offer.productName}`} className="product-image-link">
                                                                <picture decoding="async" className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail">

                                                                    <img
                                                                        decoding="async"
                                                                        width={430}
                                                                        height={491}
                                                                        src={offer.image_url}
                                                                        alt={offer.productName}
                                                                        srcSet={offer.image_url}
                                                                        sizes="(max-width: 430px) 100vw, 430px"
                                                                    />
                                                                </picture>
                                                            </a>
                                                            <div className="wd-buttons wd-pos-r-t">
                                                                <div className="wd-compare-btn product-compare-button wd-action-btn wd-style-icon wd-compare-icon">
                                                                    <a href="/" data-id={offer.productId} rel="nofollow" data-added-text="Compare products">
                                                                        <span>Compare</span>
                                                                    </a>
                                                                </div>
                                                                <div className="quick-view wd-action-btn wd-style-icon wd-quick-view-icon">
                                                                    <a href="/" className="open-quick-view quick-view-button" rel="nofollow" data-id={offer.productId}>
                                                                        Quick view
                                                                    </a>
                                                                </div>
                                                                <div className="wd-wishlist-btn wd-action-btn wd-style-icon wd-wishlist-icon">
                                                                    <a
                                                                        href="/"
                                                                        className=""
                                                                        data-key={offer.productId}
                                                                        data-product-id={offer.productId}
                                                                        rel="nofollow"
                                                                        data-added-text="Browse Wishlist"
                                                                    >
                                                                        <span>Add to wishlist</span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="product-element-bottom">
                                                            <h3 className="wd-entities-title">
                                                                <a href="/">{offer.productName}</a>
                                                            </h3>
                                                            <div className="wd-product-cats">
                                                                <a href="/" rel="tag">{offer.productName}</a>
                                                            </div>

                                                            <div className="star-rating" role="img" aria-label="Rated 5.00 out of 5">
                                                                <span style={{ width: '100%' }}>
                                                                    Rated <strong className="rating">5.00</strong> out of 5
                                                                </span>
                                                            </div>

                                                            <p className="wd-product-stock stock wd-style-default in-stock">In stock</p>

                                                            <div className="wrap-price">
                                                                <span className="price">
                                                                    <span className="woocommerce-Price-amount amount">
                                                                        <bdi>
                                                                            <span className="woocommerce-Price-currencySymbol">$</span> {offer.price}
                                                                        </bdi>
                                                                    </span>
                                                                </span>
                                                            </div>

                                                            <div className="wd-add-btn wd-add-btn-replace">
                                                                <a
                                                                    href="#"
                                                                    className="button product_type_variable add_to_cart_button add-to-cart-loop"
                                                                    data-product_id={offer.productId}
                                                                    aria-label={`Select options for ${offer.productName}`}
                                                                    rel="nofollow"
                                                                    onClick={(e) => openCart(e, offer)}
                                                                >
                                                                    <span>Buy Now</span>
                                                                </a>
                                                                <span id={`woocommerce_loop_add_to_cart_link_describedby_${offer.productId}`} className="screen-reader-text">
                                                                    This product has multiple variants. The options may be chosen on the product page.
                                                                </span>
                                                            </div>

                                                            <div className="wd-product-detail wd-product-sku">
                                                                <span className="wd-label">SKU: </span>
                                                                <span>{offer.productSku}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </article>
                    </div>
                </main>
            </div>


            {/* Cart Modal */}

            <Cartwidget isCartOpen={isCartOpen} closeCart={closeCart} setIsCartOpen={setIsCartOpen} />
        </>
    )
}
export default wishlist;