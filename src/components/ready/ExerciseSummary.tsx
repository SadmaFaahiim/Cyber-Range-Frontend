import { Background, BackgroundVariant, type Edge, type Node, ReactFlow, ReactFlowProvider } from '@xyflow/react';
import { ArrowRight, CheckCircle2, Clock, Cpu, Radio, TriangleAlert, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { edgeTypes, nodeTypes } from '@/components/topology/flowTypes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_STRINGS } from '@/lib/strings';
import useCyberRangeStore from '@/store/cyberRangeStore';

function isSignalOk(source: string, target: string, nodes: Node[]): boolean {
  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);
  if (!sourceNode || !targetNode) {
    return false;
  }
  return sourceNode.type !== targetNode.type;
}

export default function ExerciseSummary() {
  const navigate = useNavigate();
  const canvasNodes = useCyberRangeStore((state) => state.canvasNodes);
  const canvasEdges = useCyberRangeStore((state) => state.canvasEdges);
  const reset = useCyberRangeStore((state) => state.reset);
  const summary = APP_STRINGS.READINESS.SUMMARY;

  const launchedAt = useMemo(
    () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    [],
  );

  const linkedNodes = canvasNodes.map((node): Node => ({ ...node, data: { ...node.data, label: node.data.label } }));
  const linkedEdges = canvasEdges.map((edge): Edge => ({ ...edge, type: 'cable' }));

  const signalOkCount = canvasEdges.filter((edge) => isSignalOk(edge.source, edge.target, canvasNodes)).length;
  const signalWarnCount = canvasEdges.length - signalOkCount;

  const handleBack = () => navigate('/');
  const handleNewExercise = () => {
    // Navigate first, then defer reset so the AppShell step-guard
    // doesn't see currentStep=1 while we're still on /ready.
    navigate('/');
    setTimeout(() => reset(), 0);
  };

  const stats = [
    { key: 'nodes', label: summary.stats.nodes, value: canvasNodes.length, Icon: Cpu },
    { key: 'cables', label: summary.stats.cables, value: canvasEdges.length, Icon: Radio },
    { key: 'valid', label: summary.stats.valid, value: signalOkCount, Icon: CheckCircle2 },
    { key: 'warn', label: summary.stats.warn, value: signalWarnCount, Icon: TriangleAlert },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full flex-col gap-5 overflow-y-auto p-6"
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
        >
          <CheckCircle2 className="h-10 w-10 text-ready" aria-hidden="true" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {APP_STRINGS.READINESS.LAUNCHED_TITLE}
          </h1>
          <p className="text-sm text-muted-foreground">{summary.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ key, label, value, Icon }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.06, duration: 0.3 }}
            className="flex flex-col items-center gap-2 rounded-lg border border-panel-border bg-panel-bg p-4 shadow-[0_4px_20px_var(--glass-shadow)] backdrop-blur-[10px]"
          >
            <Icon
              className={key === 'valid' ? 'text-ready' : key === 'warn' ? 'text-destructive' : 'text-accent'}
              size={18}
              aria-hidden="true"
            />
            <span className="text-3xl font-semibold text-foreground">{value}</span>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs font-medium text-muted-foreground">
          {summary.stats.launchedAt}: <span className="text-foreground">{launchedAt}</span>
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="grid gap-4 lg:grid-cols-[1fr_380px]"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {summary.previewTitle}
          </h2>
          <div className="h-64 w-full overflow-hidden rounded-lg border border-panel-border bg-canvas-bg">
            <ReactFlowProvider>
              <ReactFlow<Node, Edge>
                nodes={linkedNodes}
                edges={linkedEdges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={false}
                zoomOnScroll={false}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                proOptions={{ hideAttribution: true }}
              >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(148, 163, 184, 0.15)" />
              </ReactFlow>
            </ReactFlowProvider>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{summary.logTitle}</h2>
          {linkedEdges.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {linkedEdges.map((edge, index) => {
                const sourceNode = canvasNodes.find((n) => n.id === edge.source);
                const targetNode = canvasNodes.find((n) => n.id === edge.target);
                const signalOk = isSignalOk(edge.source, edge.target, canvasNodes);
                return (
                  <motion.li
                    key={edge.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.25 }}
                    className="flex items-center justify-between gap-2 rounded-md border border-panel-border bg-panel-bg px-3 py-2"
                  >
                    <span className="flex min-w-0 items-center gap-1.5 font-mono text-xs text-foreground">
                      <span className="truncate">{sourceNode?.data.label ?? edge.source}</span>
                      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <span className="truncate">{targetNode?.data.label ?? edge.target}</span>
                    </span>
                    {signalOk ? (
                      <Badge variant="success">{summary.signalOk}</Badge>
                    ) : (
                      <Badge variant="destructive">{summary.signalWarn}</Badge>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No connections recorded.</p>
          )}
          {signalWarnCount > 0 ? (
            <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
              <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {signalWarnCount} {summary.stats.warn.toLowerCase()} — review these cables.
            </p>
          ) : null}
        </div>
      </motion.div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-panel-border pt-4">
        <Button variant="outline" onClick={handleBack}>
          {summary.ctaBack}
        </Button>
        <Button onClick={handleNewExercise}>{summary.ctaNew}</Button>
      </div>
    </motion.div>
  );
}
