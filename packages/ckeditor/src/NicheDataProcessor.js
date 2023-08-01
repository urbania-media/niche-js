import { HtmlDataProcessor } from 'ckeditor5/src/engine';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import { v4 as uuidV4 } from 'uuid';

export default class NicheDataProcessor {
    htmlDataProcessor = null;

    constructor(document) {
        this.htmlDataProcessor = new HtmlDataProcessor(document || null);
    }

    /**
     * Keeps the specified element in the output as HTML. This is useful if the editor contains
     * features producing HTML that is not a part of the Markdown standard.
     *
     * By default, all HTML tags are removed.
     *
     * @param element The element name to be kept.
     */
    // keepHtml(element) {
    // turndownService.keep( [ element ] );
    // return element;
    // }

    toView(data = null) {
        const finalData = data;
        // console.log('to view', data);
        return this.htmlDataProcessor.toView(finalData);
    }

    toData(viewFragment = null) {
        console.log('to data', viewFragment.childCount, viewFragment);

        const blocks = [...new Array(viewFragment.childCount).keys()]
            .map((index) => {
                const child = viewFragment.getChild(index);
                const id = child.getAttribute('data-niche-block-id') || null;
                const uuid = child.getAttribute('data-niche-block-uuid') || uuidV4();
                const type = child.getAttribute('data-niche-block-type') || null;

                const body = this.getInnerHTML(child) || '';
                const headingNameMatch = child.name.match(/^h([0-9])/);
                if (
                    type === 'heading' ||
                    (headingNameMatch !== null && headingNameMatch.length > 0)
                ) {
                    const size =
                        headingNameMatch !== null && headingNameMatch.length > 1
                            ? parseInt(headingNameMatch[1], 10)
                            : null;
                    return {
                        id,
                        uuid,
                        type: 'heading',
                        role: 'block',
                        size,
                        body, // `<h${size || 1}>${body}<h${size || 1}>`,
                    };
                }

                if (type === 'text' || child.name === 'p') {
                    return {
                        id,
                        uuid,
                        type: 'text',
                        role: 'block',
                        body: `<p>${body}</p>`,
                    };
                }

                if (type !== null) {
                    return {
                        id,
                        uuid,
                        type,
                        role: 'block',
                        ...this.getFieldsFromChild(child),
                    };
                }

                console.log('BLOCK NOT FOUND', child);

                return null;
            })
            .filter((block) => block !== null);

        console.log(blocks);

        return {
            components: blocks,
        };
    }

    getFieldsFromChild(child) {
        return [...new Array(child.childCount).keys()].reduce((acc, index) => {
            const subChild = child.getChild(index) || {};
            const { name = null } = subChild;

            if (subChild.name === 'img') {
                return {
                    ...acc,
                    src: subChild.getAttribute('src'),
                    alt: subChild.getAttribute('alt'),
                    srcSet: subChild.getAttribute('srcset'),
                };
            }

            if (name === 'figure') {
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
                return {
                    ...acc,
                    [editableKey]: this.getInnerHTML(subChild),
                };
            }

            return acc;
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
