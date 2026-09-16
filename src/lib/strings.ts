export const APP_STRINGS = {
  APP_NAME: 'Cyber Range',
  HEADER: {
    RESET_LABEL: 'Reset',
    RESET_CONFIRM: 'Reset the entire environment? All nodes and connections will be cleared.',
  },
  STEPS: [
    { id: 'build', label: 'Build', description: 'Design your network' },
    { id: 'review', label: 'Review', description: 'Validate your design' },
    { id: 'ready', label: 'Ready', description: 'Go live' },
  ] as const,
  VALIDATION: {
    EMPTY: 'No infrastructure has been added yet.',
    NO_ROUTER: 'Include at least one router in your network.',
    STANDALONE: 'Some nodes are not connected to the network.',
  },
  PAGES: {
    LOADING: 'Loading',
    DASHBOARD: {
      title: 'Mission Control',
      description: 'Design, review and validate your cyber-range infrastructure.',
      cta: 'Start Building',
    },
    BUILD: {
      title: 'Build Infrastructure',
      description: 'Drag PCs and routers onto the canvas to design your network.',
      ctaPrimary: 'Continue to Review',
    },
    REVIEW: {
      title: 'Review Infrastructure',
      description: 'Confirm your infrastructure is complete before going live.',
      ctaPrimary: 'Continue to Readiness',
      nodesLabel: 'Nodes',
      edgesLabel: 'Cables',
      status: {
        ready: 'Ready',
        incomplete: 'Incomplete',
      },
    },
    READY: {
      title: 'Exercise Readiness',
      description: 'Your cyber-range environment is ready to be reviewed and launched.',
      ctaPrimary: 'Back to Dashboard',
      status: {
        ready: 'Ready',
        warning: 'Needs Attention',
        none: 'Not Started',
      },
    },
  },
  BUILDER: {
    NO_NODES: 'Add at least 2 nodes and connect them with a cable to continue.',
    READY_TEXT: 'Your infrastructure is ready for review.',
  },
  PALETTE: {
    TITLE: 'Components',
    DRAG_HINT: 'Drag onto canvas',
  },
  PROPERTIES: {
    TITLE: 'Properties',
    EMPTY: 'Select a node to edit',
    NAME: 'Name',
    CONNECTIONS: 'Connections',
    NO_CONNECTIONS: 'No connections yet',
    DELETE: 'Delete Node',
  },
  CANVAS: {
    EMPTY_TITLE: 'Add your first component',
    EMPTY_DESC: 'Drag a PC or a Router from the left panel onto the canvas to begin.',
  },
  READINESS: {
    LAUNCHED_TITLE: 'Exercise Launched',
    LAUNCHED_DESC: 'Your cyber-range exercise is now running.',
    LAUNCH_LABEL: 'Launch Exercise',
    CHECKLIST: [
      { key: 'hasNodes', label: 'At least 2 nodes placed' },
      { key: 'hasConnections', label: 'Nodes connected with cables' },
      { key: 'noOverlap', label: 'No overlapping nodes' },
    ],
    SUMMARY: {
      subtitle: 'Final output of your cyber-range exercise',
      stats: {
        nodes: 'Total Nodes',
        cables: 'Cables',
        valid: 'Signal OK',
        warn: 'Warnings',
        launchedAt: 'Launched At',
      },
      previewTitle: 'Network Preview',
      logTitle: 'Connection Log',
      signalOk: 'Signal OK',
      signalWarn: 'Wrong Connection',
      ctaBack: 'Back to Dashboard',
      ctaNew: 'New Exercise',
    },
  },
} as const;
