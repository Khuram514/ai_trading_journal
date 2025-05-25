import { CustomButton } from "@/components/CustomButton";
import SearchStrategy from "@/components/strategies/SearchStrategy";
import { GalleryVerticalEnd, ListTodo, Plus } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function StrategiesPage() {
    return (
        <div>
            <div className="px-8 pt-6 pb-0 border-b border-neutral-200 space-y-4 2xl:space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/main-logo.png"
                            width={60}
                            height={60}
                            alt="Logo"
                        />
                        <h1 className="text-4xl">Your Strategies</h1>
                    </div>
                    <CustomButton isBlack={false}>
                        <div className="flex gap-2 items-center">
                            <Plus size={16} />
                            New Strategy
                        </div>
                    </CustomButton>
                </div>
                <div className="flex justify-between">
                    <div className="flex gap-8">
                        <div className="py-3 flex gap-2 border-b-2 border-black">
                            <GalleryVerticalEnd />
                            View history
                        </div>
                        <div className="py-3 flex gap-2 text-neutral-500">
                            <ListTodo />
                            View rules
                        </div>
                    </div>
                    <SearchStrategy />
                </div>
            </div>
            <div></div>
        </div>
    );
}
