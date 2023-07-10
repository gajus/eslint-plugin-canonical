import { existsSync } from 'node:fs';
import path from 'node:path';

const createDirectoryFinder = () => {
  const cache: Record<string, string | null> = {};

  return (
    startPath: string,
    needleFileName: string,
    rootPath: string,
    allowList: string[] | null = null,
  ): string | null => {
    const key = JSON.stringify({
      allowList,
      needleFileName,
      rootPath,
      startPath,
    });

    if (cache[key] !== undefined) {
      return cache[key];
    }

    let currentDirectory = path.resolve(startPath, './');

    while (currentDirectory.startsWith(rootPath)) {
      if (
        existsSync(path.resolve(currentDirectory, needleFileName)) &&
        (allowList === null || allowList.includes(currentDirectory))
      ) {
        cache[key] = currentDirectory;

        return currentDirectory;
      }

      currentDirectory = path.resolve(currentDirectory, '..');
    }

    cache[key] = null;

    return null;
  };
};

export const findDirectory = createDirectoryFinder();
