'use client';

import React, { useState, useRef, useEffect } from 'react';
import { fireStore } from "@/app/_components/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const Contact = () => {
    const [isReadMore, setIsReadMore] = useState(false);

    const [formData, setFormData] = useState({
        First: "",
        Last: "",
        Email: "",
        "your-message": "",
    });
    const [formStatus, setFormStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus("loading");

        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("currentUser");
            console.log("userData from localStorage:", userData); // Debugging

            const user = userData ? JSON.parse(userData) : null;

            if (!user) {
                setFormStatus("error");
                console.error("User not found in localStorage");
                return;
            }

            try {
                const userId = user.uid;
                const userRef = doc(fireStore, "users", userId);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const data = {
                        First: formData.First,
                        Last: formData.Last,
                        Email: formData.Email,
                        "your-message": formData["your-message"],
                        timestamp: new Date(),
                    };

                    // Save the form data under a sub-collection "messages"
                    await setDoc(doc(fireStore, "users", userId, "messages", `${new Date().getTime()}`), data);

                    setFormStatus("success");
                    console.log("Form data saved successfully!");
                } else {
                    setFormStatus("error");
                    console.error("User document does not exist in Firestore");
                }
            } catch (error) {
                setFormStatus("error");
                console.error("Error saving form data: ", error);
            }
        } else {
            setFormStatus("error");
            console.error("localStorage is not available.");
        }
    };

    const handleReadMore = () => {
        setIsReadMore(!isReadMore);
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
                            id="post-22"
                            className="entry-content post-22 page type-page status-publish hentry"
                        >
                            <div className="wpb-content-wrapper">

                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1669294457836 vc_row-o-content-top vc_row-flex wd-rs-637f6975a83bc">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-9 vc_col-md-9 wd-rs-637627aed43d5">
                                        <div className="vc_column-inner vc_custom_1668687800861">
                                            <div className="wpb_wrapper">
                                                <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1668700803879 vc_row-has-fill wd-rs-63765a7ab0cd3">
                                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-63762deee81ef">
                                                        <div className="vc_column-inner vc_custom_1668689396390">
                                                            <div className="wpb_wrapper">
                                                                <div
                                                                    id="wd-637657a83bac4"
                                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-637657a83bac4 wd-title-color-default wd-title-style-default text-left vc_custom_1668700081630 wd-underline-colored"
                                                                >
                                                                    <div className="liner-continer">
                                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-l">
                                                                            Get in Touch
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="wpcf7 no-js"
                                                                    id="wpcf7-f3792-p22-o1"
                                                                    lang="en-US"
                                                                    dir="ltr"
                                                                >
                                                                    <div className="screen-reader-response">
                                                                        <p
                                                                            role="status"
                                                                            aria-live="polite"
                                                                            aria-atomic="true"
                                                                        />
                                                                        <ul />
                                                                    </div>
                                                                    <form onSubmit={handleSubmit} className="wpcf7-form init" aria-label="Contact form" noValidate>
                                                                        <div className="row">
                                                                            <p className="col-md-6">
                                                                                <span className="wpcf7-form-control-wrap" data-name="First">
                                                                                    <input
                                                                                        type="text"
                                                                                        name="First"
                                                                                        placeholder="First name"
                                                                                        value={formData.First}
                                                                                        onChange={handleChange}
                                                                                        className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                                                                        aria-required="true"
                                                                                    />
                                                                                </span>
                                                                            </p>
                                                                            <p className="col-md-6">
                                                                                <span className="wpcf7-form-control-wrap" data-name="Last">
                                                                                    <input
                                                                                        type="text"
                                                                                        name="Last"
                                                                                        placeholder="Last name"
                                                                                        value={formData.Last}
                                                                                        onChange={handleChange}
                                                                                        className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                                                                        aria-required="true"
                                                                                    />
                                                                                </span>
                                                                            </p>
                                                                        </div>

                                                                        <p>
                                                                            <span className="wpcf7-form-control-wrap" data-name="Email">
                                                                                <input
                                                                                    type="email"
                                                                                    name="Email"
                                                                                    placeholder="Email"
                                                                                    value={formData.Email}
                                                                                    onChange={handleChange}
                                                                                    className="wpcf7-form-control wpcf7-email wpcf7-validates-as-required wpcf7-validates-as-email"
                                                                                    aria-required="true"
                                                                                />
                                                                            </span>
                                                                        </p>

                                                                        <p>
                                                                            <span className="wpcf7-form-control-wrap" data-name="your-message">
                                                                                <textarea
                                                                                    name="your-message"
                                                                                    placeholder="Your Message"
                                                                                    value={formData["your-message"]}
                                                                                    onChange={handleChange}
                                                                                    className="wpcf7-form-control wpcf7-textarea"
                                                                                    rows="10"
                                                                                    maxLength="2000"
                                                                                />
                                                                            </span>
                                                                        </p>

                                                                        <p>
                                                                            <button
                                                                                type="submit"
                                                                                className="wpcf7-form-control wpcf7-submit has-spinner btn btn-color-primary btn-style-semi-round"
                                                                            >
                                                                                {formStatus === "loading" ? "Sending..." : "Send Message"}
                                                                            </button>
                                                                        </p>

                                                                        {formStatus === "success" && (
                                                                            <div className="wpcf7-response-output" role="status">
                                                                                <p>Your message has been sent successfully!</p>
                                                                            </div>
                                                                        )}
                                                                        {formStatus === "error" && (
                                                                            <div className="wpcf7-response-output" role="status">
                                                                                <p>There was an error sending your message. Please try again.</p>
                                                                            </div>
                                                                        )}
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-3 vc_col-md-3 wd-rs-63765747a215f">
                                        <div className="vc_column-inner vc_custom_1668699979770">
                                            <div className="wpb_wrapper">
                                                <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1669294422432 vc_row-has-fill wd-rs-637f69537e774">
                                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-6376134c85019">
                                                        <div className="vc_column-inner vc_custom_1668682574250">
                                                            <div className="wpb_wrapper">
                                                                <div
                                                                    id="wd-637611e5b5702"
                                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-637611e5b5702 wd-title-color-default wd-title-style-default text-left vc_custom_1668682227123 wd-underline-colored"
                                                                >
                                                                    <div className="liner-continer">
                                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-m">
                                                                            Need a Help?
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                                <ul
                                                                    className=" wd-rs-63da23f1ddd54 wd-list wd-wpb color-scheme-custom wd-fontsize-xs wd-type-icon wd-style-default text-left "
                                                                    id="wd-63da23f1ddd54"
                                                                >
                                                                    <li>
                                                                        <span className="wd-icon list-icon far fa-bell">
                                                                            <img
                                                                                decoding="async"
                                                                                src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/phone.svg"
                                                                                title="phone"
                                                                                width={32}
                                                                                height={32}
                                                                                data-lazy-src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/phone.svg"
                                                                                data-ll-status="loaded"
                                                                                className="entered lazyloaded"
                                                                            />

                                                                        </span>
                                                                        <span className="wd-list-content list-content">
                                                                            (208) 555-0112
                                                                        </span>
                                                                        <a
                                                                            className="wd-fill"
                                                                            href="tel:+1(888) 267-5955"
                                                                            title=""
                                                                            aria-label="List link"
                                                                        />
                                                                    </li>
                                                                    <li>
                                                                        <span className="wd-icon list-icon far fa-bell">
                                                                            <img
                                                                                decoding="async"
                                                                                src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/messenger.svg"
                                                                                title="messenger"
                                                                                width={32}
                                                                                height={32}
                                                                                data-lazy-src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/messenger.svg"
                                                                                data-ll-status="loaded"
                                                                                className="entered lazyloaded"
                                                                            />

                                                                        </span>
                                                                        <span className="wd-list-content list-content">
                                                                            Messenger
                                                                        </span>
                                                                        <a
                                                                            className="wd-fill"

                                                                            title=""
                                                                            aria-label="List link"
                                                                        />
                                                                    </li>
                                                                    <li>
                                                                        <span className="wd-icon list-icon far fa-bell">
                                                                            <img
                                                                                decoding="async"
                                                                                src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/telegram.svg"
                                                                                title="telegram"
                                                                                width={32}
                                                                                height={32}
                                                                                data-lazy-src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/telegram.svg"
                                                                                data-ll-status="loaded"
                                                                                className="entered lazyloaded"
                                                                            />

                                                                        </span>
                                                                        <span className="wd-list-content list-content">
                                                                            Telegram
                                                                        </span>
                                                                        <a
                                                                            className="wd-fill"

                                                                            title=""
                                                                            aria-label="List link"
                                                                        />
                                                                    </li>
                                                                    <li>
                                                                        <span className="wd-icon list-icon far fa-bell">
                                                                            <img
                                                                                decoding="async"
                                                                                src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/email.svg"
                                                                                title="email"
                                                                                width={32}
                                                                                height={32}
                                                                                data-lazy-src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/email.svg"
                                                                                data-ll-status="loaded"
                                                                                className="entered lazyloaded"
                                                                            />

                                                                        </span>
                                                                        <span className="wd-list-content list-content">
                                                                            Email: woodmart@mail.com
                                                                        </span>
                                                                        <a
                                                                            className="wd-fill"
                                                                            href="mailto:contact@onlineflightreservation.com"
                                                                            title=""
                                                                            aria-label="List link"
                                                                        />
                                                                    </li>
                                                                </ul>
                                                                <div
                                                                    id="wd-6376252c71c4c"
                                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-6376252c71c4c wd-title-color-default wd-title-style-default text-left vc_custom_1668687158871 wd-underline-colored"
                                                                >
                                                                    <div className="liner-continer">
                                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-m">
                                                                            Subscribe us
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    id=""
                                                                    className=" wd-rs-6376256490374 wd-social-icons  wd-style-colored wd-size-default social-share wd-shape-circle text-left"
                                                                >
                                                                    <a
                                                                        rel="noopener noreferrer nofollow"
                                                                        href="/"
                                                                        target="_blank"
                                                                        className=" wd-social-icon social-facebook"
                                                                        aria-label="Facebook social link"
                                                                    >
                                                                        <span className="wd-icon" />
                                                                    </a>
                                                                    <a
                                                                        rel="noopener noreferrer nofollow"
                                                                        href="/"
                                                                        target="_blank"
                                                                        className=" wd-social-icon social-twitter"
                                                                        aria-label="X social link"
                                                                    >
                                                                        <span className="wd-icon" />
                                                                    </a>
                                                                    <a
                                                                        rel="noopener noreferrer nofollow"
                                                                        href="/"
                                                                        target="_blank"
                                                                        className=" wd-social-icon social-pinterest"
                                                                        aria-label="Pinterest social link"
                                                                    >
                                                                        <span className="wd-icon" />
                                                                    </a>
                                                                    <a
                                                                        rel="noopener noreferrer nofollow"
                                                                        href="/"
                                                                        target="_blank"
                                                                        className=" wd-social-icon social-linkedin"
                                                                        aria-label="Linkedin social link"
                                                                    >
                                                                        <span className="wd-icon" />
                                                                    </a>
                                                                    <a
                                                                        rel="noopener noreferrer nofollow"
                                                                        href="/"
                                                                        target="_blank"
                                                                        className=" wd-social-icon social-tg"
                                                                        aria-label="Telegram social link"
                                                                    >
                                                                        <span className="wd-icon" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1668011402189 vc_row-has-fill wd-rs-636bd57f5840b">
                                    <div className={`wpb_column vc_column_container vc_col-sm-12 wd-rs-63ca988e4d43a wd-collapsible-content ${isReadMore ? 'wd-opened' : ''}`}>
                                        <div className="vc_column-inner vc_custom_1666189296787">
                                            <div className="wpb_wrapper">
                                                <div
                                                    id="wd-638768c9adbdd"
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-638768c9adbdd wd-title-color-default wd-title-style-default text-left vc_custom_1669818578774 wd-underline-colored"
                                                >
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-xl">
                                                            Online store of household appliances and electronics
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div
                                                    id="wd-63da20b215a19"
                                                    className="wd-text-block wd-wpb reset-last-child wd-rs-63da20b215a19 text-left "
                                                >
                                                    <p>
                                                        Then the question arises: where’s the content? Not there
                                                        yet? That’s not so bad, there’s dummy copy to the rescue.
                                                        But worse, what if the fish doesn’t fit in the can, the
                                                        foot’s to big for the boot? Or to small? To short
                                                        sentences, to many headings, images too large for the
                                                        proposed design, or too small, or they fit in but it looks
                                                        iffy for reasons.
                                                    </p>
                                                    <p>
                                                        A client that’s unhappy for a reason is a problem, a
                                                        client that’s unhappy though he or her can’t quite put a
                                                        finger on it is worse. Chances are there wasn’t
                                                        collaboration, communication, and checkpoints, there
                                                        wasn’t a process agreed upon or specified with the
                                                        granularity required. It’s content strategy gone awry
                                                        right from the start. If that’s what you think how bout
                                                        the other way around? How can you evaluate content without
                                                        design? No typography, no colors, no layout, no styles,
                                                        all those things that convey the important signals that go
                                                        beyond the mere textual, hierarchies of information,
                                                        weight, emphasis, oblique stresses, priorities, all those
                                                        subtle cues that also have visual and emotional appeal to
                                                        the reader.
                                                    </p>
                                                </div>
                                                <div
                                                    id="wd-63c13093ea21c"
                                                    className=" wd-rs-63c13093ea21c  wd-button-wrapper text-left wd-collapsible-button"
                                                >
                                                    <a className="btn btn-style-default btn-shape-semi-round btn-size-small btn-icon-pos-right" onClick={handleReadMore}>
                                                        Read More
                                                        <span className="wd-btn-icon">
                                                            <img
                                                                decoding="async"
                                                                src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2014%2014'%3E%3C/svg%3E"
                                                                title="chevron-down-black"
                                                                width={14}
                                                                height={14}
                                                                data-lazy-src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-down-black.svg"
                                                            />

                                                        </span>
                                                    </a>
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

export default Contact;