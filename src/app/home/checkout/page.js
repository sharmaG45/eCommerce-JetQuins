'use client';

import data from "@/app/assets/faq_question.json"
import { useEffect, useState } from "react";
import { auth, fireStore } from "../../_components/firebase/config";
import { doc, getDoc, updateDoc, arrayRemove, setDoc, arrayUnion } from "firebase/firestore";
import { Country, State, City } from "country-state-city";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify"; // Import Toastify

const checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [accordionData, setAccordionData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [createAccount, setCreateAccount] = useState(false);
    const [states, setStates] = useState([]);
    const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
        rememberMe: false,
    });

    const handleLoginToggle = () => {
        setIsLoginFormVisible((prevState) => !prevState);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // Handle the login action here, like sending the request to your backend
        console.log('Logging in with:', loginData);
    };

    const [cardData, setCardData] = useState({
        card_holder_name: "",
        card_number: "",
        card_expiry: "",
        card_cvv: "",
    });

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        setCardData({ ...cardData, [name]: value });
    };

    const [shippingData, setShippingData] = useState({
        shipping_first_name: "",
        shipping_last_name: "",
        shipping_company: "",
        shipping_country: "",
        shipping_address_1: "",
        shipping_address_2: "",
        shipping_city: "",
        shipping_state: "",
        shipping_postcode: "",

    });

    const handleCheckboxChange = (e) => {
        setShipToDifferentAddress(e.target.checked);
    };

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleShippingCountryChange = (e) => {
        const countryCode = e.target.value;
        setShippingData((prevState) => ({
            ...prevState,
            shipping_country: countryCode,
        }));

        // Fetch states for the selected country
        const statesList = State.getStatesOfCountry(countryCode);
        setStates(statesList);
        setShippingData((prevState) => ({
            ...prevState,
            shipping_state: "", // Reset state when country changes
        }));
        setCities([]); // Reset cities as well
    };

    const handleStateChange = (e) => {
        const stateCode = e.target.value;
        setShippingData((prevDetails) => ({
            ...prevDetails,
            shipping_state: stateCode, // Update state property
        }));

        // Fetch cities based on the selected state and country
        const citiesList = City.getCitiesOfState(shippingData.shipping_country, stateCode);
        setCities(citiesList);
    };

    useEffect(() => {
        if (shippingData.shipping_country) {
            // Fetch initial states when country is selected
            const statesList = State.getStatesOfCountry(shippingData.shipping_country);
            setStates(statesList);
        }
    }, [shippingData.shipping_country]);

    // Create User Account
    const [userData, setUserData] = useState({
        account_username: "",
        account_password: "",
    });


    // Billing Information
    const [formData, setFormData] = useState({
        billing_first_name: "",
        billing_last_name: "",
        billing_phone: "",
        billing_email: "",
        billing_country: "",
        billing_city: "",
        billing_address_1: "",
        billing_postcode: "",

    });

    const handleCountryChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            billing_country: e.target.value,
        }));
    };

    const handleCreateAccountChange = (e) => {
        setCreateAccount(e.target.checked);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = localStorage.getItem('currentUser');
        const user = JSON.parse(userData);
        if (!user) {
            console.error("User not authenticated");
            return;
        }
        const orderId = uuidv4(); // Example: "a1b2c3d4-5678"

        // Order data
        const newOrder = {
            orderId, // Unique Order ID
            userId: user.uid, // User's ID
            formData, // User details
            shippingData, // Shipping information
            cardData, // Payment info (DO NOT store sensitive details)
            timestamp: new Date(), // Timestamp
            status: "pending", // Default status
        };

        try {
            // Reference to user's document
            const orderRef = doc(fireStore, "users", user.uid);

            // Check if user document exists
            const userDoc = await getDoc(orderRef);
            if (userDoc.exists()) {
                // Update existing user document (append order)
                await updateDoc(orderRef, {
                    orders: arrayUnion(newOrder), // Add order to the `orders` array
                });
            } else {
                // Create new user document with first order
                await setDoc(orderRef, {
                    orders: [newOrder], // Create new `orders` array
                });
            }

            toast.success(`Order saved and Your Order ID: ${orderId}`);
            console.log("Order saved under user:", user.uid, "Order ID:", orderId);
        } catch (error) {
            console.error("Error saving order:", error);
        }
        console.log("Form Data Submitted:", formData);
        console.log("Form Shipping Data Submitted:", shippingData);
        console.log("Form Card Data Submitted:", cardData);
        // Perform validation or API call here
    };

    useEffect(() => {
        // Fetch the current user's cart items
        const fetchCart = async () => {
            // Retrieve user data from localStorage
            const userData = localStorage.getItem('currentUser');

            if (!userData) {
                // alert("Please log in first.");
                toast.error("Please log in first.")
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
    }, [])

    console.log(cartItems, "Cart Data");


    const removeFromCart = async (productId, e) => {
        e.preventDefault();
        const userData = localStorage.getItem('currentUser');
        if (!userData) {
            // alert("Please log in first.");
            toast.error("Please log in first.");
            return;
        }

        const user = JSON.parse(userData); // Parse the user data from localStorage

        try {
            // Get user document reference
            const userRef = doc(fireStore, "users", user.uid);

            // Find the item to be removed by matching the productId
            const itemToRemove = cartItems.find(item => item.productId === productId);

            if (!itemToRemove) {
                console.log("Item not found in cart.");
                return;
            }

            // Remove item from cart array in Firestore using arrayRemove
            await updateDoc(userRef, {
                cart: arrayRemove(itemToRemove) // Ensure you're passing the whole object
            });

            // Update local state by filtering out the item
            setCartItems(cartItems.filter(item => item.productId !== productId));

            console.log(`Removed item with productId: ${productId}`);
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const changeQuantity = async (productId, newQuantity, e) => {
        e.preventDefault()
        if (newQuantity < 1) {
            alert("Quantity cannot be less than 1.");
            return;
        }

        const userData = localStorage.getItem('currentUser');
        // if (!userData) {
        //     alert("Please log in first.");
        //     return;
        // }

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

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    // Fetch data (you can replace this with an API call or a database query)
    useEffect(() => {
        // Simulating a fetch call
        const fetchData = async () => {
            setAccordionData(data);
        };

        fetchData();
    }, []);

    const toggleAccordion = (index) => {
        setActiveIndex(index === activeIndex ? null : index); // Toggle active index
    };

    return (
        <>
            <div className="wd-page-content main-page-wrapper">
                <main
                    className="wd-content-layout content-layout-wrapper container wd-builder-on"
                    role="main">
                    <div className="wd-content-area site-content">
                        <div className="woocommerce entry-content">

                            <div className="wpb-content-wrapper">
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1668170221487 wd-rs-636e41e822cb4">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-6213ae0da5a5b">
                                        <div className="vc_column-inner vc_custom_1645456912760">
                                            <div className="wpb_wrapper">
                                                <div className="wd-page-title-el wd-wpb wd-rs-63c80f9ba26ac vc_custom_1674055583243">
                                                    <div
                                                        className="wd-page-title page-title  page-title-default title-size-default title-design-centered color-scheme-light"
                                                        style={{}}>
                                                        <div className="container">
                                                            <ul className="wd-checkout-steps">
                                                                <li className="step-cart step-inactive">
                                                                    <a href="/">
                                                                        <span>Shopping cart</span>
                                                                    </a>
                                                                </li>
                                                                <li className="step-checkout step-active">
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
                                <div className="vc_row wpb_row vc_row-fluid">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-6213ae2902d5c">
                                        <div className="vc_column-inner vc_custom_1645456939710">
                                            <div className="wpb_wrapper">
                                                <div className="wd-wc-notices wd-wpb wd-rs-626fe69382ebd">
                                                    <div className="woocommerce-notices-wrapper" />
                                                </div>
                                                <div className="wd-checkout-login wd-wpb wd-rs-64d4a3471801a vc_custom_1691657033730">
                                                    <div className="woocommerce-form-login-toggle">
                                                        <div className="woocommerce-info">
                                                            Returning customer?
                                                            <a className="showlogin" onClick={handleLoginToggle}>
                                                                Click here to login
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {isLoginFormVisible && (
                                                        <form
                                                            className="login woocommerce-form woocommerce-form-login hidden-form"
                                                            method="post"
                                                            onSubmit={handleLoginSubmit}
                                                        >
                                                            <p>
                                                                If you have shopped with us before, please enter your details below.
                                                                If you are a new customer, please proceed to the Billing section.
                                                            </p>

                                                            <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide form-row-username">
                                                                <label htmlFor="username">
                                                                    Username or email address
                                                                    <span aria-hidden="true" className="required">*</span>
                                                                    <span className="screen-reader-text">Required</span>
                                                                </label>
                                                                <input
                                                                    className="woocommerce-Input woocommerce-Input--text input-text"
                                                                    id="username"
                                                                    name="username"
                                                                    type="text"
                                                                    value={loginData.username}
                                                                    onChange={handleInputChange}
                                                                    required
                                                                />
                                                            </p>

                                                            <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide form-row-password">
                                                                <label htmlFor="password">
                                                                    Password
                                                                    <span aria-hidden="true" className="required">*</span>
                                                                    <span className="screen-reader-text">Required</span>
                                                                </label>
                                                                <span className="password-input">
                                                                    <input
                                                                        autoComplete="current-password"
                                                                        className="woocommerce-Input woocommerce-Input--text input-text"
                                                                        id="password"
                                                                        name="password"
                                                                        type="password"
                                                                        value={loginData.password}
                                                                        onChange={handleInputChange}
                                                                        required
                                                                    />
                                                                    <span className="show-password-input" />
                                                                </span>
                                                            </p>

                                                            <p className="form-row">
                                                                <input
                                                                    defaultValue="03d4142090"
                                                                    id="woocommerce-login-nonce"
                                                                    name="woocommerce-login-nonce"
                                                                    type="hidden"
                                                                />
                                                                <input
                                                                    defaultValue="/mega-electronics/home/checkout/"
                                                                    name="_wp_http_referer"
                                                                    type="hidden"
                                                                />
                                                                <input
                                                                    defaultValue="https://woodmart.xtemos.com/mega-electronics/home/checkout/"
                                                                    name="redirect"
                                                                    type="hidden"
                                                                />
                                                                <button
                                                                    className="button woocommerce-button woocommerce-form-login__submit"
                                                                    name="login"
                                                                    type="submit"
                                                                    value="Log in"
                                                                >
                                                                    Log in
                                                                </button>
                                                            </p>

                                                            <p className="login-form-footer">
                                                                <a
                                                                    className="woocommerce-LostPassword lost_password"
                                                                    href="/"
                                                                >
                                                                    Lost your password?
                                                                </a>
                                                                <label className="woocommerce-form__label woocommerce-form__label-for-checkbox woocommerce-form-login__rememberme">
                                                                    <input
                                                                        aria-label="Remember me"
                                                                        className="woocommerce-form__input woocommerce-form__input-checkbox"
                                                                        name="rememberme"
                                                                        type="checkbox"
                                                                        checked={loginData.rememberMe}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <span>Remember me</span>
                                                                </label>
                                                            </p>
                                                        </form>
                                                    )}
                                                </div>

                                                <div className="wd-checkout-coupon wd-wpb wd-rs-64d4a33fcb558 vc_custom_1691657029664">
                                                    <div className="woocommerce-form-coupon-toggle">
                                                        <div className="woocommerce-info">
                                                            Have a coupon?
                                                            <a className="showcoupon" >
                                                                Click here to enter your code
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <form
                                                        className="checkout_coupon woocommerce-form-coupon"
                                                        method="post"
                                                        style={{
                                                            display: "none",
                                                        }}>
                                                        <p>If you have a coupon code, please apply it below.</p>
                                                        <p className="form-row form-row-first">
                                                            <label
                                                                className="screen-reader-text"
                                                                htmlFor="coupon_code">
                                                                Coupon:
                                                            </label>
                                                            <input
                                                                className="input-text"

                                                                id="coupon_code"
                                                                name="coupon_code"
                                                                placeholder="Coupon code"
                                                                type="text"
                                                            />
                                                        </p>
                                                        <p className="form-row form-row-last">
                                                            <button
                                                                className="button"
                                                                name="apply_coupon"
                                                                type="submit"
                                                                value="Apply coupon">
                                                                Apply coupon
                                                            </button>
                                                        </p>
                                                        <div className="clear" />
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <form
                                action="https://woodmart.xtemos.com/mega-electronics/home/checkout/"
                                aria-label="Checkout"
                                className="checkout woocommerce-checkout wd-checkout-form"
                                encType="multipart/form-data"
                                method="post"
                                name="checkout"
                                noValidate>

                                <div className="wpb-content-wrapper">
                                    <div className="vc_row wpb_row vc_row-fluid row-reverse-mobile wd-rs-62a30ce7c6b49">
                                        <div className="wpb_column vc_column_container vc_col-sm-6 vc_col-md-7 vc_col-xs-12 wd-enabled-flex wd-rs-63e11db794d6c">
                                            <div className="vc_column-inner">
                                                <div className="wpb_wrapper">
                                                    <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1668170517479 vc_row-has-fill wd-rs-636e4311ab3a7">
                                                        <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-629f104b4859b">
                                                            <div className="vc_column-inner vc_custom_1654591567385">
                                                                <div className="wpb_wrapper">
                                                                    <div
                                                                        className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-63972756160aa wd-enabled-width wd-title-color-default wd-title-style-default text-left vc_custom_1670850398669 wd-underline-colored"
                                                                        id="wd-63972756160aa">
                                                                        <div className="liner-continer">
                                                                            <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-l">
                                                                                Billing Details
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                    <div className="wd-billing-details wd-wpb wd-rs-63bffa3f72cee vc_custom_1673525826744">
                                                                        <div className="woocommerce-billing-fields">
                                                                            <h3>Billing details</h3>
                                                                            <div className="woocommerce-billing-fields__field-wrapper">
                                                                                <p
                                                                                    className="form-row form-row-first validate-required"
                                                                                    data-priority="10"
                                                                                    id="billing_first_name_field">
                                                                                    <label
                                                                                        className=""
                                                                                        htmlFor="billing_first_name">
                                                                                        First name
                                                                                        <abbr
                                                                                            className="required"
                                                                                            title="required">
                                                                                            *
                                                                                        </abbr>
                                                                                    </label>
                                                                                    <span className="woocommerce-input-wrapper">
                                                                                        <input
                                                                                            autoComplete="given-name"
                                                                                            className="input-text "

                                                                                            id="billing_first_name"
                                                                                            name="billing_first_name"
                                                                                            value={formData.billing_first_name}
                                                                                            onChange={handleChange}
                                                                                            placeholder=""
                                                                                            type="text"
                                                                                        />
                                                                                    </span>
                                                                                </p>
                                                                                <p
                                                                                    className="form-row form-row-last validate-required"
                                                                                    data-priority="20"
                                                                                    id="billing_last_name_field">
                                                                                    <label
                                                                                        className=""
                                                                                        htmlFor="billing_last_name">
                                                                                        Last name
                                                                                        <abbr
                                                                                            className="required"
                                                                                            title="required">
                                                                                            *
                                                                                        </abbr>
                                                                                    </label>
                                                                                    <span className="woocommerce-input-wrapper">
                                                                                        <input
                                                                                            autoComplete="family-name"
                                                                                            className="input-text "

                                                                                            id="billing_last_name"
                                                                                            name="billing_last_name"
                                                                                            value={formData.billing_last_name}
                                                                                            onChange={handleChange}
                                                                                            placeholder=""
                                                                                            type="text"
                                                                                        />
                                                                                    </span>
                                                                                </p>
                                                                                <p
                                                                                    className="form-row form-row-first validate-required validate-phone"
                                                                                    data-priority="30"
                                                                                    id="billing_phone_field">
                                                                                    <label className="" htmlFor="billing_phone">
                                                                                        Phone
                                                                                        <abbr
                                                                                            className="required"
                                                                                            title="required">
                                                                                            *
                                                                                        </abbr>
                                                                                    </label>
                                                                                    <span className="woocommerce-input-wrapper">
                                                                                        <input
                                                                                            autoComplete="tel"
                                                                                            className="input-text "

                                                                                            id="billing_phone"
                                                                                            name="billing_phone"
                                                                                            value={formData.billing_phone}
                                                                                            onChange={handleChange}
                                                                                            placeholder=""
                                                                                            type="tel"
                                                                                        />
                                                                                    </span>
                                                                                </p>
                                                                                <p
                                                                                    className="form-row form-row-last validate-required validate-email"
                                                                                    data-priority="40"
                                                                                    id="billing_email_field">
                                                                                    <label className="" htmlFor="billing_email">
                                                                                        Email address
                                                                                        <abbr
                                                                                            className="required"
                                                                                            title="required">
                                                                                            *
                                                                                        </abbr>
                                                                                    </label>
                                                                                    <span className="woocommerce-input-wrapper">
                                                                                        <input
                                                                                            autoComplete="email"
                                                                                            className="input-text "

                                                                                            id="billing_email"
                                                                                            name="billing_email"
                                                                                            value={formData.billing_email}
                                                                                            onChange={handleChange}
                                                                                            placeholder=""
                                                                                            type="email"
                                                                                        />
                                                                                    </span>
                                                                                </p>
                                                                                <p
                                                                                    className="form-row form-row-first address-field update_totals_on_change validate-required"
                                                                                    data-priority="50"
                                                                                    id="billing_country_field">
                                                                                    <label
                                                                                        className=""
                                                                                        htmlFor="billing_country">
                                                                                        Country / Region
                                                                                        <abbr
                                                                                            className="required"
                                                                                            title="required">
                                                                                            *
                                                                                        </abbr>
                                                                                    </label>
                                                                                    <span className="woocommerce-input-wrapper">
                                                                                        <select
                                                                                            className="Payment country_to_state country_select"
                                                                                            data-val="true"
                                                                                            data-val-required="The Country field is required."
                                                                                            id="billing_country"
                                                                                            name="billing_country"
                                                                                            value={formData.billing_country}
                                                                                            onChange={handleCountryChange}
                                                                                        >
                                                                                            <option value="">Select a country / region…</option>
                                                                                            {Country.getAllCountries().map((country) => (
                                                                                                <option key={country.isoCode} value={country.isoCode}>
                                                                                                    {country.name}
                                                                                                </option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </span>
                                                                                </p>
                                                                                <p
                                                                                    className="form-row form-row-last address-field validate-required"
                                                                                    data-priority="60"
                                                                                    id="billing_city_field">
                                                                                    <label className="" htmlFor="billing_city">
                                                                                        Town / City
                                                                                        <abbr
                                                                                            className="required"
                                                                                            title="required">
                                                                                            *
                                                                                        </abbr>
                                                                                    </label>
                                                                                    <span className="woocommerce-input-wrapper">
                                                                                        <input
                                                                                            autoComplete="address-level2"
                                                                                            className="input-text "

                                                                                            id="billing_city"
                                                                                            name="billing_city"
                                                                                            value={formData.billing_city}
                                                                                            onChange={handleChange}
                                                                                            placeholder=""
                                                                                            type="text"
                                                                                        />
                                                                                    </span>
                                                                                </p>
                                                                                <p
                                                                                    className="form-row form-row-first address-field validate-required"
                                                                                    data-priority="70"
                                                                                    id="billing_address_1_field">
                                                                                    <label
                                                                                        className=""
                                                                                        htmlFor="billing_address_1">
                                                                                        Street address
                                                                                        <abbr
                                                                                            className="required"
                                                                                            title="required">
                                                                                            *
                                                                                        </abbr>
                                                                                    </label>
                                                                                    <span className="woocommerce-input-wrapper">
                                                                                        <input
                                                                                            autoComplete="address-line1"
                                                                                            className="input-text "

                                                                                            id="billing_address_1"
                                                                                            name="billing_address_1"
                                                                                            value={formData.billing_address_1}
                                                                                            onChange={handleChange}
                                                                                            placeholder="House number and street name"
                                                                                            type="text"
                                                                                        />
                                                                                    </span>
                                                                                </p>
                                                                                <p
                                                                                    className="form-row form-row-last address-field validate-required validate-postcode"
                                                                                    data-priority="80"
                                                                                    id="billing_postcode_field">
                                                                                    <label
                                                                                        className=""
                                                                                        htmlFor="billing_postcode">
                                                                                        Postcode / ZIP
                                                                                        <abbr
                                                                                            className="required"
                                                                                            title="required">
                                                                                            *
                                                                                        </abbr>
                                                                                    </label>
                                                                                    <span className="woocommerce-input-wrapper">
                                                                                        <input
                                                                                            autoComplete="postal-code"
                                                                                            className="input-text "

                                                                                            id="billing_postcode"
                                                                                            name="billing_postcode"
                                                                                            value={formData.billing_postcode}
                                                                                            onChange={handleChange}
                                                                                            placeholder=""
                                                                                            type="text"
                                                                                        />
                                                                                    </span>
                                                                                </p>
                                                                            </div>

                                                                        </div>
                                                                        <div className="woocommerce-account-fields">
                                                                            <p className="form-row form-row-wide create-account woocommerce-validated">
                                                                                <label className="woocommerce-form__label woocommerce-form__label-for-checkbox checkbox">
                                                                                    <input
                                                                                        className="woocommerce-form__input woocommerce-form__input-checkbox input-checkbox"
                                                                                        defaultValue="1"
                                                                                        id="createaccount"
                                                                                        name="createaccount"
                                                                                        type="checkbox"
                                                                                        checked={createAccount}
                                                                                        onChange={handleCreateAccountChange}
                                                                                    />
                                                                                    <span>Create an account?</span>
                                                                                </label>
                                                                            </p>
                                                                            {createAccount && (
                                                                                <div className="create-account">
                                                                                    <p
                                                                                        className="form-row validate-required"
                                                                                        data-priority=""
                                                                                        id="account_username_field"
                                                                                    >
                                                                                        <label htmlFor="account_username">
                                                                                            Account username
                                                                                            <abbr className="required" title="required">
                                                                                                *
                                                                                            </abbr>
                                                                                        </label>
                                                                                        <span className="woocommerce-input-wrapper">
                                                                                            <input
                                                                                                autoComplete="username"
                                                                                                className="input-text"
                                                                                                id="account_username"
                                                                                                name="account_username"
                                                                                                value={userData.account_username}
                                                                                                onChange={handleChange}
                                                                                                placeholder="Username"
                                                                                                type="text"
                                                                                            />
                                                                                        </span>
                                                                                    </p>

                                                                                    <p
                                                                                        className="form-row validate-required"
                                                                                        data-priority=""
                                                                                        id="account_password_field"
                                                                                    >
                                                                                        <label htmlFor="account_password">
                                                                                            Create account password
                                                                                            <abbr className="required" title="required">
                                                                                                *
                                                                                            </abbr>
                                                                                        </label>
                                                                                        <span className="woocommerce-input-wrapper password-input">
                                                                                            <input
                                                                                                autoComplete="new-password"
                                                                                                className="input-text"
                                                                                                id="account_password"
                                                                                                name="account_password"
                                                                                                value={userData.account_password}
                                                                                                onChange={handleChange}
                                                                                                placeholder="Password"
                                                                                                type="password"
                                                                                            />
                                                                                            <span className="show-password-input" />
                                                                                        </span>
                                                                                    </p>

                                                                                    <div className="clear" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="wd-shipping-details wd-wpb wd-rs-63bffa375a171 vc_custom_1673525820444">
                                                                        <div className="woocommerce-shipping-fields">
                                                                            <h3 id="ship-to-different-address">
                                                                                <label className="woocommerce-form__label woocommerce-form__label-for-checkbox checkbox">
                                                                                    <input
                                                                                        className="woocommerce-form__input woocommerce-form__input-checkbox input-checkbox"
                                                                                        defaultValue="1"
                                                                                        id="ship-to-different-address-checkbox"
                                                                                        name="ship_to_different_address"
                                                                                        type="checkbox"
                                                                                        checked={shipToDifferentAddress}
                                                                                        onChange={handleCheckboxChange}
                                                                                    />
                                                                                    <span>Ship to a different address?</span>
                                                                                </label>
                                                                            </h3>
                                                                            {shipToDifferentAddress && (
                                                                                <div
                                                                                    className="shipping_address"
                                                                                    style={{
                                                                                        display: "block",
                                                                                    }}>
                                                                                    <div className="woocommerce-shipping-fields__field-wrapper">
                                                                                        <p
                                                                                            className="form-row form-row-first validate-required"
                                                                                            data-priority="10"
                                                                                            id="shipping_first_name_field">
                                                                                            <label
                                                                                                className=""
                                                                                                htmlFor="shipping_first_name">
                                                                                                First name
                                                                                                <abbr
                                                                                                    className="required"
                                                                                                    title="required">
                                                                                                    *
                                                                                                </abbr>
                                                                                            </label>
                                                                                            <span className="woocommerce-input-wrapper">
                                                                                                <input
                                                                                                    autoComplete="given-name"
                                                                                                    className="input-text "
                                                                                                    value={shippingData.shipping_first_name}
                                                                                                    onChange={handleShippingChange}
                                                                                                    id="shipping_first_name"
                                                                                                    name="shipping_first_name"
                                                                                                    placeholder=""
                                                                                                    type="text"
                                                                                                />
                                                                                            </span>
                                                                                        </p>
                                                                                        <p
                                                                                            className="form-row form-row-last validate-required"
                                                                                            data-priority="20"
                                                                                            id="shipping_last_name_field">
                                                                                            <label
                                                                                                className=""
                                                                                                htmlFor="shipping_last_name">
                                                                                                Last name
                                                                                                <abbr
                                                                                                    className="required"
                                                                                                    title="required">
                                                                                                    *
                                                                                                </abbr>
                                                                                            </label>
                                                                                            <span className="woocommerce-input-wrapper">
                                                                                                <input
                                                                                                    autoComplete="family-name"
                                                                                                    className="input-text "
                                                                                                    value={shippingData.shipping_last_name}
                                                                                                    onChange={handleShippingChange}
                                                                                                    id="shipping_last_name"
                                                                                                    name="shipping_last_name"
                                                                                                    placeholder=""
                                                                                                    type="text"
                                                                                                />
                                                                                            </span>
                                                                                        </p>
                                                                                        <p
                                                                                            className="form-row form-row-wide"
                                                                                            data-priority="30"
                                                                                            id="shipping_company_field">
                                                                                            <label
                                                                                                className=""
                                                                                                htmlFor="shipping_company">
                                                                                                Company name
                                                                                                <span className="optional">
                                                                                                    (optional)
                                                                                                </span>
                                                                                            </label>
                                                                                            <span className="woocommerce-input-wrapper">
                                                                                                <input
                                                                                                    autoComplete="organization"
                                                                                                    className="input-text "
                                                                                                    value={shippingData.shipping_company}
                                                                                                    onChange={handleShippingChange}
                                                                                                    id="shipping_company"
                                                                                                    name="shipping_company"
                                                                                                    placeholder=""
                                                                                                    type="text"
                                                                                                />
                                                                                            </span>
                                                                                        </p>
                                                                                        <p
                                                                                            className="form-row form-row-wide address-field update_totals_on_change validate-required"
                                                                                            data-priority="40"
                                                                                            id="shipping_country_field">
                                                                                            <label
                                                                                                className=""
                                                                                                htmlFor="shipping_country">
                                                                                                Country / Region
                                                                                                <abbr
                                                                                                    className="required"
                                                                                                    title="required">
                                                                                                    *
                                                                                                </abbr>
                                                                                            </label>
                                                                                            <span className="woocommerce-input-wrapper">
                                                                                                <select
                                                                                                    aria-hidden="true"
                                                                                                    autoComplete="country"
                                                                                                    className="country_to_state country_select select2-hidden-accessible"
                                                                                                    data-label="Country / Region"
                                                                                                    data-placeholder="Select a country / region…"
                                                                                                    id="shipping_country"
                                                                                                    name="shipping_country"
                                                                                                    value={shippingData.shipping_country}
                                                                                                    onChange={handleShippingCountryChange}
                                                                                                    tabIndex="-1">
                                                                                                    <option value="">
                                                                                                        Select a country / region…
                                                                                                    </option>
                                                                                                    {Country.getAllCountries().map((country) => (
                                                                                                        <option key={country.isoCode} value={country.isoCode}>
                                                                                                            {country.name}
                                                                                                        </option>
                                                                                                    ))}
                                                                                                </select>

                                                                                            </span>
                                                                                        </p>
                                                                                        <p
                                                                                            className="form-row form-row-wide address-field validate-required"
                                                                                            data-priority="50"
                                                                                            id="shipping_address_1_field">
                                                                                            <label
                                                                                                className=""
                                                                                                htmlFor="shipping_address_1">
                                                                                                Street address
                                                                                                <abbr
                                                                                                    className="required"
                                                                                                    title="required">
                                                                                                    *
                                                                                                </abbr>
                                                                                            </label>
                                                                                            <span className="woocommerce-input-wrapper">
                                                                                                <input
                                                                                                    autoComplete="address-line1"
                                                                                                    className="input-text "

                                                                                                    id="shipping_address_1"
                                                                                                    name="shipping_address_1"
                                                                                                    value={shippingData.shipping_address_1}
                                                                                                    onChange={handleShippingChange}
                                                                                                    placeholder="House number and street name"
                                                                                                    type="text"
                                                                                                />
                                                                                            </span>
                                                                                        </p>
                                                                                        <p
                                                                                            className="form-row form-row-wide address-field"
                                                                                            data-priority="60"
                                                                                            id="shipping_address_2_field">
                                                                                            <label
                                                                                                className="screen-reader-text"
                                                                                                htmlFor="shipping_address_2">
                                                                                                Apartment, suite, unit, etc.
                                                                                                <span className="optional">
                                                                                                    (optional)
                                                                                                </span>
                                                                                            </label>
                                                                                            <span className="woocommerce-input-wrapper">
                                                                                                <input
                                                                                                    autoComplete="address-line2"
                                                                                                    className="input-text "
                                                                                                    value={shippingData.shipping_address_2}
                                                                                                    onChange={handleShippingChange}
                                                                                                    id="shipping_address_2"
                                                                                                    name="shipping_address_2"
                                                                                                    placeholder="Apartment, suite, unit, etc. (optional)"
                                                                                                    type="text"
                                                                                                />
                                                                                            </span>
                                                                                        </p>
                                                                                        <p
                                                                                            className="form-row form-row-wide address-field validate-required"
                                                                                            data-priority="70"
                                                                                            id="shipping_city_field">
                                                                                            <label
                                                                                                className=""
                                                                                                htmlFor="shipping_city">
                                                                                                Town / City
                                                                                                <abbr
                                                                                                    className="required"
                                                                                                    title="required">
                                                                                                    *
                                                                                                </abbr>
                                                                                            </label>
                                                                                            <span className="woocommerce-input-wrapper">
                                                                                                <input
                                                                                                    autoComplete="address-level2"
                                                                                                    className="input-text "
                                                                                                    value={shippingData.shipping_city}
                                                                                                    onChange={handleShippingChange}
                                                                                                    id="shipping_city"
                                                                                                    name="shipping_city"
                                                                                                    placeholder=""
                                                                                                    type="text"
                                                                                                />
                                                                                            </span>
                                                                                        </p>
                                                                                        <p
                                                                                            className="form-row form-row-wide address-field validate-required validate-state"
                                                                                            data-priority="80"
                                                                                            id="shipping_state_field">
                                                                                            <label
                                                                                                className=""
                                                                                                htmlFor="shipping_state">
                                                                                                State / County
                                                                                                <abbr
                                                                                                    className="required"
                                                                                                    title="required">
                                                                                                    *
                                                                                                </abbr>
                                                                                            </label>
                                                                                            <span className="woocommerce-input-wrapper">
                                                                                                <select
                                                                                                    aria-hidden="true"
                                                                                                    autoComplete="address-level1"
                                                                                                    className="state_select select2-hidden-accessible"
                                                                                                    data-input-classes=""
                                                                                                    data-label="State / County"
                                                                                                    data-placeholder="Select an option…"
                                                                                                    id="shipping_state"
                                                                                                    name="shipping_state"
                                                                                                    value={shippingData.shipping_state}
                                                                                                    onChange={handleStateChange}
                                                                                                    tabIndex="-1">
                                                                                                    <option value="">
                                                                                                        Select an option…
                                                                                                    </option>
                                                                                                    {states.map((state) => (
                                                                                                        <option key={state.isoCode} value={state.isoCode}>
                                                                                                            {state.name}
                                                                                                        </option>
                                                                                                    ))}
                                                                                                </select>

                                                                                            </span>
                                                                                        </p>
                                                                                        <p
                                                                                            className="form-row form-row-wide address-field validate-required validate-postcode"
                                                                                            data-priority="90"
                                                                                            id="shipping_postcode_field">
                                                                                            <label
                                                                                                className=""
                                                                                                htmlFor="shipping_postcode">
                                                                                                Postcode / ZIP
                                                                                                <abbr
                                                                                                    className="required"
                                                                                                    title="required">
                                                                                                    *
                                                                                                </abbr>
                                                                                            </label>
                                                                                            <span className="woocommerce-input-wrapper">
                                                                                                <input
                                                                                                    autoComplete="postal-code"
                                                                                                    className="input-text "
                                                                                                    value={shippingData.shipping_postcode}
                                                                                                    onChange={handleShippingChange}
                                                                                                    id="shipping_postcode"
                                                                                                    name="shipping_postcode"
                                                                                                    placeholder=""
                                                                                                    type="text"
                                                                                                />
                                                                                            </span>
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="woocommerce-additional-fields">
                                                                            <div className="woocommerce-additional-fields__field-wrapper">
                                                                                <p
                                                                                    className="form-row notes"
                                                                                    data-priority=""
                                                                                    id="order_comments_field">
                                                                                    <label
                                                                                        className=""
                                                                                        htmlFor="order_comments">
                                                                                        Order notes
                                                                                        <span className="optional">
                                                                                            (optional)
                                                                                        </span>
                                                                                    </label>
                                                                                    <span className="woocommerce-input-wrapper">
                                                                                        <textarea
                                                                                            className="input-text "
                                                                                            cols="5"
                                                                                            id="order_comments"
                                                                                            name="order_comments"
                                                                                            placeholder="Notes about your order, e.g. special notes for delivery."
                                                                                            rows="2"
                                                                                        />
                                                                                    </span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1668170517479 vc_row-has-fill wd-rs-636e4311ab3a7">
                                                        <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-629f104b4859b">
                                                            <div className="vc_column-inner vc_custom_1654591567385">
                                                                <div className="wpb_wrapper">
                                                                    <div
                                                                        className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-63972756160aa wd-enabled-width wd-title-color-default wd-title-style-default text-left vc_custom_1670850398669 wd-underline-colored"
                                                                        id="wd-63972756160aa">
                                                                        <div className="liner-continer">
                                                                            <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-l">
                                                                                Card Details
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                    <div className="wd-billing-details wd-wpb wd-rs-63bffa3f72cee vc_custom_1673525826744">
                                                                        <div className="woocommerce-billing-fields">
                                                                            <h3>Card details</h3>
                                                                            <div className="woocommerce-billing-fields__field-wrapper">
                                                                                {/* Cardholder Name */}
                                                                                <p
                                                                                    className="form-row form-row-first validate-required"
                                                                                    data-priority="85"
                                                                                    id="card_holder_name_field">
                                                                                    <label className="" htmlFor="card_holder_name">
                                                                                        Cardholder Name
                                                                                        <abbr
                                                                                            className="required"
                                                                                            title="required">
                                                                                            *
                                                                                        </abbr>
                                                                                    </label>
                                                                                    <span className="woocommerce-input-wrapper">
                                                                                        <input
                                                                                            autoComplete="cc-name"
                                                                                            className="input-text"
                                                                                            id="card_holder_name"
                                                                                            name="card_holder_name"
                                                                                            value={cardData.card_holder_name}
                                                                                            onChange={handleCardChange}
                                                                                            placeholder="John Doe"
                                                                                            type="text"
                                                                                        />
                                                                                    </span>
                                                                                </p>
                                                                                {/* Card Number */}
                                                                                <p
                                                                                    className="form-row form-row-first validate-required validate-card-number"
                                                                                    data-priority="90"
                                                                                    id="card_number_field">
                                                                                    <label className="" htmlFor="card_number">
                                                                                        Card Number
                                                                                        <abbr
                                                                                            className="required"
                                                                                            title="required">
                                                                                            *
                                                                                        </abbr>
                                                                                    </label>
                                                                                    <span className="woocommerce-input-wrapper">
                                                                                        <input
                                                                                            autoComplete="cc-number"
                                                                                            className="input-text"
                                                                                            id="card_number"
                                                                                            name="card_number"
                                                                                            value={cardData.card_number}
                                                                                            onChange={handleCardChange}
                                                                                            placeholder="1234 5678 9012 3456"
                                                                                            type="text"
                                                                                        />
                                                                                    </span>
                                                                                </p>

                                                                                {/* Expiration Date */}
                                                                                <p
                                                                                    className="form-row form-row-last validate-required validate-expiry"
                                                                                    data-priority="100"
                                                                                    id="card_expiry_field">
                                                                                    <label className="" htmlFor="card_expiry">
                                                                                        Expiration Date
                                                                                        <abbr
                                                                                            className="required"
                                                                                            title="required">
                                                                                            *
                                                                                        </abbr>
                                                                                    </label>
                                                                                    <span className="woocommerce-input-wrapper">
                                                                                        <input
                                                                                            autoComplete="cc-exp"
                                                                                            className="input-text"
                                                                                            id="card_expiry"
                                                                                            name="card_expiry"
                                                                                            value={cardData.card_expiry}
                                                                                            onChange={handleCardChange}
                                                                                            placeholder="MM / YY"
                                                                                            type="text"
                                                                                        />
                                                                                    </span>
                                                                                </p>

                                                                                {/* CVV */}
                                                                                <p
                                                                                    className="form-row form-row-first validate-required validate-cvv"
                                                                                    data-priority="110"
                                                                                    id="card_cvv_field">
                                                                                    <label className="" htmlFor="card_cvv">
                                                                                        CVV
                                                                                        <abbr
                                                                                            className="required"
                                                                                            title="required">
                                                                                            *
                                                                                        </abbr>
                                                                                    </label>
                                                                                    <span className="woocommerce-input-wrapper">
                                                                                        <input
                                                                                            autoComplete="cc-csc"
                                                                                            className="input-text"
                                                                                            id="card_cvv"
                                                                                            name="card_cvv"
                                                                                            value={cardData.card_cvv}
                                                                                            onChange={handleCardChange}
                                                                                            placeholder="123"
                                                                                            type="password"
                                                                                        />
                                                                                    </span>
                                                                                </p>
                                                                            </div>


                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1668170521890 vc_row-has-fill wd-rs-636e4316aa510">
                                                        <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-629f104b4859b">
                                                            <div className="vc_column-inner vc_custom_1654591567385">
                                                                <div className="wpb_wrapper">
                                                                    <div
                                                                        className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-636e438da46a0 wd-enabled-width wd-title-color-default wd-title-style-default text-left vc_custom_1668170640989 wd-underline-colored"
                                                                        id="wd-636e438da46a0">
                                                                        <div className="liner-continer">
                                                                            <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-l">
                                                                                Payment Information
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                    <div className="wd-payment-methods wd-wpb wd-rs-6399c2d9ba463 vc_custom_1671021430848 wd-btn-align-full-width">
                                                                        <div
                                                                            className="woocommerce-checkout-payment"
                                                                            id="payment">
                                                                            <ul className="wc_payment_methods payment_methods methods">
                                                                                <li className="wc_payment_method payment_method_bacs">
                                                                                    <input
                                                                                        className="input-radio"
                                                                                        data-order_button_text=""
                                                                                        defaultChecked
                                                                                        defaultValue="bacs"
                                                                                        id="payment_method_bacs"
                                                                                        name="payment_method"
                                                                                        type="radio"
                                                                                    />
                                                                                    <label htmlFor="payment_method_bacs">
                                                                                        Direct bank transfer
                                                                                    </label>
                                                                                    <div className="payment_box payment_method_bacs">
                                                                                        <p>
                                                                                            Make your payment directly into our bank
                                                                                            account. Please use your Order ID as the
                                                                                            payment reference. Your order will not
                                                                                            be shipped until the funds have cleared
                                                                                            in our account.
                                                                                        </p>
                                                                                    </div>
                                                                                </li>
                                                                                <li className="wc_payment_method payment_method_cheque">
                                                                                    <input
                                                                                        className="input-radio"
                                                                                        data-order_button_text=""
                                                                                        defaultValue="cheque"
                                                                                        id="payment_method_cheque"
                                                                                        name="payment_method"
                                                                                        type="radio"
                                                                                    />
                                                                                    <label htmlFor="payment_method_cheque">
                                                                                        Check payments
                                                                                    </label>
                                                                                    <div
                                                                                        className="payment_box payment_method_cheque"
                                                                                        style={{
                                                                                            display: "none",
                                                                                        }}>
                                                                                        <p>
                                                                                            Please send a check to Store Name, Store
                                                                                            Street, Store Town, Store State /
                                                                                            County, Store Postcode.
                                                                                        </p>
                                                                                    </div>
                                                                                </li>
                                                                                <li className="wc_payment_method payment_method_cod">
                                                                                    <input
                                                                                        className="input-radio"
                                                                                        data-order_button_text=""
                                                                                        defaultValue="cod"
                                                                                        id="payment_method_cod"
                                                                                        name="payment_method"
                                                                                        type="radio"
                                                                                    />
                                                                                    <label htmlFor="payment_method_cod">
                                                                                        Cash on delivery
                                                                                    </label>
                                                                                    <div
                                                                                        className="payment_box payment_method_cod"
                                                                                        style={{
                                                                                            display: "none",
                                                                                        }}>
                                                                                        <p>Pay with cash upon delivery.</p>
                                                                                    </div>
                                                                                </li>
                                                                            </ul>
                                                                            <div className="form-row place-order">
                                                                                <noscript>
                                                                                    Since your browser does not support
                                                                                    JavaScript, or it is disabled, please ensure
                                                                                    you click the <em>Update Totals</em> button
                                                                                    before placing your order. You may be
                                                                                    charged more than the amount stated above if
                                                                                    you fail to do so.
                                                                                    <br />
                                                                                    <button
                                                                                        className="button alt"
                                                                                        name="woocommerce_checkout_update_totals"
                                                                                        type="submit"
                                                                                        value="Update totals">
                                                                                        Update totals
                                                                                    </button>
                                                                                </noscript>
                                                                                <button
                                                                                    className="button alt"
                                                                                    data-value="Place order"
                                                                                    id="place_order"
                                                                                    name="woocommerce_checkout_place_order"
                                                                                    type="submit"
                                                                                    onClick={handleSubmit}
                                                                                    value="Place order">
                                                                                    Place order
                                                                                </button>
                                                                                <div id="ppc-button-ppcp-googlepay" />
                                                                                <input
                                                                                    defaultValue="e331755ad7"
                                                                                    id="woocommerce-process-checkout-nonce"
                                                                                    name="woocommerce-process-checkout-nonce"
                                                                                    type="hidden"
                                                                                />
                                                                                <input
                                                                                    defaultValue="/mega-electronics/?wc-ajax=update_order_review"
                                                                                    name="_wp_http_referer"
                                                                                    type="hidden"
                                                                                />
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
                                        <div className="wpb_column vc_column_container vc_col-sm-6 vc_col-md-5 vc_col-xs-12 wd-rs-63e11dd75f8c6">
                                            <div className="vc_column-inner">
                                                <div className="wpb_wrapper">
                                                    <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1668170573443 vc_row-has-fill wd-rs-636e434842df8">
                                                        <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-6213aea437a66">
                                                            <div className="vc_column-inner vc_custom_1645457063140">
                                                                <div className="wpb_wrapper">
                                                                    <div
                                                                        className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-636e437f4b309 wd-title-color-default wd-title-style-default text-left vc_custom_1668170630179 wd-underline-colored"
                                                                        id="wd-636e437f4b309">
                                                                        <div className="liner-continer">
                                                                            <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-l">
                                                                                Your Order
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                    <div className="wd-order-table wd-wpb wd-rs-62948f05a16da vc_custom_1653903122029 wd-manage-on">
                                                                        <link
                                                                            href="https://woodmart.xtemos.com/mega-electronics/wp-content/themes/woodmart/css/parts/woo-mod-quantity.min.css?ver=8.0.4"
                                                                            id="wd-woo-mod-quantity-css"
                                                                            media="all"
                                                                            rel="stylesheet"
                                                                            type="text/css"
                                                                        />
                                                                        <table className="shop_table woocommerce-checkout-review-order-table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th className="product-name">Product</th>
                                                                                    <th className="product-total">Subtotal</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {cartItems.map((item) => (
                                                                                    <tr key={item.productId} className="cart_item">
                                                                                        <td className="wd-checkout-prod">
                                                                                            <div className="wd-checkout-remove-btn-wrapp">
                                                                                                <button
                                                                                                    aria-label="Remove this item"
                                                                                                    className="remove wd-checkout-remove-btn"
                                                                                                    onClick={(e) => removeFromCart(item.productId, e)} // Pass event object
                                                                                                />
                                                                                            </div>
                                                                                            <div className="wd-checkout-prod-img">
                                                                                                <img
                                                                                                    alt={item.productName}
                                                                                                    className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                                                                                                    decoding="async"
                                                                                                    height="491"
                                                                                                    src={item.image_url} // Display the first image
                                                                                                    width="430"
                                                                                                />
                                                                                            </div>
                                                                                            <div className="wd-checkout-prod-cont">
                                                                                                <div className="wd-checkout-prod-title">
                                                                                                    <span className="cart-product-label">
                                                                                                        {item.productName}
                                                                                                    </span>
                                                                                                    <div className="quantity">
                                                                                                        <button
                                                                                                            className="minus btn"
                                                                                                            onClick={(e) => changeQuantity(item.productId, item.quantity - 1, e)}
                                                                                                        >
                                                                                                            -
                                                                                                        </button>
                                                                                                        <input
                                                                                                            className="input-text qty text"
                                                                                                            value={item.quantity}
                                                                                                            onChange={(e) =>
                                                                                                                changeQuantity(
                                                                                                                    item.productId,
                                                                                                                    parseInt(e.target.value)
                                                                                                                )
                                                                                                            }
                                                                                                            type="number"
                                                                                                        />
                                                                                                        <button
                                                                                                            className="plus btn"
                                                                                                            onClick={(e) => changeQuantity(item.productId, item.quantity + 1, e)}
                                                                                                        >
                                                                                                            +
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="wd-checkout-prod-total product-total">
                                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                                        <bdi>
                                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                                $
                                                                                                            </span>
                                                                                                            {(item.price * item.quantity).toFixed(2)}
                                                                                                        </bdi>
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}

                                                                                <input
                                                                                    defaultValue="07978b96fb"
                                                                                    id="_wpnonce"
                                                                                    name="_wpnonce"
                                                                                    type="hidden"
                                                                                />
                                                                                <input
                                                                                    defaultValue="/mega-electronics/?wc-ajax=update_order_review"
                                                                                    name="_wp_http_referer"
                                                                                    type="hidden"
                                                                                />
                                                                            </tbody>
                                                                            <tfoot>
                                                                                <tr className="cart-subtotal">
                                                                                    <th>Subtotal</th>
                                                                                    <td>
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
                                                                                                    defaultValue="free_shipping:5"
                                                                                                    id="shipping_method_0_free_shipping5"
                                                                                                    name="shipping_method[0]"
                                                                                                    type="radio"
                                                                                                />
                                                                                                <label htmlFor="shipping_method_0_free_shipping5">
                                                                                                    Free shipping
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
                                                                                    </td>
                                                                                </tr>
                                                                                <tr className="order-total">
                                                                                    <th>Total</th>
                                                                                    <td>
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
                                                                            </tfoot>
                                                                        </table>
                                                                        {/* <wc-order-attribution-inputs>
                                                                            <input
                                                                                defaultValue="typein"
                                                                                name="wc_order_attribution_source_type"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="(none)"
                                                                                name="wc_order_attribution_referrer"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="(none)"
                                                                                name="wc_order_attribution_utm_campaign"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="(direct)"
                                                                                name="wc_order_attribution_utm_source"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="(none)"
                                                                                name="wc_order_attribution_utm_medium"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="(none)"
                                                                                name="wc_order_attribution_utm_content"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="(none)"
                                                                                name="wc_order_attribution_utm_id"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="(none)"
                                                                                name="wc_order_attribution_utm_term"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="(none)"
                                                                                name="wc_order_attribution_utm_source_platform"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="(none)"
                                                                                name="wc_order_attribution_utm_creative_format"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="(none)"
                                                                                name="wc_order_attribution_utm_marketing_tactic"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="https://woodmart.xtemos.com/mega-electronics/"
                                                                                name="wc_order_attribution_session_entry"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="2025-01-14 04:17:15"
                                                                                name="wc_order_attribution_session_start_time"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="10"
                                                                                name="wc_order_attribution_session_pages"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="1"
                                                                                name="wc_order_attribution_session_count"
                                                                                type="hidden"
                                                                            />
                                                                            <input
                                                                                defaultValue="Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
                                                                                name="wc_order_attribution_user_agent"
                                                                                type="hidden"
                                                                            />
                                                                        </wc-order-attribution-inputs> */}
                                                                    </div>
                                                                    <div className="wd-shipping-progress-bar wd-wpb wd-rs-629f4a0de2d40 vc_custom_1654606356232 text-left wd-style-default">
                                                                        <div className="wd-progress-bar wd-free-progress-bar">
                                                                            <div className="progress-msg">
                                                                                Your order qualifies for free shipping!
                                                                            </div>
                                                                            <div className="progress-area">
                                                                                <div
                                                                                    className="progress-bar"
                                                                                    style={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1670856733866 vc_row-has-fill wd-rs-63974019c1391">
                                                        <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-6213ac5daaf9d">
                                                            <div className="vc_column-inner vc_custom_1645456482508">
                                                                <div className="wpb_wrapper">
                                                                    <div
                                                                        className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-6397401f7cbc7 wd-title-color-default wd-title-style-default text-left vc_custom_1670856740311 wd-underline-colored"
                                                                        id="wd-6397401f7cbc7">
                                                                        <div className="liner-continer">
                                                                            <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-l">
                                                                                Delivery & Return
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="wd-accordion wd-wpb wd-rs-63caae612e8f5 vc_custom_1674227302057 wd-style-default wd-border-off wd-titles-left wd-opener-pos-right wd-opener-style-arrow wd-inited"
                                                                        data-state="first"
                                                                        id="wd-63caae612e8f5">
                                                                        {accordionData.map((item, index) => (
                                                                            <div className="wd-accordion-item" key={index}>
                                                                                <div
                                                                                    className={`wd-accordion-title font-primary wd-fontsize-s wd-font-weight-600 ${activeIndex === index ? "wd-active" : ""
                                                                                        }`}
                                                                                    onClick={() => toggleAccordion(index)}
                                                                                >
                                                                                    <div className="wd-accordion-title-text">
                                                                                        <span>{item.question}</span>
                                                                                    </div>
                                                                                    <span className="wd-accordion-opener" />
                                                                                </div>
                                                                                <div
                                                                                    className={`wd-accordion-content wd-entry-content ${activeIndex === index ? "wd-active" : ""
                                                                                        }`}
                                                                                    style={{
                                                                                        display: activeIndex === index ? "block" : "none",
                                                                                    }}
                                                                                >
                                                                                    <p>{item.answer}</p>
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
                            </form>
                        </div>
                    </div>
                </main>
            </div>

        </>
    )
}

export default checkout;