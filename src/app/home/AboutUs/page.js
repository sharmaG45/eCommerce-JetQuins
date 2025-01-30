'use client';

import React, { useState, useRef, useEffect } from 'react';

const Stores = () => {
    const [isReadMore, setIsReadMore] = useState(false);

    const handleReadMore = () => {
        setIsReadMore(!isReadMore);
    }
    return (
        <>
            <section
                style={{
                    width: "100%",
                    backgroundColor: "red",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        padding: "20px",
                        backgroundColor: "#1e61e4",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "3rem",
                            fontWeight: "bold",
                            marginBottom: "20px",
                            color: "white",
                        }}
                    >
                        About Us
                    </h2>
                    {/* <p style={{ fontSize: "16px", color: "#666" }}>
                        We understand that circumstances may change. If you need a refund or wish
                        to cancel a service, please refer to our policy for details.
                    </p> */}
                </div>
            </section>
            <div className="wd-page-content main-page-wrapper">
                <main
                    className="wd-content-layout content-layout-wrapper container"
                    role="main"
                >
                    <div className="wd-content-area site-content">
                        <article
                            id="post-40"
                            className="entry-content post-40 page type-page status-publish hentry"
                        >
                            <div className="wpb-content-wrapper">

                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1668011402189 vc_row-has-fill wd-rs-636bd57f5840b">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-63ca988e4d43a ">
                                        <div className="vc_column-inner vc_custom_1674224426164">
                                            <div className="wpb_wrapper">
                                                <div className="elementor-widget-container">
                                                    <h2>
                                                        <span style={{ color: "#ff0000" }}>
                                                            About <strong>Getpixelsecurity</strong>
                                                        </span>
                                                    </h2>
                                                    <p>
                                                        About Getpixelsecurity : Getpixelsecurity is a leading security and online
                                                        store to keep you the ease of buying PC security products online. The online
                                                        store provides several kinds of software including antivirus, internet
                                                        security, and virus protection software. We proudly serve customers that are
                                                        home users, professional users or business users. This website is designed
                                                        for customers shopping for security software products. Customers can do
                                                        online shopping to enjoy our best and low prices with incredible offers and
                                                        deals.
                                                    </p>
                                                    <p>Why Always Visit Getpixelsecurity</p>
                                                    <h4>
                                                        <span style={{ color: "#ff0000" }}>
                                                            <strong>Guaranteed low prices</strong>
                                                        </span>
                                                    </h4>
                                                    <p>
                                                        YES, we guarantee low prices as compared to the other available offers over
                                                        the internet. This is possible only because we have an active monitoring
                                                        team to be ahead of the competition in all possible ways. We make sure
                                                        customers get the most cost-effective and competitive pricing from us.
                                                        GUARANTEED!
                                                    </p>
                                                    <h4>
                                                        <span style={{ color: "#ff0000" }}>
                                                            <strong>Why our prices are low</strong>
                                                        </span>
                                                    </h4>
                                                    <p>
                                                        We get to these questions very often how the prices are lower than other
                                                        available sources online. Our answer to them is, we save on buying directly
                                                        from authorized resellers&nbsp;which saves a lot of money as compared to
                                                        going through the middle parties. Moreover, we buy products in high volumes
                                                        which gives us an edge to have better prices.
                                                    </p>
                                                    <p>
                                                        We strongly believe in the highest customer satisfaction while keeping their
                                                        important devices safe all the time.
                                                    </p>
                                                    <h4>
                                                        <span style={{ color: "#ff0000" }}>
                                                            <strong>Free Shipping</strong>
                                                        </span>
                                                    </h4>
                                                    <p>
                                                        Have leverage of our online free shipping throughout our online catalog
                                                        without any conditions.
                                                    </p>
                                                    <p>
                                                        We assure our customer’s free shipping after you place an order online we
                                                        also provide you with online tracking of your purchase. You will receive by
                                                        email instantly the activation key as well as the download link of the
                                                        software.
                                                    </p>
                                                    <h4>
                                                        <span style={{ color: "#ff0000" }}>
                                                            <strong>Secure data</strong>
                                                        </span>
                                                    </h4>
                                                    <p>
                                                        Get CodesKora has an HTTPS protocol implemented which has the role of
                                                        securing your navigation and protecting your personal information to the
                                                        highest level of security standards. .We guarantee you no transfer to third
                                                        parties and secure transmission of data.
                                                    </p>
                                                    <h4>
                                                        <span style={{ color: "#ff0000" }}>
                                                            <strong>Outstanding Customer Support</strong>
                                                        </span>
                                                    </h4>
                                                    <p>
                                                        We are always available during our work hours to give you world-class
                                                        customer service. We ensure any queries and information you need is answered
                                                        within the shortest possible timelines to keep your online shopping easy for
                                                        you.
                                                    </p>
                                                    <h4>
                                                        <span style={{ color: "#ff0000" }}>
                                                            <strong>Walk Through Of the Product</strong>
                                                        </span>
                                                    </h4>
                                                    <p>
                                                        We don’t believe in just selling you the product once, we are always
                                                        available with you from the moment you purchase the product and till you
                                                        start using it. Any queries and questions you have regarding your purchase
                                                        our customer support staff is eager to answer them for you. We detail you on
                                                        the product warranty, setup steps, advantages, values, and all documentation
                                                        you require to best use your product.
                                                    </p>{" "}
                                                </div>

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

export default Stores;