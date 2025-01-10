"use client";

import {
    DialogClose,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "../ui/dialog";

import { months } from "@/data/data";
import Image from "next/image";
import { CustomButton } from "../CustomButton";

import { format } from "date-fns";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
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
    SelectValue,
} from "../ui/select";

import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";
import { newTradeFormSchema } from "@/zodSchema/schema";
import { z } from "zod";
import { createNewTradeRecord } from "@/server/actions/trades";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
    setMonthViewSummary,
    setTotalOfParticularYearSummary,
    setYearViewSummary,
    updateListOfTrades,
} from "@/redux/slices/tradeRecordsSlice";
import { setIsDialogOpen } from "@/redux/slices/calendarSlice";

import { v4 as uuidv4 } from "uuid";

export default function CustomDialogContent({
    day,
}: {
    day: dayjs.Dayjs | undefined;
}) {
    const [openDate, setOpenDate] = useState<Date>();
    const [closeDate, setCloseDate] = useState<Date>();
    const [instrumentLabels, setInstrumentLabels] = useState<string[]>([]);

    const trades = useAppSelector((state) => state.tradeRecords.listOfTrades);

    const dispatch = useAppDispatch();

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<z.infer<typeof newTradeFormSchema>>({
        resolver: zodResolver(newTradeFormSchema),
        defaultValues: {
            positionType: undefined,
            openDate: undefined,
            openTime: "12:30",
            closeDate: undefined,
            closeTime: "12:30",
            deposit: "",
            instrumentName: "",
            result: "",
            notes: "",
        },
    });

    async function onSubmit(newTrade: z.infer<typeof newTradeFormSchema>) {
        const customId = uuidv4();
        const data = await createNewTradeRecord(newTrade, customId);
        if (data?.error) {
            return toast.error("There was an error saving your event!");
        } else {
            const [stringDay, month, year] = new Date(newTrade.closeDate)
                .toLocaleDateString("en-GB")
                .split("/");
            const numericMonth = parseInt(month, 10);
            const convertedMonthView = `${stringDay}-${month}-${year}`;
            const convertedYearView = `${numericMonth}-${year}`;
            dispatch(
                setMonthViewSummary({
                    month: convertedMonthView,
                    value: Number(newTrade.result),
                })
            );
            dispatch(
                setYearViewSummary({
                    year: convertedYearView,
                    value: Number(newTrade.result),
                })
            );
            dispatch(
                setTotalOfParticularYearSummary({
                    year: year,
                    value: Number(newTrade.result),
                })
            );
            dispatch(
                updateListOfTrades({
                    id: customId,
                    ...newTrade,
                })
            );

            toast.success("A new record has been created!");
            const dayKey = day !== undefined ? day.format("DD-MM-YYYY") : "any";
            dispatch(setIsDialogOpen({ key: dayKey, value: false }));
        }
    }

    useEffect(() => {
        if (day) {
            const convertedDate = day.toDate().toISOString();
            setValue("closeDate", convertedDate);
        }
        setInstrumentLabels([
            ...new Set(trades?.map((trade) => trade.instrumentName)),
        ]);
    }, [day, trades]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="sm:max-w-[460px] flex flex-col">
            <div className="w-full flex justify-center mb-2 max-md:hidden">
                <Image src="/logo.svg" alt="logo" width={40} height={40} />
            </div>
            <DialogHeader className="mb-6">
                <DialogTitle className="text-center text-[1.2rem]">
                    Add a New Trade
                </DialogTitle>

                <DialogDescription className="bg-primary p-2 rounded-xl max-md:hidden">
                    Important! The more data you add, the better you can refine
                    your strategy, improve future outcomes, and enhance
                    AI-powered analysis.
                </DialogDescription>
            </DialogHeader>
            <div className="mb-2 flex gap-4">
                <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="close-time"
                            className="mb-1 text-[.75rem]">
                            Open date:
                        </Label>
                        {errors.openDate && (
                            <span className="mb-1 text-[.75rem] text-red-500">
                                {errors.openDate.message}
                            </span>
                        )}
                    </div>

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
                                        disabled={
                                            day &&
                                            ((date) =>
                                                date >
                                                new Date(day.toISOString()))
                                        }
                                        defaultMonth={
                                            day
                                                ? new Date(
                                                      day?.year(),
                                                      day?.month()
                                                  )
                                                : new Date()
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="open-time"
                            className="mb-1 text-[.75rem]">
                            Open time:
                        </Label>
                        <span className="mb-1 text-[.65rem] text-black/50">
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
            <div className="mb-2 flex gap-4">
                <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="close-time"
                            className="mb-1 text-[.75rem]">
                            Close date:
                        </Label>
                        {errors.closeDate && (
                            <span className="mb-1 text-[.75rem] text-red-500">
                                {errors.closeDate.message}
                            </span>
                        )}
                    </div>
                    {day == undefined ? (
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
                                                field.onChange(
                                                    date?.toISOString()
                                                );
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                    ) : (
                        <Input
                            disabled
                            className="max-md:text-[.75rem]"
                            placeholder={`${day.date()} ${months[
                                day.month()
                            ].slice(0, 3)} ${day.year()}`}
                        />
                    )}
                </div>
                <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="close-time"
                            className="mb-1 text-[.75rem]">
                            Close time:
                        </Label>
                        <span className="mb-1 text-[.65rem] text-black/50">
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
            <div className="mb-2 flex flex-col">
                <div className="flex items-center justify-between">
                    <Label
                        htmlFor="instrumentName"
                        className="mb-1 text-[.75rem]">
                        Instrument name or Symbol/Ticker:
                    </Label>

                    {errors.instrumentName ? (
                        <span className="mb-1 text-[.75rem] text-red-500">
                            {errors.instrumentName.message}
                        </span>
                    ) : (
                        <span className="mb-1 text-[.65rem] text-black/50">
                            (e.g. Bitcoin or BTC)
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
                                            <SelectItem
                                                key={label}
                                                value={label}>
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
            <div className="mb-2 flex flex-col">
                <div className="flex items-center justify-between">
                    <Label htmlFor="deposit" className="mb-1 text-[.75rem]">
                        Deposit amount:
                    </Label>
                    {errors.deposit ? (
                        <span className="mb-1 text-[.75rem] text-red-500">
                            {errors.deposit.message}
                        </span>
                    ) : (
                        <span className="mb-1 text-[.65rem] text-black/50">
                            (Without commas or dots.)
                        </span>
                    )}
                </div>
                <Input
                    type="number"
                    id="deposit"
                    className="w-full max-md:text-[.75rem]"
                    {...register("deposit")}
                />
            </div>
            <div className="mb-2 flex flex-col">
                <div className="flex items-center justify-between">
                    <Label htmlFor="result" className="mb-1 text-[.75rem]">
                        Result (Earned/Lost):
                    </Label>
                    {errors.result ? (
                        <span className="mb-1 text-[.75rem] text-red-500">
                            {errors.result.message}
                        </span>
                    ) : (
                        <span className="mb-1 text-[.65rem] text-black/50">
                            (Without commas or dots.)
                        </span>
                    )}
                </div>
                <Input
                    type="number"
                    id="result"
                    className="w-full max-md:text-[.75rem]"
                    {...register("result")}
                />
            </div>
            <div className="mb-2 flex flex-col">
                <div className="flex items-center justify-between">
                    <Label className="mb-1 text-[.75rem]">Position type:</Label>
                    {errors.positionType && (
                        <span className="mb-1 text-[.75rem] text-red-500">
                            {errors.positionType.message}
                        </span>
                    )}
                </div>
                <Controller
                    name="positionType"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="buy">Buy</SelectItem>
                                    <SelectItem value="sell">Sell</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className="mb-6 flex flex-col">
                <Label htmlFor="notes" className="mb-1 text-[.75rem]">
                    Notes (optional):
                </Label>
                <textarea
                    id="notes"
                    rows={3}
                    className="w-full outline-none rounded-md border border-zinc-200 px-3 py-1 resize-none text-[0.8rem]"
                    {...register("notes")}
                />
            </div>

            <div className="flex gap-6 justify-end">
                <DialogClose asChild>
                    <CustomButton isBlack={false}>Cancel</CustomButton>
                </DialogClose>
                <CustomButton isBlack type="submit">
                    Add Trade
                </CustomButton>
            </div>
        </form>
    );
}
