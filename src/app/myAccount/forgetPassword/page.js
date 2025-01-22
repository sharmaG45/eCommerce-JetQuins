'use client';

import { useState } from "react";
import { auth } from "@/app/_components/firebase/config"; // Firebase auth import
import { sendPasswordResetEmail } from "firebase/auth"; // Firebase method for resetting password
import { useRouter } from "next/navigation";

const forgetPassword = () => {
    const [email, setEmail] = useState(""); // State to manage email input
    const [errorMessage, setErrorMessage] = useState(""); // For capturing errors
    const [successMessage, setSuccessMessage] = useState(""); // For success message
    const router = useRouter();

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setErrorMessage("Please enter your email.");
            return;
        }

        try {
            // Send password reset email
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage("Password reset email sent! Check your inbox.");
            setErrorMessage(""); // Clear any previous error message
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage(""); // Clear any previous success message
        }
    };

    return (
        <div className="wd-page-content main-page-wrapper">
            <main className="wd-content-layout content-layout-wrapper container" role="main">
                <div className="wd-content-area site-content">
                    <article id="post-36" className="entry-content post-36 page type-page status-publish hentry">
                        <div className="woocommerce">
                            <div className="woocommerce-notices-wrapper" />
                            <form
                                method="post"
                                className="woocommerce-ResetPassword lost_reset_password"
                                onSubmit={handleSubmit}
                            >
                                <p>
                                    Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.
                                </p>
                                <p className="woocommerce-form-row woocommerce-form-row--first form-row form-row-first">
                                    <label htmlFor="user_login">
                                        Username or email&nbsp;<span className="required">*</span>
                                    </label>
                                    <input
                                        className="woocommerce-Input woocommerce-Input--text input-text"
                                        type="email"
                                        name="user_login"
                                        id="user_login"
                                        autoComplete="email"
                                        aria-required="true"
                                        value={email}
                                        onChange={handleChange}
                                        required
                                    />
                                </p>

                                {/* Display error or success message */}
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                {successMessage && <p className="success-message">{successMessage}</p>}

                                <div className="clear" />

                                <p className="woocommerce-form-row form-row">
                                    <button type="submit" className="woocommerce-Button button" value="Reset password">
                                        Reset password
                                    </button>
                                </p>
                                <input
                                    type="hidden"
                                    id="woocommerce-lost-password-nonce"
                                    name="woocommerce-lost-password-nonce"
                                    defaultValue="c96119b117"
                                />
                                <input
                                    type="hidden"
                                    name="_wp_http_referer"
                                    defaultValue="/mega-electronics/my-account/lost-password/"
                                />
                            </form>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
};

export default forgetPassword;
