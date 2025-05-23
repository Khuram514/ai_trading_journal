import { CustomButton } from "@/components/CustomButton";
import { Plus } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function StrategiesPage() {
    return (
        <div>
            <div className="flex items-center justify-between p-8">
                <div className="flex items-center gap-3">
                    <Image
                        src="/main-logo.png"
                        width={60}
                        height={60}
                        alt="Logo"
                    />
                    <h1 className="text-4xl">Your Strategies</h1>
                </div>
                <CustomButton isBlack={true}>
                    <div className="flex gap-2 items-center">
                        <Plus size={16} />
                        New Strategy
                    </div>
                </CustomButton>
            </div>
            <div></div>
        </div>
    );
}
