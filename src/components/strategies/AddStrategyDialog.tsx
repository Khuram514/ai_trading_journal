"use client";

import React, { useState } from "react";
import {
    DialogTitle,
    DialogHeader,
    DialogClose,
    Dialog,
    DialogContent,
    DialogTrigger,
} from "../ui/dialog";
import { Plus } from "lucide-react";
import { Rule } from "@/types/dbSchema.types";
import { v4 as uuidv4 } from "uuid";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import NewRuleForDialog from "./NewRuleForDialog";
import { CustomButton } from "../CustomButton";
import { saveStrategy } from "@/server/actions/strategies";
import { useUser } from "@clerk/nextjs";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/store";
import { addStrategyToTheState } from "@/redux/slices/strategySlice";

export const rulesStyle = {
    low: "bg-buyWithOpacity text-buy",
    medium: "bg-yellow-400 bg-opacity-50 text-yellow-600",
    high: "bg-sellWithOpacity text-sell",
};

export default function AddStrategyDialog() {
    const [openPositionRules, setOpenPositionRules] = useState<Rule[]>([]);
    const [closePositionRules, setClosePositionRules] = useState<Rule[]>([]);
    const [strategyName, setStrategyName] = useState("");

    const [submittingNewStrategy, setSubmittingNewStrategy] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { user } = useUser();

    const dispatch = useAppDispatch();

    const handleCreateNewRule = ({ type }: { type: "open" | "close" }) => {
        const randomId = uuidv4();
        if (type === "open") {
            setOpenPositionRules((prev) => [
                ...prev,
                {
                    id: randomId,
                    priority: "medium",
                    satisfied: false,
                    rule: "New Rule",
                },
            ]);
        } else {
            setClosePositionRules((prev) => [
                ...prev,
                {
                    id: randomId,
                    priority: "medium",
                    satisfied: false,
                    rule: "New Rule",
                },
            ]);
        }
    };

    const handleChangePriority = ({
        id,
        type,
    }: {
        id: string;
        type: "open" | "close";
    }) => {
        if (type === "open") {
            setOpenPositionRules((prevRules) =>
                prevRules.map((rule) => {
                    if (rule.id === id) {
                        let nextPriority: Rule["priority"];
                        if (rule.priority === "low") {
                            nextPriority = "medium";
                        } else if (rule.priority === "medium") {
                            nextPriority = "high";
                        } else {
                            nextPriority = "low";
                        }
                        return { ...rule, priority: nextPriority };
                    }
                    return rule;
                })
            );
        } else {
            setClosePositionRules((prevRules) =>
                prevRules.map((rule) => {
                    if (rule.id === id) {
                        let nextPriority: Rule["priority"];
                        if (rule.priority === "low") {
                            nextPriority = "medium";
                        } else if (rule.priority === "medium") {
                            nextPriority = "high";
                        } else {
                            nextPriority = "low";
                        }
                        return { ...rule, priority: nextPriority };
                    }
                    return rule;
                })
            );
        }
    };

    const handleChangeRuleName = ({
        id,
        type,
        newName,
    }: {
        id: string;
        type: "open" | "close";
        newName: string;
    }) => {
        if (type === "open") {
            setOpenPositionRules((prevRules) =>
                prevRules.map((rule) => {
                    if (rule.id === id) {
                        return { ...rule, rule: newName };
                    }
                    return rule;
                })
            );
        } else {
            setClosePositionRules((prevRules) =>
                prevRules.map((rule) => {
                    if (rule.id === id) {
                        return { ...rule, rule: newName };
                    }
                    return rule;
                })
            );
        }
    };

    const handleDeleteRule = ({
        id,
        type,
    }: {
        id: string;
        type: "open" | "close";
    }) => {
        if (type === "open") {
            setOpenPositionRules((prevRules) =>
                prevRules.filter((rule) => rule.id !== id)
            );
        } else {
            setClosePositionRules((prevRules) =>
                prevRules.filter((rule) => rule.id !== id)
            );
        }
    };

    const createStrategy = async (e: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        const newId = uuidv4();
        if (strategyName.length === 0) {
            toast.error("Strategy name is required");
        } else if (
            closePositionRules.length === 0 &&
            openPositionRules.length === 0
        ) {
            toast.error("You must provide at least 1 rule");
        } else {
            setSubmittingNewStrategy(true);
            try {
                await saveStrategy({
                    openPositionRules,
                    closePositionRules,
                    userId: user?.id ?? "",
                    id: newId,
                    strategyName,
                });

                dispatch(
                    addStrategyToTheState({
                        openPositionRules,
                        closePositionRules,
                        id: newId,
                        strategyName,
                    })
                );

                toast.success("New strategy has been saved successfully!");
                setIsDialogOpen(false);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                    console.log(error.message);
                } else {
                    console.log(error);
                    toast.error("Unexpected error occured. Try again later");
                }
            } finally {
                setSubmittingNewStrategy(false);
            }
        }
    };

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger>
                    <div className="flex gap-2 items-center text-sm border border-zinc-200 md:hover:text-zinc-900 md:hover:bg-zinc-100 px-3 py-2 rounded-md shadow-sm">
                        <Plus size={16} />
                        New Strategy
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <form className="sm:max-w-[460px] flex flex-col justify-between min-h-[312px] max-h-[calc(100vh-120px)]">
                        <DialogHeader className="mb-2">
                            <DialogTitle className="text-lg">
                                Add a New Strategy
                            </DialogTitle>
                        </DialogHeader>
                        <div className="mb-4">
                            <label htmlFor="strategyName" className="sr-only">
                                Strategy Name
                            </label>
                            <Input
                                id="strategyName"
                                type="text"
                                placeholder="Enter strategy name"
                                value={strategyName}
                                onChange={(e) =>
                                    setStrategyName(e.target.value)
                                }
                            />
                        </div>
                        <Tabs className="overflow-scroll" defaultValue="open">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="open">
                                    Open Rules
                                </TabsTrigger>
                                <TabsTrigger value="close">
                                    Close Rules
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="open"
                                className="flex flex-col gap-2 mb-4">
                                <div className="flex items-center justify-between">
                                    <h1 className="py-4 text-neutral-500">
                                        Open position rules:
                                    </h1>
                                    <div
                                        onClick={() =>
                                            handleCreateNewRule({
                                                type: "open",
                                            })
                                        }
                                        className="custom-button flex justify-center cursor-pointer items-center gap-2">
                                        <Plus size={16} />
                                        <span className="text-sm">
                                            New Open Rule
                                        </span>
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[60%]">
                                                Name
                                            </TableHead>
                                            <TableHead className="w-[30%]">
                                                Priority
                                            </TableHead>
                                            <TableHead className="w-[10%]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {openPositionRules.map((rule) => (
                                            <NewRuleForDialog
                                                key={rule.id}
                                                rule={rule}
                                                handleChangePriority={() =>
                                                    handleChangePriority({
                                                        id: rule.id,
                                                        type: "open",
                                                    })
                                                }
                                                handleChangeRuleName={(
                                                    newName: string
                                                ) =>
                                                    handleChangeRuleName({
                                                        id: rule.id,
                                                        type: "open",
                                                        newName,
                                                    })
                                                }
                                                handleDeleteRule={() =>
                                                    handleDeleteRule({
                                                        id: rule.id,
                                                        type: "open",
                                                    })
                                                }
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                            <TabsContent
                                value="close"
                                className="flex flex-col gap-2 mb-4">
                                <div className="flex items-center justify-between">
                                    <h1 className="py-4 text-neutral-500">
                                        Close position rules:
                                    </h1>
                                    <div
                                        onClick={() =>
                                            handleCreateNewRule({
                                                type: "close",
                                            })
                                        }
                                        className="custom-button flex justify-center cursor-pointer items-center gap-2">
                                        <Plus size={16} />
                                        <span className="text-sm">
                                            New Close Rule
                                        </span>
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[60%]">
                                                Name
                                            </TableHead>
                                            <TableHead className="w-[30%]">
                                                Priority
                                            </TableHead>
                                            <TableHead className="w-[10%]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {closePositionRules.map((rule) => (
                                            <NewRuleForDialog
                                                key={rule.id}
                                                rule={rule}
                                                handleChangePriority={() =>
                                                    handleChangePriority({
                                                        id: rule.id,
                                                        type: "close",
                                                    })
                                                }
                                                handleChangeRuleName={(
                                                    newName: string
                                                ) =>
                                                    handleChangeRuleName({
                                                        id: rule.id,
                                                        type: "close",
                                                        newName,
                                                    })
                                                }
                                                handleDeleteRule={() =>
                                                    handleDeleteRule({
                                                        id: rule.id,
                                                        type: "close",
                                                    })
                                                }
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                        </Tabs>
                        <div className="flex gap-6 justify-end">
                            <DialogClose asChild>
                                <CustomButton isBlack={false}>
                                    Cancel
                                </CustomButton>
                            </DialogClose>
                            <CustomButton
                                isBlack
                                type="submit"
                                disabled={submittingNewStrategy}
                                onClick={createStrategy}>
                                Create a Strategy
                            </CustomButton>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
