import { mockGpuNodes } from "@/lib/mockMonitoringData";

export function getNodeNumber(nodeId: string) {
  const match = nodeId.match(/gpu(\d+)$/i);
  return match ? Number(match[1]) : Number.NaN;
}

export function compareNodeIds(a: string, b: string) {
  return getNodeNumber(a) - getNodeNumber(b);
}

export function getNodeById(nodeId: string) {
  return mockGpuNodes.find((node) => node.id === nodeId) ?? null;
}

export function toNodeChipLabel(nodeId: string) {
  const num = getNodeNumber(nodeId);
  return Number.isNaN(num) ? nodeId : `gpu${String(num).padStart(3, "0")}`;
}

export function groupNodeIdsToRanges(nodeIds: string[]) {
  const unique = Array.from(new Set(nodeIds)).sort(compareNodeIds);

  if (unique.length === 0) {
    return [];
  }

  const ranges: { start: string; end: string | null }[] = [];
  let rangeStart = unique[0];
  let prev = unique[0];

  for (let index = 1; index < unique.length; index += 1) {
    const current = unique[index];
    if (getNodeNumber(current) === getNodeNumber(prev) + 1) {
      prev = current;
      continue;
    }

    ranges.push({
      start: rangeStart,
      end: rangeStart === prev ? null : prev,
    });

    rangeStart = current;
    prev = current;
  }

  ranges.push({
    start: rangeStart,
    end: rangeStart === prev ? null : prev,
  });

  return ranges;
}

export function formatNodeRanges(nodeIds: string[]) {
  const ranges = groupNodeIdsToRanges(nodeIds);

  if (ranges.length === 0) {
    return "미지정";
  }

  return ranges
    .map((range) => {
      const startLabel = toNodeChipLabel(range.start);
      const endLabel = range.end ? toNodeChipLabel(range.end) : null;
      return endLabel ? `${startLabel}~${endLabel}` : startLabel;
    })
    .join(", ");
}

