import katex from "katex";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { assetFor, gradientFor } from "@/lib/categoryAssets";
import { categoryLabel, sortCategories } from "@/lib/categoryLabels";

interface StripCardProps {
  category: string;
  count: number;
}

function StripCard({ category, count }: StripCardProps) {
  const asset = assetFor(category);
  const gradient = gradientFor(category);
  const label = categoryLabel(category);

  const formulaHtml = useMemo(() => {
    if (asset.kind !== "formula") return null;
    return katex.renderToString(asset.latex, {
      displayMode: true,
      throwOnError: false,
      strict: "ignore",
    });
  }, [asset]);

  return (
    <Link
      to={`/dashboard#${category}`}
      className="strip-card group relative block aspect-[4/5] w-full overflow-hidden rounded-xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] transition-transform hover:scale-[1.03] hover:shadow-[0_18px_45px_-12px_rgba(34,224,122,0.45)]"
      style={{ backgroundImage: gradient }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.16), transparent 55%), radial-gradient(circle at 80% 90%, rgba(0,0,0,0.4), transparent 60%)",
        }}
      />
      <div className="absolute right-2 top-2 z-10 rounded-md bg-black/40 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
        {count}
      </div>

      <div className="absolute inset-x-0 top-[14%] flex h-[52%] items-center justify-center">
        {asset.kind === "image" ? (
          <img
            src={asset.src}
            alt={label}
            className="max-h-full max-w-[75%] object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
            loading="lazy"
          />
        ) : (
          <div
            className="strip-formula text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
            dangerouslySetInnerHTML={{ __html: formulaHtml ?? "" }}
          />
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-6">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)",
          }}
        />
        <h3 className="font-display relative text-center text-sm font-bold uppercase tracking-wide leading-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
          {label}
        </h3>
      </div>
    </Link>
  );
}

export function HeroCardsLoop() {
  const { categories } = useCategories();
  const sorted = sortCategories(categories);

  if (sorted.length === 0) {
    return <div className="hero-loop-frame" aria-hidden />;
  }

  const doubled = [...sorted, ...sorted];

  return (
    <div className="hero-loop-frame relative h-[560px] overflow-hidden">
      <div className="hero-loop-track flex flex-col gap-4">
        {doubled.map((c, i) => (
          <StripCard
            key={`${c.category}-${i}`}
            category={c.category}
            count={c.count}
          />
        ))}
      </div>
    </div>
  );
}
