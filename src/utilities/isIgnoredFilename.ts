const ignoredFilenames = ['<text>', '<input>'];

export const isIgnoredFilename = (filename: string): boolean => {
  return ignoredFilenames.includes(filename);
};
