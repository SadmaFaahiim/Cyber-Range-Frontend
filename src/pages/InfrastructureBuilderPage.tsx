import { motion } from 'motion/react';

import ComponentPalette from '@/components/infrastructure/ComponentPalette';
import InfrastructureCanvas from '@/components/infrastructure/InfrastructureCanvas';
import PropertiesPanel from '@/components/infrastructure/PropertiesPanel';

export default function InfrastructureBuilderPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full"
    >
      <ComponentPalette />
      <InfrastructureCanvas />
      <PropertiesPanel />
    </motion.div>
  );
}
