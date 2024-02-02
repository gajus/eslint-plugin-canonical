import { sep } from 'node:path';

export const findRootPath = (startPath: string): string =>
  process.platform === 'win32' ? `${startPath.split(sep)[0]}${sep}` : sep;
