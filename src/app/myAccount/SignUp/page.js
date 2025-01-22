'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, fireStore } from "@/app/_components/firebase/config"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore";

const signup = () => {

    // const router = useRouter();
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
        rememberMe: false,
    });

    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [isRegister, setIsRegister] = useState(false);

    const handleLoginChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginData({
            ...loginData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({
            ...registerData,
            [name]: value,
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = loginData;

        try {
            // Step 1: Query Firestore by the username field
            const usersRef = collection(fireStore, "users");
            const q = query(usersRef, where("username", "==", username)); // Search for a user with this username
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert("User not found. Please register first.");
                return;
            }

            // Step 2: Extract email from Firestore document and authenticate using Firebase Authentication
            const userDoc = querySnapshot.docs[0]; // Get the first document
            const { email } = userDoc.data();  // Get the email from the document

            // Step 3: Authenticate the user with Firebase Authentication using the retrieved email
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            const user = userCredential.user;

            localStorage.setItem('currentUser', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            }));

            console.log("Login successful:", user);

            // Step 4: Redirect or show success message
            alert("Login successful!");
            // router.push('/dashboard'); // Uncomment if using Next.js router for redirection
        } catch (error) {
            console.error("Error during login:", error);
            alert("Error: " + error.message);
        }
    };



    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const { email, password, username } = registerData;

        try {
            // Register user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store additional user info in Firestore
            await setDoc(doc(fireStore, "users", user.uid), {
                username,
                email,
                uid: user.uid,
                createdAt: new Date(),
            });

            alert("Registration successful!");
        } catch (error) {
            console.error("Error during registration:", error);
            alert(error.message);
        }
    };

    const toggleForm = () => {
        setIsRegister((prevState) => !prevState);
    };

    return (
        < div className="wd-page-content main-page-wrapper" >
            <main
                className="wd-content-layout content-layout-wrapper container"
                role="main"
            >
                <div className="wd-content-area site-content">
                    <article
                        id="post-36"
                        className="entry-content post-36 page type-page status-publish hentry"
                    >
                        <div className="woocommerce">
                            <div className="woocommerce-notices-wrapper" />
                            <div className="wd-registration-page wd-register-tabs active-register">
                                <div className="wd-grid-f-col" id="customer_login">
                                    {isRegister ? (
                                        <div className="wd-col col-register">
                                            <h2 className="wd-login-title">Register</h2>
                                            <form onSubmit={handleRegisterSubmit} className="woocommerce-form woocommerce-form-register register">
                                                <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                                                    <label htmlFor="reg_username">
                                                        Username&nbsp;<span className="required">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="woocommerce-Input woocommerce-Input--text input-text"
                                                        name="username"
                                                        id="reg_username"
                                                        value={registerData.username}
                                                        onChange={handleRegisterChange}
                                                        required
                                                    />
                                                </p>
                                                <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                                                    <label htmlFor="reg_email">
                                                        Email address&nbsp;<span className="required">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="woocommerce-Input woocommerce-Input--text input-text"
                                                        name="email"
                                                        id="reg_email"
                                                        value={registerData.email}
                                                        onChange={handleRegisterChange}
                                                        required
                                                    />
                                                </p>
                                                <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                                                    <label htmlFor="reg_password">
                                                        Password&nbsp;<span className="required">*</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="woocommerce-Input woocommerce-Input--text input-text"
                                                        name="password"
                                                        id="reg_password"
                                                        value={registerData.password}
                                                        onChange={handleRegisterChange}
                                                        required
                                                    />
                                                </p>
                                                <p className="woocommerce-form-row form-row">
                                                    <button type="submit" className="woocommerce-Button woocommerce-button button" name="register">
                                                        Register
                                                    </button>
                                                </p>
                                            </form>
                                            <p className="switch-link">
                                                Already have an account?
                                                <button onClick={toggleForm} className="btn-link">
                                                    Login here
                                                </button>
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="wd-col">
                                            <h2 className="wd-login-title">Login</h2>
                                            <form onSubmit={handleLoginSubmit} className="login woocommerce-form woocommerce-form-login">
                                                <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide form-row-username">
                                                    <label htmlFor="username">
                                                        Username or email address&nbsp;<span className="required">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="woocommerce-Input woocommerce-Input--text input-text"
                                                        name="username"
                                                        id="username"
                                                        value={loginData.username}
                                                        onChange={handleLoginChange}
                                                        required
                                                    />
                                                </p>
                                                <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide form-row-password">
                                                    <label htmlFor="password">
                                                        Password&nbsp;<span className="required">*</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="woocommerce-Input woocommerce-Input--text input-text"
                                                        name="password"
                                                        id="password"
                                                        value={loginData.password}
                                                        onChange={handleLoginChange}
                                                        required
                                                    />
                                                </p>
                                                <p className="form-row">
                                                    <button type="submit" className="button woocommerce-button woocommerce-form-login__submit">
                                                        Log in
                                                    </button>
                                                </p>
                                                <p className="login-form-footer">
                                                    <a href="/myAccount/forgetPassword" className="woocommerce-LostPassword lost_password">
                                                        Lost your password?
                                                    </a>
                                                    <label className="woocommerce-form__label woocommerce-form__label-for-checkbox woocommerce-form-login__rememberme">
                                                        <input
                                                            type="checkbox"
                                                            className="woocommerce-form__input woocommerce-form__input-checkbox"
                                                            name="rememberMe"
                                                            checked={loginData.rememberMe}
                                                            onChange={handleLoginChange}
                                                        />
                                                        <span>Remember me</span>
                                                    </label>
                                                </p>
                                            </form>
                                            <p className="switch-link">
                                                Don’t have an account?
                                                <button onClick={toggleForm} className="btn-link">
                                                    Register here
                                                </button>
                                            </p>
                                        </div>
                                    )}
                                    <div className="wd-col col-register-text">
                                        <p className="title wd-login-divider">
                                            <span>Or</span>
                                        </p>
                                        <h2 className="wd-login-title">{isRegister ? "Login" : "Register"}</h2>
                                        <div className="registration-info">
                                            {isRegister
                                                ? "Already have an account? Log in to access your order history and status."
                                                : "Registering for this site allows you to access your order status and history. Just fill in the fields below, and we'll set up a new account for you."}
                                        </div>
                                        <button
                                            className="btn wd-switch-to-register"
                                            onClick={toggleForm}
                                        >
                                            {isRegister ? "Login" : "Register"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </main>
        </div >
    )
}
export default signup;