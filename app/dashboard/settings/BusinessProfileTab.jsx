"use client";

import { useState, useEffect } from "react";
import { useRestaurantStore } from "@/hooks/use-restaurant-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    Loader2,
    Save,
    MapPin,
    Phone,
    MessageCircle,
    Instagram,
    Facebook,
    Twitter,
    Clock,
    Globe,
    Info,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function BusinessProfileTab() {
    const { restaurant, updateBusinessProfile } = useRestaurantStore();
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({});

    // Local form state for stability
    const [formData, setFormData] = useState({
        description: "",
        address: "",
        phone: "",
        whatsapp: "",
        socialLinks: {
            instagram: "",
            facebook: "",
            twitter: "",
        },
        openingHours: DAYS.map(day => ({ day, open: "09:00", close: "22:00", isClosed: false }))
    });

    // Validations
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (restaurant?.businessProfile) {
            const bp = restaurant.businessProfile;
            setFormData({
                description: bp.description || "",
                address: bp.address || "",
                phone: bp.phone || "",
                whatsapp: bp.whatsapp || "",
                socialLinks: {
                    instagram: bp.socialLinks?.instagram || "",
                    facebook: bp.socialLinks?.facebook || "",
                    twitter: bp.socialLinks?.twitter || "",
                },
                openingHours: bp.openingHours?.length > 0
                    ? bp.openingHours.map(h => ({
                        day: h.day,
                        open: h.open || "09:00",
                        close: h.close || "22:00",
                        isClosed: !!h.isClosed
                    }))
                    : DAYS.map(day => ({ day, open: "09:00", close: "22:00", isClosed: false }))
            });
        }
    }, [restaurant]);

    const validate = (field, value) => {
        let error = "";
        if (field === 'phone' || field === 'whatsapp') {
            if (value && !/^\+?[0-9\s-]{8,20}$/.test(value)) {
                error = "Invalid phone format (e.g. +1 234...)";
            }
        }
        if (field === 'address' && !value) {
            error = "An address helps with SEO and Maps";
        }
        if (['instagram', 'facebook', 'twitter'].includes(field)) {
            if (value && value.length < 3) {
                error = "Handle is too short";
            }
        }
        setErrors(prev => ({ ...prev, [field]: error }));
        return !error;
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));

        let value = field === 'instagram' || field === 'twitter' || field === 'facebook'
            ? formData.socialLinks[field]
            : formData[field];

        validate(field, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation
        const isPhoneValid = validate('phone', formData.phone);
        const isAddressValid = validate('address', formData.address);

        if (!isPhoneValid || !isAddressValid) {
            toast.error("Please fix validation errors before saving");
            return;
        }

        setIsLoading(true);
        try {
            const result = await updateBusinessProfile({ businessProfile: formData });
            if (result.success) {
                toast.success("Professional profile synchronized!");
            } else {
                toast.error(result.error || "Sync failed");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setIsLoading(true); // Artificial delay for premium feel
            setTimeout(() => setIsLoading(false), 800);
        }
    };

    const updateOpeningHour = (index, field, value) => {
        const newHours = [...formData.openingHours];
        newHours[index] = { ...newHours[index], [field]: value };
        setFormData(prev => ({ ...prev, openingHours: newHours }));
    };

    const updateSocial = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [platform]: value }
        }));
    };

    const FieldLabel = ({ icon: Icon, label, required, error, touched, colorClass }) => (
        <div className="flex items-center justify-between mb-2">
            <label className={cn("text-xs font-bold uppercase tracking-widest flex items-center gap-2", colorClass || "text-muted-foreground")}>
                <Icon className="w-3.5 h-3.5" />
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            {touched && error && (
                <span className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-right-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {error}
                </span>
            )}
            {touched && !error && (
                <CheckCircle2 className="w-3 h-3 text-green-500 animate-in zoom-in" />
            )}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            <div className="flex flex-col gap-2 border-b pb-8">
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    Business Persona
                    <div className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary uppercase tracking-tighter">SaaS Edition</div>
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                    Craft an elegant digital presence. These details power your public menu, SEO metadata, and customer communication channels.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Column: Essential Identity */}
                <div className="lg:col-span-7 space-y-10">
                    {/* Brand Story Card */}
                    <div className="space-y-4">
                        <FieldLabel icon={Info} label="Brand Story & Description" />
                        <div className="relative group">
                            <textarea
                                className="flex min-h-[160px] w-full rounded-2xl border-2 border-muted bg-background px-4 py-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary/50 transition-all resize-none group-hover:border-muted-foreground/20"
                                placeholder="What makes your restaurant unique? Share your vision..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                maxLength={500}
                            />
                            <div className="absolute bottom-4 right-4 text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                {formData.description.length}/500
                            </div>
                        </div>
                    </div>

                    {/* Geolocation & Contact Grid */}
                    <div className="grid sm:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-4">
                            <FieldLabel
                                icon={MapPin}
                                label="Physical Address"
                                required
                                touched={touched.address}
                                error={errors.address}
                            />
                            <div className="relative">
                                <Input
                                    className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-0 focus-visible:border-primary transition-all"
                                    placeholder="123 Culinary Ave, City"
                                    value={formData.address}
                                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    onBlur={() => handleBlur('address')}
                                />
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <FieldLabel
                                icon={Phone}
                                label="Primary Contact"
                                touched={touched.phone}
                                error={errors.phone}
                            />
                            <div className="relative">
                                <Input
                                    className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-0 focus-visible:border-primary transition-all"
                                    placeholder="+1 234 567 890"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    onBlur={() => handleBlur('phone')}
                                />
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    {/* Digital Presence Card */}
                    <div className="bg-muted/30 rounded-[2rem] p-8 border-2 border-dashed border-muted-foreground/10 space-y-8">
                        <div className="flex items-center gap-3 border-b border-muted-foreground/10 pb-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <Globe className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider">Social Channels</h3>
                                <p className="text-[10px] text-muted-foreground">Boost your reach and engagement</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <FieldLabel icon={MessageCircle} label="WhatsApp Business" colorClass="text-green-600" />
                                <Input
                                    className="h-11 rounded-lg border-green-100 focus-visible:border-green-500 focus-visible:ring-0 transition-opacity"
                                    placeholder="Number only"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <FieldLabel icon={Instagram} label="Instagram Handle" colorClass="text-pink-600" />
                                <Input
                                    className="h-11 rounded-lg border-pink-100 focus-visible:border-pink-500 focus-visible:ring-0"
                                    placeholder="@yourbrand"
                                    value={formData.socialLinks.instagram}
                                    onChange={(e) => updateSocial('instagram', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <FieldLabel icon={Facebook} label="Facebook Page" colorClass="text-blue-600" />
                                <Input
                                    className="h-11 rounded-lg border-blue-100 focus-visible:border-blue-500 focus-visible:ring-0"
                                    placeholder="fb.com/page"
                                    value={formData.socialLinks.facebook}
                                    onChange={(e) => updateSocial('facebook', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <FieldLabel icon={Twitter} label="X / Twitter" colorClass="text-sky-500" />
                                <Input
                                    className="h-11 rounded-lg border-sky-100 focus-visible:border-sky-500 focus-visible:ring-0"
                                    placeholder="@handle"
                                    value={formData.socialLinks.twitter}
                                    onChange={(e) => updateSocial('twitter', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Schedule & Status */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-card rounded-[2.5rem] border-2 border-muted shadow-2xl shadow-primary/5 overflow-hidden">
                        <div className="bg-primary p-6 text-primary-foreground">
                            <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Service Hours
                            </h3>
                            <p className="text-primary-foreground/60 text-[10px] mt-1 font-medium">Keep your customers informed about your availability.</p>
                        </div>

                        <div className="p-6 divide-y divide-muted">
                            {formData.openingHours.map((h, i) => (
                                <div key={h.day} className="py-4 first:pt-0 last:pb-0 group">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-xs font-black w-20 group-hover:text-primary transition-colors">{h.day}</span>
                                        <div className={cn("inline-flex items-center gap-2 p-1 bg-muted rounded-lg border-2 border-transparent transition-all", h.isClosed ? "opacity-30 grayscale" : "focus-within:border-primary/20 bg-background border-muted")}>
                                            <input
                                                type="time"
                                                className="bg-transparent text-[11px] font-bold outline-none w-20 px-1"
                                                value={h.open}
                                                disabled={h.isClosed}
                                                onChange={(e) => updateOpeningHour(i, 'open', e.target.value)}
                                            />
                                            <span className="text-[10px] opacity-30 font-black">—</span>
                                            <input
                                                type="time"
                                                className="bg-transparent text-[11px] font-bold outline-none w-20 px-1"
                                                value={h.close}
                                                disabled={h.isClosed}
                                                onChange={(e) => updateOpeningHour(i, 'close', e.target.value)}
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={!h.isClosed}
                                                    onChange={(e) => updateOpeningHour(i, 'isClosed', !e.target.checked)}
                                                />
                                                <div className="w-8 h-4 bg-red-100 peer-checked:bg-green-100 rounded-full transition-colors" />
                                                <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-red-500 peer-checked:bg-green-500 peer-checked:translate-x-4 rounded-full transition-transform shadow-sm" />
                                            </div>
                                            <span className={cn("text-[10px] font-black uppercase tracking-tighter", h.isClosed ? "text-red-500" : "text-green-600")}>
                                                {h.isClosed ? "OFF" : "ON"}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Hub */}
                    <div className="sticky top-8 space-y-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-16 rounded-[1.5rem] bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all text-sm group overflow-hidden relative"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Finalizing Changes...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 group-hover:animate-bounce" />
                                        Commit Profile
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                        <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                            Last synced: {restaurant?.updatedAt ? new Date(restaurant.updatedAt).toLocaleTimeString() : 'Never'}
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
