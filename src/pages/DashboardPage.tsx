import { motion } from 'motion/react';

import { APP_STRINGS } from '@/lib/strings';

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full items-center justify-center"
    >
      <h1 className="text-xl font-semibold text-foreground">{APP_STRINGS.PAGES.DASHBOARD.title}</h1>
    </motion.div>
  );
}
