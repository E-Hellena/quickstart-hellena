import { Star } from "lucide-react";

export default function ProductStars({ n, size = 14 }: { n: number; size?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    style={{ width: size, height: size }}
                    className={i <= Math.round(n) ? "fill-rating text-rating" : "fill-muted text-muted"}
                />
            ))}
        </div>
    );
}
