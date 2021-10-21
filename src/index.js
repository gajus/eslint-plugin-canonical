import recommended from './configs/recommended.json';
import idMatch from './rules/idMatch';

export default {
  configs: {
    recommended,
  },
  rules: {
    'id-match': idMatch,
  },
  rulesConfig: {
    'id-match': 0,
  },
};
