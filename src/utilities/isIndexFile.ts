import { type ParsedName } from './parseFilename';

export const isIndexFile = (parsed: ParsedName) => {
  return parsed.name === 'index';
};
