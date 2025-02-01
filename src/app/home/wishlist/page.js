"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, fireStore } from "@/app/_components/firebase/config";
import Cartwidget from "@/app/_components/Cart-widget/page";

const wishlist = () => {

    const [wishlist, setWishlist] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const router = useRouter();

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

    // console.log(wishlist, "wishlist All Data");

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

                alert("Product removed from wishlist!");
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

                    alert("Product removed from wishlist!");
                } else {
                    console.log("User document not found.");
                }
            }
        } catch (error) {
            console.error("Error removing product from wishlist:", error);
            alert("Error removing product from wishlist.");
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
                                                            <a href="/" className="product-image-link">
                                                                <picture decoding="async" className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail">
                                                                    <source
                                                                        type="image/webp"
                                                                        srcSet={`${offer.image_url}?maxHeight=150&maxWidth=225 225w`}
                                                                        sizes="(max-width: 430px) 100vw, 430px"
                                                                    />
                                                                    <img
                                                                        decoding="async"
                                                                        width={430}
                                                                        height={491}
                                                                        src={offer.image_url}
                                                                        alt={offer.productName}
                                                                        srcSet={`${offer.image_url}?maxHeight=150&maxWidth=225 225w`}
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
                                                                    href="/home/productDetails"
                                                                    className="button product_type_variable add_to_cart_button add-to-cart-loop"
                                                                    data-product_id={offer.productId}
                                                                    aria-label={`Select options for ${offer.productName}`}
                                                                    rel="nofollow"
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