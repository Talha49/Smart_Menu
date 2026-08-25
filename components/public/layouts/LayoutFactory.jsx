"use client";

import { ClassicGrid } from "./ClassicGrid";
import { OrbitalWheel } from "./OrbitalWheel";
import { LiquidCarousel } from "./LiquidCarousel";
import { MasonryLayout } from "./MasonryLayout";
import { ListLayout } from "./ListLayout";
import { BentoMagazine } from "./BentoMagazine";
import { SignatureShowcase } from "./SignatureShowcase";

export function LayoutFactory({ layoutID, ...props }) {
    // If layoutID is not provided or explicitly classic, show the grid
    if (!layoutID || layoutID === "classic-grid") {
        return <ClassicGrid {...props} />;
    }

    // Dynamic layout selection based on layoutID
    switch (layoutID) {
        case "classic-grid":
        case "grid":
            return <ClassicGrid {...props} />;
        case "orbital-wheel":
            return <OrbitalWheel {...props} />;
        case "signature-showcase":
            return <SignatureShowcase {...props} />;
        case "bento-magazine":
            return <BentoMagazine {...props} />;
        case "liquid-carousel":
            return <LiquidCarousel {...props} />;
        case "masonry":
            return <MasonryLayout {...props} />;
        case "list":
            return <ListLayout {...props} />;
        default:
            return <ClassicGrid {...props} />;
    }
}
