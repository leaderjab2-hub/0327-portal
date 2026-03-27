export function generateTimeSeries(base: number, points = 30, variance = 0.15) {
  return Array.from({ length: points }, (_, i) => ({
    timestamp: String(i + 1).padStart(2, "0"),
    value: Math.round(
      base * (1 + Math.sin(i * 0.5) * 0.1 + (Math.random() - 0.5) * variance),
    ),
  }));
}
