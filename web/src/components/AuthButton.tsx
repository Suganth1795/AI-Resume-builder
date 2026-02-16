import React from "react";

interface AuthButtonProps {
    type?: "button" | "submit";
    onClick?: () => void;
    disabled?: boolean;
    variant?: "primary" | "outline";
    children: React.ReactNode;
    className?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
    type = "button",
    onClick,
    disabled,
    variant = "primary",
    children,
    className = "",
}) => {
    const baseStyles =
        "w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-3";
    const variants = {
        primary:
            "bg-gray-900 hover:bg-gray-800 text-white disabled:bg-gray-400 disabled:cursor-not-allowed",
        outline:
            "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default AuthButton;
