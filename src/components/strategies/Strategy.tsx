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
import { ChevronDown, Trash2 } from "lucide-react";

export default function Strategy() {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <div className="flex gap-4 items-center">
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                        <span>Ribbon strategy</span>
                    </div>
                    <div className="flex gap-6 items-center mr-4">
                        {/* <div className="p-1 rounded-md md:hover:bg-neutral-200">
                            <Pencil size={18} />
                        </div> */}
                        <div className="p-1 rounded-md md:hover:bg-neutral-200">
                            <Trash2 size={18} />
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="flex gap-12">
                    <div className="flex-1">
                        <h1 className="py-4 text-neutral-500">
                            Open position rules:
                        </h1>
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
                                <TableRow>
                                    <TableCell>
                                        {/* <Checkbox disabled /> */}
                                    </TableCell>
                                    <TableCell>
                                        Ribbon algorithm signal
                                    </TableCell>
                                    <TableCell>
                                        <div className="bg-sellWithOpacity text-sell px-3 p-1 rounded-lg w-fit flex-center">
                                            &bull; High
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        {/* <Checkbox disabled /> */}
                                    </TableCell>
                                    <TableCell>
                                        Only day time from 9am to 6pm
                                    </TableCell>
                                    <TableCell>
                                        <div className="bg-buyWithOpacity text-buy px-3 p-1 rounded-lg w-fit flex-center">
                                            &bull; Low
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        {/* <Checkbox disabled /> */}
                                    </TableCell>
                                    <TableCell>Only buy positions</TableCell>
                                    <TableCell>
                                        <div className="bg-yellow-400 bg-opacity-50 text-yellow-600 px-3 p-1 rounded-lg w-fit flex-center">
                                            &bull; Medium
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
