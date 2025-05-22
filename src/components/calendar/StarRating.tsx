import { useState } from "react";
import { Star } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { newTradeFormSchema } from "@/zodSchema/schema";
import { z } from "zod";

interface StarRatingProps {
    maxRating?: number;
    setValue: UseFormSetValue<z.infer<typeof newTradeFormSchema>>;
}

export function StarRating({ maxRating = 5, setValue }: StarRatingProps) {
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);

    return (
        <div id="rating" className="flex">
            {[...Array(maxRating)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <div
                        key={ratingValue}
                        className="pr-4 cursor-pointer"
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => {
                            setRating(ratingValue);
                            setValue("rating", ratingValue);
                        }}>
                        <Star
                            className={`h-5 w-5 ${
                                ratingValue <= (hover || rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                            }`}
                        />
                    </div>
                );
            })}
        </div>
    );
}
