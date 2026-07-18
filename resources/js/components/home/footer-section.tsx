import { usePage } from '@inertiajs/react';
import { Calendar, Facebook, Instagram, Leaf, Music } from 'lucide-react';

export default function FooterSection() {
    const { name } = usePage<{ name: string }>().props;

    return (
        <footer className="w-full border-t border-border bg-white pt-16 pb-8 font-sans">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Links Grid */}
                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand column */}
                    <div className="pr-0 md:pr-8 lg:col-span-2">
                        <div className="mb-4 flex cursor-pointer items-center">
                            <span className="flex items-center font-serif text-3xl font-semibold tracking-tight text-foreground">
                                {name}
                                <Leaf className="ml-1 h-5 w-5 text-primary opacity-80" />
                            </span>
                        </div>
                        <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
                            Simple, beautiful, and meaningful products for your
                            everyday life.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Calendar className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Music className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="mb-4 text-xs font-medium tracking-wider text-foreground uppercase">
                            Shop
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="/?filter=all"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    All Products
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/?filter=new-arrivals"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    New Arrivals
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/?filter=best-sellers"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Best Sellers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/?filter=sale"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Sale
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="mb-4 text-xs font-medium tracking-wider text-foreground uppercase">
                            Customer Service
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    FAQs
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Shipping & Delivery
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Returns & Exchanges
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* About Column */}
                    <div>
                        <h4 className="mb-4 text-xs font-medium tracking-wider text-foreground uppercase">
                            About
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Our Story
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Sustainability
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Careers
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Subfooter */}
                <div className="flex flex-col items-center justify-between border-t border-border pt-8 md:flex-row">
                    <p className="mb-4 text-xs text-muted-foreground md:mb-0">
                        &copy; 2026 {name}. All rights reserved.
                    </p>

                    <div className="mb-4 flex items-center space-x-2 md:mb-0">
                        <div className="flex h-6 w-10 items-center justify-center rounded border border-border bg-white text-[9px] font-bold text-blue-800">
                            VISA
                        </div>
                        <div className="flex h-6 w-10 items-center justify-center rounded border border-border bg-white text-[9px] font-bold text-red-500">
                            MC
                        </div>
                        <div className="flex h-6 w-10 items-center justify-center rounded border border-border bg-white text-[9px] font-bold text-blue-500">
                            PayPal
                        </div>
                        <div className="flex h-6 w-10 items-center justify-center rounded border border-border bg-white text-[9px] font-bold">
                            ApplePay
                        </div>
                    </div>

                    <div className="flex space-x-4 text-xs text-[#666666]">
                        <a
                            href="#"
                            className="transition-colors hover:text-[#333333]"
                        >
                            Privacy Policy
                        </a>
                        <span className="text-gray-300">|</span>
                        <a
                            href="#"
                            className="transition-colors hover:text-[#333333]"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
