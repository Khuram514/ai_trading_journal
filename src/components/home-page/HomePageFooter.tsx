import Image from "next/image";

import { SignUpButton } from "@clerk/nextjs";
import { CustomButton } from "../CustomButton";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const HomePageFooter = () => {
    return (
        <div className="md:h-screen flex-center p-3">
            <div className="md:h-full w-full rounded-3xl flex flex-col items-center justify-center overflow-hidden text-primary">
                <div className="md:h-1/2 w-full flex flex-col items-center justify-center gap-6 bg-[#201e1d] border-b border-zinc-900 max-md:py-12 max-md:px-4">
                    <span className="border border-zinc-700 py-1 px-2 rounded-md text-[.7rem] md:text-[.9rem] shadow-md shadow-zinc-900">
                        Join for free
                    </span>

                    <h1 className="text-[2rem] md:text-[3rem] text-center font-semibold">
                        Join thousands of traders.
                    </h1>
                    <p className="max-md:px-2 text-[.9rem] md:text-[1rem]">
                        From beginners to pros, your trading success starts
                        here.
                    </p>
                    <CustomButton isBlack={false}>
                        <SignUpButton>
                            <span>Get start - for free</span>
                        </SignUpButton>
                    </CustomButton>
                </div>
                <div className="md:h-1/2 w-full flex gradient border-t-[0.5px] border-zinc-700 max-md:py-6 px-4 md:px-10">
                    <div className="max-md:hidden w-1/2 flex-center flex-col px-10 gap-6">
                        <div className="flex-center gap-2">
                            <Image
                                src="/logo.svg"
                                alt="logo"
                                width={40}
                                height={40}
                            />
                            <p className="font-semibold text-lg text-primary">
                                Journal
                            </p>
                        </div>
                        <p className="text-darkPrimary text-center">
                            Loosely designed in Figma and coded in Visual Studio
                            Code. <br /> Built with Next.js and Tailwind CSS,
                            deployed with Vercel.
                        </p>
                    </div>
                    <div className="md:w-1/2 md:flex items-center justify-center flex-col gap-4 px-2">
                        <h1 className="text-[2rem] text-center">FAQ</h1>

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>
                                    What is AI Trade Journal ?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Trade Journal is your personal trading
                                    companion that keeps track of all your
                                    market moves, analyzes performance with
                                    advanced algorithms, and offers practical
                                    advice to sharpen your strategy. Simply log
                                    all your trades and let our AI generate
                                    in-depth reports that identify both your
                                    blind spots and winning moves. The system
                                    highlights exactly where you&apos;re leaving
                                    money on the table and reinforces the
                                    strategies that are already working for you.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>
                                    Is This AI Trading Journal Free ?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Yes, AI Trading Journal is completely free
                                    to use with next features including:
                                    <ul className="mt-1">
                                        <li>
                                            &bull; Comprehensive Calendar: Track
                                            all your trading activities in one
                                            organized view
                                        </li>
                                        <li>
                                            &bull; Detailed History Page: Review
                                            all past trades with complete
                                            transaction data
                                        </li>
                                        <li>
                                            &bull; Advanced Statistics: Access
                                            powerful analytics that reveal your
                                            trading patterns and performance
                                            metrics
                                        </li>
                                        <li>
                                            &bull; AI-Powered Insights: Get
                                            started with 5 complimentary tokens
                                            for our premium AI analysis engine
                                        </li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>
                                    What Assets Are Supported?
                                </AccordionTrigger>
                                <AccordionContent>
                                    AI Trading Journal supports all major asset
                                    classes with unlimited customization
                                    options:
                                    <ul className="mt-1">
                                        <li>
                                            &bull; Equities: Individual stocks,
                                            ETFs, and global market indexes.
                                        </li>
                                        <li>
                                            &bull; Cryptocurrencies: Bitcoin,
                                            Ethereum, altcoins, and emerging
                                            digital assets.
                                        </li>
                                        <li>
                                            &bull; Forex: All major and exotic
                                            currency pairs
                                        </li>
                                        <li>
                                            &bull; Commodities: Precious metals,
                                            energy products, and agricultural
                                            futures
                                        </li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>
                                    How AI Trading Journal Improves Your
                                    Performance
                                </AccordionTrigger>
                                <AccordionContent>
                                    AI Trading Journal supports all major asset
                                    classes with unlimited customization
                                    options:
                                    <ul className="mt-1">
                                        <li>
                                            &bull; Boost Trading Profitability
                                        </li>
                                        <li>
                                            &bull; Comprehensive Risk Management
                                        </li>
                                        <li>
                                            &bull; Powerful Pattern Recognition
                                        </li>
                                        <li>
                                            &bull; Trading Psychology Insights
                                        </li>

                                        <li>
                                            &bull; Trade Planning Optimization
                                        </li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePageFooter;
