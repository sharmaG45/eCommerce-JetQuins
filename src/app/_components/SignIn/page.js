'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, fireStore } from "@/app/_components/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, query, where, collection } from "firebase/firestore";
import { toast } from "react-toastify";

const signin = ({ isModalOpen, closeModal, setIsModalOpen }) => {
    const router = useRouter();
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
        rememberMe: false,
    });

    const handleLoginChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginData({
            ...loginData,
            [name]: type === 'checkbox' ? checked : value,
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
                toast.error("User not found. Please register first.")
                return;
            }

            // Step 2: Extract email from Firestore document and authenticate using Firebase Authentication
            const userDoc = querySnapshot.docs[0]; // Get the first document
            const { email } = userDoc.data();  // Get the email from the document

            // Step 3: Authenticate the user with Firebase Authentication using the retrieved email
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            

            localStorage.setItem("currentUser", JSON.stringify(user));


            console.log("Login successful:", user);

            toast.success("Login successful!")
            setIsModalOpen(false) // Redirect to dashboard after successful login
        } catch (error) {
            console.error("Error during login:", error);
            toast.error(`Error during login:: ${error.message}`)
        }
    };

    const handleCreateAccount = () => {
        setIsModalOpen(false);
        router.push('/myAccount/SignUp'); // Redirect to the Sign Up page
    }

    return (
        <>
            <div className={`login-form-side wd-side-hidden woocommerce wd-right ${isModalOpen ? 'wd-opened' : ''}`}>
                <div className="wd-heading">
                    <span className="title">Sign in</span>
                    <div className="close-side-widget wd-action-btn wd-style-text wd-cross-icon">
                        <a rel="nofollow" onClick={closeModal}>Close</a>
                    </div>
                </div>
                <form
                    className="login woocommerce-form woocommerce-form-login"
                    onSubmit={handleLoginSubmit} // Handle form submission with the submit handler
                >
                    <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide form-row-username">
                        <label htmlFor="username">
                            Username or email address&nbsp;
                            <span className="required" aria-hidden="true">*</span>
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
                            Password&nbsp;
                            <span className="required" aria-hidden="true">*</span>
                        </label>
                        <span className="password-input">
                            <input
                                type="password"
                                className="woocommerce-Input woocommerce-Input--text input-text"
                                name="password"
                                id="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                            />
                            <span className="show-password-input" />
                        </span>
                    </p>
                    <p className="form-row">
                        <button
                            type="submit"
                            className="button woocommerce-button woocommerce-form-login__submit"
                            name="login"
                            value="Log in"
                        >
                            Log in
                        </button>
                    </p>
                    <p className="login-form-footer">
                        <a
                            href="/myAccount/forgetPassword/"
                            className="woocommerce-LostPassword lost_password"
                        >
                            Lost your password?
                        </a>
                        <label className="woocommerce-form__label woocommerce-form__label-for-checkbox woocommerce-form-login__rememberme">
                            <input
                                className="woocommerce-form__input woocommerce-form__input-checkbox"
                                name="rememberme"
                                type="checkbox"
                                defaultValue="forever"
                                title="Remember me"
                                aria-label="Remember me"
                            />
                            <span>Remember me</span>
                        </label>
                    </p>
                </form>
                <div className="create-account-question">
                    <p>No account yet?</p>
                    <button
                        className="btn create-account-button"
                        onClick={handleCreateAccount}
                    >
                        Create an Account
                    </button>
                </div>
            </div>
        </>
    );
}

export default signin;
