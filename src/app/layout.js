import "./globals.css";
import Script from "next/script";
import LoadingSpinner from "./loading/page";
import Navbar from "./_components/Navbar/page";
import Footer from "./_components/Footer/page";
import Sidebar from "./_components/Sidebar/page";
import { Suspense } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import { CartContextProvider } from "./_components/CartContext/page";

export const metadata = {
  title: "Cheap Antivirus, Compare Antivirus & Antivirus Deals",
  description: "Find the cheapest Antivirus with GetPixelSecurity ! Compare prices effortlessly and Buy the best deals on Antivirus through our advanced algorithm.",
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="browser-Chrome platform-Windows wd-scrollbar js_active  vc_desktop  vc_transform  vc_transform ">
      <head>

        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          integrity="sha384-B4gt1jrGC7Jh4A6zDdpPXlJmPb3P4XhpRNNUGih+hjI7Z9nU6hA3R4PjI14Kp6k9"
          crossOrigin="anonymous"
        />

        {/* End */}

        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-page-empty-page.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-page-wishlist.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/all.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/css.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/player.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/v4-shims.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/selects2.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/mega-electronics.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart-child/style.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart-child/wordfence.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/base.min.css?v=2" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/header-base.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/header-el-base.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/header-el-cart.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/header-el-cart-side.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/header-el-mobile-nav-drilldown.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/header-el-mobile-nav-drilldown-slide.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/header-el-my-account-sidebar.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/header-el-my-account.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/header-el-search-form.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/header-el-search.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/header-mod-content-calc.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/footer-base.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/blog-base.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/blog-loop-base.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/blog-loop-design-meta-image.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/el-banner-hover-zoom.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/el-button.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/el-countdown-timer.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/el-info-box.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/el-section-title.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/el-slider-dots-style-3.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/el-slider.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/el-social-icons.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/el-subtitle-style.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/el-banner-hover-zoom.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/el-accordion-wpb-elem.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/el-accordion.min.css" rel="stylesheet" />

        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-mod-order-details.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/el-text-block.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/helpers-wpb-elem.min.css?ver=8.0.4" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/int-mc4wp.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/mod-dropdown-full-height.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/mod-highlighted-text.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/mod-more-description.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/mod-nav-menu-label.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/mod-nav-vertical.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/mod-star-rating.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/mod-tools-design-8.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/mod-tools.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/wd-search-form.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/wd-search-results.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/widget-nav.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/widget-recent-post-comments.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/widget-wd-recent-posts.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-categories-loop-layout-masonry.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-categories-loop-old.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-categories-loop.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-el-track-order.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-mod-add-btn-replace.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-mod-block-notices.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-mod-login-form.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-mod-product-labels.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-mod-progress-bar.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-mod-quantity.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-mod-shop-attributes.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-mod-stock-status.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-mod-swatches-base.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-mod-swatches-dis-style-1.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-page-my-account.min.css" rel="stylesheet" />

        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-mod-swatches-filter.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-mod-swatches-style-3.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-opt-free-progress-bar.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-opt-grid-gallery.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-opt-hide-larger-price.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-opt-products-bg.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-opt-stretch-cont.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-opt-title-limit.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-page-wishlist-popup.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-prod-loop-fw-button.min.css" rel="stylesheet" />

        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-prod-loop-small.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-product-loop.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-widget-product-list.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-widget-shopping-cart.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-widget-slider-price-filter.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-widget-wd-layered-nav.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woocommerce-base.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/wpb-el-banner.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/wpb-opt-collapsible-content.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/int-mc4wp.min.css" rel="stylesheet" />

        <link href="/assets/wp-content/themes/woodmart/css/parts/int-woo-paypal-payments.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/int-wpb-base-deprecated.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/int-wpb-base.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/int-wpcf7.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/lib-magnific-popup.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/lib-swiper-arrows.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/lib-swiper-pagin.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/lib-swiper.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/woo-page-wishlist-popup.min.css" rel="stylesheet" />

        <link rel='stylesheet' id='wd-woo-single-prod-el-navigation-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-single-prod-el-navigation.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-single-prod-el-gallery-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-single-prod-el-gallery.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-single-prod-el-gallery-opt-thumb-left-desktop-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-single-prod-el-gallery-opt-thumb-left-desktop.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-swiper-css' href='/assets/wp-content/themes/woodmart/css/parts/lib-swiper.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-swiper-arrows-css' href='/assets/wp-content/themes/woodmart/css/parts/lib-swiper-arrows.min.css?ver=8.0.4' type='text/css' media='all' />
        {/* <link rel='stylesheet' id='wd-photoswipe-css' href='/assets/wp-content/cache/background-css/woodmart.b-cdn.net/mega-electronics/wp-content/themes/woodmart/css/parts/woo-page-my-account.min.css' type='text/css' media='all' /> */}

        <link href="/assets/wp-content/themes/woodmart/css/parts/opt-bottom-toolbar.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/opt-scrolltotop.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/opt-sticky-nav.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/themes/woodmart/css/parts/opt-widget-collapse.min.css" rel="stylesheet" />
        <link href="/assets/wp-content/uploads/sites/9/2023/02/js_composer-1675763874.css" rel="stylesheet" />
        <link href="/assets/wp-content/plugins/xz-system/css/demos_preview_style.css" rel="stylesheet" />
        <link rel='stylesheet' id='wd-woo-page-login-register-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-page-login-register.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-page-login-register-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-page-lost-password.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-single-prod-el-reviews-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-single-prod-el-reviews.css' type='text/css' media='all' />

        <link rel='stylesheet' id='wd-page-title-css' href='/assets/wp-content/themes/woodmart/css/parts/page-404-min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-mod-shop-table-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-mod-shop-table.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-page-cart-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-page-cart.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-page-title-css' href='/assets/wp-content/themes/woodmart/css/parts/page-title.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-mod-checkout-steps-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-mod-checkout-steps.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-page-checkout-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-page-checkout.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-page-checkout-payment-methods-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-page-checkout-el-payment-methods.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-page-checkout-builder-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-page-checkout-builder.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-opt-manage-checkout-prod-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-opt-manage-checkout-prod.min.css?ver=8.0.4' type='text/css' media='all' />


        <link rel='stylesheet' id='wd-wpbakery-base-css' href='/assets/wp-content/themes/woodmart/css/parts/int-wpb-base.min.css?ver=8.0.6' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woocommerce-base-css' href='/assets/wp-content/themes/woodmart/css/parts/woocommerce-base.min.css?ver=8.0.6' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-mod-quantity-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-mod-quantity.min.css?ver=8.0.6' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-mod-progress-bar-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-mod-progress-bar.min.css?ver=8.0.6' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-single-prod-builder-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-single-prod-builder.min.css?ver=8.0.6' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-single-prod-el-gallery-opt-thumb-left-desktop-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-single-prod-el-gallery-opt-thumb-left-desktop.min.css?ver=8.0.6' type='text/css'
          media='all' />
        <link rel='stylesheet' id='wd-swiper-css' href='/assets/wp-content/themes/woodmart/css/parts/lib-swiper.min.css?ver=8.0.6' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-swiper-arrows-css' href='/assets/wp-content/themes/woodmart/css/parts/lib-swiper-arrows.min.css?ver=8.0.6' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-list-css' href='/assets/wp-content/themes/woodmart/css/parts/el-list.min.css?ver=8.0.6' type='text/css' media='all' />
        <script type="text/javascript" src="/assets/wp-content/plugins/woocommerce/assets/js/zoom/jquery.zoom.min.js?ver=1.7.21-wc.9.6.0" id="zoom-js" defer="defer" data-wp-strategy="defer"></script>
        <script type="text/javascript" src="/assets/wp-includes/js/jquery/jquery.min.js?ver=3.7.1" id="jquery-core-js"></script>

        {/* <script type="text/javascript" src="/assets/wp-content/themes/woodmart/js/scripts/global/swiperInit.min.js?ver=8.0.4" id="wd-swiper-carousel-js"></script> */}
        <script type="text/javascript" src="/assets/wp-content/themes/woodmart/js/libs/swiper.min.js?ver=8.0.4" ></script>
        <script src="/assets/wp-includes/js/jquery/jquery.min.js"></script>
        <script src="/assets/wp-content/themes/woodmart/js/libs/autocomplete.min.js"></script>
        <script src="/assets/wp-content/themes/woodmart/js/libs/countdown-bundle.min.js"></script>
        <script src="/assets/wp-content/themes/woodmart/js/libs/device.min.js"></script>
        <script src="/assets/wp-content/themes/woodmart/js/libs/magnific-popup.min.js"></script>
        <script src="/assets/wp-content/themes/woodmart/js/libs/tooltips.min.js"></script>
        <script src="/assets/wp-content/themes/woodmart/js/libs/swiper.min.js"></script>
        {/* <script src="/assets/wp-content/themes/woodmart/js/scripts/header/headerBuilder.min.js"></script> */}
        <script type="text/javascript"
          src="/assets/wp-content/plugins/woocommerce/assets/js/frontend/add-to-cart.min.js?ver=9.1.4"
        ></script>
        {/* <script type="text/javascript" src="/assets/wp-content/plugins/woocommerce/assets/js/frontend/woocommerce.min.js?ver=9.1.4" id="woocommerce-js" defer="defer" data-wp-strategy="defer"></script> */}
        <script data-minify="1" type="text/javascript" src="/assets/wp-content/plugins/js_composer/assets/js/vendors/woocommerce-add-to-cart.js?ver=1734449562"  ></script>
        <script type="text/javascript" src="/assets/wp-content/themes/woodmart/js/libs/device.min.js?ver=8.0.4"  ></script>
        <script type="text/javascript" src="/assets/wp-content/themes/woodmart/js/scripts/global/scrollBar.min.js?ver=8.0.4"  ></script>
        {/* <script type="text/javascript" src="/assets/wp-content/plugins/woocommerce/assets/js/frontend/single-product.min.js?ver=9.1.4" id="wc-single-product-js" defer="defer" data-wp-strategy="defer"></script> */}
        {/* <Script
          id="woodmart-theme-js-extra"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
          var woodmart_settings = {
            "menu_storage_key": "woodmart_3128b6324db01cf556c05654a19435a9",
          "ajax_dropdowns_save": "1",
          "photoswipe_close_on_scroll": "1",
          "woocommerce_ajax_add_to_cart": "yes",
          "variation_gallery_storage_method": "old",
          "elementor_no_gap": "enabled",
          "adding_to_cart": "Processing",
          "added_to_cart": "Product was successfully added to your cart.",
          "continue_shopping": "Continue shopping",
          "view_cart": "View Cart",
          "go_to_checkout": "Checkout",
          "loading": "Loading...",
          "countdown_days": "days",
          "countdown_hours": "hr",
          "countdown_mins": "min",
          "countdown_sec": "sc",
          "cart_url": "https:\/\/woodmart.xtemos.com\/mega-electronics\/cart\/",
          "ajaxurl": "https:\/\/woodmart.xtemos.com\/mega-electronics\/wp-admin\/admin-ajax.php",
          "add_to_cart_action": "widget",
          "added_popup": "no",
          "categories_toggle": "yes",
          "enable_popup": "no",
          "popup_delay": "2000",
          "popup_event": "time",
          "popup_scroll": "1000",
          "popup_pages": "0",
          "promo_popup_hide_mobile": "yes",
          "product_images_captions": "no",
          "ajax_add_to_cart": "1",
          "all_results": "View all results",
          "zoom_enable": "yes",
          "ajax_scroll": "yes",
          "ajax_scroll_class": ".wd-page-content",
          "ajax_scroll_offset": "100",
          "infinit_scroll_offset": "300",
          "product_slider_auto_height": "no",
          "price_filter_action": "click",
          "product_slider_autoplay": "",
          "close": "Close (Esc)",
          "share_fb": "Share on Facebook",
          "pin_it": "Pin it",
          "tweet": "Share on X",
          "download_image": "Download image",
          "off_canvas_column_close_btn_text": "Close",
          "cookies_version": "1",
          "header_banner_version": "1",
          "promo_version": "1",
          "header_banner_close_btn": "yes",
          "header_banner_enabled": "no",
          "whb_header_clone": "\n\t<div class=\"whb-sticky-header whb-clone whb-main-header {{ wrapperClasses }}\">\n\t\t<div class=\"{{ cloneClass }}\">\n\t\t\t<div class=\"container\">\n\t\t\t\t<div class=\"whb-flex-row whb-general-header-inner\">\n\t\t\t\t\t<div class=\"whb-column whb-col-left whb-visible-lg\">\n\t\t\t\t\t\t{{.site - logo }}\n\t\t\t\t\t<\/div>\n\t\t\t\t\t<div class=\"whb-column whb-col-center whb-visible-lg\">\n\t\t\t\t\t\t{{.wd - header - main - nav }}\n\t\t\t\t\t<\/div>\n\t\t\t\t\t<div class=\"whb-column whb-col-right whb-visible-lg\">\n\t\t\t\t\t\t{{.wd - header - my - account }}\n\t\t\t\t\t\t{{.wd - header - search:not(.wd-header-search-mobile)}}\n\t\t\t\t\t\t{{.wd - header - wishlist }}\n\t\t\t\t\t\t{{.wd - header - compare }}\n\t\t\t\t\t\t{{.wd - header - cart }}\n\t\t\t\t\t\t{{.wd - header - fs - nav }}\n\t\t\t\t\t<\/div>\n\t\t\t\t\t{{.whb - mobile - left }}\n\t\t\t\t\t{{.whb - mobile - center }}\n\t\t\t\t\t{{.whb - mobile - right }}\n\t\t\t\t<\/div>\n\t\t\t<\/div>\n\t\t<\/div>\n\t<\/div>\n",
          "pjax_timeout": "5000",
          "split_nav_fix": "",
          "shop_filters_close": "no",
          "woo_installed": "1",
          "base_hover_mobile_click": "no",
          "centered_gallery_start": "1",
          "quickview_in_popup_fix": "",
          "one_page_menu_offset": "150",
          "hover_width_small": "1",
          "is_multisite": "1",
          "current_blog_id": "9",
          "swatches_scroll_top_desktop": "no",
          "swatches_scroll_top_mobile": "no",
          "lazy_loading_offset": "0",
          "add_to_cart_action_timeout": "no",
          "add_to_cart_action_timeout_number": "3",
          "single_product_variations_price": "yes",
          "google_map_style_text": "Custom style",
          "quick_shop": "yes",
          "sticky_product_details_offset": "150",
          "sticky_product_details_different": "100",
          "preloader_delay": "500",
          "comment_images_upload_size_text": "Some files are too large. Allowed file size is 1 MB.",
          "comment_images_count_text": "You can upload up to 3 images to your review.",
          "single_product_comment_images_required": "no",
          "comment_required_images_error_text": "Image is required.",
          "comment_images_upload_mimes_text": "You are allowed to upload images only in png, jpeg formats.",
          "comment_images_added_count_text": "Added %s image(s)",
          "comment_images_upload_size": "1048576",
          "comment_images_count": "3",
          "search_input_padding": "no",
          "comment_images_upload_mimes": {
            "jpg|jpeg|jpe": "image\/jpeg",
          "png": "image\/png"
            },
          "home_url": "https:\/\/woodmart.xtemos.com\/mega-electronics\/",
          "shop_url": "https:\/\/woodmart.xtemos.com\/mega-electronics\/shop\/",
          "age_verify": "no",
          "banner_version_cookie_expires": "60",
          "promo_version_cookie_expires": "7",
          "age_verify_expires": "30",
          "countdown_timezone": "GMT",
          "cart_redirect_after_add": "no",
          "swatches_labels_name": "no",
          "product_categories_placeholder": "Select a category",
          "product_categories_no_results": "No matches found",
          "cart_hash_key": "wc_cart_hash_2cd9a0981480a0f3547262560cdb5f57",
          "fragment_name": "wc_fragments_2cd9a0981480a0f3547262560cdb5f57",
          "photoswipe_template": "<div class=\"pswp\" aria-hidden=\"true\" role=\"dialog\" tabindex=\"-1\"><div class=\"pswp__bg\"><\/div><div class=\"pswp__scroll-wrap\"><div class=\"pswp__container\"><div class=\"pswp__item\"><\/div><div class=\"pswp__item\"><\/div><div class=\"pswp__item\"><\/div><\/div><div class=\"pswp__ui pswp__ui--hidden\"><div class=\"pswp__top-bar\"><div class=\"pswp__counter\"><\/div><button class=\"pswp__button pswp__button--close\" title=\"Close (Esc)\"><\/button> <button class=\"pswp__button pswp__button--share\" title=\"Share\"><\/button> <button class=\"pswp__button pswp__button--fs\" title=\"Toggle fullscreen\"><\/button> <button class=\"pswp__button pswp__button--zoom\" title=\"Zoom in\/out\"><\/button><div class=\"pswp__preloader\"><div class=\"pswp__preloader__icn\"><div class=\"pswp__preloader__cut\"><div class=\"pswp__preloader__donut\"><\/div><\/div><\/div><\/div><\/div><div class=\"pswp__share-modal pswp__share-modal--hidden pswp__single-tap\"><div class=\"pswp__share-tooltip\"><\/div><\/div><button class=\"pswp__button pswp__button--arrow--left\" title=\"Previous (arrow left)\"><\/button> <button class=\"pswp__button pswp__button--arrow--right\" title=\"Next (arrow right)>\"><\/button><div class=\"pswp__caption\"><div class=\"pswp__caption__center\"><\/div><\/div><\/div><\/div><\/div>",
          "load_more_button_page_url": "yes",
          "load_more_button_page_url_opt": "yes",
          "menu_item_hover_to_click_on_responsive": "no",
          "clear_menu_offsets_on_resize": "yes",
          "three_sixty_framerate": "60",
          "three_sixty_prev_next_frames": "5",
          "ajax_search_delay": "300",
          "animated_counter_speed": "3000",
          "site_width": "1400",
          "cookie_secure_param": "1",
          "cookie_path": "\/",
          "theme_dir": "https:\/\/woodmart.xtemos.com\/mega-electronics\/wp-content\/themes\/woodmart",
          "slider_distortion_effect": "sliderWithNoise",
          "current_page_builder": "wpb",
          "collapse_footer_widgets": "yes",
          "carousel_breakpoints": {
            "1025": "lg",
          "768.98": "md",
          "0": "sm"
            },
          "ajax_fullscreen_content": "yes",
          "grid_gallery_control": "hover",
          "grid_gallery_enable_arrows": "arrows",
          "ajax_shop": "1",
          "add_to_cart_text": "Add to cart",
          "mobile_navigation_drilldown_back_to": "Back to %s",
          "mobile_navigation_drilldown_back_to_main_menu": "Back to menu",
          "mobile_navigation_drilldown_back_to_categories": "Back to categories",
          "tooltip_left_selector": ".wd-buttons[class*=\"wd-pos-r\"] .wd-action-btn, .wd-portfolio-btns .portfolio-enlarge",
            "tooltip_top_selector": ".wd-tooltip, .wd-buttons:not([class*=\"wd-pos-r\"]) > .wd-action-btn, body:not(.catalog-mode-on):not(.login-see-prices) .wd-hover-base .wd-bottom-actions .wd-action-btn.wd-style-icon, .wd-hover-base .wd-compare-btn, body:not(.logged-in) .wd-review-likes a",
          "ajax_links": ".wd-nav-product-cat a, .wd-page-wrapper .widget_product_categories a, .widget_layered_nav_filters a, .woocommerce-widget-layered-nav a, .filters-area:not(.custom-content) a, body.post-type-archive-product:not(.woocommerce-account) .woocommerce-pagination a, body.tax-product_cat:not(.woocommerce-account) .woocommerce-pagination a, .wd-shop-tools a:not([rel=\"v:url\"]), .woodmart-woocommerce-layered-nav a, .woodmart-price-filter a, .wd-clear-filters a, .woodmart-woocommerce-sort-by a, .woocommerce-widget-layered-nav-list a, .wd-widget-stock-status a, .widget_nav_mega_menu a, .wd-products-shop-view a, .wd-products-per-page a, .category-grid-item a, .wd-cat a, body[class*=\"tax-pa_\"] .woocommerce-pagination a",
          "wishlist_expanded": "no",
          "wishlist_show_popup": "enable",
          "wishlist_page_nonce": "badb3c3f78",
          "wishlist_fragments_nonce": "02149ff1ac",
          "wishlist_remove_notice": "Do you really want to remove these products?",
          "wishlist_hash_name": "woodmart_wishlist_hash_c0c0c92a5efe41003581dc278272801d",
          "wishlist_fragment_name": "woodmart_wishlist_fragments_c0c0c92a5efe41003581dc278272801d",
          "wishlist_save_button_state": "no",
          "wishlist_current_default_group_text": "Current default group",
          "wishlist_default_group_text": "Default group",
          "wishlist_rename_group_notice": "Title is empty!",
          "counter_visitor_live_duration": "10000",
          "counter_visitor_ajax_update": "yes",
          "counter_visitor_live_mode": "no",
          "is_criteria_enabled": "1",
          "summary_criteria_ids": "value_for_money,durability,delivery_speed",
          "review_likes_tooltip": "Please log in to rate reviews.",
          "vimeo_library_url": "https:\/\/woodmart.xtemos.com\/mega-electronics\/wp-content\/themes\/woodmart\/js\/libs\/vimeo-player.min.js",
          "compare_by_category": "yes",
          "compare_page_nonce": "16edb3bd2f",
          "compare_save_button_state": "no",
          "reviews_criteria_rating_required": "no",
          "is_rating_summary_filter_enabled": "1"
        };


          var woodmart_variation_gallery_data = [];
          `
          }}


        />

        <script type="text/javascript"
          src="/assets/wp-content/themes/woodmart/js/scripts/global/helpers.min.js?ver=8.0.6"
          id="woodmart-theme-js"></script>
        <script type="text/javascript"
          src="/assets/wp-content/themes/woodmart/js/libs/swiper.min.js?ver=8.0.6"
          id="wd-swiper-library-js"></script>
        <script type="text/javascript"
          src="/assets/wp-content/themes/woodmart/js/scripts/global/swiperInit.min.js?ver=8.0.6"
          id="wd-swiper-carousel-js"></script> */}
      </head>
      <body
        className="home page-template-default page page-id-15 theme-woodmart woocommerce-js wrapper-custom  categories-accordion-on woodmart-ajax-shop-on sticky-toolbar-on hide-larger-price wd-sticky-nav-enabled wpb-js-composer js-comp-ver-7.8 vc_responsiv"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <CartContextProvider>
            <Sidebar />
            <div className="wd-page-wrapper website-wrapper">
              <Navbar />
              <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
              {children}
              <a className="scrollToTop" aria-label="Scroll to top button" />
              <Footer />
            </div>
          </CartContextProvider>
        </Suspense>
      </body>
    </html>
  );
}
