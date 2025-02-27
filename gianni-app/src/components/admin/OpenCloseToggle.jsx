/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { FaLockOpen, FaLock } from "react-icons/fa";
import { useSignal } from "@preact/signals-react";

const OpenCloseToggle = ({ storeType }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const ws = new WebSocket(`${import.meta.env.VITE_API_URL.replace('http', 'ws')}/ws`);
        
        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: 'GET_STORE_STATE',
                clientId: Date.now().toString(),
                storeType: storeType
            }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'STORE_STATUS_UPDATE' && data.storeType === storeType) {
                setIsOpen(data.state === 'open');
            }
        };

        return () => ws.close();
    }, [storeType]);

    const toggleStoreState = async () => {
        const newState = !isOpen;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/setState`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    state: newState ? 'open' : 'closed',
                    type: storeType 
                })
            });

            if (response.ok) {
                setIsOpen(newState);
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
                className={`absolute w-6 h-6 rounded-full shadow-md transform duration-700 ${isOpen ? "bg-green-500" : "bg-accent"}`}
                style={{ transition: 'all 0.3s ease', left: isOpen ? "2px" : "calc(100% - 2px - 24px)" }}
            />
            <FaLock className="ml-auto text-red-600 w-3"/>
        </div>
    )
}

export default OpenCloseToggle;