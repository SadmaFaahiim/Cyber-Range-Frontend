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
      title: 'Review Environment',
      description: 'Confirm your infrastructure is complete before going live.',
      ctaPrimary: 'Mark Ready',
    },
    READY: {
      title: 'Environment Ready',
      description: 'Your cyber-range environment is ready for the exercise.',
      ctaPrimary: 'Back to Dashboard',
      status: {
        ready: 'Ready',
        warning: 'Needs Attention',
        none: 'Not Started',
      },
    },
  },
} as const;
