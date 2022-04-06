import path from 'node:path';

export const parseFilename = (filename) => {
  const ext = path.extname(filename);

  return {
    base: path.basename(filename),
    dir: path.dirname(filename),
    ext,
    name: path.basename(filename, ext),
  };
};
