import recommended from './configs/recommended.json';
import idMatch from './rules/idMatch';
import sortKeys from './rules/sortKeys';

export default {
  configs: {
    recommended,
  },
  rules: {
    'id-match': idMatch,
    'sort-keys': sortKeys,
  },
  rulesConfig: {
    'id-match': 0,
    'sort-keys': 0,
  },
};
