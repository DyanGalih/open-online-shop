import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';
import React from 'react';

export default function BenefitsSection() {
    const benefits = [
        {
            icon: <Truck className="h-6 w-6 text-[#d89797]" />,
            title: 'Free Shipping',
            desc: 'On orders over $75',
        },
        {
            icon: <RotateCcw className="h-6 w-6 text-[#d89797]" />,
            title: 'Easy Returns',
            desc: '30 days return policy',
        },
        {
            icon: <ShieldCheck className="h-6 w-6 text-[#d89797]" />,
            title: 'Secure Payment',
            desc: '100% secure checkout',
        },
        {
            icon: <Headphones className="h-6 w-6 text-[#d89797]" />,
            title: 'Customer Support',
            desc: '24/7 friendly support',
        },
    ];

    return (
        <section
            id="benefits"
            className="w-full border-b border-[#eaeaea] bg-white py-12"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {benefits.map((b, idx) => (
                        <div key={idx} className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#fdf5f2]">
                                {b.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#333333]">
                                    {b.title}
                                </h3>
                                <p className="mt-1 text-xs text-[#666666]">
                                    {b.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
