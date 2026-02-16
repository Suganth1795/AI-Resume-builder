import React from "react";

interface GeometricIllustrationProps {
    mouseX: number;
    mouseY: number;
    eyesClosed: boolean;
}

const GeometricIllustration: React.FC<GeometricIllustrationProps> = ({
    mouseX,
    mouseY,
    eyesClosed,
}) => {
    // Calculate 360-degree eye movement
    const centerX = 0.5;
    const centerY = 0.5;
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(
        Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 2,
        1
    );

    // Smooth eye movement with full range
    const maxEyeMove = 5;
    const eyeOffsetX = Math.cos(angle) * distance * maxEyeMove;
    const eyeOffsetY = Math.sin(angle) * distance * maxEyeMove;

    // Subtle parallax movement for shapes
    const parallaxX = deltaX * 8;
    const parallaxY = deltaY * 8;

    const transition = { transition: "all 0.12s ease-out" };

    return (
        <svg
            viewBox="0 0 240 280"
            className="w-full h-full max-w-[380px] max-h-[460px]"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Gradient definitions */}
            <defs>
                <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C6CF0" />
                    <stop offset="100%" stopColor="#5B4BC7" />
                </linearGradient>
                <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF7B4A" />
                    <stop offset="100%" stopColor="#E85A25" />
                </linearGradient>
                <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD76A" />
                    <stop offset="100%" stopColor="#F5C045" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.15" />
                </filter>
            </defs>

            {/* Orange Half Circle - Base */}
            <ellipse
                cx={95 + parallaxX * 0.2}
                cy={265 + parallaxY * 0.2}
                rx="85"
                ry="35"
                fill="url(#orangeGrad)"
                style={transition}
            />

            {/* Purple Tilted Rectangle with eyes - Back character */}
            <g
                transform={`rotate(-12, 100, 100) translate(${parallaxX * 0.4}, ${parallaxY * 0.4})`}
                style={transition}
                filter="url(#shadow)"
            >
                <rect
                    x="55"
                    y="35"
                    width="80"
                    height="145"
                    rx="14"
                    fill="url(#purpleGrad)"
                />

                {eyesClosed ? (
                    <>
                        {/* Closed eyes - cute arcs */}
                        <path
                            d="M75 85 Q85 80 95 85"
                            stroke="#1a1a1a"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                            style={transition}
                        />
                        <path
                            d="M105 85 Q115 80 125 85"
                            stroke="#1a1a1a"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                            style={transition}
                        />
                    </>
                ) : (
                    <>
                        {/* Open eyes */}
                        <circle
                            cx={85 + eyeOffsetX}
                            cy={85 + eyeOffsetY}
                            r="5"
                            fill="#1a1a1a"
                            style={transition}
                        />
                        <circle
                            cx={115 + eyeOffsetX}
                            cy={85 + eyeOffsetY}
                            r="5"
                            fill="#1a1a1a"
                            style={transition}
                        />
                        {/* Eye highlights */}
                        <circle
                            cx={87 + eyeOffsetX * 0.3}
                            cy={83 + eyeOffsetY * 0.3}
                            r="1.8"
                            fill="white"
                            style={transition}
                        />
                        <circle
                            cx={117 + eyeOffsetX * 0.3}
                            cy={83 + eyeOffsetY * 0.3}
                            r="1.8"
                            fill="white"
                            style={transition}
                        />
                    </>
                )}
            </g>

            {/* Black Vertical Rectangle - Right character */}
            <g
                transform={`translate(${parallaxX * 0.6}, ${parallaxY * 0.6})`}
                style={transition}
                filter="url(#shadow)"
            >
                <rect x="145" y="125" width="55" height="115" rx="12" fill="#1a1a1a" />
                {/* Eyes background */}
                <circle cx="160" cy="170" r="6" fill="white" style={transition} />
                <circle cx="185" cy="170" r="6" fill="white" style={transition} />

                {eyesClosed ? (
                    <>
                        <path
                            d="M155 170 Q160 167 165 170"
                            stroke="#1a1a1a"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            fill="none"
                            style={transition}
                        />
                        <path
                            d="M180 170 Q185 167 190 170"
                            stroke="#1a1a1a"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            fill="none"
                            style={transition}
                        />
                    </>
                ) : (
                    <>
                        <circle
                            cx={160 + eyeOffsetX * 0.4}
                            cy={170 + eyeOffsetY * 0.4}
                            r="2.5"
                            fill="#1a1a1a"
                            style={transition}
                        />
                        <circle
                            cx={185 + eyeOffsetX * 0.4}
                            cy={170 + eyeOffsetY * 0.4}
                            r="2.5"
                            fill="#1a1a1a"
                            style={transition}
                        />
                    </>
                )}
            </g>

            {/* Yellow Rounded Shape - Front character */}
            <g
                transform={`translate(${parallaxX * 0.3}, ${parallaxY * 0.3})`}
                style={transition}
                filter="url(#shadow)"
            >
                <rect
                    x="60"
                    y="175"
                    width="80"
                    height="75"
                    rx="18"
                    fill="url(#yellowGrad)"
                />
                {/* Rosy cheeks */}
                <circle cx="75" cy="210" r="6" fill="#FFB088" opacity="0.5" />
                <circle cx="125" cy="210" r="6" fill="#FFB088" opacity="0.5" />

                {eyesClosed ? (
                    <>
                        <path
                            d="M75 200 Q85 195 95 200"
                            stroke="#1a1a1a"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                            style={transition}
                        />
                        <path
                            d="M105 200 Q115 195 125 200"
                            stroke="#1a1a1a"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                            style={transition}
                        />
                    </>
                ) : (
                    <>
                        <circle
                            cx={85 + eyeOffsetX * 0.6}
                            cy={200 + eyeOffsetY * 0.6}
                            r="4.5"
                            fill="#1a1a1a"
                            style={transition}
                        />
                        <circle
                            cx={115 + eyeOffsetX * 0.6}
                            cy={200 + eyeOffsetY * 0.6}
                            r="4.5"
                            fill="#1a1a1a"
                            style={transition}
                        />
                        {/* Eye highlights */}
                        <circle
                            cx={87 + eyeOffsetX * 0.2}
                            cy={198 + eyeOffsetY * 0.2}
                            r="1.5"
                            fill="white"
                            style={transition}
                        />
                        <circle
                            cx={117 + eyeOffsetX * 0.2}
                            cy={198 + eyeOffsetY * 0.2}
                            r="1.5"
                            fill="white"
                            style={transition}
                        />
                    </>
                )}

                {/* Cute smile */}
                <path
                    d="M90 225 Q100 232 110 225"
                    stroke="#1a1a1a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                />
            </g>
        </svg>
    );
};

export default GeometricIllustration;
