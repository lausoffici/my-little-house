export const monthsName = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString('es-ES', { month: 'long' }).replace(/^./, (char) => char.toUpperCase())
);

export const currentYear = new Date().getFullYear();
