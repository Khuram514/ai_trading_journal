import Image from "next/image";

import { SignUpButton } from "@clerk/nextjs";
import { CustomButton } from "../CustomButton";

const HomePageFooter = () => {
    return (
        <div className="md:h-screen flex-center py-2 px-2">
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
                        <p className="text-zinc-400 text-center">
                            Loosely designed in Figma and coded in Visual Studio
                            Code. <br /> Built with Next.js and Tailwind CSS,
                            deployed with AWS.
                        </p>
                    </div>
                    <div className="md:w-1/2 md:flex-center flex-col gap-4 px-2">
                        <h1 className="text-[2rem] text-center">FAQ</h1>
                        <div className="grid grid-rows-3 md:grid-rows-2 grid-cols-2 gap-3">
                            <div className="col-span-2 row-span-1">
                                <h1 className="text-[1rem] md:text-[1.2rem] mb-2">
                                    {" "}
                                    What is Trade Journal ?
                                </h1>
                                <p className="text-[.7rem] md:text-[.9rem] text-zinc-300">
                                    Trade Journal is my personal project,
                                    developed entirely by me{" "}
                                    <a
                                        className="underline"
                                        href="https://www.linkedin.com/in/bohdan-bilovodskyi-0437241b7/"
                                        target="_blank">
                                        (Hi!👋 Feel free to connect with me on
                                        LinkedIn if you'd like to chat).{" "}
                                    </a>
                                    I have two passions: trading and coding. At
                                    one point, I decided to combine them, which
                                    led to the creation of this project.
                                    I&apos;m thrilled that this journal has
                                    earned the approval of thousands of traders
                                    worldwide.
                                </p>
                            </div>
                            <div className="col-span-2 md:col-span-1 row-span-1">
                                <h1 className="text-[1rem] md:text-[1.2rem] mb-2">
                                    Is this trading journal free ?
                                </h1>
                                <p className="text-[.7rem] md:text-[.9rem] text-zinc-300">
                                    This app is completely free for everyone. My
                                    goal was to meet the needs of all traders by
                                    incorporating key features such as a
                                    calendar, a history page, and a variety of
                                    charts with statistics.
                                </p>
                            </div>
                            <div className="col-span-2 md:col-span-1 row-span-1">
                                <h1 className="text-[1rem] md:text-[1.2rem] mb-2">
                                    What assets are supported?
                                </h1>
                                <p className="text-[.7rem] md:text-[.9rem] text-zinc-300">
                                    You can add any assets you trade—it&apos;s
                                    fully customizable. Whether it&apos;s
                                    indexes, stocks, options, futures, crypto,
                                    or forex, you have the flexibility to tailor
                                    the app to your trading needs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePageFooter;
