'use client';

import { useRouter } from 'next/navigation';

const Sidebar = () => {

    const router = useRouter();

    const products = [
        {
            id: 1,
            name: "Bitdefender Antivirus",
            imgAlt: "Bitdefender",
            imgSrc: "https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Laptops-Tablets-PC.svg",
            url: "/home/productCategory?title=Bitdefender" // Assuming the product URL for Bitdefender
        },
        {
            id: 2,
            name: "McAfee Antivirus",
            imgAlt: "McAfee",
            imgSrc: "https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Hardware-Components.svg",
            url: "/home/productCategory?title=McAfee" // Assuming the product URL for McAfee
        },
        {
            id: 3,
            name: "Trend Micro",
            imgAlt: "Trend Micro",
            imgSrc: "https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/TV-HIFI.svg",
            url: "/home/productCategory?title=Trend Micro" // Assuming the product URL for Trend Micro
        },
        {
            id: 4,
            name: "Norton Antivirus",
            imgAlt: "Norton",
            imgSrc: "https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Computer-Office.svg",
            url: "/home/productCategory?title=Norton" // Assuming the product URL for Norton

        },
        {
            id: 5,
            name: "Webroot Antivirus",
            imgAlt: "",
            imgSrc: "https://woodmart.xtemos.com/mega-electronics/wp-content/uploads/sites/9/2022/11/Smartphones.svg",
            url: "/home/productCategory?title=Webroot" // Assuming the product URL for Norton
        }
    ];

    const handleProductClick = (productUrl) => {
        router.push(`${productUrl}`)
    }
    return (
        <>
            <div className="wd-sticky-nav wd-hide-md">
                <div className="wd-sticky-nav-title">
                    <span>All Categories</span>
                </div>
                <ul
                    className="menu wd-nav wd-nav-vertical wd-nav-sticky"
                    id="menu-sticky-navigation-mega-electronics">
                    {products.map(item => (
                        <li
                            key={item.id}
                            className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-3557 item-level-0 menu-mega-dropdown wd-event-hover menu-item-has-children"
                            id={item.id}
                            style={{
                                "--wd-dropdown-width": "275px",
                                cursor:"pointer"
                            }}
                        >
                            <a className="woodmart-nav-link" onClick={() => { handleProductClick(item.url) }}>
                                <img
                                    className="wd-nav-img entered lazyloaded"
                                    src={item.imgSrc}
                                    alt={item.imgAlt}
                                    height="18"
                                    width="18"
                                />
                                <span className="nav-link-text">{item.name}</span>
                            </a>
                        </li>
                    ))}


                </ul>
            </div>

        </>
    )
}
export default Sidebar;