import fs from 'fs';
import path from 'path';
import { pkgUpSync } from 'pkg-up';
import slugify from 'slugify';

const generateScopedName = (localName, filePath) => {
    if (!filePath.match(/\.module\.css$/)) {
        return localName;
    }
    const packageJsonPath = pkgUpSync({
        cwd: path.dirname(filePath),
    });

    const packagePath = path.dirname(packageJsonPath);
    const rawdata = fs.readFileSync(packageJsonPath);
    const { name: packageName = null } = JSON.parse(rawdata);

    const stylesPath = path.join(packagePath, 'src/styles');
    const hasStylesPath = fs.existsSync(stylesPath);
    const namespace = slugify(packageName.replace(/[@/]/gi, ' '));

    const relativePath = hasStylesPath ? path.relative(stylesPath, filePath) : null;
    const subDirectory =
        relativePath !== null
            ? path
                  .dirname(relativePath)
                  .replace(/\//gi, '-')
                  .replace(/[^a-z-]+/gi, '')
            : null;
    const basename = path.basename(filePath).replace(/(\.module|\.global)?\.s?css$/i, '');
    const finalNamespace =
        subDirectory !== null && subDirectory.length > 0
            ? `${namespace}-${subDirectory}`
            : namespace;
    const basenamePattern = new RegExp(`-${basename}$`, 'gi');
    const name =
        basename !== 'styles' && !basenamePattern.test(finalNamespace)
            ? `${finalNamespace}-${basename}`
            : finalNamespace;

    return '[name]-[local]'
        .replace(/\[\s*name\s*\]/gi, name)
        .replace(/\[\s*local\s*\]/gi, localName);
};

export default generateScopedName;
