export const APPLICATION_KEYS = {
  root: () => ["APPLICATION"],
  list: (args?: Record<string, unknown>) => [
    APPLICATION_KEYS.root(),
    "LIST",
    { ...(args || {}) },
  ],
};
