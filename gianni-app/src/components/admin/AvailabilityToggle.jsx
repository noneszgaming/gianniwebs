/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { useSignal } from "@preact/signals-react";
import { isWebshopOpen } from "../../signals";

const AvailabilityToggle = ({ itemId, initialAvailability, onToggle }) => {
    const [isAvailable, setIsAvailable] = useState(initialAvailability);

    const handleToggle = async () => {
        try {
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    available: !isAvailable
                })
            });

            if (response.ok) {
                setIsAvailable(!isAvailable);
                // Call the onToggle prop after successful update
                if (onToggle) {
                    onToggle(!isAvailable);
                }
            }
        } catch (error) {
            console.error('Error updating availability:', error);
        }
    };

    return (
        <div
            className="relative w-16 h-8 flex items-center bg-gray-200 cursor-pointer rounded-full p-2 border-2 border-red-500 dark:hover:shadow-lg hover:shadow-lg hover:shadow-red-400 duration-500 self-center"
            onClick={handleToggle}
            role="button"
            tabIndex={0}
        >
            <FaCheck className="text-green-500 w-4"/>
            <span
                className={`absolute w-6 h-6 rounded-full shadow-md transform duration-700 ${isAvailable ? "bg-green-500" : "bg-accent"}`}
                style={{ zIndex: 9, transition: 'all 0.3s ease', left: isAvailable ? "2px" : "calc(100% - 2px - 24px)" }}
            />
            <IoIosClose className="absolute -right-[2px] text-red-600 w-8 h-8 z-0"/>
        </div>
    );
};

export default AvailabilityToggle;
