"use client";

import { TableRow, TableCell } from "@/components/ui/table";

import { rulesStyle } from "./AddStrategyDialog";
import { Rule } from "@/types/dbSchema.types";
import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { CustomButton } from "../CustomButton";
import { toast } from "sonner";

type NewRuleForDialogProps = {
    rule: Rule;
    handleChangePriority: () => void;
    handleDeleteRule: () => void;
    handleChangeRuleName: (newName: string) => void;
};

export default function NewRuleForDialog({
    rule,
    handleChangePriority,
    handleChangeRuleName,
    handleDeleteRule,
}: NewRuleForDialogProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(rule.rule || "");

    const handleSaveNewName = (e: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        const trimmedName = newName.trim();
        if (newName === rule.rule) {
            setIsEditingName(false);
        } else if (trimmedName.length > 0) {
            handleChangeRuleName(trimmedName);
            setIsEditingName(false);
        } else {
            toast.error("New rule field cannot be empty.");
        }
    };
    return (
        <TableRow key={rule.id} className="py-2">
            {isEditingName ? (
                <TableCell className="flex items-center">
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        type="text"
                        placeholder="New rule"
                        className="outline-none bg-transparent"
                        autoFocus
                    />
                    <div className="flex items-center gap-2">
                        {newName.length > 0 ? (
                            <X
                                onClick={() => setNewName("")}
                                className="cursor-pointer"
                                size={16}
                            />
                        ) : (
                            <X className="opacity-0" size={16} />
                        )}
                        <CustomButton
                            isBlack={false}
                            onClick={handleSaveNewName}>
                            Save
                        </CustomButton>
                    </div>
                </TableCell>
            ) : (
                <TableCell className="w-[60%]">
                    <div
                        onClick={() => {
                            setIsEditingName(true);
                        }}
                        className="cursor-pointer w-fit">
                        {rule.rule}
                    </div>
                </TableCell>
            )}
            {/* <div className="flex gap-8 items-center justify-between"> */}

            <TableCell onClick={handleChangePriority}>
                <span
                    className={`w-[30%] px-3 p-1 rounded-lg text-center text-sm cursor-pointer whitespace-nowrap ${
                        rulesStyle[rule.priority]
                    }`}>
                    &bull; {rule.priority}
                </span>
            </TableCell>
            <TableCell className="w-[10%] text-center">
                <Trash2
                    className="cursor-pointer"
                    onClick={handleDeleteRule}
                    size={18}
                />
            </TableCell>
            {/* </div> */}
        </TableRow>
    );
}
