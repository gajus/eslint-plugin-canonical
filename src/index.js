import recommended from './configs/recommended.json';
import idMatch from './rules/idMatch';
import noRestrictedStrings from './rules/noRestrictedStrings';
import sortKeys from './rules/sortKeys';

export default {
  configs: {
    recommended,
  },
  rules: {
    'id-match': idMatch,
    'no-restricted-strings': noRestrictedStrings,
    'sort-keys': sortKeys,
  },
  rulesConfig: {
    'id-match': 0,
    'no-restricted-strings': 0,
    'sort-keys': 0,
  },
};
