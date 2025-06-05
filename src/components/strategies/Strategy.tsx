import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Strategy } from "@/types/strategies.types";
import { ChevronDown, Trash2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import DeleteStrategyButton from "./DeleteStrategyButton";

const priorityColors = {
    high: "bg-sellWithOpacity text-sell",
    medium: "bg-yellow-400 text-yellow-600 bg-opacity-50",
    low: "bg-buyWithOpacity text-buy",
};

export default function StrategyCard({ strategy }: { strategy: Strategy }) {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <div className="flex gap-4 items-center">
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                        <span>{strategy.strategyName}</span>
                    </div>
                    <div className="flex gap-6 items-center mr-4">
                        {/* <div className="p-1 rounded-md md:hover:bg-neutral-200">
                            <Pencil size={18} />
                        </div> */}
                        <DeleteStrategyButton strategy={strategy} />
                    </div>
                </AccordionTrigger>
                <AccordionContent className="flex gap-12">
                    <div className="flex-1">
                        <h1 className="py-4 text-neutral-500">
                            Open position rules:
                        </h1>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Priority</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {strategy.openPositionRules.map((rule) => (
                                    <TableRow key={rule.id}>
                                        <TableCell className="w-[5%]">
                                            <Checkbox disabled />
                                        </TableCell>
                                        <TableCell className="w-[70%]">
                                            {rule.rule}
                                        </TableCell>
                                        <TableCell className="w-[25%]">
                                            <div
                                                className={`${
                                                    priorityColors[
                                                        rule.priority
                                                    ]
                                                } px-3 p-1 rounded-lg w-fit flex-center`}>
                                                &bull; {rule.priority}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex-1">
                        <h1 className="py-4 text-neutral-500">
                            Close position rules:
                        </h1>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Priority</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {strategy.closePositionRules.map((rule) => (
                                    <TableRow key={rule.id}>
                                        <TableCell className="w-[5%]">
                                            <Checkbox disabled />
                                        </TableCell>
                                        <TableCell className="w-[70%]">
                                            {rule.rule}
                                        </TableCell>
                                        <TableCell className="w-[25%]">
                                            <div
                                                className={`${
                                                    priorityColors[
                                                        rule.priority
                                                    ]
                                                } px-3 p-1 rounded-lg w-fit flex-center`}>
                                                &bull; {rule.priority}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
