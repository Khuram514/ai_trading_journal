"use client";

import { CustomButton } from "@/components/CustomButton";
import CustomLoading from "@/components/CustomLoading";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    addRemoveFavorite,
    deleteReportFromDB,
    getReports,
} from "@/server/actions/archive";
import { ReportsEntry } from "@/types/tradeAI.types";
import { useUser } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

export default function Page() {
    const { user } = useUser();
    const [reports, setReports] = useState<ReportsEntry[]>();
    const [sorted, setSorted] = useState<string>();
    const [showOnlyFavorite, setShowOnlyFavorite] = useState(false);
    const [paginatedReports, setPaginatedReports] = useState<ReportsEntry[]>();

    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 9;
    const [totalPages, setTotalPages] = useState(0);

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getReports(user?.id);
                if (data?.success) {
                    setReports(data.reports);
                }
            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (!reports) {
            setPaginatedReports([]);
            setTotalPages(0);
            return;
        }

        let filteredReports = [...reports];

        if (showOnlyFavorite) {
            filteredReports = filteredReports.filter(
                (report) => report.isFavorite
            );
        }

        if (sorted === "asc") {
            filteredReports.sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            );
        } else if (sorted === "desc") {
            filteredReports.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
        }

        const newTotalPages = Math.ceil(
            filteredReports.length / reportsPerPage
        );
        setTotalPages(newTotalPages);

        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else if (newTotalPages === 0) {
            setCurrentPage(1);
        }

        const startIndex = (currentPage - 1) * reportsPerPage;
        const endIndex = startIndex + reportsPerPage;
        setPaginatedReports(filteredReports.slice(startIndex, endIndex));
    }, [reports, showOnlyFavorite, sorted, currentPage, reportsPerPage]);

    const addDeleteFavorite = async (id: string) => {
        if (!reports) return;
        await addRemoveFavorite(id);
        setReports(
            reports.map((report) =>
                report.reportId === id
                    ? { ...report, isFavorite: !report.isFavorite }
                    : report
            )
        );
    };

    const deleteReport = async (id: string) => {
        if (!reports) return;
        try {
            const response = await deleteReportFromDB(id);
            if (response?.success) {
                setReports((prevReports) =>
                    prevReports
                        ? prevReports.filter((report) => report.reportId !== id)
                        : []
                );
                toast.success("Report deleted successfully!");
            } else {
                toast.error(response?.error);
                console.log(response?.error);
            }
        } catch (err) {
            toast.error("Server error. Try again later!");
            console.log(err);
        }
    };

    console.log(paginatedReports);

    return (
        <div
            className={`flex flex-col ${
                totalPages > 1 ? "justify-between" : "justify-start"
            } gap-8 2xl:gap-20 py-6 2xl:py-16 px-4 md:px-16 2xl:px-36 2xl:mx-[64px] h-full`}>
            <div className="flex max-md:flex-col gap-4 md:gap-0 items-center justify-between">
                <span className="text-zinc-500 text-[.9rem] px-4 py-2 border border-gray-200 rounded-lg ">
                    View the history of your saved reports. You can ask the AI
                    more questions by picking up where you left off.
                </span>
                <div className="flex max-lg:flex-col gap-4 w-full lg:w-auto">
                    <CustomButton
                        isBlack={false}
                        onClick={() => setShowOnlyFavorite((prev) => !prev)}>
                        <div className="flex gap-2 items-center justify-center">
                            <Star
                                size={20}
                                color={
                                    showOnlyFavorite
                                        ? "var(--customYellow)"
                                        : "#3d3929"
                                }
                            />
                            Favorite
                        </div>
                    </CustomButton>
                    <Select
                        value={sorted}
                        onValueChange={(value) => setSorted(value)}>
                        <SelectTrigger className="border border-gray-200 rounded-md w-full md:w-[160px] px-4">
                            <SelectValue placeholder="Sort by time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="desc">
                                    Newest first
                                </SelectItem>
                                <SelectItem value="asc">
                                    Oldest first
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-3 grid-rows-3 gap-x-4 2xl:gap-x-8 gap-y-4 2xl:gap-y-8 pb-[24px] lg:pb-0">
                {paginatedReports ? (
                    paginatedReports?.map((report) => (
                        <Link
                            className="relative max-h-[170px] col-span-3 lg:col-span-1 row-span-1 border border-gray-200 md:hover:border-gray-400 duration-300 rounded-lg py-4 px-6 flex flex-col gap-2 shadow-md overflow-hidden"
                            href={`/private/reports-history/${report.reportId}`}
                            key={report.reportId}>
                            <div className="pointer-events-none absolute -inset-px z-2 overflow-hidden">
                                <div className="absolute right-[1rem] top-0 size-[7rem] -translate-y-[20%] translate-x-1/3 transform-gpu rounded-full bg-[radial-gradient(theme(colors.sky.300),transparent)] opacity-5 blur-lg"></div>
                                <div className="absolute right-[15rem] top-0 size-[10rem] -translate-y-[50%] translate-x-1/3 transform-gpu rounded-full bg-[radial-gradient(theme(colors.emerald.300),transparent)] opacity-5 blur-lg"></div>
                                <div className="absolute right-[10rem] top-0 size-[12rem] translate-y-[40%] translate-x-1/3 transform-gpu rounded-full bg-[radial-gradient(theme(colors.orange.400),transparent)] opacity-5 blur-lg"></div>
                            </div>
                            <Image
                                src="/logo-watermark.png"
                                height={270}
                                width={270}
                                alt="logo"
                                className="absolute opacity-5 right-0 top-0"
                            />
                            <div className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    <Image
                                        src="/logo.svg"
                                        alt="logo"
                                        width={30}
                                        height={30}
                                    />
                                    <span className="">Your report</span>
                                </div>

                                <MdDelete
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        deleteReport(report.reportId);
                                    }}
                                    className="text-[1.2rem] text-sell cursor-pointer hover:opacity-85 transition-opacity duration-200 z-20"
                                />
                            </div>
                            <div
                                className="flex gap-2 items-center py-1 px-2 border border-gray-200 hover:border-gray-400 duration-200 rounded-md w-fit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    addDeleteFavorite(report.reportId);
                                }}>
                                <Star
                                    size={14}
                                    color={
                                        report.isFavorite
                                            ? "var(--customYellow)"
                                            : "#71717a"
                                    }
                                />
                                <span className="text-[.9rem] text-zinc-500">
                                    Favorite
                                </span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <span className="text-zinc-500 text-[.8rem]">
                                    Generated on:
                                </span>
                                <span className="text-[.9rem]">
                                    {report.createdAt}
                                </span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <span className="text-zinc-500 text-[.8rem]">
                                    Messages:
                                </span>
                                <span className="text-[.9rem]">
                                    {report.numberOfMessages}
                                </span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="min-h-[400px] col-span-3 row-span-3 flex items-start justify-center">
                        <CustomLoading />
                    </div>
                )}
                {paginatedReports?.length === 0 && (
                    <div className="min-h-[400px] col-span-3 row-span-3 flex items-center justify-center md:text-[1.5rem] text-zinc-500">
                        Your reports archive is empty
                    </div>
                )}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4 pb-[24px] lg:pb-0">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`flex gap-2 items-center px-4 py-2 text-[.9rem] rounded-md ${
                            currentPage === 1
                                ? " text-gray-400 cursor-not-allowed"
                                : ""
                        }`}>
                        <ChevronLeft />
                        Prev
                    </button>
                    <span className="text-[.9rem]">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`flex gap-2 items-center px-4 py-2 text-[.9rem] rounded-md ${
                            currentPage === totalPages
                                ? " text-gray-400 cursor-not-allowed"
                                : ""
                        }`}>
                        Next
                        <ChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}
