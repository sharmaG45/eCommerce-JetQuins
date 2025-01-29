'use client';

import { useEffect, useState } from "react";

const Dashboard = () => {

    const [username, setUsername] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Retrieve the user authentication data from sessionStorage
        if (typeof window !== "undefined") {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                const user = JSON.parse(currentUser);
                setCurrentUser(user);
                setUsername(user.displayName); // Set the username once on mount
            }
        }
    }, [])
    return (
        <>
            <div className="wd-page-content main-page-wrapper">
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
                                                    <a href="/">
                                                        Wishlist
                                                    </a>
                                                </li>
                                                <li className="woocommerce-MyAccount-navigation-link woocommerce-MyAccount-navigation-link--customer-logout">
                                                    <a href="/">
                                                        Logout
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
                                                <a href="/">
                                                    Wishlist
                                                </a>
                                            </div>
                                            <div className="customer-logout-link">
                                                <a href="/">
                                                    Logout
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </main>
            </div>

        </>
    )
}

export default Dashboard;