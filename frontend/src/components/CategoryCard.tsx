import katex from "katex";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { assetFor, gradientFor } from "@/lib/categoryAssets";
import { categoryLabel } from "@/lib/categoryLabels";

interface Props {
  category: string;
  count: number;
  index: number;
}

export function CategoryCard({ category, count, index }: Props) {
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
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/dashboard#${category}`}
        className="group relative block aspect-[3/4] overflow-hidden rounded-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] transition-shadow hover:shadow-[0_18px_50px_-12px_rgba(34,224,122,0.45)]"
        style={{ backgroundImage: gradient }}
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 55%), radial-gradient(circle at 80% 90%, rgba(0,0,0,0.35), transparent 55%)",
          }}
        />

        <div className="absolute left-3 top-3 z-10 flex items-center justify-center rounded-md bg-black/35 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-md bg-black/35 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
          {count} <span className="opacity-70">problems</span>
        </div>

        <div className="absolute inset-x-0 top-[20%] flex h-[48%] items-center justify-center">
          {asset.kind === "image" ? (
            <img
              src={asset.src}
              alt={label}
              className="max-h-full max-w-[78%] object-contain drop-shadow-[0_8px_22px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className="formula-card text-white drop-shadow-[0_8px_22px_rgba(0,0,0,0.45)]"
              dangerouslySetInnerHTML={{ __html: formulaHtml ?? "" }}
            />
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-8">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 70%, transparent 100%)",
            }}
          />
          <h3 className="font-display relative text-center text-xl font-bold uppercase tracking-wide leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] md:text-2xl">
            {label}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
