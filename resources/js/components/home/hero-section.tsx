import { ArrowRight } from 'lucide-react';
import React from 'react';

export default function HeroSection() {
    return (
        <section className="relative flex min-h-[500px] w-full items-center overflow-hidden bg-[#f5efe9] md:min-h-[600px]">
            {/* Background image & gradient overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute right-0 bottom-0 h-full w-full bg-cover bg-center opacity-40 md:w-2/3 md:opacity-60"
                    style={{
                        backgroundImage:
                            "url('https://placehold.co/1200x800/eaddd6/a3928f?text=Decorative+Vase+%26+Arch')",
                    }}
                />
                <div className="absolute inset-0 w-full bg-gradient-to-r from-[#f5efe9] via-[#f5efe9]/90 to-transparent md:w-3/5" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
                <div className="max-w-xl">
                    <p className="mb-4 text-xs font-semibold tracking-widest text-[#d89797] uppercase md:text-sm">
                        New Collection
                    </p>
                    <h1 className="mb-6 font-serif text-4xl leading-tight text-[#333333] md:text-6xl">
                        Simple Things,
                        <br />
                        Beautiful Life
                    </h1>
                    <p className="mb-8 max-w-md text-base leading-relaxed text-[#666666] md:text-lg">
                        Thoughtfully designed products to make your everyday
                        life better.
                    </p>
                    <a
                        href="#catalog"
                        className="inline-flex items-center justify-center border border-transparent bg-[#859b84] px-8 py-3 text-xs font-medium tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-[#728871] md:text-sm"
                    >
                        Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
