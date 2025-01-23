'use client';

import bestOffer from "../../assets/product.json";
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

            if (title) {
                const filtered = bestOffer.filter((product) => {
                    if (!product.brand) {
                        console.warn('Missing brand data for product:', product);
                        return false;
                    }
                    return product.brand.toLowerCase().includes(title.toLowerCase());
                });

                // If no specific products match the filter, display all products
                if (filtered.length === 0) {
                    console.warn('No matching products found. Displaying all products.');
                    setFilteredProducts(bestOffer);
                } else {
                    setFilteredProducts(filtered);
                }
            } else {
                setFilteredProducts(bestOffer);
            }

            setProducts(bestOffer);
        };

        fetchAndFilter();
    }, [searchParams]);


    return (
        <>
            <div className="wd-page-content main-page-wrapper">
                <main
                    className="wd-content-layout content-layout-wrapper container wd-builder-on wd-sidebar-hidden-sm"
                    role="main">
                    <div className="wd-content-area site-content entry-content">
                        <div className="wpb-content-wrapper">
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
                                            </div>
                                            <div className="wd-shop-product wd-products-element wd-wpb wd-rs-63ada1f6e22d0">
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
                                                    {filteredProducts.map((product, index) => (
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
                                                                        href={product.productUrl || '#'}>
                                                                        <img
                                                                            src={product.imageUrl || 'https://via.placeholder.com/150'}
                                                                            alt={product.brand || 'Product Image'}
                                                                            width="150"
                                                                            height="150"
                                                                        />
                                                                    </a>

                                                                </div>
                                                                <div className="product-element-bottom">
                                                                    <h3 className="wd-entities-title">
                                                                        <a href="https://woodmart.xtemos.com/mega-electronics/product/apple-iphone-13/">
                                                                            {product.brand}
                                                                        </a>
                                                                    </h3>
                                                                    <div className="wd-product-cats">
                                                                        <a
                                                                            href="https://woodmart.xtemos.com/mega-electronics/product-category/smartphones/mobile-phones/apple-iphone/"
                                                                            rel="tag">
                                                                            {product.brand}
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
                                                                                    {product.price}
                                                                                </bdi>
                                                                            </span>
                                                                        </span>
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
                                                                    {/* Addded new code */}
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