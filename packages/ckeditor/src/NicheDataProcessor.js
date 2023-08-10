import { HtmlDataProcessor } from 'ckeditor5/src/engine';
import { v4 as uuidV4 } from 'uuid';

export default class NicheDataProcessor {
    htmlDataProcessor = null;

    constructor(document) {
        this.htmlDataProcessor = new HtmlDataProcessor(document || null);
    }

    toView(data = null) {
        // console.log('to view', data);
        return this.htmlDataProcessor.toView(data);
    }

    toData(viewFragment = null) {
        // console.log('to data', viewFragment.childCount, viewFragment);

        const components = [...new Array(viewFragment.childCount).keys()]
            .map((index) => {
                const child = viewFragment.getChild(index);
                const id = child.getAttribute('data-niche-id') || null;
                const uuid = child.getAttribute('data-niche-uuid') || uuidV4();
                const type = child.getAttribute('data-niche-type') || null;
                const role = child.getAttribute('data-niche-role') || null;
                const platform = child.getAttribute('data-niche-platform') || null;

                const body = this.getInnerHTML(child) || '';
                const headingNameMatch = child.name.match(/^h([1-6])/);
                const hasHeadingMatch = headingNameMatch !== null && headingNameMatch.length > 1;

                // General case for new paragraphs/headings
                if (type === 'heading' || hasHeadingMatch) {
                    const size =
                        headingNameMatch !== null && headingNameMatch.length > 1
                            ? parseInt(headingNameMatch[1], 10)
                            : null;
                    return {
                        id,
                        uuid,
                        type: 'heading',
                        role: 'block',
                        platform,
                        size,
                        body,
                    };
                }

                // Paragraphs
                if (type === 'text' || child.name === 'p') {
                    return {
                        id,
                        uuid,
                        type: 'text',
                        role: 'block',
                        platform,
                        body: `<p>${body}</p>`,
                    };
                }

                // Default component case
                if (type !== null && role !== null) {
                    return {
                        id,
                        uuid,
                        type,
                        role,
                        platform,
                        ...this.getFieldsFromChild(child),
                    };
                }

                // A new top-level image
                const imageClass = child.getAttribute('class') || null === 'image';
                if (imageClass && child.name === 'figure') {
                    return {
                        id,
                        uuid,
                        type: 'image',
                        role: 'block',
                        platform,
                        ...this.getFieldsFromChild(child),
                    };
                }

                console.log('BEWARE COMPONENT NOT FOUND', child);

                return null;
            })
            .filter((block) => block !== null);

        // console.log('all parsed components', components);

        return {
            components,
        };
    }

    getFieldsFromChild(child) {
        if (!child.childCount) {
            return null;
        }

        return [...new Array(child.childCount).keys()].reduce((acc, index) => {
            const subChild = child.getChild(index) || {};
            if (!subChild.getAttribute) {
                return acc;
            }

            if (subChild.name === 'img') {
                const key = subChild.getAttribute('key');
                return {
                    ...acc,
                    [key || 'media']: {
                        url: subChild.getAttribute('src'),
                        alt: subChild.getAttribute('alt'),
                        srcSet: subChild.getAttribute('srcset'),
                        class: subChild.parent ? subChild.parent.getAttribute('class') : null,
                    },
                };
            }

            // TODO: Figure out a better rule for sub children?
            if (subChild.name === 'figure') {
                const attributes = this.getFieldsFromChild(subChild);
                return {
                    ...acc,
                    ...attributes,
                };
            }

            const editableKey =
                subChild.getAttribute('data-niche-editable-inline') ||
                subChild.getAttribute('data-niche-editable') ||
                null;

            if (editableKey !== null) {
                // console.log('editableKey', editableKey, this.getInnerHTML(subChild));
                return {
                    ...acc,
                    [editableKey]: this.getInnerHTML(subChild),
                };
            }

            return { ...acc, extra: true };
        }, {});
    }

    getInnerHTML(fragment) {
        const domFragment = this.htmlDataProcessor.domConverter.viewToDom(fragment);
        const doc = document.implementation.createHTMLDocument('');
        const container = doc.createElement('div');
        container.appendChild(domFragment);
        return container.children[0].innerHTML;
    }

    getHTML(fragment) {
        const domFragment = this.htmlDataProcessor.domConverter.viewToDom(fragment);
        const doc = document.implementation.createHTMLDocument('');
        const container = doc.createElement('div');
        container.appendChild(domFragment);
        return container.innerHTML;
    }

    registerRawContentMatcher(pattern) {
        this.htmlDataProcessor.registerRawContentMatcher(pattern);
    }

    useFillerType(type) {
        this.htmlDataProcessor.domConverter.blockFillerMode =
            type === 'marked' ? 'markedNbsp' : 'nbsp';
    }
}
