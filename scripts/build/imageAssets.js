import path from 'path';

import url from '@rollup/plugin-url';
import { createFilter } from '@rollup/pluginutils';

export default (options = {}) => {
    const filter = createFilter(options.include, options.exclude);
    const { load, ...plugin } = url({
        ...options,
        publicPath: '../assets/images/',
    });
    return {
        resolveId: async (module, importer) => {
            if (module.match(/^\./) === null) {
                return null;
            }
            const id = path.join(path.dirname(importer), module);
            if (!filter(id)) {
                return null;
            }
            const exportData = (await load(id)) || null;
            const matches = exportData.match(/^export default "([^\"]+)"$/);
            return matches !== null && matches[1].match(/^data:/) === null
                ? {
                      id: matches[1],
                      external: true,
                  }
                : null;
        },
        load,
        ...plugin,
    };
};
