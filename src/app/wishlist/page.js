"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const wishlist = () => {

    const [wishlist, setWishlist] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const router = useRouter();

    // Fetch wishlist data from localStorage when the component mounts
    useEffect(() => {
        // Get wishlist data from localStorage
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlist(savedWishlist);
    }, []);

    console.log(wishlist, "Wishlist");

    const handleRemoveFromWishlist = (productId) => {
        const updatedWishlist = wishlist.filter(item => item.product_id !== productId);
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };

    const openCart = (e) => {
        e.preventDefault();

        setIsCartOpen(true);
    };

    // Function to close the modal
    const closeCart = () => {
        setIsCartOpen(false);
    };

    const handleCheckout = () => {
        router.push('/checkout');
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
                            className="entry-content post-30 page type-page status-publish hentry"
                            id="post-30"
                        >
                            <div className="">
                                {wishlist.map((offer, index) => (
                                    <div className="wd-wishlist-content" key={index}>
                                        <link
                                            href="https://woodmart.xtemos.com/mega-electronics/wp-content/themes/woodmart/css/parts/woo-page-wishlist-bulk.min.css?ver=8.0.4"
                                            id="wd-page-wishlist-bulk-css"
                                            media="all"
                                            rel="stylesheet"
                                            type="text/css"
                                        />
                                        <div className="wd-wishlist-head">
                                            <h4 className="title">
                                                Your products wishlist
                                            </h4>
                                        </div>
                                        <div className="wd-wishlist-bulk-action">
                                            <div className="wd-wishlist-remove-action wd-action-btn wd-style-text wd-cross-icon">
                                                <a  onClick={(e) => handleRemoveFromWishlist(offer.product_id)}>
                                                    Remove
                                                </a>
                                            </div>
                                            <div className="wd-wishlist-select-all wd-action-btn wd-style-text">
                                                <a >
                                                    <span className="wd-wishlist-text-select">
                                                        Select all
                                                    </span>
                                                    <span className="wd-wishlist-text-deselect">
                                                        Deselect all
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                        {/* <link
                                        href="https://woodmart.xtemos.com/mega-electronics/wp-content/themes/woodmart/css/parts/woo-opt-products-bg.min.css?ver=8.0.4"
                                        id="wd-woo-opt-products-bg-css"
                                        media="all"
                                        rel="stylesheet"
                                        type="text/css"
                                    /> */}
                                        <div
                                            className="wd-products-element wd-wpb"
                                            id=""
                                        >
                                            <div
                                                className="products wd-products  grid-columns-3 elements-grid pagination-links wd-grid-g title-line-one wd-stretch-cont-lg wd-products-with-bg"
                                                data-atts="{&quot;post_type&quot;:&quot;ids&quot;,&quot;include&quot;:&quot;872&quot;,&quot;pagination&quot;:&quot;links&quot;,&quot;items_per_page&quot;:&quot;12&quot;,&quot;columns&quot;:&quot;3&quot;,&quot;products_bordered_grid&quot;:&quot;0&quot;,&quot;products_with_background&quot;:&quot;1&quot;,&quot;products_shadow&quot;:&quot;0&quot;,&quot;force_not_ajax&quot;:&quot;no&quot;,&quot;products_masonry&quot;:&quot;disable&quot;,&quot;products_different_sizes&quot;:&quot;disable&quot;,&quot;query_post_type&quot;:[&quot;product&quot;,&quot;product_variation&quot;],&quot;is_wishlist&quot;:&quot;yes&quot;}"
                                                data-columns="3"
                                                data-grid-gallery="{&quot;grid_gallery&quot;:&quot;1&quot;,&quot;grid_gallery_control&quot;:&quot;hover&quot;,&quot;grid_gallery_enable_arrows&quot;:&quot;arrows&quot;}"
                                                data-paged="1"
                                                data-source="shortcode"
                                                style={{
                                                    '--wd-col-lg': '3',
                                                    '--wd-col-md': '3',
                                                    '--wd-col-sm': '2',
                                                    '--wd-gap-lg': '20px',
                                                    '--wd-gap-sm': '10px'
                                                }}
                                            >
                                                <div
                                                    className="wd-product wd-with-labels wd-hover-fw-button wd-hover-with-fade wd-col product-grid-item product type-product post-872 status-publish instock product_cat-office-pcs has-post-thumbnail featured shipping-taxable purchasable product-type-simple hover-ready"
                                                    data-id="872"
                                                    data-loop="1"
                                                >
                                                    <div className="wd-wishlist-product-actions">
                                                        <div className="wd-wishlist-product-remove wd-action-btn wd-style-text wd-cross-icon">
                                                            <a
                                                                className="wd-wishlist-remove"
                                                                data-product-id="872"
                                                                
                                                                onClick={(e) => handleRemoveFromWishlist(offer.product_id)}
                                                            >
                                                                Remove
                                                            </a>
                                                        </div>
                                                        <div className="wd-wishlist-product-checkbox">
                                                            <input
                                                                className="wd-wishlist-checkbox"
                                                                data-product-id="872"
                                                                type="checkbox"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="product-wrapper">
                                                        <div
                                                            className="content-product-imagin"
                                                            style={{
                                                                marginBottom: '-112px'
                                                            }}
                                                        />
                                                        <div className="product-element-top wd-quick-shop">
                                                            <a className="product-image-link" href={offer.product_url}>
                                                                <div className="wd-product-grid-slider wd-fill">
                                                                    {offer.image_urls.map((url, imageIndex) => (
                                                                        <div
                                                                            className="wd-product-grid-slide"
                                                                            key={imageIndex}
                                                                            data-image-url={url}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <div className="wd-product-grid-slider-nav wd-fill wd-hover-enabled">
                                                                    <div className="wd-prev" />
                                                                    <div className="wd-next" />
                                                                </div>
                                                                <div className="wd-product-grid-slider-pagin">
                                                                    {offer.image_urls.map((_, imageIndex) => (
                                                                        <div
                                                                            className={`wd-product-grid-slider-dot ${imageIndex === 0 ? "wd-active" : ""
                                                                                }`}
                                                                            data-image-id={imageIndex}
                                                                            key={imageIndex}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <div className="product-labels labels-rounded-sm">
                                                                    {offer.labels.map((label, index) => (
                                                                        <span className="featured product-label" key={index}>
                                                                            {label}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                {/* {offer.image_urls.map((url, imageIndex) => (
                                                                    <picture
                                                                        className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                                                                        key={imageIndex}
                                                                        decoding="async"
                                                                    >
                                                                        <source
                                                                            sizes="(max-width: 430px) 100vw, 430px"
                                                                            srcSet={`${url} 700w, ${url.replace(
                                                                                ".jpg",
                                                                                "-263x300.jpg"
                                                                            )} 263w, ${url.replace(".jpg", "-88x100.jpg")} 88w, ${url.replace(
                                                                                ".jpg",
                                                                                "-180x206.jpg"
                                                                            )} 180w, ${url.replace(".jpg", "-430x491.jpg")} 430w`}
                                                                            type="image/webp"
                                                                        />
                                                                        <img
                                                                            alt="Product Image"
                                                                            decoding="async"
                                                                            height="491"
                                                                            sizes="(max-width: 430px) 100vw, 430px"
                                                                            src={url}
                                                                            srcSet={`${url} 700w, ${url.replace(
                                                                                ".jpg",
                                                                                "-263x300.jpg"
                                                                            )} 263w, ${url.replace(".jpg", "-88x100.jpg")} 88w, ${url.replace(
                                                                                ".jpg",
                                                                                "-180x206.jpg"
                                                                            )} 180w, ${url.replace(".jpg", "-430x491.jpg")} 430w`}
                                                                            width="430"
                                                                        />
                                                                    </picture>
                                                                ))} */}
                                                            </a>
                                                            <div className="wd-buttons wd-pos-r-t">
                                                                <div className="wd-compare-btn product-compare-button wd-action-btn wd-style-icon wd-compare-icon">
                                                                    <a
                                                                        data-added-text="Compare products"
                                                                        data-id={offer.product_id}
                                                                        href={`https://your-site.com/compare/?product_id=${offer.product_id}`}
                                                                        rel="nofollow"
                                                                    >
                                                                        <span>Compare</span>
                                                                    </a>
                                                                </div>
                                                                <div className="quick-view wd-action-btn wd-style-icon wd-quick-view-icon">
                                                                    <a
                                                                        className="open-quick-view quick-view-button"
                                                                        data-id={offer.product_id}
                                                                        href={offer.product_url}
                                                                        rel="nofollow"
                                                                    >
                                                                        Quick view
                                                                    </a>
                                                                </div>
                                                                <div className="wd-wishlist-btn wd-action-btn wd-style-icon wd-wishlist-icon">
                                                                    <a
                                                                        className=""
                                                                        data-added-text="Browse Wishlist"
                                                                        data-key={offer.wishlist_key}
                                                                        data-product-id={offer.product_id}
                                                                        href="https://your-site.com/wishlist/"
                                                                        rel="nofollow"
                                                                    >
                                                                        <span>Add to wishlist</span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="product-element-bottom">
                                                            <h3 className="wd-entities-title">
                                                                <a href="https://woodmart.xtemos.com/mega-electronics/product/acer-conceptd-ct300/">
                                                                    ACER ConceptD CT300
                                                                </a>
                                                            </h3>
                                                            <div className="wd-product-cats">
                                                                <a
                                                                    href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/pcs/office-pcs/"
                                                                    rel="tag"
                                                                >
                                                                    Office PCs
                                                                </a>
                                                            </div>
                                                            <div
                                                                aria-label="Rated 5.00 out of 5"
                                                                className="star-rating"
                                                                role="img"
                                                            >
                                                                <span
                                                                    style={{
                                                                        width: '100%'
                                                                    }}
                                                                >
                                                                    Rated{' '}
                                                                    <strong className="rating">
                                                                        5.00
                                                                    </strong>
                                                                    {' '}out of 5
                                                                </span>
                                                            </div>
                                                            <p className="wd-product-stock stock wd-style-default in-stock">
                                                                In stock
                                                            </p>
                                                            <div className="wrap-price">
                                                                <span className="price">
                                                                    <span className="woocommerce-Price-amount amount">
                                                                        <bdi>
                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                $
                                                                            </span>
                                                                            1,199.00
                                                                        </bdi>
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <div className="wd-add-btn wd-add-btn-replace" onClick={openCart}>
                                                                <a
                                                                    aria-describedby="woocommerce_loop_add_to_cart_link_describedby_872"
                                                                    aria-label="Add to cart: “ACER ConceptD CT300”"
                                                                    className="button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-loop"
                                                                    data-product_id="872"
                                                                    data-product_sku="30944"
                                                                    data-quantity="1"
                                                                    href="?add-to-cart=872"
                                                                    rel="nofollow"
                                                                >
                                                                    <span>
                                                                        Add to cart
                                                                    </span>
                                                                </a>
                                                                <span
                                                                    className="screen-reader-text"
                                                                    id="woocommerce_loop_add_to_cart_link_describedby_872"
                                                                >
                                                                </span>
                                                            </div>
                                                            <div className="wd-product-detail wd-product-sku">
                                                                <span className="wd-label">
                                                                    SKU:
                                                                </span>
                                                                <span>
                                                                    30944
                                                                </span>
                                                            </div>
                                                            {/* Add Some Code */}
                                                            <div className="fade-in-block wd-scroll">
                                                                <div className="hover-content-wrap">
                                                                    <div className="hover-content wd-more-desc">
                                                                        <div className="hover-content-inner wd-more-desc-inner">
                                                                            <table
                                                                                aria-label="Product Details"
                                                                                className="woocommerce-product-attributes shop_attributes"
                                                                            >
                                                                                <tbody>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_brand">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Brand
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    Acer
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_model">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Model
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    ConceptD CT300
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_color">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Color
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    White
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_operating-system">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Operating system
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    Windows 11
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_processor">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Processor
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    Intel Core i7
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_number-of-processor-cores">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Number of processor cores
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    8-core
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_ram">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    RAM
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    16GB
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_type-of-ram">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Type of RAM
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    DDR4
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_storage">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Storage
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    512GB SSD
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_graphics">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Graphics
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    Discreet
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_graphics-series">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Graphics series
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    NVIDIA RTX 3070
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_wi-fi">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Wi-Fi
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    Wi-Fi 6
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_ethernet">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Ethernet
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    Gigabit Ethernet
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_bluetooth">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Bluetooth
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    Bluetooth 5.0
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_usb">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    USB
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    USB 2.0 x 4
                                                                                                </p>
                                                                                            </span>
                                                                                            ,{' '}
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    USB 3.0 x 2
                                                                                                </p>
                                                                                            </span>
                                                                                            ,{' '}
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    USB 3.1 x 2
                                                                                                </p>
                                                                                            </span>
                                                                                            ,{' '}
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    USB Type-C x 1
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_video-connections">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Video connections
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    DisplayPort 1.4 x 1
                                                                                                </p>
                                                                                            </span>
                                                                                            ,{' '}
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    DVI-D x 1
                                                                                                </p>
                                                                                            </span>
                                                                                            ,{' '}
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    HDMI 2.0 x 1
                                                                                                </p>
                                                                                            </span>
                                                                                            ,{' '}
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    HDMI x 1
                                                                                                </p>
                                                                                            </span>
                                                                                            ,{' '}
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    Thunderbolt 4×3
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_audio-connections">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Audio connections
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    3.5 мм mini-jack
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_weight">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Weight
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    6.31 kg
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_demensions">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Demensions
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    337 x 155 x 297.3 mm
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_material">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Material
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    Metal
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_manufacturer-guarantee">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Manufacturer guarantee
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    12 months
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_release-years">
                                                                                        <th
                                                                                            className="woocommerce-product-attributes-item__label"
                                                                                            scope="row"
                                                                                        >
                                                                                            <span className="wd-attr-name">
                                                                                                <span className="wd-attr-name-label">
                                                                                                    Release years
                                                                                                </span>
                                                                                            </span>
                                                                                        </th>
                                                                                        <td className="woocommerce-product-attributes-item__value">
                                                                                            <span className="wd-attr-term">
                                                                                                <p>
                                                                                                    2021
                                                                                                </p>
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                        <a
                                                                            aria-label="Read more description"
                                                                            className="wd-more-desc-btn"
                                                                            
                                                                            rel="nofollow"
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
                                ))}

                            </div>
                        </article>
                    </div>
                </main>
            </div>


            {/* Cart Modal */}

            {isCartOpen && (<div className="cart-widget-side wd-side-hidden wd-right wd-opened">
                <div className="wd-heading">
                    <span className="title">Shopping cart</span>
                    <div className="close-side-widget wd-action-btn wd-style-text wd-cross-icon">
                        <a  rel="nofollow" onClick={closeCart}>
                            Close
                        </a>
                    </div>
                </div>
                <div className="widget woocommerce widget_shopping_cart">
                    <div className="widget_shopping_cart_content">
                        <div className="shopping-cart-widget-body wd-scroll">
                            <div className="wd-scroll-content">
                                <ul className="cart_list product_list_widget woocommerce-mini-cart ">
                                    <li
                                        className="woocommerce-mini-cart-item mini_cart_item"
                                        data-key="b1301141feffabac455e1f90a7de2054"
                                    >
                                        <a
                                            href="https://woodmart.xtemos.com/mega-electronics/product/oculus-quest-2/"
                                            className="cart-item-link wd-fill"
                                        >
                                            Show
                                        </a>
                                        <a
                                            href="https://woodmart.xtemos.com/mega-electronics/cart/?remove_item=b1301141feffabac455e1f90a7de2054&_wpnonce=ee462b7815"
                                            className="remove remove_from_cart_button"
                                            aria-label="Remove Oculus Quest 2 from cart"
                                            data-product_id={2435}
                                            data-cart_item_key="b1301141feffabac455e1f90a7de2054"
                                            data-product_sku={608069}
                                            data-success_message="“Oculus Quest 2” has been removed from your cart"
                                        >
                                            ×
                                        </a>{" "}
                                        <a
                                            href="https://woodmart.xtemos.com/mega-electronics/product/oculus-quest-2/"
                                            className="cart-item-image"
                                        >
                                            <img
                                                width={430}
                                                height={491}
                                                src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/oculus-quest-2-1-430x491.jpg"
                                                className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                                                alt=""
                                                decoding="async"
                                                srcSet="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/oculus-quest-2-1-430x491.jpg 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/oculus-quest-2-1-263x300.jpg 263w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/oculus-quest-2-1-88x100.jpg 88w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/oculus-quest-2-1-180x206.jpg 180w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/oculus-quest-2-1.jpg 700w"
                                                sizes="(max-width: 430px) 100vw, 430px"
                                            />{" "}
                                        </a>
                                        <div className="cart-info">
                                            <span className="wd-entities-title">Oculus Quest 2 </span>
                                            <div className="wd-product-detail wd-product-sku">
                                                <span className="wd-label">SKU: </span>
                                                <span>608069 </span>
                                            </div>
                                            <div className="quantity">
                                                <input type="button" defaultValue="-" className="minus btn" />
                                                <label
                                                    className="screen-reader-text"
                                                    htmlFor="quantity_6784e22dca593"
                                                >
                                                    Oculus Quest 2 quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    id="quantity_6784e22dca593"
                                                    className="input-text qty text"
                                                    defaultValue={5}
                                                    aria-label="Product quantity"
                                                    min={0}
                                                    max=""
                                                    name="cart[b1301141feffabac455e1f90a7de2054][qty]"
                                                    step={1}
                                                    placeholder=""
                                                    inputMode="numeric"
                                                    autoComplete="off"
                                                />
                                                <input type="button" defaultValue="+" className="plus btn" />
                                            </div>
                                            <span className="quantity">
                                                5 ×{" "}
                                                <span className="woocommerce-Price-amount amount">
                                                    <bdi>
                                                        <span className="woocommerce-Price-currencySymbol">
                                                            $
                                                        </span>
                                                        449.00
                                                    </bdi>
                                                </span>
                                            </span>{" "}
                                        </div>
                                    </li>
                                    <li
                                        className="woocommerce-mini-cart-item mini_cart_item"
                                        data-key="26e359e83860db1d11b6acca57d8ea88"
                                    >
                                        <a
                                            href="https://woodmart.xtemos.com/mega-electronics/product/asus-zenbook-oled-13/"
                                            className="cart-item-link wd-fill"
                                        >
                                            Show
                                        </a>
                                        <a
                                            href="https://woodmart.xtemos.com/mega-electronics/cart/?remove_item=26e359e83860db1d11b6acca57d8ea88&_wpnonce=ee462b7815"
                                            className="remove remove_from_cart_button"
                                            aria-label="Remove ASUS ZenBook OLED 13 from cart"
                                            data-product_id={298}
                                            data-cart_item_key="26e359e83860db1d11b6acca57d8ea88"
                                            data-product_sku={30884}
                                            data-success_message="“ASUS ZenBook OLED 13” has been removed from your cart"
                                        >
                                            ×
                                        </a>{" "}
                                        <a
                                            href="https://woodmart.xtemos.com/mega-electronics/product/asus-zenbook-oled-13/"
                                            className="cart-item-image"
                                        >
                                            <img
                                                width={430}
                                                height={491}
                                                src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/asus-zenbook-oled-13-1-430x491.jpg"
                                                className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                                                alt=""
                                                decoding="async"
                                                srcSet="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/asus-zenbook-oled-13-1-430x491.jpg 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/asus-zenbook-oled-13-1-263x300.jpg 263w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/asus-zenbook-oled-13-1-88x100.jpg 88w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/asus-zenbook-oled-13-1-180x206.jpg 180w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/asus-zenbook-oled-13-1.jpg 700w"
                                                sizes="(max-width: 430px) 100vw, 430px"
                                            />{" "}
                                        </a>
                                        <div className="cart-info">
                                            <span className="wd-entities-title">ASUS ZenBook OLED 13 </span>
                                            <div className="wd-product-detail wd-product-sku">
                                                <span className="wd-label">SKU: </span>
                                                <span>30884 </span>
                                            </div>
                                            <div className="quantity">
                                                <input type="button" defaultValue="-" className="minus btn" />
                                                <label
                                                    className="screen-reader-text"
                                                    htmlFor="quantity_6784e22dcaabe"
                                                >
                                                    ASUS ZenBook OLED 13 quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    id="quantity_6784e22dcaabe"
                                                    className="input-text qty text"
                                                    defaultValue={2}
                                                    aria-label="Product quantity"
                                                    min={0}
                                                    max=""
                                                    name="cart[26e359e83860db1d11b6acca57d8ea88][qty]"
                                                    step={1}
                                                    placeholder=""
                                                    inputMode="numeric"
                                                    autoComplete="off"
                                                />
                                                <input type="button" defaultValue="+" className="plus btn" />
                                            </div>
                                            <span className="quantity">
                                                2 ×{" "}
                                                <span className="woocommerce-Price-amount amount">
                                                    <bdi>
                                                        <span className="woocommerce-Price-currencySymbol">
                                                            $
                                                        </span>
                                                        1,600.00
                                                    </bdi>
                                                </span>
                                            </span>{" "}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="shopping-cart-widget-footer">
                            <p className="woocommerce-mini-cart__total total">
                                <strong>Subtotal:</strong>{" "}
                                <span className="woocommerce-Price-amount amount">
                                    <bdi>
                                        <span className="woocommerce-Price-currencySymbol">$</span>
                                        5,445.00
                                    </bdi>
                                </span>{" "}
                            </p>
                            <div className="wd-progress-bar wd-free-progress-bar">
                                <div className="progress-msg">
                                    Your order qualifies for free shipping!{" "}
                                </div>
                                <div className="progress-area">
                                    <div className="progress-bar" style={{ width: "100%" }} />
                                </div>
                            </div>
                            <p className="woocommerce-mini-cart__buttons buttons">
                                <a
                                    href="/cart"
                                    className="button btn-cart wc-forward"
                                >
                                    View cart
                                </a>
                                <a
                                    href="/checkout"
                                    className="button checkout wc-forward"
                                    onClick={handleCheckout}
                                >
                                    Checkout
                                </a>
                            </p>
                        </div>
                    </div>
                </div>{" "}
            </div>)}
        </>
    )
}
export default wishlist;