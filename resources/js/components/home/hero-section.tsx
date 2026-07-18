import heroImage from '@/../../resources/images/home/hero-main.png';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative flex min-h-[500px] w-full items-center overflow-hidden bg-[#f5efe9] md:min-h-[600px]">
            {/* Background image & gradient overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute right-0 bottom-0 h-full w-full bg-cover bg-center opacity-40 md:w-2/3 md:opacity-60"
                    style={{
                        backgroundImage: `url(${heroImage})`,
                    }}
                />
                <div className="absolute inset-0 w-full bg-gradient-to-r from-[#f5efe9] via-[#f5efe9]/90 to-transparent md:w-3/5" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
                <div className="max-w-xl">
                    <p className="mb-4 text-xs font-semibold tracking-widest text-accent-foreground uppercase md:text-sm">
                        New Collection
                    </p>
                    <h1 className="mb-6 font-serif text-4xl leading-tight text-foreground md:text-6xl">
                        Simple Things,
                        <br />
                        Beautiful Life
                    </h1>
                    <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                        Thoughtfully designed products to make your everyday
                        life better.
                    </p>
                    <a
                        href="#catalog"
                        className="inline-flex items-center justify-center border border-transparent bg-primary px-8 py-3 text-xs font-medium tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-primary/90 md:text-sm"
                    >
                        Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
