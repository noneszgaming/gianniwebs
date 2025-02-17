/* eslint-disable no-unused-vars */
import { signal } from "@preact/signals-react"

const isHomeOpened = signal(true);
const isCartOpened = signal(false);
const isOrderDataPageOpened = signal(false);
const isChoosePaymentPageOpened = signal(false);
const isWebshopOpen = signal(true);
const isAddItemOpened = signal(false);
const isSuccessfulPaymentOpened = signal(false);
const cartCount = signal(0);

export { 
    isHomeOpened,
    isCartOpened,
    isOrderDataPageOpened,
    isChoosePaymentPageOpened,
    isWebshopOpen,
    isAddItemOpened,
    isSuccessfulPaymentOpened,
    cartCount
}