import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface StarRatingProps {
    maxRating?: number;
}

export function StarRating({ maxRating = 5 }: StarRatingProps) {
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);

    return (
        <div id="rating" className="flex">
            {[...Array(maxRating)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <div
                        key={ratingValue}
                        className="pr-4"
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}>
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
