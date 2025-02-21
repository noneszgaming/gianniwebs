/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { FaLockOpen, FaLock } from "react-icons/fa";
import { useSignal } from "@preact/signals-react";
import { isWebshopOpen } from "../../signals";

const OpenCloseToggle = () => {
    useSignal();

    const toggleStoreState = async () => {
        const newState = !isWebshopOpen.value;
        try {
            const token = localStorage.getItem('adminToken');
            console.log("Sending request to server with state:", newState ? 'open' : 'closed');
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/setState`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ state: newState ? 'open' : 'closed' })
            });

            const data = await response.json();
            console.log("Server response:", data);

            if (response.ok) {
                isWebshopOpen.value = newState;
                console.log("New store state:", isWebshopOpen.value);
            } else {
                console.error('Server error:', data);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <div
            className="relative w-16 h-8 flex items-center bg-gray-200 cursor-pointer rounded-full p-2 border-2 border-accent dark:hover:shadow-lg hover:shadow-lg hover:shadow-light-accent duration-500"
            onClick={toggleStoreState}
            role="button"
            tabIndex={0}
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