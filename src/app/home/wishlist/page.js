"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, fireStore } from "@/app/_components/firebase/config";

const wishlist = () => {

    const [wishlist, setWishlist] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const router = useRouter();

    // Make sure user is set properly
    const fetchWishlist = async (userId) => {
        try {
            const userRef = doc(fireStore, 'users', userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                // Get wishlist data from Firestore
                const wishlistData = userDoc.data().wishlist || [];
                setWishlist(wishlistData); // Update state with wishlist data
            } else {
                console.log('No wishlist found for the user');
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user && user.uid) {
            const userId = user.uid;
            fetchWishlist(userId); // Fetch wishlist data
        }
    }, []);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const userId = user?.uid;

            if (userId) {
                const userRef = doc(fireStore, 'users', userId);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userWishlist = userDoc.data().wishlist || [];

                    // Remove the item from the wishlist
                    const updatedWishlist = userWishlist.filter(item => item.productId !== productId);

                    // Update the wishlist in Firestore
                    await updateDoc(userRef, { wishlist: updatedWishlist });

                    // Update local state
                    setWishlist(updatedWishlist);
                    alert('Product removed from wishlist!');
                }
            }
        } catch (error) {
            console.error('Error removing product from wishlist:', error);
            alert('Error removing product from wishlist.');
        }
    };


    const openCart = (e) => {
        e.preventDefault();

        setIsCartOpen(true);
    };

    // Function to close the modal
    const closeCart = () => {
        setIsCartOpen(false);
    };

    const handleCheckout = () => {
        router.push('/home/checkout');
    }

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
                            <div className="">
                                {wishlist.length === 0 ? (
                                    <p>Your wishlist is empty.</p>
                                ) : (
                                    wishlist.map((offer, index) => (
                                        <div className="wd-wishlist-content" key={index}>
                                            <link
                                                href="https://woodmart.xtemos.com/mega-electronics/wp-content/themes/woodmart/css/parts/woo-page-wishlist-bulk.min.css?ver=8.0.4"
                                                id="wd-page-wishlist-bulk-css"
                                                media="all"
                                                rel="stylesheet"
                                                type="text/css"
                                            />
                                            <div className="wd-wishlist-head">
                                                <h4 className="title">Your products wishlist</h4>
                                            </div>
                                            <div className="wd-wishlist-bulk-action">
                                                <div className="wd-wishlist-remove-action wd-action-btn wd-style-text wd-cross-icon">
                                                    <a onClick={(e) => handleRemoveFromWishlist(offer.productId)}>
                                                        Remove
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="wd-products-element wd-wpb">
                                                <div
                                                    className="products wd-products grid-columns-3 elements-grid pagination-links wd-grid-g title-line-one wd-stretch-cont-lg wd-products-with-bg"
                                                    style={{
                                                        '--wd-col-lg': '3',
                                                        '--wd-col-md': '3',
                                                        '--wd-col-sm': '2',
                                                        '--wd-gap-lg': '20px',
                                                        '--wd-gap-sm': '10px'
                                                    }}
                                                >
                                                    <div
                                                        className="wd-product wd-with-labels wd-hover-fw-button wd-hover-with-fade wd-col product-grid-item"
                                                        data-id={offer.productId}
                                                        data-loop="1"
                                                    >
                                                        <div className="wd-wishlist-product-actions">
                                                            <div className="wd-wishlist-product-remove wd-action-btn wd-style-text wd-cross-icon">
                                                                <a
                                                                    onClick={(e) => handleRemoveFromWishlist(offer.productId)}
                                                                >
                                                                    Remove
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="product-wrapper">
                                                            <div className="content-product-imagin" />
                                                            <div className="product-element-top wd-quick-shop">
                                                                <a className="product-image-link" href={offer.productUrl}>
                                                                    <div className="wd-product-grid-slider wd-fill">
                                                                        {offer.imageUrls.map((url, imageIndex) => (
                                                                            <div
                                                                                className="wd-product-grid-slide"
                                                                                key={imageIndex}
                                                                                data-image-url={url}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </a>
                                                            </div>

                                                            <div className="product-element-bottom">
                                                                <h3 className="wd-entities-title">
                                                                    <a href={offer.productUrl}>{offer.productName}</a>
                                                                </h3>
                                                                <p className="wd-product-stock stock wd-style-default in-stock">
                                                                    In stock
                                                                </p>
                                                                <div className="wrap-price">
                                                                    <span className="price">
                                                                        <span className="woocommerce-Price-amount amount">
                                                                            <bdi>
                                                                                <span className="woocommerce-Price-currencySymbol">
                                                                                    $
                                                                                </span>
                                                                                {offer.price}
                                                                            </bdi>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}

                            </div>
                        </article>
                    </div>
                </main>
            </div>


            {/* Cart Modal */}

            {isCartOpen && (<div className="cart-widget-side wd-side-hidden wd-right wd-opened">
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
                                    <li
                                        className="woocommerce-mini-cart-item mini_cart_item"
                                        data-key="b1301141feffabac455e1f90a7de2054"
                                    >
                                        <a
                                            href="https://woodmart.xtemos.com/mega-electronics/product/oculus-quest-2/"
                                            className="cart-item-link wd-fill"
                                        >
                                            Show
                                        </a>
                                        <a
                                            href="https://woodmart.xtemos.com/mega-electronics/home/cart/?remove_item=b1301141feffabac455e1f90a7de2054&_wpnonce=ee462b7815"
                                            className="remove remove_from_cart_button"
                                            aria-label="Remove Oculus Quest 2 from cart"
                                            data-product_id={2435}
                                            data-cart_item_key="b1301141feffabac455e1f90a7de2054"
                                            data-product_sku={608069}
                                            data-success_message="“Oculus Quest 2” has been removed from your cart"
                                        >
                                            ×
                                        </a>
                                        <a
                                            href="https://woodmart.xtemos.com/mega-electronics/product/oculus-quest-2/"
                                            className="cart-item-image"
                                        >
                                            <img
                                                width={430}
                                                height={491}
                                                src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/oculus-quest-2-1-430x491.jpg"
                                                className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                                                alt=""
                                                decoding="async"
                                                srcSet="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/oculus-quest-2-1-430x491.jpg 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/oculus-quest-2-1-263x300.jpg 263w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/oculus-quest-2-1-88x100.jpg 88w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/oculus-quest-2-1-180x206.jpg 180w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/oculus-quest-2-1.jpg 700w"
                                                sizes="(max-width: 430px) 100vw, 430px"
                                            />
                                        </a>
                                        <div className="cart-info">
                                            <span className="wd-entities-title">Oculus Quest 2 </span>
                                            <div className="wd-product-detail wd-product-sku">
                                                <span className="wd-label">SKU: </span>
                                                <span>608069 </span>
                                            </div>
                                            <div className="quantity">
                                                <input type="button" defaultValue="-" className="minus btn" />
                                                <label
                                                    className="screen-reader-text"
                                                    htmlFor="quantity_6784e22dca593"
                                                >
                                                    Oculus Quest 2 quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    id="quantity_6784e22dca593"
                                                    className="input-text qty text"
                                                    defaultValue={5}
                                                    aria-label="Product quantity"
                                                    min={0}
                                                    max=""
                                                    name="cart[b1301141feffabac455e1f90a7de2054][qty]"
                                                    step={1}
                                                    placeholder=""
                                                    inputMode="numeric"
                                                    autoComplete="off"
                                                />
                                                <input type="button" defaultValue="+" className="plus btn" />
                                            </div>
                                            <span className="quantity">
                                                5 ×
                                                <span className="woocommerce-Price-amount amount">
                                                    <bdi>
                                                        <span className="woocommerce-Price-currencySymbol">
                                                            $
                                                        </span>
                                                        449.00
                                                    </bdi>
                                                </span>
                                            </span>
                                        </div>
                                    </li>
                                    <li
                                        className="woocommerce-mini-cart-item mini_cart_item"
                                        data-key="26e359e83860db1d11b6acca57d8ea88"
                                    >
                                        <a
                                            href="https://woodmart.xtemos.com/mega-electronics/product/asus-zenbook-oled-13/"
                                            className="cart-item-link wd-fill"
                                        >
                                            Show
                                        </a>
                                        <a
                                            href="https://woodmart.xtemos.com/mega-electronics/home/cart/?remove_item=26e359e83860db1d11b6acca57d8ea88&_wpnonce=ee462b7815"
                                            className="remove remove_from_cart_button"
                                            aria-label="Remove ASUS ZenBook OLED 13 from cart"
                                            data-product_id={298}
                                            data-cart_item_key="26e359e83860db1d11b6acca57d8ea88"
                                            data-product_sku={30884}
                                            data-success_message="“ASUS ZenBook OLED 13” has been removed from your cart"
                                        >
                                            ×
                                        </a>
                                        <a
                                            href="https://woodmart.xtemos.com/mega-electronics/product/asus-zenbook-oled-13/"
                                            className="cart-item-image"
                                        >
                                            <img
                                                width={430}
                                                height={491}
                                                src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/asus-zenbook-oled-13-1-430x491.jpg"
                                                className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                                                alt=""
                                                decoding="async"
                                                srcSet="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/asus-zenbook-oled-13-1-430x491.jpg 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/asus-zenbook-oled-13-1-263x300.jpg 263w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/asus-zenbook-oled-13-1-88x100.jpg 88w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/asus-zenbook-oled-13-1-180x206.jpg 180w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/asus-zenbook-oled-13-1.jpg 700w"
                                                sizes="(max-width: 430px) 100vw, 430px"
                                            />
                                        </a>
                                        <div className="cart-info">
                                            <span className="wd-entities-title">ASUS ZenBook OLED 13 </span>
                                            <div className="wd-product-detail wd-product-sku">
                                                <span className="wd-label">SKU: </span>
                                                <span>30884 </span>
                                            </div>
                                            <div className="quantity">
                                                <input type="button" defaultValue="-" className="minus btn" />
                                                <label
                                                    className="screen-reader-text"
                                                    htmlFor="quantity_6784e22dcaabe"
                                                >
                                                    ASUS ZenBook OLED 13 quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    id="quantity_6784e22dcaabe"
                                                    className="input-text qty text"
                                                    defaultValue={2}
                                                    aria-label="Product quantity"
                                                    min={0}
                                                    max=""
                                                    name="cart[26e359e83860db1d11b6acca57d8ea88][qty]"
                                                    step={1}
                                                    placeholder=""
                                                    inputMode="numeric"
                                                    autoComplete="off"
                                                />
                                                <input type="button" defaultValue="+" className="plus btn" />
                                            </div>
                                            <span className="quantity">
                                                2 ×
                                                <span className="woocommerce-Price-amount amount">
                                                    <bdi>
                                                        <span className="woocommerce-Price-currencySymbol">
                                                            $
                                                        </span>
                                                        1,600.00
                                                    </bdi>
                                                </span>
                                            </span>
                                        </div>
                                    </li>
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
                                    href="/home/cart"
                                    className="button btn-cart wc-forward"
                                >
                                    View cart
                                </a>
                                <a
                                    href="/home/checkout"
                                    className="button checkout wc-forward"
                                    onClick={handleCheckout}
                                >
                                    Checkout
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>)}
        </>
    )
}
export default wishlist;