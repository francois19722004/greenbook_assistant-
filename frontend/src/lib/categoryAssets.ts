export type CategoryAsset =
  | { kind: "image"; src: string }
  | { kind: "formula"; latex: string };

const enc = (name: string) => `/webp/${encodeURIComponent(name)}.webp`;

export const categoryAssets: Record<string, CategoryAsset> = {
  brain_teasers: { kind: "image", src: enc("brain teasers") },
  combinatorics: { kind: "image", src: enc("combinatorics") },
  probability: { kind: "image", src: enc("probability") },
  conditional_probability: { kind: "image", src: enc("conditional probability") },
  distributions: { kind: "image", src: enc("distributions") },
  expected_value: { kind: "image", src: enc("expected value") },
  conditional_expectation: { kind: "formula", latex: "E[X \\mid Y]" },
  calculus: { kind: "image", src: enc("calculus") },
  linear_algebra: { kind: "formula", latex: "A\\vec{x} = \\vec{b}" },
  stochastic_calculus: { kind: "image", src: enc("stochastic calculus") },
  option_pricing: { kind: "image", src: enc("options pricing") },
  greeks: { kind: "image", src: enc("greeks") },
  option_strategies: { kind: "image", src: enc("option strategy") },
  portfolio_theory: { kind: "image", src: enc("portolio theory") },
  fixed_income: { kind: "image", src: enc("fixed income") },
  algorithms: { kind: "image", src: enc("algorithms") },
};

export const categoryGradients: Record<string, string> = {
  brain_teasers:
    "linear-gradient(160deg, #0f3a5c 0%, #16b1a3 60%, #c5f74f 100%)",
  combinatorics:
    "linear-gradient(160deg, #0d2849 0%, #2e6cc9 55%, #34d399 100%)",
  probability:
    "linear-gradient(160deg, #0c2a3a 0%, #14b8a6 55%, #6ee7b7 100%)",
  conditional_probability:
    "linear-gradient(160deg, #0b1f3d 0%, #1d4ed8 55%, #22e07a 100%)",
  distributions:
    "linear-gradient(160deg, #103352 0%, #0ea5e9 55%, #a7f3d0 100%)",
  expected_value:
    "linear-gradient(160deg, #0d2d2a 0%, #0f766e 55%, #c5f74f 100%)",
  conditional_expectation:
    "linear-gradient(160deg, #0c1f3a 0%, #2563eb 55%, #34d399 100%)",
  calculus:
    "linear-gradient(160deg, #0e2940 0%, #0891b2 55%, #84cc16 100%)",
  linear_algebra:
    "linear-gradient(160deg, #0a223d 0%, #1e40af 55%, #22e07a 100%)",
  stochastic_calculus:
    "linear-gradient(160deg, #102a4d 0%, #0d9488 55%, #bef264 100%)",
  option_pricing:
    "linear-gradient(160deg, #0c1f33 0%, #115e59 55%, #4ade80 100%)",
  greeks:
    "linear-gradient(160deg, #0a1f3a 0%, #0369a1 55%, #34d399 100%)",
  option_strategies:
    "linear-gradient(160deg, #0d2942 0%, #0e7490 55%, #a7f3d0 100%)",
  portfolio_theory:
    "linear-gradient(160deg, #0e2e3a 0%, #14b8a6 55%, #d9f99d 100%)",
  fixed_income:
    "linear-gradient(160deg, #102a4a 0%, #1d4ed8 55%, #6ee7b7 100%)",
  algorithms:
    "linear-gradient(160deg, #0a1f3a 0%, #0f766e 55%, #22e07a 100%)",
};

const fallbackGradient =
  "linear-gradient(160deg, #0c1d35 0%, #0d9488 55%, #34d399 100%)";

export function gradientFor(category: string): string {
  return categoryGradients[category] ?? fallbackGradient;
}

export function assetFor(category: string): CategoryAsset {
  return (
    categoryAssets[category] ?? { kind: "formula", latex: "\\sum_{i=1}^{n} x_i" }
  );
}
