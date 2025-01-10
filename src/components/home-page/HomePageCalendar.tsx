import Image from "next/image";

const HomePageCalendar = () => {
    return (
        <div className="flex-center py-10 px-3 lg:px-48">
            <div className="py-10 bg-primary rounded-xl w-full flex flex-col items-center justify-center background-class">
                <div className="flex flex-col items-center justify-center gap-4 pb-10">
                    <span className="border border-zinc-200 py-1 px-2 rounded-md text-[.7rem] md:text-[.9rem] shadow-md">
                        Calendar
                    </span>

                    <h1 className="text-[2rem] md:text-[3rem] text-center font-semibold">
                        Visual Calendar. <br /> Simple. Powerful.
                    </h1>
                    <p className="max-md:px-2 text-[.9rem] md:text-[1rem]">
                        Simple and intuitive way to collect and visualise your
                        trades.
                    </p>
                    {/* <CustomButton isBlack text="Join for free" /> */}
                </div>
                <div className="rounded-lg max-md:hidden">
                    {/* <Image
                        src="/fake-calendar-2.jpeg"
                        alt="calendar"
                        width={1000}
                        height={900}
                    /> */}
                    <video
                        src="/calendar-demo.mov"
                        autoPlay
                        loop
                        muted
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="rounded-lg md:hidden">
                    {/* <Image
                        src="/iphone-mockup-mobile-view.png"
                        alt="iphone-mockup"
                        width={490}
                        height={1000}
                    /> */}
                    <Image
                        src="/calendar-mobile.png"
                        alt="iphone-mockup"
                        width={220}
                        height={600}
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePageCalendar;
