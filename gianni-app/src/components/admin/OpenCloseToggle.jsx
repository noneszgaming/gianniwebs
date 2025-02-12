/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { FaLockOpen, FaLock } from "react-icons/fa";

import { useSignal } from "@preact/signals-react";
import { isWebshopOpen } from "../../signals";

const OpenCloseToggle = () => {
    
    useSignal();

    return (
        <div
            className="relative w-16 h-8 flex items-center bg-gray-200 cursor-pointer rounded-full p-2 border-2 border-red-500 dark:hover:shadow-lg hover:shadow-lg hover:shadow-red-400 duration-500"
            onClick={() => isWebshopOpen.value = !isWebshopOpen.value}
        >
            <FaLockOpen className="text-green-500 w-4"/>
            <span
                className={`absolute  w-6 h-6 rounded-full shadow-md transform duration-700 ${isWebshopOpen.value ? "bg-green-500" : "bg-accent"}`}
                style={{ transition: 'all 0.3s ease', left: isWebshopOpen.value ? "2px" : "calc(100% - 2px - 24px)" }}
            />
            <FaLock className="ml-auto text-red-600 w-3"/>
        </div>
    )
}

export default OpenCloseToggle;
