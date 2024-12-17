### `prefer-use-mount`

In React, it is common to use [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) without dependencies when the intent is to run the effect only once (on mount and unmount). However, just doing that may lead to undesired side-effects, such as the effect being called twice in [Strict Mode](https://reactjs.org/docs/strict-mode.html). For this reason, it is better to use an abstraction such as [`useMount`](https://stackoverflow.com/a/72319081/368691) that handles this use case.

<!-- assertions preferUseMount -->
