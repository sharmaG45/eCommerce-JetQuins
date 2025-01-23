'use client'

import bestOffer from "../../app/assets/scraped_products.json";
import categories from "../../app/assets/product_categories.json";
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, fireStore } from "@/app/_components/firebase/config";
import styles from './Slider.module.css'
import Slider from "react-slick";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const HomePage = () => {

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const router = useRouter();
    const sliderRef = useRef(null);


    const handleAddToWishlist = async (e, offer) => {
        e.preventDefault(); // Prevent the default link behavior
        const user = JSON.parse(localStorage.getItem('currentUser')); // Assuming user info is stored in localStorage



        if (!user) {
            alert("Please log in first.");
            return;
        }

        // Log the offer object to see if it's structured correctly
        console.log('Offer:', offer);

        // Static fallback data in case some fields are missing
        const staticData = {
            product_url: 'https://defaultproducturl.com',
            image_urls: [
                "https://via.placeholder.com/430x491?text=Image+1",
                "https://via.placeholder.com/430x491?text=Image+2",
                "https://via.placeholder.com/430x491?text=Image+3",
                "https://via.placeholder.com/430x491?text=Image+4"
            ],
            brand: 'Default Brand',
            productId: '00000',
            productName: 'Default Product',
            productSku: 'DEFAULTSKU',
            price: 99.99,
            discount: 0
        };

        // Use static data if any required fields are missing
        const offerData = {
            product_url: offer.product_url || staticData.product_url,
            image_urls: offer.image_urls && offer.image_urls.length > 0 ? offer.image_urls : staticData.image_urls,
            productId: offer.productId || staticData.productId,
            productName: offer.productName || staticData.productName,
            productSku: offer.productSku || staticData.productSku,
            price: offer.price || staticData.price,
            discount: offer.discount || staticData.discount,
        };

        // Log the final offer data (either user-provided or static)
        console.log('Final Offer Data:', offerData);

        try {
            // Get the user's ID
            const userId = user.uid;

            // Reference to the user document in the 'users' collection
            const userRef = doc(fireStore, "users", userId);

            // Fetch the current user data to check if the wishlist exists
            const userDoc = await getDoc(userRef);
            let userWishlist = userDoc.exists() ? userDoc.data().wishlist || [] : [];

            // Check if the product is already in the wishlist
            const existingProductIndex = userWishlist.findIndex(item => item.productId === offerData.productId);

            if (existingProductIndex !== -1) {
                // If the product is found, notify the user that it's already in the wishlist
                alert("Product is already in your wishlist!");
                // Optionally, redirect to the wishlist page if you want to
                // router.push('/home/wishlist');
            } else {
                // If the product is not in the wishlist, add it as a new item
                userWishlist.push({
                    productUrls: offerData.product_url,
                    productId: offerData.productId,
                    productName: offerData.productName,
                    productSku: offerData.productSku,
                    imageUrls: offerData.image_urls,
                    price: offerData.price,
                    discount: offerData.discount,
                    timestamp: new Date(),
                });

                // Update the user's wishlist document with the new product
                await updateDoc(userRef, { wishlist: userWishlist });

                console.log("Product added to wishlist for user:", userId);
                alert("Product added to your wishlist!");
            }

            // Optionally open the wishlist after adding
            // setIsWishlistOpen(true); // Set state to show the wishlist modal or component

        } catch (error) {
            console.error("Error adding product to wishlist:", error);
            alert("Error adding product to wishlist.");
        }
    };

    const handleCategoryClick = (category) => {
        console.log(category.title, "Category");

        const encodedTitle = encodeURIComponent(category.title);
        router.push(`/home/productCategory?title=${encodedTitle}`);
    };

    const handleProductDetails = (brandDetails) => {
        router.push(`/home/productDetails?brand=${brandDetails}`);
    }

    // Function to open the Cart Modal
    const openCart = async (e, offer) => {
        e.preventDefault(); // Prevent the default link behavior

        const user = JSON.parse(localStorage.getItem('currentUser'));

        if (!user) {
            alert("Please log in first.");
            return;
        }

        // Log the offer object to see if it's structured correctly
        console.log('Offer:', offer);

        // Static fallback data in case some fields are missing
        const staticData = {
            product_url: 'https://defaultproducturl.com',
            image_urls: [
                "https://via.placeholder.com/430x491?text=Image+1",
                "https://via.placeholder.com/430x491?text=Image+2",
                "https://via.placeholder.com/430x491?text=Image+3",
                "https://via.placeholder.com/430x491?text=Image+4"
            ],
            brand: 'Default Brand',
            productId: '00000',
            productName: 'Default Product',
            productSku: 'DEFAULTSKU',
            price: 99.99,
            discount: 0
        };

        // Use static data if any required fields are missing
        const offerData = {
            product_url: offer.product_url || staticData.product_url,
            image_urls: offer.image_urls && offer.image_urls.length > 0 ? offer.image_urls : staticData.image_urls,
            productId: offer.productId || staticData.productId,
            productName: offer.productName || staticData.productName,
            productSku: offer.productSku || staticData.productSku,
            price: offer.price || staticData.price,
            discount: offer.discount || staticData.discount,
        };

        // Log the final offer data (either user-provided or static)
        console.log('Final Offer Data:', offerData);

        try {
            // Get the user's ID
            const userId = user.uid;

            // Reference to the user document in the 'users' collection
            const userRef = doc(fireStore, "users", userId);

            // Fetch the current user data to check if the cart exists
            const userDoc = await getDoc(userRef);
            let userCart = userDoc.exists() ? userDoc.data().cart || [] : [];

            // Check if the product is already in the cart
            const existingProductIndex = userCart.findIndex(item => item.productId === offerData.productId);

            if (existingProductIndex !== -1) {
                // If the product is found, increment the quantity in place
                userCart[existingProductIndex].quantity += 1;

                // Update the user's cart document with the new quantity
                await updateDoc(userRef, { cart: userCart });

                console.log("Product quantity incremented in cart for user:", userId);
                alert("Product quantity updated in your cart!");
            } else {
                // If the product is not in the cart, add it as a new product
                userCart.push({
                    productUrls: offerData.product_url,
                    productId: offerData.productId,
                    productName: offerData.productName,
                    productSku: offerData.productSku,
                    imageUrls: offerData.image_urls,
                    price: offerData.price,
                    discount: offerData.discount,
                    quantity: 1, // Starting quantity
                    timestamp: new Date(),
                });

                // Update the user's cart document with the new product
                await updateDoc(userRef, { cart: userCart });

                console.log("Product added to cart for user:", userId);
                alert("Product added to your cart!");
            }

            setIsCartOpen(true); // Open the cart after adding/updating
        } catch (error) {
            console.error("Error adding product to cart:", error);
            alert("Error adding product to cart.");
        }
    };

    const closeCart = () => {
        setIsCartOpen(false);
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        router.push('/home/checkout');
        setIsCartOpen(false);
    };

    const handleViewCart = (e) => {
        e.preventDefault();
        router.push('/home/cart');
        setIsCartOpen(false);
    }



    // SLider

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 20000,
        adaptiveHeight: true,
        arrows: false,
    };

    const slides = [
        {
            id: "slide-1",
            title: "Apple Shopping Event",
            description: "Shop great deals on MacBook, iPad, iPhone and more.",
            buttonText: "Shop Now",
            buttonLink: "#",
            backgroundImage: "/assets/Images/background-1.jpg", // Replace with your image URL
        },
        {
            id: "slide-2",
            title: "The new Google Pixel 7",
            description: "Shop great deals on MacBook, iPad, iPhone and more.",
            buttonText: "Pre-Order Now",
            buttonLink: "#",
            backgroundImage: "/assets/Images/background-2.jpg", // Replace with your image URL
        },
        {
            id: "slide-3",
            title: "Discount on all Smart appliances up to 25%",
            description: "Shop great deals on MacBook, iPad, iPhone and more.",
            buttonText: "Shop Now",
            buttonLink: "#",
            backgroundImage: "/assets/Images/background-3.jpg", // Replace with your image URL
        },
    ];

    const goToNext = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    const goToPrev = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    return (
        <>
            <div className="wd-page-content main-page-wrapper">
                <main
                    className="wd-content-layout content-layout-wrapper container"
                    role="main"
                >
                    <div className="wd-content-area site-content">
                        <article
                            id="post-15"
                            className="entry-content post-15 page type-page status-publish has-post-thumbnail hentry"
                        >
                            <div className="wpb-content-wrapper">
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1668613203662 wd-rs-63750447ba1c2">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-12 vc_col-md-12 wd-rs-637503f5909fc">
                                        <div className="vc_column-inner vc_custom_1668613113545">
                                            <div className="wpb_wrapper">

                                                <div className={styles.sliderContainer}>
                                                    <Slider ref={sliderRef} {...sliderSettings}>
                                                        {slides.map((slide) => (
                                                            <div
                                                                key={slide.id}
                                                                className={styles.slide}
                                                                style={{
                                                                    backgroundImage: `url(${slide.backgroundImage})`,
                                                                    backgroundSize: "cover",
                                                                    backgroundPosition: "center",
                                                                }}
                                                            >
                                                                <div className={styles.content}>
                                                                    <h4 className={styles.title}>{slide.title}</h4>
                                                                    <p className={styles.description}>{slide.description}</p>
                                                                    <a href={slide.buttonLink} className={styles.button} target="_blank" rel="noopener noreferrer">
                                                                        {slide.buttonText}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </Slider>

                                                    {/* Next and Previous Buttons */}
                                                    <button className={styles.prevButton} onClick={goToPrev}>
                                                        Previous
                                                    </button>
                                                    <button className={styles.nextButton} onClick={goToNext}>
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1666183160320 wd-rs-634fefed87ae9">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-634fefd25f329">
                                        <div className="vc_column-inner vc_custom_1666183127613">
                                            <div className="wpb_wrapper">
                                                <div
                                                    id="wd-634d675b41324"
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-634d675b41324 wd-title-color-default wd-title-style-default text-left vc_custom_1666017138726 wd-underline-colored"
                                                >
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-xl">
                                                            Popular Categories
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div
                                                    id="wd-678497ab2fe96"
                                                    className="products woocommerce wd-carousel-container wd-cats-element wd-rs-637e42d972764 wd-wpb wd-img-width wd-cats"
                                                >
                                                    <div className="wd-carousel-inner">
                                                        <div
                                                            className="wd-carousel wd-grid wd-initialized wd-horizontal wd-watch-progress wd-backface-hidden"
                                                            data-scroll_per_page="yes"
                                                            style={{
                                                                "--wd-col-lg": "7",
                                                                "--wd-col-md": "4",
                                                                "--wd-col-sm": "2",
                                                                "--wd-gap-lg": "20px",
                                                                "--wd-gap-sm": "10px",
                                                            }}
                                                        >
                                                            <div
                                                                className="wd-carousel-wrap"
                                                                style={{
                                                                    WebkitTransitionDuration: "0ms",
                                                                    transitionDuration: "0ms",
                                                                    WebkitTransitionDelay: "0ms",
                                                                    transitionDelay: "0ms",
                                                                    WebkitTransform: "translate3d(0px, 0px, 0px)",
                                                                    msTransform: "translate3d(0px, 0px, 0px)",
                                                                    transform: "translate3d(0px, 0px, 0px)",
                                                                }}
                                                            >
                                                                {categories.map((category) => (
                                                                    <div
                                                                        key={category.id}
                                                                        className="wd-carousel-item wd-slide-visible wd-full-visible wd-active"
                                                                        style={{ width: "190px" }}
                                                                        onClick={() => handleCategoryClick(category)}
                                                                    >
                                                                        <div className="category-grid-item wd-cat cat-design-alt wd-with-subcat product-category product first" data-loop={1}>
                                                                            <div className="wrapp-category">
                                                                                <div className="category-image-wrapp">
                                                                                    <a className="category-image" aria-label="Category image">
                                                                                        <picture decoding="async" className="attachment-200 size-200">
                                                                                            <source
                                                                                                type="image/webp"
                                                                                                srcSet={`${category.image}.webp 400w, ${category.image}-300x300.jpg.webp 300w, ${category.image}-150x150.jpg.webp 150w, ${category.image}-100x100.jpg.webp 100w`}
                                                                                                sizes="(max-width: 400px) 100vw, 400px"
                                                                                            />
                                                                                            <img
                                                                                                decoding="async"
                                                                                                width={400}
                                                                                                height={400}
                                                                                                src={category.image}
                                                                                                alt={category.title}
                                                                                                srcSet={`${category.image} 400w, ${category.image}-300x300.jpg 300w, ${category.image}-150x150.jpg 150w, ${category.image}-100x100.jpg 100w`}
                                                                                                sizes="(max-width: 400px) 100vw, 400px"
                                                                                            />
                                                                                        </picture>
                                                                                    </a>
                                                                                </div>
                                                                                <div className="hover-mask">
                                                                                    <h3 className="wd-entities-title">
                                                                                        {category.title} <mark className="count">({category.productsCount})</mark>
                                                                                    </h3>
                                                                                    <div className="more-products">
                                                                                        <a >
                                                                                            {category.productsCount} products
                                                                                        </a>
                                                                                    </div>
                                                                                </div>
                                                                                <a

                                                                                    className="category-link wd-fill"
                                                                                    aria-label={`Product category ${category.title}`}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                            </div>

                                                        </div>
                                                        <div className="wd-nav-arrows wd-pos-sep wd-hover-1 wd-icon-1">
                                                            <div className="wd-btn-arrow wd-prev wd-disabled wd-lock">
                                                                <div className="wd-arrow-inner" />
                                                            </div>
                                                            <div className="wd-btn-arrow wd-next wd-lock wd-disabled">
                                                                <div className="wd-arrow-inner" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1666183170575 wd-rs-634feff906542">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-634ff2b59ca25">
                                        <div className="vc_column-inner vc_custom_1666183867410">
                                            <div className="wpb_wrapper">
                                                <div
                                                    id="wd-634ff2ae7a84a"
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-634ff2ae7a84a wd-enabled-width wd-title-color-default wd-title-style-default text-left vc_custom_1666183861337 wd-underline-colored"
                                                >
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-xl">
                                                            The Best Offers
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div
                                                    id="wd-63e123a3abd83"
                                                    className=" wd-rs-63e123a3abd83 vc_custom_1675699148725 wd-button-wrapper text-center inline-element"
                                                >
                                                    <a
                                                        href="https://woodmart.xtemos.com/mega-electronics/outlet/"
                                                        title="Outlet"
                                                        className="btn btn-style-default btn-shape-round btn-size-default btn-icon-pos-right"
                                                    >
                                                        More Products
                                                        <span className="wd-btn-icon">
                                                            <img
                                                                decoding="async"
                                                                src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-primary.svg"
                                                                title="chevron-right-primary"
                                                                width={14}
                                                                height={14}
                                                                data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-primary.svg"
                                                                data-ll-status="loaded"
                                                                className="entered lazyloaded"
                                                            />

                                                        </span>
                                                    </a>
                                                </div>
                                                <div
                                                    id
                                                    className="wd-products-element wd-rs-63e1023d7a64b wd-wpb"
                                                >
                                                    <div
                                                        className="products wd-products  grid-columns-5 elements-grid wd-grid-g title-line-one wd-stretch-cont-lg wd-products-with-bg"
                                                        data-paged={1}
                                                        data-atts='{"post_type":"ids","spacing":"20","include":"182, 2435, 1476, 2564, 3110","items_per_page":"5","columns":"5","columns_tablet":"3","sale_countdown":"0","stock_progress_bar":"0","highlighted_products":"0","products_bordered_grid":"0","products_with_background":"1","products_shadow":"0","orderby":"post__in","img_size":"large","woodmart_css_id":"63e1023d7a64b","force_not_ajax":"no"}'
                                                        data-source="shortcode"
                                                        data-columns={5}
                                                        data-grid-gallery='{"grid_gallery":"1","grid_gallery_control":"hover","grid_gallery_enable_arrows":"arrows"}'
                                                        style={{
                                                            "--wd-col-lg": "5",
                                                            "--wd-col-md": "3",
                                                            "--wd-col-sm": "2",
                                                            "--wd-gap-lg": "20px",
                                                            "--wd-gap-sm": "10px",
                                                        }}
                                                    >

                                                        {bestOffer.slice(0, 5).map((offer, index) => (
                                                            <div
                                                                className="wd-product wd-with-labels wd-hover-fw-button wd-hover-with-fade wd-col product-grid-item product type-product post-2435 status-publish instock product_cat-vr-headsets has-post-thumbnail sale shipping-taxable purchasable product-type-simple hover-ready"
                                                                data-loop={index}
                                                                data-id={offer.productId} // Assuming you have unique IDs for each product
                                                                key={offer.productId} // Use a unique key for each product

                                                            >
                                                                <div className="product-wrapper">
                                                                    <div className="content-product-imagin" style={{ marginBottom: "-112px" }} />

                                                                    <div className="product-element-top wd-quick-shop">
                                                                        <a className="product-image-link" >
                                                                            <div className="wd-product-grid-slider wd-fill" onClick={() => handleProductDetails(offer.brand)}>
                                                                                {/* {offer.image_urls.map((url, imageIndex) => (
                                                                                    <div
                                                                                        className="wd-product-grid-slide"
                                                                                        key={imageIndex}
                                                                                        data-image-url={url}
                                                                                        data-image-srcset={`${url} 700w, ${url.replace(".jpg", "-263x300.jpg")} 263w, ${url.replace(".jpg", "-88x100.jpg")} 88w, ${url.replace(".jpg", "-430x491.jpg")} 430w, ${url.replace(".jpg", "-180x206.jpg")} 180w`}
                                                                                        data-image-id={imageIndex}

                                                                                    />
                                                                                ))} */}
                                                                            </div>
                                                                            <div className="wd-product-grid-slider-nav wd-fill wd-hover-enabled">
                                                                                <div className="wd-prev" />
                                                                                <div className="wd-next" />
                                                                            </div>
                                                                            <div className="wd-product-grid-slider-pagin">
                                                                                {/* {offer.image_urls.map((_, imageIndex) => (
                                                                                    <div key={imageIndex} data-image-id={imageIndex} className="wd-product-grid-slider-dot" />
                                                                                ))} */}
                                                                            </div>
                                                                            <div className="product-labels labels-rounded-sm">
                                                                                <span className="onsale product-label">{offer.discount}%</span> {/* Assuming you have discount info */}
                                                                            </div>
                                                                            <picture decoding="async" className="attachment-large size-large">
                                                                                <source
                                                                                    type="image/webp"
                                                                                    data-lazy-srcset={`${offer.image_urls}.webp 700w, ${offer.image_urls}.webp 263w`}
                                                                                    srcSet={`${offer.image_urls}.webp 700w, ${offer.image_urls}.webp 263w`}
                                                                                    sizes="(max-width: 700px) 100vw, 700px"
                                                                                />
                                                                                <img
                                                                                    decoding="async"
                                                                                    width={700}
                                                                                    height={800}
                                                                                    src={offer.image_urls}

                                                                                    data-lazy-srcset={`${offer.image_urls} 700w, ${offer.image_urls} 263w`}
                                                                                    data-lazy-sizes="(max-width: 700px) 100vw, 700px"
                                                                                    className="entered lazyloaded"
                                                                                    sizes="(max-width: 700px) 100vw, 700px"
                                                                                    srcSet={`${offer.image_urls} 700w, ${offer.image_urls} 263w`}
                                                                                />
                                                                            </picture>
                                                                        </a>
                                                                        <div className="wd-buttons wd-pos-r-t">
                                                                            <div className="wd-compare-btn product-compare-button wd-action-btn wd-style-icon wd-compare-icon">
                                                                                <a
                                                                                    href={`https://woodmart.xtemos.com/mega-electronics/compare/?product_id=${offer.productId}`}
                                                                                    data-id={offer.productId}
                                                                                    rel="nofollow"
                                                                                    data-added-text="Compare products"
                                                                                >
                                                                                    <span>Compare</span>
                                                                                </a>
                                                                            </div>
                                                                            <div className="quick-view wd-action-btn wd-style-icon wd-quick-view-icon">
                                                                                <a

                                                                                    className="open-quick-view quick-view-button"
                                                                                    rel="nofollow"
                                                                                    data-id={offer.productId}
                                                                                >
                                                                                    Quick view
                                                                                </a>
                                                                            </div>
                                                                            <div className="wd-wishlist-btn wd-action-btn wd-style-icon wd-wishlist-icon">
                                                                                <a
                                                                                    onClick={(e) => handleAddToWishlist(e, offer)}
                                                                                    href="/home/wishlist"
                                                                                    data-key={offer.productId}
                                                                                    data-product-id={offer.productId}
                                                                                    rel="nofollow"
                                                                                    data-added-text="Browse Wishlist"
                                                                                >
                                                                                    <span>{isAdded ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>


                                                                    <div className="product-element-bottom">
                                                                        <h3 className="wd-entities-title">
                                                                            <a href={offer.product_url}>
                                                                                {offer.productName}
                                                                            </a>
                                                                        </h3>
                                                                        <div className="wd-product-cats">
                                                                            <a href={offer.category_url} rel="tag">
                                                                                {offer.category}
                                                                            </a>
                                                                        </div>
                                                                        <div className="star-rating" role="img" aria-label={`Rated ${offer.rating} out of 5`}>
                                                                            <span style={{ width: `${(offer.rating / 5) * 100}%` }}>
                                                                                Rated <strong className="rating">{offer.rating}</strong> out of 5
                                                                            </span>
                                                                        </div>
                                                                        <p className="wd-product-stock stock wd-style-default in-stock">
                                                                            {offer.stockStatus}
                                                                        </p>
                                                                        <div className="wrap-price">
                                                                            <span className="price">
                                                                                <del aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {offer.price}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </del>
                                                                                <span className="screen-reader-text">
                                                                                    Original price was:  {offer.originalPrice}.
                                                                                </span>
                                                                                <ins aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {offer.price}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </ins>
                                                                                <span className="screen-reader-text">
                                                                                    Current price is: $449.00.
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        <div className="wd-add-btn wd-add-btn-replace">
                                                                            <a
                                                                                href="#"
                                                                                aria-describedby="woocommerce_loop_add_to_cart_link_describedby_2435"
                                                                                data-quantity={1}
                                                                                className="button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-loop"
                                                                                data-product_id={2435}
                                                                                data-product_sku={608069}
                                                                                aria-label="Add to cart: Oculus Quest 2"
                                                                                rel="nofollow"
                                                                                onClick={(e) => openCart(e, offer)}
                                                                            >
                                                                                <span>Add to cart</span>
                                                                            </a>
                                                                            <span
                                                                                id="woocommerce_loop_add_to_cart_link_describedby_2435"
                                                                                className="screen-reader-text"
                                                                            ></span>
                                                                        </div>
                                                                        <div className="wd-product-detail wd-product-sku">
                                                                            <span className="wd-label">SKU: </span>
                                                                            <span> <span>{offer.productSku}</span> </span>
                                                                        </div>
                                                                        {/* Add new data */}
                                                                    </div>
                                                                </div>
                                                            </div>))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1669208804222 wd-rs-637e1ae2b109c">
                                    <div className="wpb_column vc_column_container vc_col-sm-3 vc_hidden-sm vc_hidden-xs wd-rs-637502f36f06d">
                                        <div className="vc_column-inner vc_custom_1668612856492">
                                            <div className="wpb_wrapper">

                                                <div className="promo-banner-wrapper  wd-rs-63d90c213c7b6 ">
                                                    <div
                                                        id="wd-63d90c213c7b6"
                                                        className="promo-banner  banner- banner-hover-zoom color-scheme-light banner-btn-size-default banner-btn-style-default  with-btn banner-btn-position-static wd-underline-colored"
                                                    >
                                                        <div className="main-wrapp-img">
                                                            <div className="banner-image wd-bg-position-center">
                                                                <img
                                                                    decoding="async"
                                                                    width={600}
                                                                    height={720}
                                                                    src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/nothing-phone-1-600x720.jpg"
                                                                    className="attachment-600x720 size-600x720 entered lazyloaded"
                                                                    alt
                                                                    data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/nothing-phone-1-600x720.jpg"
                                                                    data-ll-status="loaded"
                                                                />

                                                            </div>
                                                        </div>
                                                        <div className="wrapper-content-banner wd-fill  wd-items-top wd-justify-center">
                                                            <div className="content-banner  text-center">
                                                                <div className="banner-subtitle subtitle-color-default subtitle-style-default wd-fontsize-xs wd-font-weight-700 font-alt">
                                                                    AT A GOOD PRICE
                                                                </div>
                                                                <h4 className="banner-title wd-font-weight- wd-fontsize-l">
                                                                    Nothing Phone 1
                                                                </h4>
                                                                <div className="banner-btn-wrapper">
                                                                    <div
                                                                        id="wd-678497ab4ec69"
                                                                        className="  wd-button-wrapper text-center"
                                                                    >
                                                                        <a className="btn btn-color-primary btn-style-default btn-shape-semi-round btn-size-default">
                                                                            Buy Now
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
                                    <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-9 vc_col-md-9 wd-enabled-flex wd-rs-637502fa312e0">
                                        <div className="vc_column-inner vc_custom_1668612867432">
                                            <div className="wpb_wrapper">
                                                <div
                                                    id="wd-634ff240c9859"
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-634ff240c9859 wd-enabled-width wd-title-color-default wd-title-style-default text-left vc_custom_1666183754887 wd-underline-colored"
                                                >
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-xl">
                                                            New Goods
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div
                                                    id="wd-63e125b0c79da"
                                                    className=" wd-rs-63e125b0c79da vc_custom_1675699639912 wd-button-wrapper text-center inline-element"
                                                >
                                                    <a
                                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/laptops-tablets-pcs/"
                                                        title="Outlet"
                                                        className="btn btn-style-default btn-shape-round btn-size-default btn-icon-pos-right"
                                                    >
                                                        More Products
                                                        <span className="wd-btn-icon">
                                                            <img
                                                                decoding="async"
                                                                src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-primary.svg"
                                                                title="chevron-right-primary"
                                                                width={14}
                                                                height={14}
                                                                data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-primary.svg"
                                                                data-ll-status="loaded"
                                                                className="entered lazyloaded"
                                                            />

                                                        </span>
                                                    </a>
                                                </div>
                                                <div
                                                    id
                                                    className="wd-products-element wd-rs-63ca986f2aaee wd-wpb"
                                                >
                                                    <div
                                                        className="products wd-products  grid-columns-4 elements-grid wd-grid-g title-line-one wd-stretch-cont-lg wd-products-with-bg"
                                                        data-paged={1}
                                                        data-atts='{"spacing":"20","items_per_page":"4","columns_tablet":"3","sale_countdown":"0","stock_progress_bar":"0","highlighted_products":"0","products_bordered_grid":"0","products_with_background":"1","products_shadow":"0","img_size":"large","woodmart_css_id":"63ca986f2aaee","force_not_ajax":"no"}'
                                                        data-source="shortcode"
                                                        data-columns={4}
                                                        data-grid-gallery='{"grid_gallery":"1","grid_gallery_control":"hover","grid_gallery_enable_arrows":"arrows"}'
                                                        style={{
                                                            "--wd-col-lg": "4",
                                                            "--wd-col-md": "3",
                                                            "--wd-col-sm": "2",
                                                            "--wd-gap-lg": "20px",
                                                            "--wd-gap-sm": "10px",
                                                        }}
                                                    >
                                                        {/* Addd */}

                                                        {bestOffer.slice(0, 4).map((offer, index) => (
                                                            <div
                                                                className="wd-product wd-with-labels wd-hover-fw-button wd-hover-with-fade wd-col product-grid-item product type-product post-2435 status-publish instock product_cat-vr-headsets has-post-thumbnail sale shipping-taxable purchasable product-type-simple hover-ready"
                                                                data-loop={index}
                                                                data-id={offer.productId} // Assuming you have unique IDs for each product
                                                                key={offer.productId} // Use a unique key for each product

                                                            >
                                                                <div className="product-wrapper">
                                                                    <div className="content-product-imagin" style={{ marginBottom: "-112px" }} />

                                                                    <div className="product-element-top wd-quick-shop">
                                                                        <a className="product-image-link" >
                                                                            <div className="wd-product-grid-slider wd-fill" onClick={() => handleProductDetails(offer.brand)}>
                                                                                {/* {offer.image_urls.map((url, imageIndex) => (
                                                                                    <div
                                                                                        className="wd-product-grid-slide"
                                                                                        key={imageIndex}
                                                                                        data-image-url={url}
                                                                                        data-image-srcset={`${url} 700w, ${url.replace(".jpg", "-263x300.jpg")} 263w, ${url.replace(".jpg", "-88x100.jpg")} 88w, ${url.replace(".jpg", "-430x491.jpg")} 430w, ${url.replace(".jpg", "-180x206.jpg")} 180w`}
                                                                                        data-image-id={imageIndex}

                                                                                    />
                                                                                ))} */}
                                                                            </div>
                                                                            <div className="wd-product-grid-slider-nav wd-fill wd-hover-enabled">
                                                                                <div className="wd-prev" />
                                                                                <div className="wd-next" />
                                                                            </div>
                                                                            <div className="wd-product-grid-slider-pagin">
                                                                                {/* {offer.image_urls.map((_, imageIndex) => (
                                                                                    <div key={imageIndex} data-image-id={imageIndex} className="wd-product-grid-slider-dot" />
                                                                                ))} */}
                                                                            </div>
                                                                            <div className="product-labels labels-rounded-sm">
                                                                                <span className="onsale product-label">{offer.discount}%</span> {/* Assuming you have discount info */}
                                                                            </div>
                                                                            <picture decoding="async" className="attachment-large size-large">
                                                                                <source
                                                                                    type="image/webp"
                                                                                    data-lazy-srcset={`${offer.image_urls}.webp 700w, ${offer.image_urls}.webp 263w`}
                                                                                    srcSet={`${offer.image_urls}.webp 700w, ${offer.image_urls}.webp 263w`}
                                                                                    sizes="(max-width: 700px) 100vw, 700px"
                                                                                />
                                                                                <img
                                                                                    decoding="async"
                                                                                    width={700}
                                                                                    height={800}
                                                                                    src={offer.image_urls}

                                                                                    data-lazy-srcset={`${offer.image_urls} 700w, ${offer.image_urls} 263w`}
                                                                                    data-lazy-sizes="(max-width: 700px) 100vw, 700px"
                                                                                    className="entered lazyloaded"
                                                                                    sizes="(max-width: 700px) 100vw, 700px"
                                                                                    srcSet={`${offer.image_urls} 700w, ${offer.image_urls} 263w`}
                                                                                />
                                                                            </picture>
                                                                        </a>
                                                                        <div className="wd-buttons wd-pos-r-t">
                                                                            <div className="wd-compare-btn product-compare-button wd-action-btn wd-style-icon wd-compare-icon">
                                                                                <a
                                                                                    href={`https://woodmart.xtemos.com/mega-electronics/compare/?product_id=${offer.productId}`}
                                                                                    data-id={offer.productId}
                                                                                    rel="nofollow"
                                                                                    data-added-text="Compare products"
                                                                                >
                                                                                    <span>Compare</span>
                                                                                </a>
                                                                            </div>
                                                                            <div className="quick-view wd-action-btn wd-style-icon wd-quick-view-icon">
                                                                                <a

                                                                                    className="open-quick-view quick-view-button"
                                                                                    rel="nofollow"
                                                                                    data-id={offer.productId}
                                                                                >
                                                                                    Quick view
                                                                                </a>
                                                                            </div>
                                                                            <div className="wd-wishlist-btn wd-action-btn wd-style-icon wd-wishlist-icon">
                                                                                <a
                                                                                    onClick={(e) => handleAddToWishlist(e, offer)}
                                                                                    href="/home/wishlist"
                                                                                    data-key={offer.productId}
                                                                                    data-product-id={offer.productId}
                                                                                    rel="nofollow"
                                                                                    data-added-text="Browse Wishlist"
                                                                                >
                                                                                    <span>{isAdded ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>


                                                                    <div className="product-element-bottom">
                                                                        <h3 className="wd-entities-title">
                                                                            <a href={offer.product_url}>
                                                                                {offer.productName}
                                                                            </a>
                                                                        </h3>
                                                                        <div className="wd-product-cats">
                                                                            <a href={offer.category_url} rel="tag">
                                                                                {offer.category}
                                                                            </a>
                                                                        </div>
                                                                        <div className="star-rating" role="img" aria-label={`Rated ${offer.rating} out of 5`}>
                                                                            <span style={{ width: `${(offer.rating / 5) * 100}%` }}>
                                                                                Rated <strong className="rating">{offer.rating}</strong> out of 5
                                                                            </span>
                                                                        </div>
                                                                        <p className="wd-product-stock stock wd-style-default in-stock">
                                                                            {offer.stockStatus}
                                                                        </p>
                                                                        <div className="wrap-price">
                                                                            <span className="price">
                                                                                <del aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {offer.price}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </del>
                                                                                <span className="screen-reader-text">
                                                                                    Original price was:  {offer.originalPrice}.
                                                                                </span>
                                                                                <ins aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {offer.price}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </ins>
                                                                                <span className="screen-reader-text">
                                                                                    Current price is: $449.00.
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        <div className="wd-add-btn wd-add-btn-replace">
                                                                            <a
                                                                                href="#"
                                                                                aria-describedby="woocommerce_loop_add_to_cart_link_describedby_2435"
                                                                                data-quantity={1}
                                                                                className="button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-loop"
                                                                                data-product_id={2435}
                                                                                data-product_sku={608069}
                                                                                aria-label="Add to cart: Oculus Quest 2"
                                                                                rel="nofollow"
                                                                                onClick={(e) => openCart(e, offer)}
                                                                            >
                                                                                <span>Add to cart</span>
                                                                            </a>
                                                                            <span
                                                                                id="woocommerce_loop_add_to_cart_link_describedby_2435"
                                                                                className="screen-reader-text"
                                                                            ></span>
                                                                        </div>
                                                                        <div className="wd-product-detail wd-product-sku">
                                                                            <span className="wd-label">SKU: </span>
                                                                            <span> <span>{offer.productSku}</span> </span>
                                                                        </div>
                                                                        {/* Add new data */}
                                                                    </div>
                                                                </div>
                                                            </div>))}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="vc_row wpb_row vc_row-fluid vc_custom_1669208808246 vc_row-has-fill wd-bg-center-center wd-rs-637e1ae60fd2e wd-section-stretch"
                                    data-rocket-lazy-bg-495a8d3f-ea3f-41fb-84e1-9971610dfbe8="loaded"
                                >
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-634ff34d0b9f1">
                                        <div className="vc_column-inner vc_custom_1666184018278">
                                            <div className="wpb_wrapper">
                                                <div className="vc_row wpb_row vc_inner vc_row-fluid vc_row-o-content-middle vc_row-flex wd-rs-637257b9e47aa">
                                                    <div className="wpb_column vc_column_container vc_col-sm-5 wd-rs-634ff56bbfb53">
                                                        <div className="vc_column-inner vc_custom_1666184560776">
                                                            <div className="wpb_wrapper">

                                                                <div
                                                                    id="wd-63d90af56021f"
                                                                    className="wd-image wd-wpb wd-rs-63d90af56021f text-left vc_custom_1675168504439"
                                                                >
                                                                    <img
                                                                        decoding="async"
                                                                        width={580}
                                                                        height={365}
                                                                        src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-580x365.png"
                                                                        className="attachment-580x365 size-580x365 entered lazyloaded"
                                                                        alt
                                                                        data-lazy-srcset="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img.png 580w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-400x252.png 400w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-100x63.png 100w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-430x271.png 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-180x113.png 180w"
                                                                        data-lazy-sizes="(max-width: 580px) 100vw, 580px"
                                                                        data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-580x365.png"
                                                                        data-ll-status="loaded"
                                                                        sizes="(max-width: 580px) 100vw, 580px"
                                                                        srcSet="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img.png 580w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-400x252.png 400w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-100x63.png 100w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-430x271.png 430w, https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-shopping-event-full-img-180x113.png 180w"
                                                                    />

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="wpb_column vc_column_container vc_col-sm-7 wd-rs-634ff570a667b">
                                                        <div className="vc_column-inner vc_custom_1666184565547">
                                                            <div className="wpb_wrapper">
                                                                <div
                                                                    id="wd-6375053b71efb"
                                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-6375053b71efb wd-title-color-default wd-title-style-default text-left vc_custom_1668613440554 wd-underline-colored"
                                                                >
                                                                    <div className="liner-continer">
                                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-l">
                                                                            Apple Shopping Event
                                                                        </h4>
                                                                    </div>
                                                                    <div className="title-after_title reset-last-child  wd-fontsize-xs">
                                                                        Hurry and get discounts on all Apple devices up to
                                                                        20%
                                                                    </div>
                                                                </div>
                                                                <div className="wd-countdown-timer  color-scheme-dark text-left wd-rs- ">
                                                                    <div
                                                                        className="wd-timer wd-size-large wd-style-standard"
                                                                        data-end-date="2026-01-01 00:00"
                                                                        data-timezone="GMT"
                                                                        data-hide-on-finish="no"
                                                                    >
                                                                        <span className="wd-timer-days">
                                                                            <span className="wd-timer-value">352 </span>
                                                                            <span className="wd-timer-text">days</span>
                                                                        </span>
                                                                        <span className="wd-timer-hours">
                                                                            <span className="wd-timer-value">13 </span>
                                                                            <span className="wd-timer-text">hr</span>
                                                                        </span>
                                                                        <span className="wd-timer-min">
                                                                            <span className="wd-timer-value">21 </span>
                                                                            <span className="wd-timer-text">min</span>
                                                                        </span>
                                                                        <span className="wd-timer-sec">
                                                                            <span className="wd-timer-value">17 </span>
                                                                            <span className="wd-timer-text">sc</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    id="wd-63e50c013d15f"
                                                                    className=" wd-rs-63e50c013d15f vc_custom_1675955206512 wd-button-wrapper text-left"
                                                                >
                                                                    <a
                                                                        href="/home/productCategory"
                                                                        title
                                                                        className="btn btn-color-primary btn-style-default btn-shape-semi-round btn-size-default btn-icon-pos-right"
                                                                    >
                                                                        Go Shopping
                                                                        <span className="wd-btn-icon">
                                                                            <img
                                                                                decoding="async"
                                                                                src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-white.svg"
                                                                                title="chevron-right-white"
                                                                                width={14}
                                                                                height={14}
                                                                                data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-white.svg"
                                                                                data-ll-status="loaded"
                                                                                className="entered lazyloaded"
                                                                            />

                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    id="carousel-521"
                                                    className="wd-carousel-container  wd-wpb wd-rs-64e4cbd0da5b4  wd-products-element wd-products products wd-products-with-bg title-line-one"
                                                >
                                                    <div className="wd-carousel-inner">
                                                        <div
                                                            className="wd-carousel wd-grid wd-initialized wd-horizontal wd-watch-progress wd-backface-hidden"
                                                            data-scroll_per_page="yes"
                                                            style={{
                                                                "--wd-col-lg": "5",
                                                                "--wd-col-md": "4",
                                                                "--wd-col-sm": "1",
                                                                "--wd-gap-lg": "20px",
                                                                "--wd-gap-sm": "10px",
                                                            }}
                                                        >
                                                            <div
                                                                className="wd-carousel-wrap"
                                                                style={{ cursor: "grab" }}
                                                            >
                                                                <div
                                                                    className="wd-carousel-item wd-slide-visible wd-full-visible wd-active"
                                                                    style={{ width: "262.6px" }}
                                                                >
                                                                    <div
                                                                        className="wd-product wd-hover-small product-grid-item product type-product post-662 status-publish instock product_cat-apple-ipad has-post-thumbnail shipping-taxable purchasable product-type-variable"
                                                                        data-loop={1}
                                                                        data-id={662}
                                                                    >
                                                                        <div className="product-wrapper">
                                                                            <div className="product-element-top">
                                                                                <a
                                                                                    href="https://woodmart.xtemos.com/mega-electronics/product/ipad-mini/"
                                                                                    className="product-image-link"
                                                                                >
                                                                                    <img
                                                                                        decoding="async"
                                                                                        width={80}
                                                                                        height={80}
                                                                                        src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-ipad-mini-starlight-1-80x80.jpg"
                                                                                        className="attachment-80x80 size-80x80 entered lazyloaded"
                                                                                        alt
                                                                                        data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-ipad-mini-starlight-1-80x80.jpg"
                                                                                        data-ll-status="loaded"
                                                                                    />

                                                                                </a>
                                                                            </div>
                                                                            <div className="product-element-bottom">
                                                                                <h3 className="wd-entities-title">
                                                                                    <a href="https://woodmart.xtemos.com/mega-electronics/product/ipad-mini/">
                                                                                        iPad Mini
                                                                                    </a>
                                                                                </h3>
                                                                                <div
                                                                                    className="star-rating"
                                                                                    role="img"
                                                                                    aria-label="Rated 5.00 out of 5"
                                                                                >
                                                                                    <span style={{ width: "100%" }}>
                                                                                        Rated
                                                                                        <strong className="rating">5.00</strong>
                                                                                        out of 5
                                                                                    </span>
                                                                                </div>
                                                                                <span className="price">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            600.00
                                                                                        </bdi>
                                                                                    </span>
                                                                                    –
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            800.00
                                                                                        </bdi>
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="wd-carousel-item wd-slide-visible wd-full-visible wd-slide-next"
                                                                    style={{ width: "262.6px" }}
                                                                >
                                                                    <div
                                                                        className="wd-product wd-hover-small product-grid-item product type-product post-2090 status-publish instock product_cat-sport-watches has-post-thumbnail shipping-taxable purchasable product-type-simple"
                                                                        data-loop={2}
                                                                        data-id={2090}
                                                                    >
                                                                        <div className="product-wrapper">
                                                                            <div className="product-element-top">
                                                                                <a
                                                                                    href="https://woodmart.xtemos.com/mega-electronics/product/apple-watch-ultra/"
                                                                                    className="product-image-link"
                                                                                >
                                                                                    <img
                                                                                        decoding="async"
                                                                                        width={80}
                                                                                        height={80}
                                                                                        src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-watch-ultra-1-80x80.jpg"
                                                                                        className="attachment-80x80 size-80x80 entered lazyloaded"
                                                                                        alt
                                                                                        data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-watch-ultra-1-80x80.jpg"
                                                                                        data-ll-status="loaded"
                                                                                    />

                                                                                </a>
                                                                            </div>
                                                                            <div className="product-element-bottom">
                                                                                <h3 className="wd-entities-title">
                                                                                    <a href="https://woodmart.xtemos.com/mega-electronics/product/apple-watch-ultra/">
                                                                                        Apple Watch Ultra
                                                                                    </a>
                                                                                </h3>
                                                                                <div
                                                                                    className="star-rating"
                                                                                    role="img"
                                                                                    aria-label="Rated 5.00 out of 5"
                                                                                >
                                                                                    <span style={{ width: "100%" }}>
                                                                                        Rated
                                                                                        <strong className="rating">5.00</strong>
                                                                                        out of 5
                                                                                    </span>
                                                                                </div>
                                                                                <span className="price">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            799.00
                                                                                        </bdi>
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="wd-carousel-item wd-slide-visible wd-full-visible"
                                                                    style={{ width: "262.6px" }}
                                                                >
                                                                    <div
                                                                        className="wd-product wd-hover-small product-grid-item product type-product post-239 status-publish last instock product_cat-apple-macbook has-post-thumbnail shipping-taxable purchasable product-type-variable"
                                                                        data-loop={3}
                                                                        data-id={239}
                                                                    >
                                                                        <div className="product-wrapper">
                                                                            <div className="product-element-top">
                                                                                <a
                                                                                    href="https://woodmart.xtemos.com/mega-electronics/product/apple-macbook-air-13-m1/"
                                                                                    className="product-image-link"
                                                                                >
                                                                                    <img
                                                                                        decoding="async"
                                                                                        width={80}
                                                                                        height={80}
                                                                                        src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-macbook-air-13-space-gray-1-2-80x80.jpg"
                                                                                        className="attachment-80x80 size-80x80 entered lazyloaded"
                                                                                        alt
                                                                                        data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-macbook-air-13-space-gray-1-2-80x80.jpg"
                                                                                        data-ll-status="loaded"
                                                                                    />

                                                                                </a>
                                                                            </div>
                                                                            <div className="product-element-bottom">
                                                                                <h3 className="wd-entities-title">
                                                                                    <a href="https://woodmart.xtemos.com/mega-electronics/product/apple-macbook-air-13-m1/">
                                                                                        Apple MacBook Air 13” M1
                                                                                    </a>
                                                                                </h3>
                                                                                <div
                                                                                    className="star-rating"
                                                                                    role="img"
                                                                                    aria-label="Rated 5.00 out of 5"
                                                                                >
                                                                                    <span style={{ width: "100%" }}>
                                                                                        Rated
                                                                                        <strong className="rating">5.00</strong>
                                                                                        out of 5
                                                                                    </span>
                                                                                </div>
                                                                                <span className="price">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            999.00
                                                                                        </bdi>
                                                                                    </span>
                                                                                    –
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            1,299.00
                                                                                        </bdi>
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="wd-carousel-item wd-slide-visible wd-full-visible"
                                                                    style={{ width: "262.6px" }}
                                                                >
                                                                    <div
                                                                        className="wd-product wd-with-labels wd-hover-small product-grid-item product type-product post-1937 status-publish first instock product_cat-apple-iphone has-post-thumbnail featured shipping-taxable purchasable product-type-variable"
                                                                        data-loop={4}
                                                                        data-id={1937}
                                                                    >
                                                                        <div className="product-wrapper">
                                                                            <div className="product-element-top">
                                                                                <a
                                                                                    href="https://woodmart.xtemos.com/mega-electronics/product/apple-iphone-14-plus/"
                                                                                    className="product-image-link"
                                                                                >
                                                                                    <img
                                                                                        decoding="async"
                                                                                        width={80}
                                                                                        height={80}
                                                                                        src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-14-plus-blue-1-80x80.jpg"
                                                                                        className="attachment-80x80 size-80x80 entered lazyloaded"
                                                                                        alt
                                                                                        data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-iphone-14-plus-blue-1-80x80.jpg"
                                                                                        data-ll-status="loaded"
                                                                                    />

                                                                                </a>
                                                                            </div>
                                                                            <div className="product-element-bottom">
                                                                                <h3 className="wd-entities-title">
                                                                                    <a href="https://woodmart.xtemos.com/mega-electronics/product/apple-iphone-14-plus/">
                                                                                        Apple iPhone 14 Plus
                                                                                    </a>
                                                                                </h3>
                                                                                <div
                                                                                    className="star-rating"
                                                                                    role="img"
                                                                                    aria-label="Rated 5.00 out of 5"
                                                                                >
                                                                                    <span style={{ width: "100%" }}>
                                                                                        Rated
                                                                                        <strong className="rating">5.00</strong>
                                                                                        out of 5
                                                                                    </span>
                                                                                </div>
                                                                                <span className="price">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            799.00
                                                                                        </bdi>
                                                                                    </span>
                                                                                    –
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            899.00
                                                                                        </bdi>
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="wd-carousel-item wd-slide-visible wd-full-visible"
                                                                    style={{ width: "262.6px" }}
                                                                >
                                                                    <div
                                                                        className="wd-product wd-with-labels wd-hover-small product-grid-item product type-product post-897 status-publish instock product_cat-all-in-one has-post-thumbnail featured shipping-taxable purchasable product-type-simple"
                                                                        data-loop={5}
                                                                        data-id={897}
                                                                    >
                                                                        <div className="product-wrapper">
                                                                            <div className="product-element-top">
                                                                                <a
                                                                                    href="https://woodmart.xtemos.com/mega-electronics/product/apple-imac-24-m1/"
                                                                                    className="product-image-link"
                                                                                >
                                                                                    <img
                                                                                        decoding="async"
                                                                                        width={80}
                                                                                        height={80}
                                                                                        src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-imac-24-M1-blue-1-80x80.jpg"
                                                                                        className="attachment-80x80 size-80x80 entered lazyloaded"
                                                                                        alt
                                                                                        data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/10/apple-imac-24-M1-blue-1-80x80.jpg"
                                                                                        data-ll-status="loaded"
                                                                                    />

                                                                                </a>
                                                                            </div>
                                                                            <div className="product-element-bottom">
                                                                                <h3 className="wd-entities-title">
                                                                                    <a href="https://woodmart.xtemos.com/mega-electronics/product/apple-imac-24-m1/">
                                                                                        Apple iMac 24″ M1
                                                                                    </a>
                                                                                </h3>
                                                                                <div
                                                                                    className="star-rating"
                                                                                    role="img"
                                                                                    aria-label="Rated 5.00 out of 5"
                                                                                >
                                                                                    <span style={{ width: "100%" }}>
                                                                                        Rated
                                                                                        <strong className="rating">5.00</strong>
                                                                                        out of 5
                                                                                    </span>
                                                                                </div>
                                                                                <span className="price">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            1,299.00
                                                                                        </bdi>
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="wd-carousel-item"
                                                                    style={{ width: "262.6px" }}
                                                                >
                                                                    <div
                                                                        className="wd-product wd-hover-small product-grid-item product type-product post-1277 status-publish instock product_cat-keyboadrs has-post-thumbnail shipping-taxable purchasable product-type-simple"
                                                                        data-loop={6}
                                                                        data-id={1277}
                                                                    >
                                                                        <div className="product-wrapper">
                                                                            <div className="product-element-top">
                                                                                <a
                                                                                    href="https://woodmart.xtemos.com/mega-electronics/product/apple-magic-keyboard-with-touch-id/"
                                                                                    className="product-image-link"
                                                                                >
                                                                                    <img
                                                                                        decoding="async"
                                                                                        width={80}
                                                                                        height={80}
                                                                                        src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2080%2080'%3E%3C/svg%3E"
                                                                                        className="attachment-80x80 size-80x80"
                                                                                        alt
                                                                                        data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-magic-keyboard-with-touch-id-1-80x80.jpg"
                                                                                    />

                                                                                </a>
                                                                            </div>
                                                                            <div className="product-element-bottom">
                                                                                <h3 className="wd-entities-title">
                                                                                    <a href="https://woodmart.xtemos.com/mega-electronics/product/apple-magic-keyboard-with-touch-id/">
                                                                                        Apple Magic Keyboard with Touch ID
                                                                                    </a>
                                                                                </h3>
                                                                                <div
                                                                                    className="star-rating"
                                                                                    role="img"
                                                                                    aria-label="Rated 5.00 out of 5"
                                                                                >
                                                                                    <span style={{ width: "100%" }}>
                                                                                        Rated
                                                                                        <strong className="rating">5.00</strong>
                                                                                        out of 5
                                                                                    </span>
                                                                                </div>
                                                                                <span className="price">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            270.00
                                                                                        </bdi>
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="wd-carousel-item"
                                                                    style={{ width: "262.6px" }}
                                                                >
                                                                    <div
                                                                        className="wd-product wd-with-labels wd-hover-small product-grid-item product type-product post-2126 status-publish last instock product_cat-cases-accessories has-post-thumbnail featured shipping-taxable purchasable product-type-simple"
                                                                        data-loop={7}
                                                                        data-id={2126}
                                                                    >
                                                                        <div className="product-wrapper">
                                                                            <div className="product-element-top">
                                                                                <a
                                                                                    href="https://woodmart.xtemos.com/mega-electronics/product/apple-magsafe-clear-case/"
                                                                                    className="product-image-link"
                                                                                >
                                                                                    <img
                                                                                        decoding="async"
                                                                                        width={80}
                                                                                        height={80}
                                                                                        src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2080%2080'%3E%3C/svg%3E"
                                                                                        className="attachment-80x80 size-80x80"
                                                                                        alt
                                                                                        data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/apple-magsafe-clear-case-1-80x80.jpg"
                                                                                    />

                                                                                </a>
                                                                            </div>
                                                                            <div className="product-element-bottom">
                                                                                <h3 className="wd-entities-title">
                                                                                    <a href="https://woodmart.xtemos.com/mega-electronics/product/apple-magsafe-clear-case/">
                                                                                        Apple MagSafe Clear Case
                                                                                    </a>
                                                                                </h3>
                                                                                <div
                                                                                    className="star-rating"
                                                                                    role="img"
                                                                                    aria-label="Rated 5.00 out of 5"
                                                                                >
                                                                                    <span style={{ width: "100%" }}>
                                                                                        Rated
                                                                                        <strong className="rating">5.00</strong>
                                                                                        out of 5
                                                                                    </span>
                                                                                </div>
                                                                                <span className="price">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            50.00
                                                                                        </bdi>
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="wd-nav-arrows wd-pos-sep wd-hover-1 wd-icon-1">
                                                            <div className="wd-btn-arrow wd-prev wd-disabled">
                                                                <div className="wd-arrow-inner" />
                                                            </div>
                                                            <div className="wd-btn-arrow wd-next">
                                                                <div className="wd-arrow-inner" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1669208817052 wd-rs-637e1aefc8b3e">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-enabled-flex wd-rs-63ca97f31e225">
                                        <div className="vc_column-inner vc_custom_1674221560298">
                                            <div className="wpb_wrapper">
                                                <div
                                                    id="wd-63ca97e116739"
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-63ca97e116739 wd-enabled-width wd-title-color-default wd-title-style-default text-left vc_custom_1674221541822 wd-underline-colored"
                                                >
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-xl">
                                                            Home Appliance
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div
                                                    id="wd-63e125d491cb9"
                                                    className=" wd-rs-63e125d491cb9 vc_custom_1675699678280 wd-button-wrapper text-center inline-element"
                                                >
                                                    <a
                                                        href="https://woodmart.xtemos.com/mega-electronics/product-category/home-appliance/"
                                                        title="Outlet"
                                                        className="btn btn-style-default btn-shape-round btn-size-default btn-icon-pos-right"
                                                    >
                                                        More Products
                                                        <span className="wd-btn-icon">
                                                            <img
                                                                decoding="async"
                                                                src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-primary.svg"
                                                                title="chevron-right-primary"
                                                                width={14}
                                                                height={14}
                                                                data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-right-primary.svg"
                                                                data-ll-status="loaded"
                                                                className="entered lazyloaded"
                                                            />

                                                        </span>
                                                    </a>
                                                </div>
                                                <div
                                                    id
                                                    className="wd-products-element wd-rs-63ca97d62665c wd-wpb"
                                                >
                                                    <div
                                                        className="products wd-products  grid-columns-5 elements-grid wd-grid-g title-line-one wd-stretch-cont-lg wd-products-with-bg"
                                                        data-paged={1}
                                                        data-atts='{"spacing":"20","taxonomies":"274","items_per_page":"5","columns":"5","columns_tablet":"3","sale_countdown":"0","stock_progress_bar":"0","highlighted_products":"0","products_bordered_grid":"0","products_with_background":"1","products_shadow":"0","img_size":"large","woodmart_css_id":"63ca97d62665c","force_not_ajax":"no"}'
                                                        data-source="shortcode"
                                                        data-columns={5}
                                                        data-grid-gallery='{"grid_gallery":"1","grid_gallery_control":"hover","grid_gallery_enable_arrows":"arrows"}'
                                                        style={{
                                                            "--wd-col-lg": "5",
                                                            "--wd-col-md": "3",
                                                            "--wd-col-sm": "2",
                                                            "--wd-gap-lg": "20px",
                                                            "--wd-gap-sm": "10px",
                                                        }}
                                                    >
                                                        {bestOffer.slice(0, 5).map((offer, index) => (
                                                            <div
                                                                className="wd-product wd-with-labels wd-hover-fw-button wd-hover-with-fade wd-col product-grid-item product type-product post-2435 status-publish instock product_cat-vr-headsets has-post-thumbnail sale shipping-taxable purchasable product-type-simple hover-ready"
                                                                data-loop={index}
                                                                data-id={offer.productId} // Assuming you have unique IDs for each product
                                                                key={offer.productId} // Use a unique key for each product

                                                            >
                                                                <div className="product-wrapper">
                                                                    <div className="content-product-imagin" style={{ marginBottom: "-112px" }} />

                                                                    <div className="product-element-top wd-quick-shop">
                                                                        <a className="product-image-link" >
                                                                            <div className="wd-product-grid-slider wd-fill" onClick={() => handleProductDetails(offer.brand)}>
                                                                                {/* {offer.image_urls.map((url, imageIndex) => (
                                                                                    <div
                                                                                        className="wd-product-grid-slide"
                                                                                        key={imageIndex}
                                                                                        data-image-url={url}
                                                                                        data-image-srcset={`${url} 700w, ${url.replace(".jpg", "-263x300.jpg")} 263w, ${url.replace(".jpg", "-88x100.jpg")} 88w, ${url.replace(".jpg", "-430x491.jpg")} 430w, ${url.replace(".jpg", "-180x206.jpg")} 180w`}
                                                                                        data-image-id={imageIndex}

                                                                                    />
                                                                                ))} */}
                                                                            </div>
                                                                            <div className="wd-product-grid-slider-nav wd-fill wd-hover-enabled">
                                                                                <div className="wd-prev" />
                                                                                <div className="wd-next" />
                                                                            </div>
                                                                            <div className="wd-product-grid-slider-pagin">
                                                                                {/* {offer.image_urls.map((_, imageIndex) => (
                                                                                    <div key={imageIndex} data-image-id={imageIndex} className="wd-product-grid-slider-dot" />
                                                                                ))} */}
                                                                            </div>
                                                                            <div className="product-labels labels-rounded-sm">
                                                                                <span className="onsale product-label">{offer.discount}%</span> {/* Assuming you have discount info */}
                                                                            </div>
                                                                            <picture decoding="async" className="attachment-large size-large">
                                                                                <source
                                                                                    type="image/webp"
                                                                                    data-lazy-srcset={`${offer.image_urls}.webp 700w, ${offer.image_urls}.webp 263w`}
                                                                                    srcSet={`${offer.image_urls}.webp 700w, ${offer.image_urls}.webp 263w`}
                                                                                    sizes="(max-width: 700px) 100vw, 700px"
                                                                                />
                                                                                <img
                                                                                    decoding="async"
                                                                                    width={700}
                                                                                    height={800}
                                                                                    src={offer.image_urls}

                                                                                    data-lazy-srcset={`${offer.image_urls} 700w, ${offer.image_urls} 263w`}
                                                                                    data-lazy-sizes="(max-width: 700px) 100vw, 700px"
                                                                                    className="entered lazyloaded"
                                                                                    sizes="(max-width: 700px) 100vw, 700px"
                                                                                    srcSet={`${offer.image_urls} 700w, ${offer.image_urls} 263w`}
                                                                                />
                                                                            </picture>
                                                                        </a>
                                                                        <div className="wd-buttons wd-pos-r-t">
                                                                            <div className="wd-compare-btn product-compare-button wd-action-btn wd-style-icon wd-compare-icon">
                                                                                <a
                                                                                    href={`https://woodmart.xtemos.com/mega-electronics/compare/?product_id=${offer.productId}`}
                                                                                    data-id={offer.productId}
                                                                                    rel="nofollow"
                                                                                    data-added-text="Compare products"
                                                                                >
                                                                                    <span>Compare</span>
                                                                                </a>
                                                                            </div>
                                                                            <div className="quick-view wd-action-btn wd-style-icon wd-quick-view-icon">
                                                                                <a

                                                                                    className="open-quick-view quick-view-button"
                                                                                    rel="nofollow"
                                                                                    data-id={offer.productId}
                                                                                >
                                                                                    Quick view
                                                                                </a>
                                                                            </div>
                                                                            <div className="wd-wishlist-btn wd-action-btn wd-style-icon wd-wishlist-icon">
                                                                                <a
                                                                                    onClick={(e) => handleAddToWishlist(e, offer)}
                                                                                    href="/home/wishlist"
                                                                                    data-key={offer.productId}
                                                                                    data-product-id={offer.productId}
                                                                                    rel="nofollow"
                                                                                    data-added-text="Browse Wishlist"
                                                                                >
                                                                                    <span>{isAdded ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>


                                                                    <div className="product-element-bottom">
                                                                        <h3 className="wd-entities-title">
                                                                            <a href={offer.product_url}>
                                                                                {offer.productName}
                                                                            </a>
                                                                        </h3>
                                                                        <div className="wd-product-cats">
                                                                            <a href={offer.category_url} rel="tag">
                                                                                {offer.category}
                                                                            </a>
                                                                        </div>
                                                                        <div className="star-rating" role="img" aria-label={`Rated ${offer.rating} out of 5`}>
                                                                            <span style={{ width: `${(offer.rating / 5) * 100}%` }}>
                                                                                Rated <strong className="rating">{offer.rating}</strong> out of 5
                                                                            </span>
                                                                        </div>
                                                                        <p className="wd-product-stock stock wd-style-default in-stock">
                                                                            {offer.stockStatus}
                                                                        </p>
                                                                        <div className="wrap-price">
                                                                            <span className="price">
                                                                                <del aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {offer.price}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </del>
                                                                                <span className="screen-reader-text">
                                                                                    Original price was:  {offer.originalPrice}.
                                                                                </span>
                                                                                <ins aria-hidden="true">
                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                        <bdi>
                                                                                            <span className="woocommerce-Price-currencySymbol">
                                                                                                $
                                                                                            </span>
                                                                                            {offer.price}
                                                                                        </bdi>
                                                                                    </span>
                                                                                </ins>
                                                                                <span className="screen-reader-text">
                                                                                    Current price is: $449.00.
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        <div className="wd-add-btn wd-add-btn-replace">
                                                                            <a
                                                                                href="#"
                                                                                aria-describedby="woocommerce_loop_add_to_cart_link_describedby_2435"
                                                                                data-quantity={1}
                                                                                className="button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-loop"
                                                                                data-product_id={2435}
                                                                                data-product_sku={608069}
                                                                                aria-label="Add to cart: Oculus Quest 2"
                                                                                rel="nofollow"
                                                                                onClick={(e) => openCart(e, offer)}
                                                                            >
                                                                                <span>Add to cart</span>
                                                                            </a>
                                                                            <span
                                                                                id="woocommerce_loop_add_to_cart_link_describedby_2435"
                                                                                className="screen-reader-text"
                                                                            ></span>
                                                                        </div>
                                                                        <div className="wd-product-detail wd-product-sku">
                                                                            <span className="wd-label">SKU: </span>
                                                                            <span> <span>{offer.productSku}</span> </span>
                                                                        </div>
                                                                        {/* Add new data */}
                                                                    </div>
                                                                </div>
                                                            </div>))}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="vc_row wpb_row vc_row-fluid vc_custom_1668612970168 vc_row-has-fill wd-rs-6375035fb3c7d">
                                    <div className="wpb_column vc_column_container vc_col-sm-12 wd-rs-63ca988e4d43a wd-collapsible-content">
                                        <div className="vc_column-inner vc_custom_1674221725280">
                                            <div className="wpb_wrapper">
                                                <div
                                                    id="wd-638768520bd96"
                                                    className="title-wrapper wd-wpb wd-set-mb reset-last-child  wd-rs-638768520bd96 wd-title-color-default wd-title-style-default text-left vc_custom_1669818470753 wd-underline-colored"
                                                >
                                                    <div className="liner-continer">
                                                        <h4 className="woodmart-title-container title  wd-font-weight- wd-fontsize-xl">
                                                            Online store of household appliances and electronics
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div
                                                    id="wd-63da1f44d7fc6"
                                                    className="wd-text-block wd-wpb reset-last-child wd-rs-63da1f44d7fc6 text-left "
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
                                                    id="wd-63c1303864fc7"
                                                    className=" wd-rs-63c1303864fc7  wd-button-wrapper text-left wd-collapsible-button"
                                                >
                                                    <a className="btn btn-style-default btn-shape-semi-round btn-size-small btn-icon-pos-right">
                                                        Read More
                                                        <span className="wd-btn-icon">
                                                            <img
                                                                decoding="async"
                                                                src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-down-black.svg"
                                                                title="chevron-down-black"
                                                                width={14}
                                                                height={14}
                                                                data-lazy-src="https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2023/01/chevron-down-black.svg"
                                                                data-ll-status="loaded"
                                                                className="entered lazyloaded"
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

            {/* Cart Modal */}

            <div className={`cart-widget-side wd-side-hidden wd-right ${isCartOpen ? 'wd-opened' : ''}`}>
                <div className="wd-heading">
                    <span className="title">Shopping cart</span>
                    <div className="close-side-widget wd-action-btn wd-style-text wd-cross-icon">
                        <a rel="nofollow" onClick={closeCart}>
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
                                            href="https://woodmart.xtemos.com/mega-electronics/home/cart/?remove_item=b1301141feffabac455e1f90a7de2054&_wpnonce=ee462b7815"
                                            className="remove remove_from_cart_button"
                                            aria-label="Remove Oculus Quest 2 from cart"
                                            data-product_id={2435}
                                            data-cart_item_key="b1301141feffabac455e1f90a7de2054"
                                            data-product_sku={608069}
                                            data-success_message="“Oculus Quest 2” has been removed from your cart"
                                        >
                                            ×
                                        </a>
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
                                            />
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
                                                5 ×
                                                <span className="woocommerce-Price-amount amount">
                                                    <bdi>
                                                        <span className="woocommerce-Price-currencySymbol">
                                                            $
                                                        </span>
                                                        449.00
                                                    </bdi>
                                                </span>
                                            </span>
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
                                            href="https://woodmart.xtemos.com/mega-electronics/home/cart/?remove_item=26e359e83860db1d11b6acca57d8ea88&_wpnonce=ee462b7815"
                                            className="remove remove_from_cart_button"
                                            aria-label="Remove ASUS ZenBook OLED 13 from cart"
                                            data-product_id={298}
                                            data-cart_item_key="26e359e83860db1d11b6acca57d8ea88"
                                            data-product_sku={30884}
                                            data-success_message="“ASUS ZenBook OLED 13” has been removed from your cart"
                                        >
                                            ×
                                        </a>
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
                                            />
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
                                                2 ×
                                                <span className="woocommerce-Price-amount amount">
                                                    <bdi>
                                                        <span className="woocommerce-Price-currencySymbol">
                                                            $
                                                        </span>
                                                        1,600.00
                                                    </bdi>
                                                </span>
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="shopping-cart-widget-footer">
                            <p className="woocommerce-mini-cart__total total">
                                <strong>Subtotal:</strong>
                                <span className="woocommerce-Price-amount amount">
                                    <bdi>
                                        <span className="woocommerce-Price-currencySymbol">$</span>
                                        5,445.00
                                    </bdi>
                                </span>
                            </p>
                            <div className="wd-progress-bar wd-free-progress-bar">
                                <div className="progress-msg">
                                    Your order qualifies for free shipping!
                                </div>
                                <div className="progress-area">
                                    <div className="progress-bar" style={{ width: "100%" }} />
                                </div>
                            </div>
                            <p className="woocommerce-mini-cart__buttons buttons">
                                <a
                                    href="#"
                                    className="button btn-cart wc-forward"
                                    onClick={handleViewCart}
                                >
                                    View cart
                                </a>
                                <a
                                    href="#"
                                    className="button checkout wc-forward"
                                    onClick={handleCheckout}
                                >
                                    Checkout
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`wd-close-side wd-fill ${isCartOpen ? 'wd-close-side-opened' : ''}`} />

        </>
    )
}

export default HomePage;