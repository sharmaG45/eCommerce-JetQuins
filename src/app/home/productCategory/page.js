'use client';

import bestOffer from "../../assets/scraped_products.json";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const smartPhone = () => {

    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const fetchAndFilter = () => {
            const title = searchParams.get('title');
            console.log('Title from URL:', title);
            console.log('Best Offer Data:', bestOffer);

            if (title) {
                const filtered = bestOffer.filter((product) => {

                    if (!product.brand) {
                        console.log('Missing brand data for product:', product);
                        return false;
                    }
                    const matchesBrand = product.brand.toLowerCase().includes(title.toLowerCase());
                    return matchesBrand;
                });

                console.log('Filtered Products:', filtered);
                setFilteredProducts(filtered);
            } else {
                setFilteredProducts(bestOffer);
            }

            setProducts(bestOffer);
        };

        fetchAndFilter();
    }, [searchParams]);

    console.log(filteredProducts, "Filter Data");


    return (
        <>
            <div className="wd-page-content main-page-wrapper">
                <main
                    className="wd-content-layout content-layout-wrapper container wd-builder-on wd-sidebar-hidden-sm"
                    role="main">
                    <div className="wd-content-area site-content entry-content">
                        <style
                            dangerouslySetInnerHTML={{
                                __html:
                                    ".vc_custom_1672241838724{margin-top: -20px !important;margin-bottom: 20px !important;}.vc_custom_1672326631913{margin-right: -10px !important;margin-bottom: 60px !important;margin-left: -10px !important;}.vc_custom_1648030749279{padding-top: 0px !important;}.vc_custom_1692774265909{margin-bottom: 5px !important;}.vc_custom_1653978669797{margin-bottom: 5px !important;}.vc_custom_1668698917507{margin-top: 15px !important;margin-bottom: 0px !important;padding-top: 20px !important;padding-right: 20px !important;padding-bottom: 20px !important;padding-left: 20px !important;background-color: #ffffff !important;border-radius: 10px !important;}.vc_custom_1672326769003{padding-right: 10px !important;padding-left: 10px !important;}.vc_custom_1694175532071{padding-top: 0px !important;padding-right: 10px !important;padding-left: 10px !important;}.vc_custom_1672326988957{margin-bottom: 0px !important;padding-top: 30px !important;padding-right: 15px !important;padding-bottom: 30px !important;padding-left: 15px !important;background-color: #ffffff !important;border-radius: 10px !important;}.vc_custom_1669293421553{margin-bottom: 20px !important;padding-top: 20px !important;padding-right: 0px !important;padding-bottom: 20px !important;padding-left: 0px !important;}.vc_custom_1645450529811{margin-bottom: 15px !important;}.vc_custom_1669130241411{padding-top: 0px !important;}.vc_custom_1672326891222{padding-top: 0px !important;}.vc_custom_1666353633027{margin-bottom: 0px !important;}.vc_custom_1649771534702{margin-right: 20px !important;margin-bottom: 0px !important;}.vc_custom_1653977959986{margin-right: 20px !important;margin-bottom: 0px !important;}.vc_custom_1672323410866{margin-right: 20px !important;margin-bottom: 0px !important;}.vc_custom_1674220707815{margin-bottom: 0px !important;}.wd-rs-623af418065b0 > .vc_column-inner > .wpb_wrapper{align-items: center;justify-content: space-between}.wd-rs-64e5af7632452{width: auto !important;max-width: auto !important;}.wd-rs-6295b629d0df4{width: auto !important;max-width: auto !important;}.wd-rs-6376531caf4d0{--wd-cat-img-width: 100px;}.wd-rs-6376531caf4d0 div.product-category .wd-entities-title, .wd-rs-6376531caf4d0 .wd-nav-product-cat>li>a{font-size: 16px;text-transform: capitalize;}.wd-rs-637ce7ffc0800 > .vc_column-inner > .wpb_wrapper{align-items: center;justify-content: flex-start}.wd-rs-63adaedf92008 > .vc_column-inner > .wpb_wrapper{align-items: center;justify-content: flex-end}.wd-rs-635289c806692 .title{font-size: 26px;}.wd-rs-625583ff5f76a{width: auto !important;max-width: auto !important;}.wd-rs-6295b3632e35b{width: auto !important;max-width: auto !important;}.wd-rs-63ada14c1f7ed{width: auto !important;max-width: auto !important;}.wd-rs-63ca949f87745{width: auto !important;max-width: auto !important;}@media (max-width: 1199px) { .wd-rs-63adaedf92008 > .vc_column-inner > .wpb_wrapper{justify-content: space-between}.wd-rs-635289c806692 .title{font-size: 24px;} }@media (max-width: 767px) { .wd-rs-63adaedf92008 > .vc_column-inner > .wpb_wrapper{justify-content: space-between}.wd-rs-635289c806692 .title{font-size: 22px;} }@media (max-width: 1199px) {.website-wrapper .wd-rs-63ac62970ef1e{margin-bottom:5px !important;}.website-wrapper .wd-rs-63adade1da04b{margin-bottom:40px !important;}.website-wrapper .wd-rs-63adae5e319ea > .vc_column-inner{margin-right:0px !important;margin-left:0px !important;}.website-wrapper .wd-rs-63adaf4745fc3{padding-right:5px !important;padding-left:5px !important;}.website-wrapper .wd-rs-637f656807e9b{padding-top:10px !important;padding-bottom:10px !important;}.website-wrapper .wd-rs-637ce7ffc0800 > .vc_column-inner{margin-bottom:10px !important;}}@media (max-width: 767px) {.website-wrapper .wd-rs-63ac62970ef1e{margin-bottom:0px !important;}.website-wrapper .wd-rs-63adade1da04b{margin-bottom:20px !important;}}",
                            }}
                            data-type="vc_shortcodes-custom-css"
                        />
                        <div className="wpb-content-wrapper">
                            {/* <div className="vc_row wpb_row vc_row-fluid vc_custom_1672241838724 wd-rs-63ac62970ef1e">
                                <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-623af418065b0">
                                    <div className="vc_column-inner vc_custom_1648030749279">
                                        <div className="wpb_wrapper">
                                            <div className="wd-el-breadcrumbs wd-wpb wd-rs-64e5af7632452 wd-enabled-width vc_custom_1692774265909 wd-nowrap-md text-left">
                                                <nav
                                                    aria-label="Breadcrumb"
                                                    className="wd-breadcrumbs woocommerce-breadcrumb">
                                                    <span className="" typeof="v:Breadcrumb">
                                                        <a
                                                            href="https://woodmart.xtemos.com/mega-electronics"
                                                            property="v:title"
                                                            rel="v:url">
                                                            Home
                                                        </a>
                                                    </span>
                                                    <span className="wd-delimiter" />
                                                    <span className="" typeof="v:Breadcrumb">
                                                        <a
                                                            href="https://woodmart.xtemos.com/mega-electronics/product-category/smartphones/"
                                                            property="v:title"
                                                            rel="v:url">
                                                            Smartphones
                                                        </a>
                                                    </span>
                                                    <span className="wd-delimiter" />
                                                    <span className=" wd-last-link" typeof="v:Breadcrumb">
                                                        <a
                                                            href="https://woodmart.xtemos.com/mega-electronics/product-category/smartphones/mobile-phones/"
                                                            property="v:title"
                                                            rel="v:url">
                                                            Mobile phones
                                                        </a>
                                                    </span>
                                                    <span className="wd-delimiter" />
                                                    <span className="wd-last">Apple iPhone</span>
                                                </nav>
                                            </div>
                                            <div className="wd-shop-result-count wd-wpb wd-rs-6295b629d0df4 hidden-md hidden-sm hidden-xs wd-enabled-width vc_custom_1653978669797">
                                                <p className="woocommerce-result-count">
                                                    Showing all 8 results
                                                </p>
                                            </div>
                                            <div className="wd-shop-desc wd-wpb wd-rs-6352873b64114 text-left" />
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="vc_row wpb_row vc_row-fluid vc_custom_1672326631913 wd-rs-63adade1da04b">
                                <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-12 wd-col-content-md-sm wd-col-content-sm wd-alignment-left wd-rs-64fb1122efc8b">
                                    <div className="vc_column-inner vc_custom_1694175532071">
                                        <div className="wpb_wrapper">
                                            <div className="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1669293421553 vc_row-o-content-middle vc_row-flex wd-rs-637f656807e9b">
                                                <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-4 wd-enabled-flex wd-rs-637ce7ffc0800">
                                                    <div className="vc_column-inner vc_custom_1669130241411">
                                                        <div className="wpb_wrapper">
                                                            <div className="wd-woo-page-title wd-wpb wd-rs-635289c806692 vc_custom_1666353633027 text-left">
                                                                <h1 className="entry-title title">Apple iPhone</h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-8 wd-enabled-flex wd-rs-63adaedf92008">
                                                    <div className="vc_column-inner vc_custom_1672326891222">
                                                        <div className="wpb_wrapper">
                                                            <div className="wd-wpb wd-rs-625583ff5f76a hidden-lg wd-enabled-width vc_custom_1649771534702">
                                                                <div className="wd-off-canvas-btn wd-action-btn wd-style-text wd-burger-icon">
                                                                    <a  rel="nofollow">
                                                                        Show sidebar
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div className="wd-shop-prod-per-page wd-wpb wd-rs-6295b3632e35b hidden-md hidden-sm hidden-xs wd-enabled-width vc_custom_1653977959986">
                                                                <div className="wd-products-per-page">
                                                                    <span className="wd-label per-page-title">
                                                                        Show
                                                                    </span>
                                                                    <a
                                                                        className="per-page-variation"
                                                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/smartphones/mobile-phones/apple-iphone/?per_page=9"
                                                                        rel="nofollow noopener">
                                                                        <span>9</span>
                                                                    </a>
                                                                    <span className="per-page-border" />
                                                                    <a
                                                                        className="per-page-variation current-variation"
                                                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/smartphones/mobile-phones/apple-iphone/?per_page=12"
                                                                        rel="nofollow noopener">
                                                                        <span>12</span>
                                                                    </a>
                                                                    <span className="per-page-border" />
                                                                    <a
                                                                        className="per-page-variation"
                                                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/smartphones/mobile-phones/apple-iphone/?per_page=18"
                                                                        rel="nofollow noopener">
                                                                        <span>18</span>
                                                                    </a>
                                                                    <span className="per-page-border" />
                                                                    <a
                                                                        className="per-page-variation"
                                                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/smartphones/mobile-phones/apple-iphone/?per_page=24"
                                                                        rel="nofollow noopener">
                                                                        <span>24</span>
                                                                    </a>
                                                                    <span className="per-page-border" />
                                                                </div>
                                                            </div>
                                                            <div className="wd-shop-view wd-wpb wd-rs-63ada14c1f7ed hidden-md hidden-sm hidden-xs wd-enabled-width vc_custom_1672323410866">
                                                                <div className="wd-products-shop-view products-view-grid_list">
                                                                    <a
                                                                        aria-label="List view"
                                                                        className="shop-view per-row-list"
                                                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/smartphones/mobile-phones/apple-iphone/?shop_view=list"
                                                                        rel="nofollow noopener"
                                                                    />
                                                                    <a
                                                                        aria-label="Grid view 3"
                                                                        className="shop-view per-row-3"
                                                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/smartphones/mobile-phones/apple-iphone/?shop_view=grid&per_row=3"
                                                                        rel="nofollow noopener"
                                                                    />
                                                                    <a
                                                                        aria-label="Grid view 4"
                                                                        className="shop-view per-row-4"
                                                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/smartphones/mobile-phones/apple-iphone/?shop_view=grid&per_row=4"
                                                                        rel="nofollow noopener"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="wd-shop-ordering wd-wpb wd-rs-63ca949f87745 wd-enabled-width vc_custom_1674220707815">
                                                                <form
                                                                    className="woocommerce-ordering wd-style-default wd-ordering-mb-icon"
                                                                    method="get">
                                                                    <select
                                                                        aria-label="Shop order"
                                                                        className="orderby"
                                                                        name="orderby">
                                                                        <option selected value="menu_order">
                                                                            Default sorting
                                                                        </option>
                                                                        <option value="popularity">
                                                                            Sort by popularity
                                                                        </option>
                                                                        <option value="rating">
                                                                            Sort by average rating
                                                                        </option>
                                                                        <option value="date">Sort by latest</option>
                                                                        <option value="price">
                                                                            Sort by price: low to high
                                                                        </option>
                                                                        <option value="price-desc">
                                                                            Sort by price: high to low
                                                                        </option>
                                                                    </select>
                                                                    <input
                                                                        defaultValue="1"
                                                                        name="paged"
                                                                        type="hidden"
                                                                    />
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </div>
                                            {/* <div className="wd-wc-notices wd-wpb wd-rs-6213963c263b2">
                                                <div className="woocommerce-notices-wrapper" />
                                            </div> */}
                                            <div className="wd-shop-product wd-products-element wd-wpb wd-rs-63ada1f6e22d0">
                                                {/* <div className="wd-sticky-loader wd-content-loader">
                                                    <span className="wd-loader" />
                                                </div> */}

                                                <div
                                                    className="products wd-products wd-grid-g grid-columns-4 elements-grid pagination-pagination title-line-one wd-stretch-cont-lg wd-products-with-bg"
                                                    data-columns="4"
                                                    data-max_price=""
                                                    data-min_price=""
                                                    data-source="main_loop"
                                                    style={{
                                                        "--wd-col-lg": "4",
                                                        "--wd-col-md": "4",
                                                        "--wd-col-sm": "2",
                                                        "--wd-gap-lg": "20px",
                                                        "--wd-gap-sm": "10px",
                                                    }}>
                                                    {products.map((product, index) => (
                                                        <div
                                                            className="wd-product wd-hover-fw-button wd-hover-with-fade wd-col product-grid-item product type-product post-1975 status-publish instock product_cat-apple-iphone has-post-thumbnail shipping-taxable purchasable product-type-variable hover-ready"
                                                            data-id="1975"
                                                            data-loop="1" key={index}>
                                                            <div className="product-wrapper">
                                                                <div
                                                                    className="content-product-imagin"
                                                                    style={{
                                                                        marginBottom: "-112px",
                                                                    }}
                                                                />
                                                                <div className="product-element-top wd-quick-shop">
                                                                    <a
                                                                        className="product-image-link"
                                                                        href="https://woodmart.xtemos.com/mega-electronics/product/apple-iphone-13/">
                                                                        <div className="wd-product-grid-slider wd-fill">
                                                                            <div
                                                                                className="wd-product-grid-slide"
                                                                                data-image-id="0"
                                                                                data-image-srcset="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1.jpg 700w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-263x300.jpg 263w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-88x100.jpg 88w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-430x491.jpg 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-180x206.jpg 180w"
                                                                                data-image-url="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1.jpg"
                                                                            />
                                                                            <div
                                                                                className="wd-product-grid-slide"
                                                                                data-image-id="1"
                                                                                data-image-srcset="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-2.jpg 700w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-2-263x300.jpg 263w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-2-88x100.jpg 88w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-2-430x491.jpg 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-2-180x206.jpg 180w"
                                                                                data-image-url="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-2.jpg"
                                                                            />
                                                                            <div
                                                                                className="wd-product-grid-slide"
                                                                                data-image-id="2"
                                                                                data-image-srcset="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-3.jpg 700w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-3-263x300.jpg 263w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-3-88x100.jpg 88w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-3-430x491.jpg 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-3-180x206.jpg 180w"
                                                                                data-image-url="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-3.jpg"
                                                                            />
                                                                            <div
                                                                                className="wd-product-grid-slide"
                                                                                data-image-id="3"
                                                                                data-image-srcset="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1.jpg 700w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-263x300.jpg 263w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-88x100.jpg 88w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-430x491.jpg 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-180x206.jpg 180w"
                                                                                data-image-url="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1.jpg"
                                                                            />
                                                                        </div>
                                                                        <div className="wd-product-grid-slider-nav wd-fill wd-hover-enabled">
                                                                            <div className="wd-prev" />
                                                                            <div className="wd-next" />
                                                                        </div>
                                                                        <div className="wd-product-grid-slider-pagin">
                                                                            <div
                                                                                className="wd-product-grid-slider-dot wd-active"
                                                                                data-image-id="0"
                                                                            />
                                                                            <div
                                                                                className="wd-product-grid-slider-dot"
                                                                                data-image-id="1"
                                                                            />
                                                                            <div
                                                                                className="wd-product-grid-slider-dot"
                                                                                data-image-id="2"
                                                                            />
                                                                            <div
                                                                                className="wd-product-grid-slider-dot"
                                                                                data-image-id="3"
                                                                            />
                                                                        </div>
                                                                        <picture
                                                                            className="attachment-large size-large"
                                                                            decoding="async">
                                                                            <source
                                                                                sizes="(max-width: 700px) 100vw, 700px"
                                                                                srcSet="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1.jpg 700w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-263x300.jpg 263w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-88x100.jpg 88w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-430x491.jpg 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-180x206.jpg 180w"
                                                                                type="image/webp"
                                                                            />
                                                                            <img
                                                                                alt=""
                                                                                decoding="async"
                                                                                height="800"
                                                                                sizes="(max-width: 700px) 100vw, 700px"
                                                                                src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1.jpg"
                                                                                srcSet="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1.jpg 700w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-263x300.jpg 263w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-88x100.jpg 88w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-430x491.jpg 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-180x206.jpg 180w"
                                                                                width="700"
                                                                            />
                                                                        </picture>
                                                                    </a>
                                                                    <div className="wd-buttons wd-pos-r-t">
                                                                        <div className="wd-compare-btn product-compare-button wd-action-btn wd-style-icon wd-compare-icon">
                                                                            <a
                                                                                data-added-text="Compare products"
                                                                                data-id="1975"
                                                                                href="https://woodmart.xtemos.com/mega-electronics/compare/?product_id=1975"
                                                                                rel="nofollow">
                                                                                <span>Compare</span>
                                                                            </a>
                                                                        </div>
                                                                        <div className="quick-view wd-action-btn wd-style-icon wd-quick-view-icon">
                                                                            <a
                                                                                className="open-quick-view quick-view-button"
                                                                                data-id="1975"
                                                                                href="https://woodmart.xtemos.com/mega-electronics/product/apple-iphone-13/"
                                                                                rel="nofollow">
                                                                                Quick view
                                                                            </a>
                                                                        </div>
                                                                        <div
                                                                            className="wd-wishlist-btn wd-action-btn wd-style-icon wd-wishlist-icon wd-tooltip-inited"
                                                                            data-original-title=""
                                                                            title="">
                                                                            <a
                                                                                className=""
                                                                                data-added-text="Browse Wishlist"
                                                                                data-key="f906b35254"
                                                                                data-product-id="1975"
                                                                                href="https://woodmart.xtemos.com/mega-electronics/home/wishlist/"
                                                                                rel="nofollow">
                                                                                <span>Add to wishlist</span>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="product-element-bottom">
                                                                    <h3 className="wd-entities-title">
                                                                        <a href="https://woodmart.xtemos.com/mega-electronics/product/apple-iphone-13/">
                                                                            Apple iPhone 13
                                                                        </a>
                                                                    </h3>
                                                                    <div className="wd-product-cats">
                                                                        <a
                                                                            href="https://woodmart.xtemos.com/mega-electronics/product-category/smartphones/mobile-phones/apple-iphone/"
                                                                            rel="tag">
                                                                            Apple iPhone
                                                                        </a>
                                                                    </div>
                                                                    <div
                                                                        aria-label="Rated 0 out of 5"
                                                                        className="star-rating"
                                                                        role="img">
                                                                        <span
                                                                            style={{
                                                                                width: "0%",
                                                                            }}>
                                                                            Rated <strong className="rating">0</strong> out of
                                                                            5
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
                                                                                    599.00
                                                                                </bdi>
                                                                            </span>
                                                                            –
                                                                            <span className="woocommerce-Price-amount amount">
                                                                                <bdi>
                                                                                    <span className="woocommerce-Price-currencySymbol">
                                                                                        $
                                                                                    </span>
                                                                                    699.00
                                                                                </bdi>
                                                                            </span>
                                                                        </span>
                                                                        <div className="wd-swatches-grid wd-swatches-product wd-swatches-attr wd-bg-style-3 wd-text-style-3 wd-dis-style-1 wd-size-m wd-shape-round">
                                                                            <div
                                                                                className="wd-swatch wd-tooltip wd-bg"
                                                                                data-image-sizes="(max-width: 700px) 100vw, 700px"
                                                                                data-image-src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-blue-4.jpg"
                                                                                data-image-srcset="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-blue-4.jpg 700w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-blue-4-263x300.jpg 263w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-blue-4-88x100.jpg 88w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-blue-4-430x491.jpg 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-blue-4-180x206.jpg 180w">
                                                                                <span
                                                                                    className="wd-swatch-bg"
                                                                                    style={{
                                                                                        backgroundColor: "rgb(119,129,149)",
                                                                                    }}></span>
                                                                                <span className="wd-swatch-text">Blue</span>
                                                                            </div>
                                                                            <div
                                                                                className="wd-swatch wd-tooltip wd-bg"
                                                                                data-image-sizes="(max-width: 700px) 100vw, 700px"
                                                                                data-image-src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-midnight-5.jpg"
                                                                                data-image-srcset="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-midnight-5.jpg 700w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-midnight-5-263x300.jpg 263w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-midnight-5-88x100.jpg 88w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-midnight-5-430x491.jpg 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-midnight-5-180x206.jpg 180w">
                                                                                <span
                                                                                    className="wd-swatch-bg"
                                                                                    style={{
                                                                                        backgroundColor: "rgb(47,54,65)",
                                                                                    }}></span>
                                                                                <span className="wd-swatch-text">Midnight</span>
                                                                            </div>
                                                                            <div
                                                                                className="wd-swatch wd-tooltip wd-bg"
                                                                                data-image-sizes="(max-width: 700px) 100vw, 700px"
                                                                                data-image-src="https://woodmart.b-cdn.net/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1.jpg"
                                                                                data-image-srcset="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1.jpg 700w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-263x300.jpg 263w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-88x100.jpg 88w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-430x491.jpg 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-13-pink-1-180x206.jpg 180w">
                                                                                <span
                                                                                    className="wd-swatch-bg"
                                                                                    style={{
                                                                                        backgroundColor: "rgb(252,233,229)",
                                                                                    }}></span>
                                                                                <span className="wd-swatch-text">Pink</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="wd-add-btn wd-add-btn-replace">
                                                                        <a
                                                                            aria-describedby="woocommerce_loop_add_to_cart_link_describedby_1975"
                                                                            aria-label="Select options for “Apple iPhone 13”"
                                                                            className="button product_type_variable add_to_cart_button add-to-cart-loop"
                                                                            data-product_id="1975"
                                                                            data-product_sku="228117"
                                                                            data-quantity="1"
                                                                            href="/home/productDetails"
                                                                            rel="nofollow">
                                                                            <span>Buy Now</span>
                                                                        </a>
                                                                        <span
                                                                            className="screen-reader-text"
                                                                            id="woocommerce_loop_add_to_cart_link_describedby_1975">
                                                                            This product has multiple variants. The options
                                                                            may be chosen on the product page
                                                                        </span>
                                                                    </div>
                                                                    <div className="wd-product-detail wd-product-sku">
                                                                        <span className="wd-label">SKU:</span>
                                                                        <span>228117</span>
                                                                    </div>
                                                                    <div className="fade-in-block wd-scroll">
                                                                        <div className="hover-content-wrap">
                                                                            <div className="hover-content wd-more-desc wd-more-desc-calculated">
                                                                                <div className="hover-content-inner wd-more-desc-inner">
                                                                                    <table
                                                                                        aria-label="Product Details"
                                                                                        className="woocommerce-product-attributes shop_attributes">
                                                                                        <tbody>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_brand">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Brand
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>Apple</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_model">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Model
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>13</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_color">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Color
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>Blue</p>
                                                                                                    </span>
                                                                                                    ,
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>Midnight</p>
                                                                                                    </span>
                                                                                                    ,
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>Pink</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_operating-system">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Operating system
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>iOS</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_processor">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Processor
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>A15 Bionic</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_screen-diagonal">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Screen diagonal
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>6.7″</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_resolution">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Resolution
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>2796×1290</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_screen-coverage">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Screen coverage
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>Glossy</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_screan-type">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Screen type
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>Retina</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_screen-refresh-rate">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Screen refresh rate
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>120 Hz</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_ram">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            RAM
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>4GB</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_storage">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Storage
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>128GB SSD</p>
                                                                                                    </span>
                                                                                                    ,
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>256GB SSD</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_graphics-series">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Graphics series
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>A15 Bionic</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_release-years">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Release years
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>2022</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_manufacturer-guarantee">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Manufacturer guarantee
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>12 months</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_battery-capacity">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Battery capacity
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>70 W*h</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_wi-fi">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Wi-Fi
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>Wi-Fi 6</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_bluetooth">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Bluetooth
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>Bluetooth 5.0</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_audio-connections">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Audio connections
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>3.5 мм mini-jack</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_camera">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Camera
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>1080p facetime HD camera</p>
                                                                                                    </span>
                                                                                                    ,
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>8MP Wide camera</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_security-features">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Security features
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>Touch ID sensor</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr className="woocommerce-product-attributes-item woocommerce-product-attributes-item--attribute_pa_speakers">
                                                                                                <th
                                                                                                    className="woocommerce-product-attributes-item__label"
                                                                                                    scope="row">
                                                                                                    <span className="wd-attr-name">
                                                                                                        <span className="wd-attr-name-label">
                                                                                                            Speakers
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </th>
                                                                                                <td className="woocommerce-product-attributes-item__value">
                                                                                                    <span className="wd-attr-term">
                                                                                                        <p>Four-speaker sound system</p>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                                <a
                                                                                    aria-label="Read more description"
                                                                                    className="wd-more-desc-btn wd-shown"

                                                                                    rel="nofollow"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default smartPhone;