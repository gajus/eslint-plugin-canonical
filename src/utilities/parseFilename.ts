import path from 'node:path';

export type ParsedName = {
  base: string,
  dir: string,
  ext: string,
  name: string,
};

export const parseFilename = (filename: string): ParsedName => {
  const extension = path.extname(filename);

  return {
    base: path.basename(filename),
    dir: path.dirname(filename),
    ext: extension,
    name: path.basename(filename, extension),
  };
};
