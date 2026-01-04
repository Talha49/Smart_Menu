"use client";

import { ClassicGrid } from "./ClassicGrid";
import { OrbitalWheel } from "./OrbitalWheel";
import { LiquidCarousel } from "./LiquidCarousel";

export function LayoutFactory({ layoutID, ...props }) {
    // If layoutID is not provided or explicitly classic, show the grid
    if (!layoutID || layoutID === "classic-grid") {
        return <ClassicGrid {...props} />;
    }

    // New layouts will be added here
    switch (layoutID) {
        case "classic-grid":
            return <ClassicGrid {...props} />;
        case "orbital-wheel":
            return <OrbitalWheel {...props} />;
        case "liquid-carousel":
            return <LiquidCarousel {...props} />;
        default:
            return <ClassicGrid {...props} />;
    }
}
