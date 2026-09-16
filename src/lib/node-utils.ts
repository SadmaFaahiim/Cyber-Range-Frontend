const idCounters: Record<string, number> = {};

export function formatNodeId(kind: 'pc' | 'router' | 'edge'): string {
  const next = (idCounters[kind] ?? 0) + 1;
  idCounters[kind] = next;
  return `${kind}-${String(next).padStart(2, '0')}`;
}
