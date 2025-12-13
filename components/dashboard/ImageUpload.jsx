"use client";

import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/Button";
import { ImagePlus, X, Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export function ImageUpload({ value, onChange, disabled }) {
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;

        // Validate type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            toast.error("Please upload a valid image (JPG, PNG, WebP)");
            return;
        }

        // Validate size (max 4.5MB to be safe for serverless/edge limits if applicable, though Blob handles large)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB");
            return;
        }

        setIsLoading(true);
        try {
            const newBlob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });

            onChange(newBlob.url);
            toast.success("Image uploaded");
        } catch (error) {
            console.error(error);
            toast.error("Upload failed");
        } finally {
            setIsLoading(false);
        }
    };

    const onDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (disabled) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    return (
        <div className="space-y-4">
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed transition-all duration-200 bg-muted/5",
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
                onDragEnter={onDrag}
                onDragLeave={onDrag}
                onDragOver={onDrag}
                onDrop={onDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={disabled || isLoading}
                />

                {value ? (
                    <div className="relative h-full w-full p-2">
                        <div className="relative h-full w-full overflow-hidden rounded-md">
                            {/* Standard img tag for instant preview without Next.js optimization config issues */}
                            <img
                                src={value}
                                alt="Upload preview"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <Button
                            onClick={handleRemove}
                            disabled={disabled}
                            variant="destructive"
                            size="icon"
                            className="absolute top-3 right-3 h-7 w-7 shadow-sm"
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4" onClick={() => inputRef.current?.click()}>
                        {isLoading ? (
                            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-3" />
                        ) : (
                            <UploadCloud className={cn("h-8 w-8 mb-3 transition-colors", dragActive ? "text-primary" : "text-muted-foreground")} />
                        )}
                        <p className="mb-1 text-sm text-foreground font-medium">
                            <span className="font-semibold text-primary cursor-pointer hover:underline">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                            SVG, PNG, JPG or GIF (max. 5MB)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
