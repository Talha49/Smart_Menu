"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import toast from "react-hot-toast";
import { Store, ArrowRight } from "lucide-react";
import { useDebounce } from "use-debounce";
import { RestaurantService } from "@/services/restaurantService";

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        restaurantId: "", // slug
    });

    const [debouncedRestaurantId] = useDebounce(formData.restaurantId, 500);

    // Auto-generate slug from name
    const handleNameChange = (e) => {
        const name = e.target.value;
        // Only auto-generate if user hasn't manually edited the slug (simple heuristic: if slug basically matches name)
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        setFormData(prev => ({ ...prev, name, restaurantId: slug }));
    };

    const handleSlugChange = (e) => {
        setFormData(prev => ({ ...prev, restaurantId: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await RestaurantService.create(formData);

            toast.success("Restaurant setup complete!");

            // Update session to include new restaurantId
            await update({
                ...session,
                user: {
                    ...session?.user,
                    restaurantId: data.restaurant.restaurantId
                }
            });

            router.push("/dashboard");
            router.refresh();

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <div className="max-w-xl w-full animate-fade-in relative">
                {/* Decorative background blobs */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <Card className="glass border-none shadow-xl relative z-10">
                    <CardHeader>
                        <CardTitle className="text-3xl font-display">Let's set up your venue</CardTitle>
                        <CardDescription className="text-base">
                            Tell us about your restaurant to create your digital menu.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex gap-4 items-start">
                                <div className="p-2 bg-white dark:bg-black rounded-md shadow-sm">
                                    <Store className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Create your workspace</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        This will be the home for your menu, orders, and settings.
                                    </p>
                                </div>
                            </div>

                            <Input
                                label="Restaurant Name"
                                placeholder="e.g. The Burger Joint"
                                value={formData.name}
                                onChange={handleNameChange}
                                required
                                startIcon={<Store className="h-4 w-4" />}
                            />

                            <div className="space-y-2">
                                <Input
                                    label="Restaurant URL ID"
                                    placeholder="the-burger-joint"
                                    value={formData.restaurantId}
                                    onChange={handleSlugChange}
                                    required
                                    startIcon={<span className="text-xs font-mono">/</span>}
                                />
                                <p className="text-xs text-muted-foreground pl-1">
                                    Your menu will be at: <span className="font-mono text-primary">smartmenu.com/{formData.restaurantId || 'your-name'}</span>
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full h-12 text-lg"
                                isLoading={loading}
                            >
                                Complete Setup
                                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
