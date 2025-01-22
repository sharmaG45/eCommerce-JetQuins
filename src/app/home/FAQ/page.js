
'use client';

import React, { useState, useEffect } from "react";

const outlet = () => {

    const [accordionData, setAccordionData] = useState([]);

    // Fetch data (you can replace this with an API call or a database query)
    useEffect(() => {
        // Simulating a fetch call
        const fetchData = async () => {
            // Example data; replace this with actual API response
            const data = [
                {
                    question: "My order hasn't arrived yet. Where is it?",
                    answer:
                        "How can you evaluate content without design? No typography, no colors, no layout, no styles, all those things that convey the important signals that go beyond the mere textual, hierarchies of information, weight.",
                },
                {
                    question: "Do you deliver on public holidays?",
                    answer:
                        "To short sentences, to many headings, images too large for the proposed design, or too small, or they fit in but it looks iffy for reasons the folks in the meeting can’t quite tell right now, but they’re unhappy, somehow.",
                },
                {
                    question: "Do you deliver to my postcode?",
                    answer:
                        "How can you evaluate content without design? No typography, no colors, no layout, no styles, all those things that convey the important signals that go beyond the mere textual, hierarchies of information, weight.",
                },
                {
                    question: "Is next-day delivery available on all orders?",
                    answer:
                        "To short sentences, to many headings, images too large for the proposed design, or too small, or they fit in but it looks iffy for reasons the folks in the meeting can’t quite tell right now, but they’re unhappy, somehow.",
                },
                {
                    question: "Do I need to be there to sign for delivery?",
                    answer:
                        "How can you evaluate content without design? No typography, no colors, no layout, no styles, all those things that convey the important signals that go beyond the mere textual, hierarchies of information, weight.",
                },
            ];

            setAccordionData(data); // Update state with fetched data
        };

        fetchData();
    }, []);

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(index === activeIndex ? null : index); // Toggle active index
    };
    
    return (
        <>
            <div className="wd-page-content main-page-wrapper">
                <main
                    className="wd-content-layout content-layout-wrapper container"
                    role="main">
                    <div className="wd-content-area site-content">
                        <article
                            className="entry-content post-26 page type-page status-publish hentry"
                            id="post-26">
                            <div className="wpb-content-wrapper">
                                <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1670856733866 vc_row-has-fill wd-rs-63974019c1391">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-6213ac5daaf9d">
                                        <div className="vc_column-inner vc_custom_1645456482508">
                                            <div className="wpb_wrapper">
                                                <div
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-6397401f7cbc7 wd-title-color-default wd-title-style-default text-left vc_custom_1670856740311 wd-underline-colored"
                                                    id="wd-6397401f7cbc7">
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-l">
                                                            FREQUENTLY ASKED QUESTIONS
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
                        </article>
                    </div>
                </main>
            </div>

        </>
    )
}
export default outlet;