"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { months } from "@/data/data";
import { newTradeFormSchema } from "@/zodSchema/schema";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
} from "../ui/select";
import { StarRating } from "../calendar/StarRating";

interface OpenDetailsTabProps {
    form: UseFormReturn<z.infer<typeof newTradeFormSchema>>;
    openDate: Date | undefined;
    setOpenDate: (date: Date | undefined) => void;
    closeDate: Date | undefined;
    setCloseDate: (date: Date | undefined) => void;
    instrumentLabels: string[];
    day?: dayjs.Dayjs | undefined;
    rating: number;
}

export const OpenDetailsTab = ({
    form,
    openDate,
    setOpenDate,
    closeDate,
    setCloseDate,
    instrumentLabels,
    day,
    rating
}: OpenDetailsTabProps) => {
    const { register, control, setValue, formState: { errors } } = form;

    return (
        <div className="flex flex-col gap-2">
            {/* Date and Time Section */}
            <div className="mb-2 flex gap-4">
                <div className="flex flex-col flex-1 gap-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="close-time" className="mb-1">
                            Open date:
                        </Label>
                        {errors.openDate && (
                            <span className="mb-1 text-[.75rem] text-red-500">
                                {errors.openDate.message}
                            </span>
                        )}
                    </div>

                    {day == undefined ? (
                        <Controller
                            name="openDate"
                            control={control}
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className="justify-start text-left font-normal max-md:text-[.75rem]">
                                            <CalendarIcon />
                                            {openDate ? (
                                                format(openDate, "dd MMM yyyy")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={openDate}
                                            onSelect={(date) => {
                                                setOpenDate(date);
                                                field.onChange(date?.toISOString());
                                            }}
                                            defaultMonth={new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                    ) : (
                        <Input
                            disabled
                            className="max-md:text-[.75rem]"
                            placeholder={`${day.date()} ${months[day.month()].slice(0, 3)} ${day.year()}`}
                        />
                    )}
                </div>
                <div className="flex flex-col flex-1 gap-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="open-time" className="mb-1">
                            Open time:
                        </Label>
                        <span className="text-[.75rem] text-black/50">
                            (default time)
                        </span>
                    </div>
                    <Input
                        type="time"
                        id="open-time"
                        className="w-full max-md:text-[.75rem]"
                        {...register("openTime")}
                    />
                </div>
            </div>

            {/* <div className="mb-2 flex gap-4">
                <div className="flex flex-col flex-1 gap-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="close-time" className="mb-1">
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
            </div> */}

            {/* Instrument Name Section */}
            <div className="mb-2 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <Label htmlFor="instrumentName" className="mb-1">
                        Instrument:
                    </Label>

                    {errors.instrumentName ? (
                        <span className="mb-1 text-[.75rem] text-red-500">
                            {errors.instrumentName.message}
                        </span>
                    ) : (
                        <span className="mb-1 text-[.75rem] text-black/50">
                            (e.g. Crypto or Forex)
                        </span>
                    )}
                </div>
                <Controller
                    name="instrumentName"
                    control={control}
                    render={({ field }) => (
                        <div className="flex gap-2">
                            <Input
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Type manually"
                                type="text"
                                className="w-2/3 max-md:text-[.75rem]"
                            />
                            <Select onValueChange={field.onChange}>
                                <SelectTrigger className="w-1/3">
                                    <div className="text-zinc-500">
                                        Or select
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {instrumentLabels.map((label) => (
                                            <SelectItem key={label} value={label}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                />
            </div>

            {/* Symbol Name Section */}
            <div className="mb-2 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <Label htmlFor="symbolName" className="mb-1">
                        Symbol:
                    </Label>

                    {errors.symbolName ? (
                        <span className="mb-1 text-[.75rem] text-red-500">
                            {errors.symbolName.message}
                        </span>
                    ) : (
                        <span className="mb-1 text-[.75rem] text-black/50">
                            (e.g. Bitcoin or BTC)
                        </span>
                    )}
                </div>
                <Controller
                    name="symbolName"
                    control={control}
                    render={({ field }) => (
                        <div className="flex gap-2">
                            <Input
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Type manually"
                                type="text"
                                className="w-2/3 max-md:text-[.75rem]"
                            />
                            <Select onValueChange={field.onChange}>
                                <SelectTrigger className="w-1/3">
                                    <div className="text-zinc-500">
                                        Or select
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {instrumentLabels.map((label) => (
                                            <SelectItem key={label} value={label}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                />
            </div>

            {/* Position Type Section */}
            <div className="flex gap-2">


                <div className="mb-2 flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                        <Label className="mb-1">Position type:</Label>
                        {errors.positionType ? (
                            <span className="mb-1 text-[.75rem] text-red-500">
                                {errors.positionType.message}
                            </span>
                        ) : (
                            <span className="mb-1 text-[.75rem] text-black/50">
                                (Click to change)
                            </span>
                        )}
                    </div>
                    <Controller
                        name="positionType"
                        control={control}
                        render={({ field }) => (
                            <div
                                className={`h-[40px] ${field.value === "buy" ? "bg-buy" : "bg-sell"
                                    } rounded-md cursor-pointer flex-center`}
                                onClick={() =>
                                    field.value === "buy"
                                        ? setValue("positionType", "sell")
                                        : setValue("positionType", "buy")
                                }>
                                <p className="text-white">
                                    {field.value === "buy" ? "Buy" : "Sell"}
                                </p>
                            </div>
                        )}
                    />
                </div>
                <div className="mb-2 flex flex-col flex-1 gap-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="entryPrice" className="mb-1">
                            Entry price:
                        </Label>
                        {errors.entryPrice ? (
                            <span className="mb-1 text-[.75rem] text-red-500">
                                {errors.entryPrice.message}
                            </span>
                        ) : (
                            <span className="mb-1 text-[.75rem] text-black/50">
                                (Only num.)
                            </span>
                        )}
                    </div>
                    <Input
                        type="number"
                        id="entryPrice"
                        className="w-full max-md:text-[.75rem]"
                        {...register("entryPrice")}
                    />
                </div>
            </div>

            {/* Quantity and Total cost Section */}
            <div className="flex gap-2">
                <div className="mb-2 flex flex-col flex-1 gap-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="quantity" className="mb-1">
                            Quantity:
                        </Label>
                        {errors.quantity ? (
                            <span className="mb-1 text-[.75rem] text-red-500">
                                {errors.quantity.message}
                            </span>
                        ) : (
                            <span className="mb-1 text-[.75rem] text-black/50">
                                (Only num.)
                            </span>
                        )}
                    </div>
                    <Input
                        type="number"
                        id="quantity"
                        className="w-full max-md:text-[.75rem]"
                        {...register("quantity")}
                    />
                </div>
                <div className="mb-2 flex flex-col flex-1 gap-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="totalCost" className="mb-1">
                            Total cost:
                        </Label>
                        {errors.totalCost ? (
                            <span className="mb-1 text-[.75rem] text-red-500">
                                {errors.totalCost.message}
                            </span>
                        ) : (
                            <span className="mb-1 text-[.75rem] text-black/50">
                                (Only num.)
                            </span>
                        )}
                    </div>
                    <Input
                        type="number"
                        id="totalCost"
                        className="w-full max-md:text-[.75rem]"
                        {...register("totalCost")}
                    />
                </div>
            </div>

            {/* Rating Section */}
            <div className="mb-2 flex flex-col gap-2">
                <Label htmlFor="rating" className="mb-1">
                    Rate your trade:{" "}
                    <span className="ml-2 text-[.75rem] text-black/50">
                        (default 0)
                    </span>
                </Label>
                <StarRating setValue={setValue} rating={rating} />
            </div>

            {/* Notes Section */}
            <div className="mb-4 flex flex-col gap-1">
                <Label htmlFor="notes" className="mb-1">
                    Notes (optional):
                </Label>
                <textarea
                    id="notes"
                    rows={2}
                    className="w-full outline-none rounded-md border border-zinc-200 px-3 py-1 resize-none text-[0.9rem]"
                    {...register("notes")}
                />
            </div>
        </div>
    );
};