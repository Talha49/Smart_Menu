"use client";

import { useRestaurantStore } from "@/hooks/use-restaurant-store";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlusCircle, ExternalLink, Utensils, QrCode } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { restaurant, isLoading } = useRestaurantStore();

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading specific restaurant details...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-display">Overview</h2>
                    <p className="text-muted-foreground">
                        Welcome back to <span className="font-semibold text-foreground">{restaurant?.name || 'your dashboard'}</span>.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/${restaurant?.restaurantId}`} target="_blank">
                        <Button variant="outline" className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            View Menu
                        </Button>
                    </Link>
                    <Link href="/dashboard/menu">
                        <Button className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Add Item
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Menu items configured</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visual Views</CardTitle>
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Menu scans this month</p>
                    </CardContent>
                </Card>

                {/* Pro Plan Upsell (Visible if free) */}
                {restaurant?.plan === 'free' && (
                    <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-primary">Upgrade into Pro</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground mb-3">Get unlimited items and remove branding.</p>
                            <Button size="sm" variant="outline" className="w-full bg-background/50">View Plans</Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Quick Actions (Placeholder for now) */}
            <Card className="glass">
                <CardHeader>
                    <CardTitle>Getting Started</CardTitle>
                    <CardDescription>Follow these steps to set up your digital menu.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center text-sm font-bold">1</div>
                        <div className="flex-1">
                            <h4 className="font-medium text-sm">Create your first category</h4>
                            <p className="text-xs text-muted-foreground">e.g. Starters, Mains, Drinks</p>
                        </div>
                        <Link href="/dashboard/categories"><Button variant="ghost" size="sm">Go</Button></Link>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">2</div>
                        <div className="flex-1">
                            <h4 className="font-medium text-sm">Add menu items</h4>
                            <p className="text-xs text-muted-foreground">Upload photos and set prices</p>
                        </div>
                        <Link href="/dashboard/menu"><Button variant="ghost" size="sm">Go</Button></Link>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-purple-500/20 text-purple-600 flex items-center justify-center text-sm font-bold">3</div>
                        <div className="flex-1">
                            <h4 className="font-medium text-sm">Fine-tune your branding</h4>
                            <p className="text-xs text-muted-foreground">Custom colors, logos and more</p>
                        </div>
                        <Link href="/dashboard/settings/branding"><Button variant="ghost" size="sm">Go</Button></Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
