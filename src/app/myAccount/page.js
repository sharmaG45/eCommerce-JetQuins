'use client';

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import SignUp from "./SignUp/page";
import { fireStore, auth } from '../_components/firebase/config';

const Dashboard = () => {

    const [username, setUsername] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        // Retrieve the user authentication data from localStorage
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("currentUser");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setCurrentUser(user);
                setIsUserLoggedIn(true); // Set to true if a user exists
                setUsername(user.displayName);
            }
        }
    }, []);

    const handleSignOut = (e) => {
        e.preventDefault();
        signOut(auth)
            .then(() => {
                // Remove user session info from localStorage
                localStorage.removeItem("currentUser");
                setIsUserLoggedIn(false); // Update state to reflect logout

                // Show success toast message
                toast.success("You have successfully signed out.");
            })
            .catch((error) => {
                console.error("Sign-out error: ", error);
                toast.error("An error occurred while signing out. Please try again.");
            });
    };

    return (
        <>
            {isUserLoggedIn ? (<div className="wd-page-content main-page-wrapper">
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
                                <div className="woocommerce-my-account-wrapper">
                                    <div className="wd-my-account-sidebar">
                                        {" "}
                                        <h3 className="woocommerce-MyAccount-title entry-title">
                                            My account{" "}
                                        </h3>
                                        <nav
                                            className="woocommerce-MyAccount-navigation"
                                            aria-label="Account pages"
                                        >
                                            <ul>
                                                <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--dashboard is-active">
                                                    <a href="/">
                                                        Dashboard
                                                    </a>
                                                </li>
                                                <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--orders">
                                                    <a href="/">
                                                        Orders
                                                    </a>
                                                </li>
                                                <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--downloads">
                                                    <a href="/">
                                                        Downloads
                                                    </a>
                                                </li>
                                                <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--edit-address">
                                                    <a href="/">
                                                        Addresses
                                                    </a>
                                                </li>
                                                <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--edit-account">
                                                    <a href="/">
                                                        Account details
                                                    </a>
                                                </li>
                                                <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--wishlist">
                                                    <a href="/home/wishlist">
                                                        Wishlist
                                                    </a>
                                                </li>
                                                <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--customer-logout">
                                                    <a href='/' onClick={(e) => handleSignOut(e)}>
                                                        <span>Logout</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                    <div className="woocommerce-MyAccount-content">
                                        <div className="woocommerce-notices-wrapper" />
                                        <p>
                                            Hello <strong>{username}</strong> (not <strong>{username}</strong>?{" "}
                                            <a href="/">
                                                Log out
                                            </a>
                                            )
                                        </p>
                                        <p>
                                            From your account dashboard you can view your{" "}
                                            <a href="/">
                                                recent orders
                                            </a>
                                            , manage your{" "}
                                            <a href="/">
                                                shipping and billing addresses
                                            </a>
                                            , and{" "}
                                            <a href="/">
                                                edit your password and account details
                                            </a>
                                            .
                                        </p>
                                        <div className="wd-my-account-links wd-grid-g">
                                            <div className="dashboard-link">
                                                <a href="/">
                                                    Dashboard
                                                </a>
                                            </div>
                                            <div className="orders-link">
                                                <a href="/">
                                                    Orders
                                                </a>
                                            </div>
                                            <div className="downloads-link">
                                                <a href="/">
                                                    Downloads
                                                </a>
                                            </div>
                                            <div className="edit-address-link">
                                                <a href="/">
                                                    Addresses
                                                </a>
                                            </div>
                                            <div className="edit-account-link">
                                                <a href="/">
                                                    Account details
                                                </a>
                                            </div>
                                            <div className="wishlist-link">
                                                <a href="/home/wishlist">
                                                    Wishlist
                                                </a>
                                            </div>
                                            <div className="customer-logout-link">
                                                <a href='/' onClick={(e) => handleSignOut(e)}>
                                                    <span>Logout</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </main>
            </div>) : (
                <SignUp />
            )}

            {/* {isUserLoggedIn && <SignUp />} */}

        </>
    )
}

export default Dashboard;