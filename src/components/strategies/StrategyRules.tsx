import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Strategy } from "@/types/strategies.types";
import { Checkbox } from "../ui/checkbox";

const priorityColors = {
    high: "bg-sellWithOpacity text-sell",
    medium: "bg-yellow-400 text-yellow-600 bg-opacity-50",
    low: "bg-buyWithOpacity text-buy",
};

interface StrategyRulesProps {
    strategy: Strategy;
}

export default function StrategyRules({ strategy }: StrategyRulesProps) {
    return (
        <>
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
                                        className={`${priorityColors[
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
                                        className={`${priorityColors[
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
        </>
    );
}