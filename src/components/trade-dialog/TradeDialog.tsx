"use client";

import dayjs from "dayjs";

import { Trades } from "@/types";
import { DialogClose, DialogTitle, DialogHeader } from "../ui/dialog";
import { CustomButton } from "../CustomButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { useTradeForm } from "./hooks/useTradeForm";
import { TradeDetailsTab } from "./TradeDetailsTab";
import { StrategyTab } from "./StrategyTab";

interface TradeDialogProps {
    editMode?: boolean;
    existingTrade?: Trades;
    day?: dayjs.Dayjs | undefined;
    onRequestClose?: () => void;
}

export const TradeDialog = ({
    editMode = false,
    existingTrade,
    day,
    onRequestClose,
}: TradeDialogProps) => {
    const tradeForm = useTradeForm({
        editMode,
        existingTrade,
        day,
        onRequestClose,
    });

    return (
        <form
            onSubmit={tradeForm.form.handleSubmit(tradeForm.onSubmit)}
            className="sm:max-w-[460px] flex flex-col">

            <DialogHeader className="mb-6">
                <DialogTitle className="text-center text-[1.4rem]">
                    {editMode ? "Edit Trade" : "Add a New Trade"}
                </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="strategy">Strategy</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="flex flex-col gap-2">
                    <TradeDetailsTab
                        form={tradeForm.form}
                        openDate={tradeForm.openDate}
                        setOpenDate={tradeForm.setOpenDate}
                        closeDate={tradeForm.closeDate}
                        setCloseDate={tradeForm.setCloseDate}
                        instrumentLabels={tradeForm.instrumentLabels}
                        day={day}
                        rating={tradeForm.rating}
                    />

                    <div className="flex gap-6 justify-end">
                        <DialogClose asChild>
                            <CustomButton isBlack={false}>Cancel</CustomButton>
                        </DialogClose>
                        <CustomButton
                            isBlack
                            type="submit"
                            disabled={tradeForm.submittingTrade}>
                            {editMode ? "Update Trade" : "Add Trade"}
                        </CustomButton>
                    </div>
                </TabsContent>

                <TabsContent value="strategy">
                    <StrategyTab
                        form={tradeForm.form}
                        strategies={tradeForm.localStrategies}
                        selectedStrategyId={tradeForm.selectedStrategyId}
                        checkedOpenRules={tradeForm.checkedOpenRules}
                        checkedCloseRules={tradeForm.checkedCloseRules}
                        onStrategyChange={tradeForm.handleStrategyChange}
                        onOpenRuleToggle={tradeForm.handleOpenRuleToggle}
                        onCloseRuleToggle={tradeForm.handleCloseRuleToggle}
                    />

                    <div className="flex gap-6 justify-end">
                        <DialogClose asChild>
                            <CustomButton isBlack={false}>Cancel</CustomButton>
                        </DialogClose>
                        <CustomButton
                            isBlack
                            type="submit"
                            disabled={tradeForm.submittingTrade}>
                            {editMode ? "Update Trade" : "Add Trade"}
                        </CustomButton>
                    </div>
                </TabsContent>
            </Tabs>
        </form>
    );
};