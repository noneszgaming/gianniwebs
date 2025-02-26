/* eslint-disable no-unused-vars */
import { signal } from "@preact/signals-react"

const isHomeOpened = signal(true);
const isCartOpened = signal(false);
const isOrderDataPageOpened = signal(false);
const isChoosePaymentPageOpened = signal(false);
const isWebshopOpen = signal(true);
const isAddItemOpened = signal(false);
const isUpdateItemOpened = signal(false);
const isSuccessfulPaymentOpened = signal(false);
const isSidePanelOpened = signal(false);
const isAddAllergeneOpened = signal(false);
const isAddBoxOpened = signal(false);
const cartCount = signal(0);

export { 
    isHomeOpened,
    isCartOpened,
    isOrderDataPageOpened,
    isChoosePaymentPageOpened,
    isWebshopOpen,
    isAddItemOpened,
    isUpdateItemOpened,
    isSuccessfulPaymentOpened,
    isSidePanelOpened,
    isAddAllergeneOpened,
    isAddBoxOpened,
    cartCount
}