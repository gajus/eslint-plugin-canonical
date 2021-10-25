const ignoredFilenames = ['<text>', '<input>'];

export const isIgnoredFilename = (filename) => {
  return ignoredFilenames.includes(filename);
};
