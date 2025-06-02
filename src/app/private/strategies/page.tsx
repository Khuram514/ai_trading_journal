import AddStrategyDialog from "@/components/strategies/AddStrategyDialog";
import SearchStrategy from "@/components/strategies/SearchStrategy";
import SlidingTabs from "@/components/strategies/SlidingTabs";
import Strategy from "@/components/strategies/Strategy";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
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
                    <Dialog>
                        <DialogTrigger>
                            <div className="flex gap-2 items-center text-sm border border-zinc-200 md:hover:text-zinc-900 md:hover:bg-zinc-100 px-3 py-2 rounded-md shadow-sm">
                                <Plus size={16} />
                                New Strategy
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <AddStrategyDialog />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex justify-between">
                    <SlidingTabs />
                    <SearchStrategy />
                </div>
            </div>
            <div className="px-8 py-4 space-y-4">
                <Strategy />
                <Strategy />
            </div>
        </div>
    );
}
