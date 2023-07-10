import { readFileSync } from 'node:fs';

type PackageJson = {
  name?: string;
};

const createPackageJsonReader = () => {
  const cache: Record<string, PackageJson> = {};

  return (packageJsonPath: string) => {
    const key = packageJsonPath;

    if (cache[key] !== undefined) {
      return cache[key];
    }

    const packageJson = JSON.parse(
      readFileSync(packageJsonPath, 'utf8'),
    ) as PackageJson;

    cache[key] = packageJson;

    return packageJson;
  };
};

export const readPackageJson = createPackageJsonReader();
