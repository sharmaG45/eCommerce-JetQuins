"use client"
import { act, createContext, useReducer, useState } from "react";

// Add

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const CartReducer = (state, action) => {
        console.log(action, "Context Action")
        if (action.type === "Add") {
            console.log("Add To Cart Triggered")
            let productCart = cart;
            productCart.push(action.payload);
            console.log(productCart, "Current Cart Status Add To Cart");
            setCart(productCart);
        } else if (action.type === "Remove") {
            let productCart = cart;
            productCart.pop(productCart.indexOf(action.payload));
            console.log(productCart, "Current Cart Status")
            setCart(productCart);
        } else if (action.type === "Update") {
            console.log("Current Cart Data from Database", action.payload)
            setCart(action.payload);
        }
    };

    const [state, dispatch] = useReducer(CartReducer, cart);

    return <CartContext.Provider value={{ data: cart, dispatch }} >
        {children}
    </CartContext.Provider>

}