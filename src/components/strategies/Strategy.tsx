"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { Strategy } from "@/types/strategies.types";
import { ChevronDown } from "lucide-react";
import DeleteStrategyButton from "./DeleteStrategyButton";
import AddStrategyDialog from "./AddStrategyDialog";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import StrategyRules from "./StrategyRules";
import StrategyHistory from "./StrategyHistory";



export default function StrategyCard({
    strategy,
    hideAll = false
}: {
    strategy: Strategy;
    hideAll?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(true);

    // Get activeTab from Redux
    const activeTab = useAppSelector((state) => state.strategies.activeTab);

    // Handle hideAll changes
    useEffect(() => {
        setIsOpen(!hideAll);
    }, [hideAll]);

    return (
        <Accordion
            type="single"
            collapsible
            className="w-full"
            value={isOpen ? "item-1" : ""}
            onValueChange={(value) => setIsOpen(value === "item-1")}
        >
            <AccordionItem value="item-1">
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-[rgb(245,245,245)] ">
                    <AccordionTrigger>
                        <div className="flex gap-4 items-center">
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                            <span>{strategy.strategyName}</span>
                        </div>
                    </AccordionTrigger>
                    <div className="flex gap-6 items-center mr-4">
                        <AddStrategyDialog
                            openPositionRulesEditing={strategy.openPositionRules}
                            closePositionRulesEditing={strategy.closePositionRules}
                            strategyNameEditing={strategy.strategyName}
                            idEditing={strategy.id}
                        />
                        <DeleteStrategyButton strategy={strategy} />
                    </div>
                </div>
                <AccordionContent className="flex gap-12">
                    {activeTab === "rules" ? (
                        <StrategyRules strategy={strategy} />
                    ) : (
                        <StrategyHistory strategy={strategy} />
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
