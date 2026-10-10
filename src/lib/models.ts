/** Model numbers follow a lens's project order: the first unit is `fo-01`. */
export const modelNumber = (index: number) => `fo-${String(index + 1).padStart(2, '0')}`;
