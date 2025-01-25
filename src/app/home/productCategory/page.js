'use client';

import bestOffer from "../../assets/scraped_products.json";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const smartPhone = () => {

    const searchParams = new URLSearchParams(window.location.search); // You can get the search params from the URL
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Start


    // useEffect(() => {
    //     const fetchAndFilter = () => {
    //         const brand = searchParams.get('title');
    //         console.log('Title from URL:', brand);

    //         let filtered = bestOffer;

    //         if (searchQuery) {
    //             filtered = bestOffer.filter((product) => {
    //                 const productName = product.productName || ''; // Default to empty string if missing
    //                 return productName.toLowerCase().includes(searchQuery.toLowerCase());
    //             });
    //         }

    //         if (brand) {
    //             filtered = filtered.filter((product) => {
    //                 const brandName = product.brand || ''; // Default to empty string if missing
    //                 return brandName.toLowerCase().includes(brand.toLowerCase());
    //             });
    //         }

    //         // If no products match the filter, display all products
    //         if (filtered.length === 0) {
    //             console.warn('No matching products found. Displaying all products.');
    //             setFilteredProducts(bestOffer);
    //         } else {
    //             setFilteredProducts(filtered);
    //         }

    //         setProducts(bestOffer); // Set the initial products (can be modified later)
    //     };

    //     fetchAndFilter();
    // }, [searchParams, searchQuery]); // Re-run whenever the search query or searchParams change

    // const handleSearchChange = (event) => {
    //     setSearchQuery(event.target.value);
    // };


    // End

    useEffect(() => {
        const fetchAndFilter = () => {
            const title = searchParams.get('title');
            console.log('Title from URL:', title);

            if (title) {
                const filtered = bestOffer.filter((product) =>
                    product.productName.toLowerCase().includes(title.toLowerCase())
                );

                setFilteredProducts(filtered.length > 0 ? filtered : bestOffer);  // Display all products if none match
            } else {
                setFilteredProducts(bestOffer);  // Display all products if no query param
            }
        };

        fetchAndFilter();
    }, [searchParams]);
    console.log(filteredProducts, "All Filter Data");


    const handleProductClick = (product) => {
        console.log("Product clicked:", product);
        router.push(`/home/productDetails?brand=${product.productName}`)
    }



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
                                                            data-id={product.productId || "0"}
                                                            data-loop={index + 1}
                                                            key={index}>
                                                            <div className="product-wrapper">
                                                                <div
                                                                    className="content-product-imagin"
                                                                    style={{
                                                                        marginBottom: "-112px",
                                                                    }}
                                                                />
                                                                <div className="product-element-top wd-quick-shop">
                                                                    <div
                                                                        className="product-image-link"
                                                                        role="button"
                                                                        onClick={() => handleProductClick(product)}
                                                                        style={{ cursor: "pointer" }}>
                                                                        <img
                                                                            src={product.image_url || "https://via.placeholder.com/150"}
                                                                            alt={product.productName || "Product Image"}
                                                                            width="150"
                                                                            height="150"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="product-element-bottom">
                                                                    <h3 className="wd-entities-title">
                                                                        <a href={product.product_url || "#"}>
                                                                            {product.productName}
                                                                        </a>
                                                                    </h3>
                                                                    <div className="wd-product-cats">
                                                                        <a href="#" rel="tag">
                                                                            {product.brand}
                                                                        </a>
                                                                    </div>
                                                                    <div
                                                                        aria-label={`Rated ${product.rating || 0} out of 5`}
                                                                        className="star-rating"
                                                                        role="img">
                                                                        <span
                                                                            style={{
                                                                                width: `${(product.rating / 5) * 100}%`,
                                                                            }}>
                                                                            Rated <strong className="rating">{product.rating || 0}</strong> out of 5
                                                                        </span>
                                                                    </div>
                                                                    <p className={`wd-product-stock stock wd-style-default ${product.stockStatus?.toLowerCase().replace(" ", "-") || "in-stock"}`}>
                                                                        {product.stockStatus || "In stock"}
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
                                                                            aria-describedby={`woocommerce_loop_add_to_cart_link_describedby_${product.productId}`}
                                                                            aria-label={`Buy now for “${product.productName}”`}
                                                                            className="button product_type_variable add_to_cart_button add-to-cart-loop"
                                                                            data-product_id={product.productId}
                                                                            data-product_sku={product.productSku}
                                                                            data-quantity="1"
                                                                            href="/home/productDetails"
                                                                            rel="nofollow">
                                                                            <span>Buy Now</span>
                                                                        </a>
                                                                        <span
                                                                            className="screen-reader-text"
                                                                            id={`woocommerce_loop_add_to_cart_link_describedby_${product.productId}`}>
                                                                            This product has multiple variants. The options may be chosen on the product page
                                                                        </span>
                                                                    </div>
                                                                    <div className="wd-product-detail wd-product-sku">
                                                                        <span className="wd-label">SKU:</span>
                                                                        <span>{product.productSku || "N/A"}</span>
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