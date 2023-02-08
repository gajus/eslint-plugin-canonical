### `virtual-module`

Enforces "virtual modules" architecture.

Virtual modules is a convention-driven code architecture enforced using ESLint rules. In the most simple of terms, a virtual module is any directory that has a barrel file (`index.ts`). `index.ts` is the only way that a virtual module can be imported; any files contained inside of the same directory cannot be imported from outside of the virtual module, unless they are explicitly re-exported through `index.ts`.

Using the virtual module pattern:

* You separate the module public interface from their implementation details.
* You ensure that there is only 1 way to import every module across the project.
* You ensure that there are no cycling dependencies within the project.

#### Virtual Modules Architecture

The basic idea behind a virtual module is that every directory in your project that has `index.ts` becomes a "virtual module". That virtual module (and sub-folders) can only be imported through `index.ts`, i.e. `index.ts` needs to explicitly export everything that is part of the public interface. This pattern ensures that there is only one way to import all modules across the entire project, and that virtual module implementation details are not public unless they are explicitly re-exported through `index.ts`.

It is easiest to illustrate this using an example:

```
components/
├── Foo/
│   ├── Baz/
│   │   └── index.ts
│   └── Qux/
│       └── index.ts/
│           └── Quux/
│               └── index.ts
└── Bar/
    └── index.ts
```

In this example, `Bar`, `Baz`, `Qux` and `Quux` are all virtual modules.

* `Bar` can import from `Baz` and vice-versa.
* `Bar` can import from `Qux` and vice-versa.
* `Baz` can import from `Qux` and vice-versa.
* `Bar` cannot import directly from `Quux` because it is a sub-module of `Qux`. Only `Qux` can import from `Quux`.
* `Foo` does not have `index.ts`, therefore it is not a virtual module.

```
components/
├── Foo/
│   ├── index.ts
│   └── utilities.ts
└── Bar/
    └── index.ts
```

In this example, `Foo` and `Bar` are virtual modules.

* `Foo` can import from `Bar` and vice-versa.

However, unless `/components/Foo/index.ts` explicitly exports from `./utilities.ts`, then `Bar` cannot access `Foo` utilities, i.e. `./utilities.ts` is an implementation detail of `Foo` not meant for consumption by the rest of the application.

Other notes:

* Within a virtual module, only absolute imports can be used to import outside modules.
* Within a virtual module, only relative imports can be used to import module files (allows to relocate virtual module without impacting internal imports).
* A virtual module cannot import `index.ts` of itself (prevents circular references).
* A virtual module cannot access parent module (prevents circular references).

<!-- assertions virtualModule -->