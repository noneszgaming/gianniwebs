/* eslint-disable no-unused-vars */
import { signal } from "@preact/signals-react"

const isHomeOpened = signal(true);
const isCartOpened = signal(false);
const isOrderDataPageOpened = signal(false);
const isChoosePaymentPageOpened = signal(false);
const isWebshopOpen = signal(true);


export { 
    isHomeOpened,
    isCartOpened,
    isOrderDataPageOpened,
    isChoosePaymentPageOpened,
    isWebshopOpen,
}