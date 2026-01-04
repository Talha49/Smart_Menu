"use client";

import { useRef, useEffect } from 'react';
import { DeviceFrameset, DeviceEmulator } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';
import 'react-device-frameset/styles/device-emulator.min.css';

const PreviewContent = ({ previewUrl, iframeRef }) => (
    <div className="w-full h-full bg-white overflow-hidden relative group rounded-[2.5rem]">
        {!previewUrl ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4 bg-zinc-50">
                <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-3xl animate-pulse">🍱</div>
                <div>
                    <h4 className="font-bold text-sm text-zinc-900">Initializing...</h4>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest leading-relaxed">Establishing secure sync</p>
                </div>
            </div>
        ) : (
            <iframe
                ref={iframeRef}
                src={previewUrl}
                className="w-full h-full border-none"
                title="Menu Preview Overlay"
                style={{
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehavior: 'contain'
                }}
            />
        )}

        {/* Visual Indicator */}
        <div className="absolute top-6 right-6 z-[60] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="bg-zinc-950/90 text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Perfect Parity Sync
            </div>
        </div>
    </div>
);

export function LivePreview({
    restaurant,
    branding,
    minimal = false
}) {
    const iframeRef = useRef(null);
    const restaurantId = restaurant?.restaurantId;

    // Stable preview URL - NO dependencies on branding
    const previewUrl = restaurantId ? `/menu/${restaurantId}?preview=true` : null;

    const { brandColor, fontFamily, logoUrl, layoutID } = branding || {};

    // Broadcast changes to the iframe in real-time
    useEffect(() => {
        const sendUpdate = () => {
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                    type: "PREVIEW_UPDATE",
                    data: {
                        brandColor,
                        fontFamily,
                        logoUrl,
                        experienceConfig: {
                            layoutID: layoutID || branding?.experienceConfig?.layoutID
                        }
                    }
                }, "*");
            }
        };

        sendUpdate();
        const timer = setTimeout(sendUpdate, 1000);
        return () => clearTimeout(timer);
    }, [brandColor, fontFamily, logoUrl, layoutID, previewUrl]);

    if (minimal) return <PreviewContent previewUrl={previewUrl} iframeRef={iframeRef} />;

    return (
        <div className="flex justify-center w-full">
            <DeviceEmulator banDevices={['HTC One', 'Lumia 920', 'Nexus 5']}>
                {(props) => (
                    <DeviceFrameset
                        {...props}
                        device={props?.device || "iPhone X"}
                        color={props?.color || "black"}
                    >
                        <PreviewContent previewUrl={previewUrl} iframeRef={iframeRef} />
                    </DeviceFrameset>
                )}
            </DeviceEmulator>
        </div>
    );
}
