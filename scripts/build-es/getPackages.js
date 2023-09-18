import getPackage from './getPackage';
import getPackagesPaths from './getPackagesPaths';

export default function getPackages() {
    return getPackagesPaths()
        .map((packagePath) => getPackage(packagePath))
        .filter((it) => it !== null);
}
