import { Star } from 'lucide-react';
import React from 'react';

export default function ReviewsSection() {
    const reviews = [
        {
            text: '"My minimal ceramic mug and scented soy candle arrived in beautiful, sustainable packaging. The craftsmanship is wonderful and fits perfectly with my home decor."',
            name: 'Aria Kim',
            product: 'Home & Living Collection',
            avatarBg: '#ebe5e0',
        },
        {
            text: '"The canvas tote bag is sturdy and spacious, perfect for my everyday commute. I love the simple, elegant design and the philosophy behind it."',
            name: 'Lucas Vance',
            product: 'Canvas Everyday Tote',
            avatarBg: '#e8ece6',
        },
        {
            text: '"Sleek, minimalist watch! The muted colors and clean aesthetic look very premium. Delivery was fast and customer service was incredibly helpful."',
            name: 'Emma Rose',
            product: 'Classic Minimal Watch',
            avatarBg: '#f3e8e6',
        },
    ];

    return (
        <section id="reviews" className="w-full bg-[#fbf9f6] py-20 font-sans">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="mb-2 font-serif text-3xl text-[#333333] md:text-4xl">
                    Customer Stories
                </h2>
                <p className="mx-auto mb-12 max-w-lg text-[#666666]">
                    Read what our community has to say about bringing simple,
                    beautiful things into their daily lives.
                </p>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {reviews.map((r, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col justify-between border border-[#eaeaea] bg-white p-8 text-left"
                        >
                            <div>
                                <div className="mb-4 flex space-x-0.5 text-[#e8c07d]">
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                </div>
                                <p className="mb-6 text-sm leading-relaxed text-[#4b5563] italic md:text-base">
                                    {r.text}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div
                                    className="h-10 w-10 flex-shrink-0 rounded-full"
                                    style={{ backgroundColor: r.avatarBg }}
                                />
                                <div>
                                    <strong className="block text-sm text-[#333333]">
                                        {r.name}
                                    </strong>
                                    <span className="text-[11px] text-[#666666]">
                                        {r.product}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
