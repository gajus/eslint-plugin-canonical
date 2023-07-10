import { existsSync } from 'node:fs';
import path from 'node:path';

export const findClosestDirectoryWithNeedle = (
  startPath: string,
  needleFileName: string,
  rootPath: string,
  allowList: string[] | null = null,
): string | null => {
  let currentDirectory = path.resolve(startPath, './');

  while (currentDirectory.startsWith(rootPath)) {
    if (
      existsSync(path.resolve(currentDirectory, needleFileName)) &&
      (allowList === null || allowList.includes(currentDirectory))
    ) {
      return currentDirectory;
    }

    currentDirectory = path.resolve(currentDirectory, '..');
  }

  return null;
};
