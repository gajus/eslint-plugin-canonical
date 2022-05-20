export default {
  invalid: [
    {
      code: 'useEffect(() => {}, [])',
      errors: [
        {
          messageId: 'noEffectWithoutDependencies',
        },
      ],
    },
  ],
  valid: [
    {
      code: 'useEffect(() => {}, [foo])',
    },
    {
      code: 'useMount(() => {}, [])',
    },
  ],
};
