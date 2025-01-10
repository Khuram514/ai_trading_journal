import HomePage from "@/components/home-page/HomePage";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Home() {
    const { userId } = await auth();
    if (userId != null) redirect("/private/calendar");
    return (
        <Suspense
            fallback={
                <div className="flex-center h-screen">
                    <div className="running-algorithm">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                </div>
            }>
            <HomePage />
        </Suspense>
    );
}
