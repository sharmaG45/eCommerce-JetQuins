import "./globals.css";
import Navbar from "./_components/Navbar/page";
import Footer from "./_components/Footer/page";
import Sidebar from "./_components/Sidebar/page";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const metadata = {
  title: "Cheap Flights, Compare Flights & Airline Deals - onlineflightreservations.com",
  description: "Find the cheapest flight tickets with OnlineFlightReservations ! Compare prices effortlessly and book the best deals on flights through our advanced algorithm. Start saving on your next trip today",
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="browser-Chrome platform-Windows wd-scrollbar js_active  vc_desktop  vc_transform  vc_transform ">
      <head>
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


        <link rel='stylesheet' id='wd-woo-single-prod-el-navigation-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-single-prod-el-navigation.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-single-prod-el-gallery-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-single-prod-el-gallery.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-woo-single-prod-el-gallery-opt-thumb-left-desktop-css' href='/assets/wp-content/themes/woodmart/css/parts/woo-single-prod-el-gallery-opt-thumb-left-desktop.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-swiper-css' href='/assets/wp-content/themes/woodmart/css/parts/lib-swiper.min.css?ver=8.0.4' type='text/css' media='all' />
        <link rel='stylesheet' id='wd-swiper-arrows-css' href='/assets/wp-content/themes/woodmart/css/parts/lib-swiper-arrows.min.css?ver=8.0.4' type='text/css' media='all' />
        {/* <link rel='stylesheet' id='wd-photoswipe-css' href='/assets/wp-content/cache/background-css/woodmart.b-cdn.net/mega-electronics/wp-content/themes/woodmart/css/parts/lib-photoswipe.min.css?ver=8.0.4&wpr_t=1737408789' type='text/css' media='all' /> */}

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

        {/* <script type="text/javascript" src="/assets/wp-content/themes/woodmart/js/scripts/global/swiperInit.min.js?ver=8.0.4" id="wd-swiper-carousel-js"></script> */}
        <script type="text/javascript" src="/assets/wp-content/themes/woodmart/js/libs/swiper.min.js?ver=8.0.4" id="wd-swiper-library-js"></script>
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
          id="wc-add-to-cart-js" data-wp-strategy="defer"></script>
        {/* <script type="text/javascript" src="/assets/wp-content/plugins/woocommerce/assets/js/frontend/woocommerce.min.js?ver=9.1.4" id="woocommerce-js" defer="defer" data-wp-strategy="defer"></script> */}
        <script data-minify="1" type="text/javascript" src="/assets/wp-content/plugins/js_composer/assets/js/vendors/woocommerce-add-to-cart.js?ver=1734449562" id="vc_woocommerce-add-to-cart-js-js" data-rocket-defer defer></script>
        <script type="text/javascript" src="/assets/wp-content/themes/woodmart/js/libs/device.min.js?ver=8.0.4" id="wd-device-library-js" data-rocket-defer defer></script>
        <script type="text/javascript" src="/assets/wp-content/themes/woodmart/js/scripts/global/scrollBar.min.js?ver=8.0.4" id="wd-scrollbar-js" data-rocket-defer defer></script>
        {/* <script type="text/javascript" src="/assets/wp-content/plugins/woocommerce/assets/js/frontend/single-product.min.js?ver=9.1.4" id="wc-single-product-js" defer="defer" data-wp-strategy="defer"></script> */}
      </head>
      <body
        className="home page-template-default page page-id-15 theme-woodmart woocommerce-js wrapper-custom  categories-accordion-on woodmart-ajax-shop-on sticky-toolbar-on hide-larger-price wd-sticky-nav-enabled wpb-js-composer js-comp-ver-7.8 vc_responsiv"
      >

        <Sidebar />
        <div className="wd-page-wrapper website-wrapper">
          <Navbar />
          {children}
          <a className="scrollToTop" aria-label="Scroll to top button" />
          <Footer />

        </div>


      </body>
    </html>
  );
}
