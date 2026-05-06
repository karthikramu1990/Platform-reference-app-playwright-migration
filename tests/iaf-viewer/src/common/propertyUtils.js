export const mergeGisProperties = (base, overrides) => {
  return { ...base, ...overrides, initial: { ...base.initial, ...overrides?.initial } };
};