'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Footer = () => {
    const [isShopOpen, setShopOpen] = useState(false);
    const router = useRouter();
    const products = [
        {
            id: 1,
            name: "Bitdefender Antivirus",
            url: "/home/productCategory?title=Bitdefender" // Assuming the product URL for Bitdefender
        },
        {
            id: 2,
            name: "McAfee Antivirus",
            url: "/home/productCategory?title=McAfee" // Assuming the product URL for McAfee
        },
        {
            id: 3,
            name: "Trend Micro",
            url: "/home/productCategory?title=Trend Micro" // Assuming the product URL for Trend Micro
        },
        {
            id: 4,
            name: "Norton Antivirus",
            url: "/home/productCategory?title=Norton" // Assuming the product URL for Norton

        },
        {
            id: 5,
            name: "Webroot Antivirus",
            url: "/home/productCategory?title=Webroot" // Assuming the product URL for Norton
        }
    ];
    const handleProductClick = (productUrl) => {
        router.push(`${productUrl}`)
        setShopOpen(false);
    }
    return <>
        <footer
            data-wpr-lazyrender={1}
            className="wd-footer footer-container color-scheme-dark"
        >
            <div className="container main-footer wd-entry-content">
                <style
                    data-type="vc_shortcodes-custom-css"
                    dangerouslySetInnerHTML={{
                        __html:
                            ".vc_custom_1669295016720{margin-bottom: 40px !important;padding-top: 40px !important;}.vc_custom_1668779245150{padding-top: 0px !important;}.vc_custom_1668779255112{padding-top: 0px !important;}.vc_custom_1668779264766{padding-top: 0px !important;}.vc_custom_1668779274593{padding-top: 0px !important;}.vc_custom_1669904336840{margin-bottom: 0px !important;}.vc_custom_1669387447622{margin-bottom: 0px !important;}.vc_custom_1669387456657{margin-bottom: 0px !important;}.vc_custom_1669387465358{margin-bottom: 0px !important;}.vc_custom_1669294977126{margin-bottom: 0px !important;}.vc_custom_1668779382032{padding-top: 0px !important;}.vc_custom_1668779376777{padding-top: 0px !important;}.vc_custom_1668779356225{padding-top: 0px !important;}.vc_custom_1668779351601{padding-top: 0px !important;}.vc_custom_1668779344705{margin-bottom: 10px !important;padding-top: 0px !important;}.vc_custom_1669904956863{margin-bottom: 20px !important;}.vc_custom_1675239302223{margin-bottom: 20px !important;}.vc_custom_1666192635650{margin-bottom: 10px !important;}.vc_custom_1666280890277{margin-bottom: 30px !important;}.vc_custom_1666194678735{margin-bottom: -10px !important;}.vc_custom_1666194692241{margin-bottom: -10px !important;}.vc_custom_1666194698611{margin-bottom: -10px !important;}.vc_custom_1675239361486{margin-bottom: 20px !important;}.vc_custom_1666194559103{margin-right: 15px !important;margin-bottom: 20px !important;}.vc_custom_1666194562939{margin-bottom: 20px !important;}.wd-rs-6388ba0e775af{--wd-brd-radius: 0px;}.wd-rs-63501c7aafa28{--wd-brd-radius: 0px;}.wd-rs-63501c7f1bd96{--wd-brd-radius: 0px;}#wd-6388b350c4846 .info-box-title{line-height:28px;font-size:18px;}#wd-6380d4af0732d .info-box-title{line-height:28px;font-size:18px;}#wd-6380d4b93e561 .info-box-title{line-height:28px;font-size:18px;}#wd-6380d4c2b2d46 .info-box-title{line-height:28px;font-size:18px;}#wd-63da1fbd0652e .woodmart-title-container{line-height:28px;font-size:18px;}#wd-63da1fbd0652e .title-after_title{line-height:25px;font-size:15px;}"
                    }}
                />
                <div className="wpb-content-wrapper">
                    <div className="vc_row wpb_row vc_row-fluid vc_custom_1669295016720 wd-rs-637f6ba4813e4">
                        <div className="wpb_column vc_column_container vc_col-sm-6 vc_col-lg-3 vc_col-md-3 wd-rs-63778ce5a2174">
                            <div className="vc_column-inner vc_custom_1668779245150">
                                <div className="wpb_wrapper">

                                    <div className="info-box-wrapper inline-element">
                                        <div
                                            id="wd-6388b350c4846"
                                            className=" wd-rs-6388b350c4846 wd-info-box wd-wpb text-left box-icon-align-right box-style- color-scheme- wd-bg-none wd-items-top vc_custom_1669904336840"
                                        >
                                            <div className="box-icon-wrapper  box-with-icon box-icon-simple">
                                                <div className="info-box-icon">
                                                    <div
                                                        className="info-svg-wrapper"
                                                        style={{ width: 24, height: 24 }}
                                                    >
                                                        <img
                                                            src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3C/svg%3E"
                                                            title="arrow-on-primary-circle"
                                                            width={24}
                                                            height={24}
                                                            data-lazy-src="/assets/wp-content/uploads/sites/9/2022/10/arrow-on-primary-circle.svg"
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="info-box-content">
                                                <h4 className="info-box-title title box-title-style-default wd-fontsize-m">
                                                    Broadway Store
                                                </h4>
                                                <div className="info-box-inner reset-last-child" />
                                            </div>
                                            <a
                                                className="wd-info-box-link wd-fill"
                                                aria-label="Infobox link"
                                                href="/"
                                                title="Broadway Store"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        id="wd-637784a200295"
                                        className="wd-text-block wd-wpb reset-last-child wd-rs-637784a200295 text-left "
                                    >
                                        <p>1260 Broadway, San Francisco, CA 94109</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="wpb_column vc_column_container vc_col-sm-6 vc_col-lg-3 vc_col-md-3 wd-rs-63778cefd2df2">
                            <div className="vc_column-inner vc_custom_1668779255112">
                                <div className="wpb_wrapper">

                                    <div className="info-box-wrapper inline-element">
                                        <div
                                            id="wd-6380d4af0732d"
                                            className=" wd-rs-6380d4af0732d wd-info-box wd-wpb text-left box-icon-align-right box-style- color-scheme- wd-bg-none wd-items-top vc_custom_1669387447622"
                                        >
                                            <div className="box-icon-wrapper  box-with-icon box-icon-simple">
                                                <div className="info-box-icon">
                                                    <div
                                                        className="info-svg-wrapper"
                                                        style={{ width: 24, height: 24 }}
                                                    >
                                                        <img
                                                            src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3C/svg%3E"
                                                            title="arrow-on-primary-circle"
                                                            width={24}
                                                            height={24}
                                                            data-lazy-src="/assets/wp-content/uploads/sites/9/2022/10/arrow-on-primary-circle.svg"
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="info-box-content">
                                                <h4 className="info-box-title title box-title-style-default wd-fontsize-m">
                                                    Valencia Store
                                                </h4>
                                                <div className="info-box-inner reset-last-child" />
                                            </div>
                                            <a
                                                className="wd-info-box-link wd-fill"
                                                aria-label="Infobox link"
                                                href="/"
                                                title="Valencia Store"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        id="wd-6350097003eae"
                                        className="wd-text-block wd-wpb reset-last-child wd-rs-6350097003eae text-left "
                                    >
                                        <p>1501 Valencia St, San Francisco, CA 94110</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="wpb_column vc_column_container vc_col-sm-6 vc_col-lg-3 vc_col-md-3 wd-rs-63778cf8a58b3">
                            <div className="vc_column-inner vc_custom_1668779264766">
                                <div className="wpb_wrapper">

                                    <div className="info-box-wrapper inline-element">
                                        <div
                                            id="wd-6380d4b93e561"
                                            className=" wd-rs-6380d4b93e561 wd-info-box wd-wpb text-left box-icon-align-right box-style- color-scheme- wd-bg-none wd-items-top vc_custom_1669387456657"
                                        >
                                            <div className="box-icon-wrapper  box-with-icon box-icon-simple">
                                                <div className="info-box-icon">
                                                    <div
                                                        className="info-svg-wrapper"
                                                        style={{ width: 24, height: 24 }}
                                                    >
                                                        <img
                                                            src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3C/svg%3E"
                                                            title="arrow-on-primary-circle"
                                                            width={24}
                                                            height={24}
                                                            data-lazy-src="art.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/arrow-on-primary-circle.svg"
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="info-box-content">
                                                <h4 className="info-box-title title box-title-style-default wd-fontsize-m">
                                                    Emeryville Store
                                                </h4>
                                                <div className="info-box-inner reset-last-child" />
                                            </div>
                                            <a
                                                className="wd-info-box-link wd-fill"
                                                aria-label="Infobox link"
                                                href="/"
                                                title="Alameda Store"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        id="wd-6350097ea9899"
                                        className="wd-text-block wd-wpb reset-last-child wd-rs-6350097ea9899 text-left "
                                    >
                                        <p>1034 36th St, Emeryville, CA 94608</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="wpb_column vc_column_container vc_col-sm-6 vc_col-lg-3 vc_col-md-3 wd-rs-63778d01f4178">
                            <div className="vc_column-inner vc_custom_1668779274593">
                                <div className="wpb_wrapper">

                                    <div className="info-box-wrapper inline-element">
                                        <div
                                            id="wd-6380d4c2b2d46"
                                            className=" wd-rs-6380d4c2b2d46 wd-info-box wd-wpb text-left box-icon-align-right box-style- color-scheme- wd-bg-none wd-items-top vc_custom_1669387465358"
                                        >
                                            <div className="box-icon-wrapper  box-with-icon box-icon-simple">
                                                <div className="info-box-icon">
                                                    <div
                                                        className="info-svg-wrapper"
                                                        style={{ width: 24, height: 24 }}
                                                    >
                                                        <img
                                                            src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3C/svg%3E"
                                                            title="arrow-on-primary-circle"
                                                            width={24}
                                                            height={24}
                                                            data-lazy-src="/assets/wp-content/uploads/sites/9/2022/10/arrow-on-primary-circle.svg"
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="info-box-content">
                                                <h4 className="info-box-title title box-title-style-default wd-fontsize-m">
                                                    Alameda Store
                                                </h4>
                                                <div className="info-box-inner reset-last-child" />
                                            </div>
                                            <a
                                                className="wd-info-box-link wd-fill"
                                                aria-label="Infobox link"
                                                href="/"
                                                title="Alameda Store"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        id="wd-6350098ecf551"
                                        className="wd-text-block wd-wpb reset-last-child wd-rs-6350098ecf551 text-left "
                                    >
                                        <p>1433 High St, Alameda, CA 94501</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="wpb_column vc_column_container vc_col-sm-12">
                            <div className="vc_column-inner">
                                <div className="wpb_wrapper">
                                    <div className="vc_separator wpb_content_element vc_separator_align_center vc_sep_width_100 vc_sep_pos_align_center vc_separator_no_text vc_custom_1669294977126">
                                        <span className="vc_sep_holder vc_sep_holder_l">
                                            <span
                                                style={{ borderColor: "rgba(0,0,0,0.1)" }}
                                                className="vc_sep_line"
                                            />
                                        </span>
                                        <span className="vc_sep_holder vc_sep_holder_r">
                                            <span
                                                style={{ borderColor: "rgba(0,0,0,0.1)" }}
                                                className="vc_sep_line"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="vc_row wpb_row vc_row-fluid">
                        <div className="wpb_column vc_column_container vc_col-sm-8 vc_col-lg-3 vc_col-md-3 wd-rs-63778d71e35d0">
                            <div className="vc_column-inner vc_custom_1668779382032">
                                <div className="wpb_wrapper">

                                    <div
                                        id="wd-6388ba0e775af"
                                        className="wd-image wd-wpb wd-rs-6388ba0e775af text-left vc_custom_1669904956863"
                                    >
                                        <a href="/">
                                            <img
                                                src="/assets/Images/Logo-3.png"
                                                title="mega-electronics-logo"
                                                width={200}
                                                height={34}
                                            />
                                        </a>
                                    </div>
                                    <div
                                        id="wd-63da1f80da70f"
                                        className="wd-text-block wd-wpb reset-last-child wd-rs-63da1f80da70f text-left vc_custom_1675239302223"
                                    >
                                        <p>
                                            Condimentum adipiscing vel neque dis nam parturient orci at
                                            scelerisque.
                                        </p>
                                    </div>
                                    <div
                                        id="wd-635014f5bcd69"
                                        className="wd-text-block wd-wpb reset-last-child wd-rs-635014f5bcd69 text-left wd-font-weight-500 color-title wd-fontsize-m font-primary vc_custom_1666192635650"
                                    >
                                        <p>Subscribe us</p>
                                    </div>
                                    <div
                                        id="true"
                                        className=" wd-rs-63516db187bb5 wd-social-icons vc_custom_1666280890277 wd-style-colored wd-size-small social-share wd-shape-circle text-left"
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
                        <div className="wpb_column vc_column_container vc_col-sm-4 vc_col-lg-2 vc_col-md-2 wd-rs-63778d6c0f98c">
                            <div className="vc_column-inner vc_custom_1668779376777">
                                <div className="wpb_wrapper">

                                    <div
                                        id="wd-63501cef7f4b2"
                                        className="wd-text-block wd-wpb reset-last-child wd-rs-63501cef7f4b2 text-left wd-font-weight-500 color-title wd-fontsize-m font-primary vc_custom_1666194678735"
                                    >
                                        <p>Categories</p>
                                    </div>
                                    <ul className="wd-sub-menu wd-rs-63501b62b7cc0 mega-menu-list wd-sub-accented wd-wpb">
                                        <li className="true">
                                            <a>
                                                <span className="nav-link-text"></span>
                                            </a>

                                            <ul className="sub-sub-menu">
                                                {products.map((product) => (
                                                    <li className="true" key={product.id}>
                                                        <a
                                                            href="#"
                                                            title="true"
                                                            onClick={(e) => {
                                                                e.preventDefault(); // Prevent default link behavior
                                                                handleProductClick(product.url); // Redirect to the product URL
                                                            }}
                                                        >
                                                            {product.name}
                                                        </a>
                                                    </li>
                                                ))}

                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="wpb_column vc_column_container vc_col-sm-4 vc_col-lg-2 vc_col-md-2 wd-rs-63778d598935d">
                            <div className="vc_column-inner vc_custom_1668779356225">
                                <div className="wpb_wrapper">

                                    <div
                                        id="wd-63501cff3c4b0"
                                        className="wd-text-block wd-wpb reset-last-child wd-rs-63501cff3c4b0 text-left wd-font-weight-500 color-title wd-fontsize-m font-primary vc_custom_1666194692241"
                                    >
                                        <p>Useful Links</p>
                                    </div>
                                    <ul className="wd-sub-menu wd-rs-63501cfb2e16d mega-menu-list wd-sub-accented wd-wpb">
                                        <li className="true">
                                            <a>
                                                <span className="nav-link-text"></span>
                                            </a>
                                            <ul className="sub-sub-menu">
                                                <li className="true">
                                                    <a
                                                        href="/home/AboutUs"
                                                        title="About Us"
                                                    >
                                                        About Us
                                                    </a>
                                                </li>
                                                <li className="true">
                                                    <a
                                                        href="/home/terms-and-policy"
                                                        title="Terms & Condition"
                                                    >
                                                        Terms & Condition
                                                    </a>
                                                </li>
                                                <li className="true">
                                                    <a
                                                        href="/home/privacy-policy"
                                                        title="Privacy Policy"
                                                    >
                                                        Privacy Policy
                                                    </a>
                                                </li>
                                                <li className="true">
                                                    <a
                                                        href="/home/refund-and-cancellation"
                                                        title="Refund & Cancellation Policy"
                                                    >
                                                        Refund & Cancellation Policy
                                                    </a>
                                                </li>
                                                <li className="true">
                                                    <a
                                                        href="/home/FAQ"
                                                        title="FAQ"
                                                    >
                                                        FAQ
                                                    </a>
                                                </li>

                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="wpb_column vc_column_container vc_col-sm-4 vc_col-lg-2 vc_col-md-2 wd-rs-63778d53277cd">
                            <div className="vc_column-inner vc_custom_1668779351601">
                                <div className="wpb_wrapper">

                                    <div
                                        id="wd-63501d0614f13"
                                        className="wd-text-block wd-wpb reset-last-child wd-rs-63501d0614f13 text-left wd-font-weight-500 color-title wd-fontsize-m font-primary vc_custom_1666194698611"
                                    >
                                        <p>Contact Us</p>
                                    </div>
                                    <ul className="wd-sub-menu wd-rs-63501cfb2e16d mega-menu-list wd-sub-accented wd-wpb">
                                        <li className="true">
                                            <a>
                                                <span className="nav-link-text"></span>
                                            </a>
                                            <ul className="sub-sub-menu">
                                                <li className="true">
                                                    <a
                                                        href="/"
                                                        title="Blog"
                                                    >
                                                        Blog
                                                    </a>
                                                </li>
                                                <li className="true">
                                                    <a
                                                        href="/home/ourContact"
                                                        title="Our Contacts"
                                                    >
                                                        Our contacts
                                                    </a>
                                                </li>
                                                {/* <li className="true">
                                                    <a
                                                        href="/"
                                                        title="Promotions"
                                                    >
                                                        Promotions
                                                    </a>
                                                </li> */}
                                                <li className="true">
                                                    <a title="true">
                                                        Stores
                                                    </a>
                                                </li>
                                                <li className="true">
                                                    <a
                                                        href="/"
                                                        title="Delivery & Return"
                                                    >
                                                        Delivery &amp; Return
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="wpb_column vc_column_container vc_col-sm-4 vc_col-lg-3 vc_col-md-3 wd-rs-63778d45672c0">
                            <div className="vc_column-inner vc_custom_1668779344705">
                                <div className="wpb_wrapper">
                                    <div
                                        id="wd-63da1fbd0652e"
                                        className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-63da1fbd0652e wd-title-color-default wd-title-style-default text-left vc_custom_1675239361486 wd-underline-colored"
                                    >
                                        <div className="liner-continer">
                                            <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-m">
                                                Download App on Mobile:
                                            </h4>
                                        </div>
                                        <div className="title-after_title reset-last-child  wd-fontsize-xs">
                                            15% discount on your first purchase
                                        </div>
                                    </div>
                                    <div
                                        id="wd-63501c7aafa28"
                                        className="wd-image wd-wpb wd-rs-63501c7aafa28 text-left vc_custom_1666194559103 inline-element"
                                    >
                                        <a >
                                            <img
                                                src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20135%2040'%3E%3C/svg%3E"
                                                title="google-play"
                                                width={135}
                                                height={40}
                                                data-lazy-src="/assets/wp-content/uploads/sites/9/2022/10/google-play.svg"
                                            />
                                            {/* <noscript>
                                                &lt;img
                                                src="/assets/wp-content/uploads/sites/9/2022/10/google-play.svg"
                                                title="google-play" loading="lazy" width="135"
                                                height="40"&gt;
                                            </noscript> */}
                                        </a>
                                    </div>
                                    <div
                                        id="wd-63501c7f1bd96"
                                        className="wd-image wd-wpb wd-rs-63501c7f1bd96 text-left vc_custom_1666194562939 inline-element"
                                    >
                                        <a >
                                            <img
                                                src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20120%2040'%3E%3C/svg%3E"
                                                title="app-store"
                                                width={120}
                                                height={40}
                                                data-lazy-src="/assets/wp-content/uploads/sites/9/2022/10/app-store.svg"
                                            />
                                            {/* <noscript>
                                                &lt;img
                                                src="/assets/wp-content/uploads/sites/9/2022/10/app-store.svg"
                                                title="app-store" loading="lazy" width="120" height="40"&gt;
                                            </noscript> */}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="wd-copyrights copyrights-wrapper wd-layout-two-columns">
                <div className="container wd-grid-g">
                    <div className="wd-col-start reset-last-child">
                        <small>
                            <a href="/home">
                                <strong>GetPixelSecurity</strong>
                            </a>
                            © 2025 CREATED BY
                            <a href="/">
                                <strong> JetQuins Travel</strong>
                            </a>
                            . PREMIUM E-COMMERCE SOLUTIONS.
                        </small>
                    </div>
                    <div className="wd-col-end reset-last-child">

                    </div>
                </div>
            </div>
        </footer>

    </>
}

export default Footer;