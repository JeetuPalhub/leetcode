import React from "react";

const BellCurve = ({ percentile, color = "#22c55e", label = "Runtime" }) => {
    // SVG Constants
    const width = 300;
    const height = 100;
    const padding = 10;

    // Normal distribution function
    // f(x) = (1 / (sigma * sqrt(2 * pi))) * exp(-0.5 * ((x - mu) / sigma)^2)
    const mu = 50; // Mean
    const sigma = 15; // Standard deviation

    const points = [];
    for (let x = 0; x <= 100; x += 2) {
        const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
        // Scale y to fit height
        const scaledY = height - (y * 3000) - padding;
        const scaledX = (x / 100) * (width - 2 * padding) + padding;
        points.push(`${scaledX},${scaledY}`);
    }

    const pathData = `M ${points.join(" L ")}`;

    // Calculate marker position
    const markerX = (percentile / 100) * (width - 2 * padding) + padding;
    // Get Y value at markerX by interpolating or just calculating
    const markerYFunc = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((percentile - mu) / sigma, 2));
    const markerY = height - (markerYFunc * 3000) - padding;

    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">{label} Distribution</span>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 drop-shadow-sm">
                {/* Background Area Gradient */}
                <defs>
                    <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
                        <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
                    </linearGradient>
                </defs>

                {/* The Curve Fill */}
                <path
                    d={`${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
                    fill={`url(#grad-${label})`}
                />

                {/* The Curve Line */}
                <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="animate-draw"
                />

                {/* Marker Line */}
                <line
                    x1={markerX}
                    y1={height - padding}
                    x2={markerX}
                    y2={markerY}
                    stroke={color}
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                />

                {/* Marker Point */}
                <circle
                    cx={markerX}
                    cy={markerY}
                    r="4"
                    fill={color}
                    className="animate-pulse"
                />

                {/* X-Axis */}
                <line
                    x1={padding}
                    y1={height - padding}
                    x2={width - padding}
                    y2={height - padding}
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeWidth="1"
                />
            </svg>

            <div className="flex justify-between mt-1 text-[9px] font-bold opacity-30">
                <span>Fast</span>
                <span>Average</span>
                <span>Slow</span>
            </div>

            <div
                className="absolute top-8 pointer-events-none"
                style={{ left: `${Math.min(85, Math.max(5, percentile))}%`, transform: 'translateX(-50%)' }}
            >
                <div className={`px-2 py-1 rounded bg-base-300 border border-white/10 text-[9px] font-bold shadow-xl flex items-center gap-1 whitespace-nowrap`}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    You are here
                </div>
            </div>
        </div>
    );
};

export default BellCurve;
