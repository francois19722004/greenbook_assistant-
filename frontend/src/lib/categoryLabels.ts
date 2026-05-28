export const categoryLabels: Record<string, string> = {
  brain_teasers: "Brain Teasers",
  calculus: "Calculus",
  linear_algebra: "Linear Algebra",
  conditional_expectation: "Conditional Expectation",
  conditional_probability: "Conditional Probability",
  probability: "Probability",
  combinatorics: "Combinatorics",
  distributions: "Distributions",
  expected_value: "Expected Value",
  stochastic_calculus: "Stochastic Calculus",
  option_pricing: "Option Pricing",
  greeks: "Greeks",
  option_strategies: "Option Strategies",
  portfolio_theory: "Portfolio Theory",
  fixed_income: "Fixed Income",
  algorithms: "Algorithms",
};

export function categoryLabel(slug: string): string {
  return categoryLabels[slug] ?? slug.replace(/_/g, " ");
}

export const categoryOrder = [
  "brain_teasers",
  "combinatorics",
  "probability",
  "conditional_probability",
  "distributions",
  "expected_value",
  "conditional_expectation",
  "calculus",
  "linear_algebra",
  "stochastic_calculus",
  "option_pricing",
  "greeks",
  "option_strategies",
  "portfolio_theory",
  "fixed_income",
  "algorithms",
];

export function sortCategories<T extends { category: string }>(items: T[]): T[] {
  const rank = new Map(categoryOrder.map((c, i) => [c, i]));
  return [...items].sort(
    (a, b) =>
      (rank.get(a.category) ?? 999) - (rank.get(b.category) ?? 999)
  );
}
