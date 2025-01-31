'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from 'react';
import { doc, getDoc, arrayRemove, updateDoc } from 'firebase/firestore';
import { fireStore, auth } from '../../_components/firebase/config';
import { CartContext } from "../CartContext/page";
import { toast } from "react-toastify";

const Cartwidget = ({ setIsCartOpen, isCartOpen, closeCart }) => {

    const { data, dispatch } = useContext(CartContext);
    const router = useRouter();

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

    const handleViewCart = (e) => {
        e.preventDefault();
        router.push('/home/cart');
        setIsCartOpen(false);
    }

    const removeFromCart = async (productId) => {
        const userData = localStorage.getItem("currentUser");

        if (!userData) {
            console.log("No user logged in. Removing item from guest cart.");

            let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
            guestCart = guestCart.filter(item => item.productId !== productId);

            localStorage.setItem("guestCart", JSON.stringify(guestCart));
            dispatch({ type: "Update", payload: guestCart });

            toast.success("Product removed from cart!");
            return;
        }

        const user = JSON.parse(userData);
        if (!user?.uid) return;

        try {
            const userRef = doc(fireStore, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                let userCart = userDoc.data().cart || [];
                userCart = userCart.filter(item => item.productId !== productId);

                await updateDoc(userRef, { cart: userCart });
                dispatch({ type: "Update", payload: userCart });

                toast.success("Product removed from cart!");
            } else {
                console.log("User document not found.");
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
            toast.error("Error removing product from cart.");
        }
    };

    const changeQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            toast.error("Quantity cannot be less than 1.");
            return;
        }

        const userData = localStorage.getItem("currentUser");

        if (!userData) {
            console.log("No user logged in. Updating quantity in guest cart.");

            let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
            guestCart = guestCart.map(item =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            );

            localStorage.setItem("guestCart", JSON.stringify(guestCart));
            dispatch({ type: "Update", payload: guestCart });

            toast.success("Quantity updated!");
            return;
        }

        const user = JSON.parse(userData);
        if (!user?.uid) return;

        try {
            const userRef = doc(fireStore, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                let userCart = userDoc.data().cart || [];
                userCart = userCart.map(item =>
                    item.productId === productId ? { ...item, quantity: newQuantity } : item
                );

                await updateDoc(userRef, { cart: userCart });
                dispatch({ type: "Update", payload: userCart });

                toast.success("Quantity updated!");
            } else {
                console.log("User document not found.");
            }
        } catch (error) {
            console.error("Error updating quantity in cart:", error);
            toast.error("Error updating quantity.");
        }
    };

    const calculateSubtotal = () => {
        return data.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    useEffect(() => {
        // console.log(data, "cart Data from Context in UserEffect")
        const fetchCart = async () => {
            try {
                // Get user data from localStorage
                const userData = localStorage.getItem("currentUser");

                if (!userData) {
                    console.log("No user logged in. Fetching cart from localStorage.");

                    let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

                    // Ensure guest cart does not contain duplicates
                    const uniqueGuestCart = Array.from(new Map(guestCart.map(item => [item.productId, item])).values());

                    // Dispatch the unique guest cart to the context
                    dispatch({ type: "Update", payload: uniqueGuestCart });

                    // Update localStorage with unique guest cart
                    localStorage.setItem("guestCart", JSON.stringify(uniqueGuestCart));

                    return;
                }

                // Parse user data
                const user = JSON.parse(userData);

                // Validate user object
                if (!user || !user.uid) {
                    console.log("Invalid user data.");
                    return;
                }

                // Get the user's cart data from Firestore
                const userRef = doc(fireStore, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const cartData = userDoc.data().cart || [];
                    console.log(cartData, "Inital State of Cart Data");
                    // Update cart only if data is different (avoiding unnecessary re-renders)
                    if (JSON.stringify(cartData) !== JSON.stringify(data)) {
                        dispatch({ type: "Update", payload: cartData });
                    }
                } else {
                    console.log("User document not found.");
                }
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        };

        fetchCart();
    }, [fireStore, dispatch]);

    return (
        <>
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
                                    {data.length > 0 ? (
                                        data.map((item, index) => (
                                            <li key={index} className="woocommerce-mini-cart-item mini_cart_item">
                                                <a href={item.productUrl} className="cart-item-link wd-fill">
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
                                                <a href={item.productUrl} className="cart-item-image">
                                                    <img
                                                        width={430}
                                                        height={491}
                                                        src={item.image_url}
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
                                                            value="-"
                                                            className="minus btn"
                                                            onClick={() => changeQuantity(item.productId, item.quantity - 1)} // Decrease quantity
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
                                                            min={1}
                                                            onChange={(e) => changeQuantity(item.productId, parseInt(e.target.value))} // Set new quantity
                                                        />
                                                        <input
                                                            type="button"
                                                            value="+"
                                                            className="plus btn"
                                                            onClick={() => changeQuantity(item.productId, item.quantity + 1)} // Increase quantity
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
                                        <div className="wd-empty-mini-cart">
                                            <p className="woocommerce-mini-cart__empty-message empty title">
                                                No products in the cart.
                                            </p>
                                            <a
                                                className="btn wc-backward"
                                                href="/home/productCategory"
                                            >
                                                Return To Shop{" "}
                                            </a>
                                        </div>
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
                                        {calculateSubtotal()}
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
                                    onClick={(e) => handleCheckout(e)}
                                >
                                    Checkout
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cartwidget;