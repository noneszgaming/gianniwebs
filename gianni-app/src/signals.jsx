/* eslint-disable no-unused-vars */
import { signal } from "@preact/signals-react"



export const isWebshopOpen = signal(false)
export const cartCount = signal(0)
export const isSidePanelOpened = signal(false)
export const storeType = signal('public')
export const publicStoreOpen = signal(false);
export const airbnbStoreOpen = signal(false);



const isHomeOpened = signal(true);
const isCartOpened = signal(false);
const isOrderDataPageOpened = signal(false);
const isChoosePaymentPageOpened = signal(false);

const isAddItemOpened = signal(false);
const isUpdateItemOpened = signal(false);
const isSuccessfulPaymentOpened = signal(false);

const isAddAllergeneOpened = signal(false);
const isAddBoxOpened = signal(false);


export { 
    isHomeOpened,
    isCartOpened,
    isOrderDataPageOpened,
    isChoosePaymentPageOpened,

    isAddItemOpened,
    isUpdateItemOpened,
    isSuccessfulPaymentOpened,

    isAddAllergeneOpened,
    isAddBoxOpened

}