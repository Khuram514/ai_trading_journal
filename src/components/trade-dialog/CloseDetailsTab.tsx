"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { newTradeFormSchema } from "@/zodSchema/schema";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface CloseDetailsTabProps {
    form: UseFormReturn<z.infer<typeof newTradeFormSchema>>;
    openDate: Date | undefined;
    closeDate: Date | undefined;
    setCloseDate: (date: Date | undefined) => void;
}

export const CloseDetailsTab = ({
    form,
    openDate,
    closeDate,
    setCloseDate,
}: CloseDetailsTabProps) => {
    const { register, control, formState: { errors } } = form;

    return (
        <div className="flex flex-col gap-2">
            {/* Close Date and Time Section */}
            <div className="mb-2 flex gap-4">
                <div className="flex flex-col flex-1 gap-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="close-date" className="mb-1">
                            Close date:
                        </Label>
                        {errors.closeDate && (
                            <span className="mb-1 text-[.75rem] text-red-500">
                                {errors.closeDate.message}
                            </span>
                        )}
                    </div>
                    <Controller
                        name="closeDate"
                        control={control}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className="justify-start text-left font-normal max-md:text-[.75rem]">
                                        <CalendarIcon />
                                        {closeDate ? (
                                            format(closeDate, "dd MMM yyyy")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        mode="single"
                                        selected={closeDate}
                                        onSelect={(date) => {
                                            setCloseDate(date);
                                            field.onChange(date?.toISOString());
                                        }}
                                        disabled={
                                            openDate &&
                                            ((date) =>
                                                date < new Date(openDate.toISOString()))
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                </div>
                <div className="flex flex-col flex-1 gap-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="close-time" className="mb-1">
                            Close time:
                        </Label>
                        <span className="text-[.75rem] text-black/50">
                            (default time)
                        </span>
                    </div>

                    <Input
                        type="time"
                        id="close-time"
                        className="w-full max-md:text-[.75rem]"
                        {...register("closeTime")}
                    />
                </div>
            </div>

            {/* Sell Price and Quantity Sold Section */}
            <div className="flex gap-2">
                <div className="mb-2 flex flex-col flex-1 gap-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="sellPrice" className="mb-1">
                            Sell price:
                        </Label>
                        {errors.sellPrice ? (
                            <span className="mb-1 text-[.75rem] text-red-500">
                                {errors.sellPrice.message}
                            </span>
                        ) : (
                            <span className="mb-1 text-[.75rem] text-black/50">
                                (Only num.)
                            </span>
                        )}
                    </div>
                    <Input
                        type="number"
                        id="sellPrice"
                        className="w-full max-md:text-[.75rem]"
                        {...register("sellPrice")}
                    />
                </div>
                <div className="mb-2 flex flex-col flex-1 gap-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="quantitySold" className="mb-1">
                            Quantity sold:
                        </Label>
                        {errors.quantitySold ? (
                            <span className="mb-1 text-[.75rem] text-red-500">
                                {errors.quantitySold.message}
                            </span>
                        ) : (
                            <span className="mb-1 text-[.75rem] text-black/50">
                                (Only num.)
                            </span>
                        )}
                    </div>
                    <Input
                        type="number"
                        id="quantitySold"
                        className="w-full max-md:text-[.75rem]"
                        {...register("quantitySold")}
                    />
                </div>
            </div>

            {/* Profit or Loss Section */}
            <div className="mb-2 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <Label htmlFor="profitOrLoss" className="mb-1">
                        Profit or Loss:
                    </Label>
                    {errors.profitOrLoss ? (
                        <span className="mb-1 text-[.75rem] text-red-500">
                            {errors.profitOrLoss.message}
                        </span>
                    ) : (
                        <span className="mb-1 text-[.75rem] text-black/50">
                            (Positive for profit, negative for loss)
                        </span>
                    )}
                </div>
                <Input
                    type="number"
                    id="profitOrLoss"
                    className="w-full max-md:text-[.75rem]"
                    {...register("profitOrLoss")}
                    placeholder="Enter profit (+) or loss (-)"
                />
            </div>
        </div>
    );
};
