import { usePage } from '@inertiajs/react';
import { Leaf, Instagram, Facebook, Calendar, Music } from 'lucide-react';
import React from 'react';

export default function FooterSection() {
    const { name } = usePage<{ name: string }>().props;

    return (
        <footer className="w-full border-t border-[#eaeaea] bg-white pt-16 pb-8 font-sans">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Links Grid */}
                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand column */}
                    <div className="pr-0 md:pr-8 lg:col-span-2">
                        <div className="mb-4 flex cursor-pointer items-center">
                            <span className="flex items-center font-serif text-3xl font-semibold tracking-tight text-[#333333]">
                                {name}
                                <Leaf className="ml-1 h-5 w-5 text-[#859b84] opacity-80" />
                            </span>
                        </div>
                        <p className="mb-6 max-w-xs text-sm leading-relaxed text-[#666666]">
                            Simple, beautiful, and meaningful products for your
                            everyday life.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-[#666666] transition-colors hover:text-[#859b84]"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-[#666666] transition-colors hover:text-[#859b84]"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-[#666666] transition-colors hover:text-[#859b84]"
                            >
                                <Calendar className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-[#666666] transition-colors hover:text-[#859b84]"
                            >
                                <Music className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="mb-4 text-xs font-medium tracking-wider text-[#333333] uppercase">
                            Shop
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#catalog"
                                    className="text-sm text-[#666666] transition-colors hover:text-[#859b84]"
                                >
                                    All Products
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#catalog"
                                    className="text-sm text-[#666666] transition-colors hover:text-[#859b84]"
                                >
                                    New Arrivals
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#catalog"
                                    className="text-sm text-[#666666] transition-colors hover:text-[#859b84]"
                                >
                                    Best Sellers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#catalog"
                                    className="text-sm text-[#666666] transition-colors hover:text-[#859b84]"
                                >
                                    Sale
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="mb-4 text-xs font-medium tracking-wider text-[#333333] uppercase">
                            Customer Service
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-[#666666] transition-colors hover:text-[#859b84]"
                                >
                                    FAQs
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-[#666666] transition-colors hover:text-[#859b84]"
                                >
                                    Shipping & Delivery
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-[#666666] transition-colors hover:text-[#859b84]"
                                >
                                    Returns & Exchanges
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-[#666666] transition-colors hover:text-[#859b84]"
                                >
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* About Column */}
                    <div>
                        <h4 className="mb-4 text-xs font-medium tracking-wider text-[#333333] uppercase">
                            About
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-[#666666] transition-colors hover:text-[#859b84]"
                                >
                                    Our Story
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-[#666666] transition-colors hover:text-[#859b84]"
                                >
                                    Sustainability
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-[#666666] transition-colors hover:text-[#859b84]"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-[#666666] transition-colors hover:text-[#859b84]"
                                >
                                    Careers
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Subfooter */}
                <div className="flex flex-col items-center justify-between border-t border-[#eaeaea] pt-8 md:flex-row">
                    <p className="mb-4 text-xs text-[#666666] md:mb-0">
                        &copy; 2026 {name}. All rights reserved.
                    </p>

                    <div className="mb-4 flex items-center space-x-2 md:mb-0">
                        <div className="flex h-6 w-10 items-center justify-center rounded border border-[#eaeaea] bg-white text-[9px] font-bold text-blue-800">
                            VISA
                        </div>
                        <div className="flex h-6 w-10 items-center justify-center rounded border border-[#eaeaea] bg-white text-[9px] font-bold text-red-500">
                            MC
                        </div>
                        <div className="flex h-6 w-10 items-center justify-center rounded border border-[#eaeaea] bg-white text-[9px] font-bold text-blue-500">
                            PayPal
                        </div>
                        <div className="flex h-6 w-10 items-center justify-center rounded border border-[#eaeaea] bg-white text-[9px] font-bold">
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
