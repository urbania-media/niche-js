import { HtmlDataProcessor } from 'ckeditor5/src/engine';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import { v4 as uuidV4 } from 'uuid';

export default class NicheDataProcessor {
    /**
     * HTML data processor used to process HTML produced by the Markdown-to-HTML converter and the other way.
     */
    htmlDataProcessor = null;

    dataToView = null;

    /**
     * Creates a new instance of the Markdown data processor class.
     */
    constructor(document = null, editor) {
        this.htmlDataProcessor = new HtmlDataProcessor(document);
        const { dataToView = null } = editor.config.get('niche') || {};
        this.dataToView = dataToView;
        console.log('dataToView', dataToView);
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

    /**
     * Converts the provided Markdown string to a view tree.
     *
     * @param data A Markdown string.
     * @returns The converted view element.
     */
    toView(data = null) {
        const finalData = data;
        console.log('to view', data);
        return this.htmlDataProcessor.toView(finalData);
    }

    /**
     * Converts the provided {@link module:engine/view/documentfragment~DocumentFragment} to data format &mdash; in this
     * case to a Markdown string.
     *
     * @returns Markdown string.
     */
    toData(viewFragment = null) {
        console.log('to data', viewFragment, 'count', viewFragment.childCount);

        const blocks = [...new Array(viewFragment.childCount).keys()]
            .map((index) => {
                const child = viewFragment.getChild(index);
                const id = child.getAttribute('data-niche-block-id') || null;
                const uuid = child.getAttribute('data-niche-block-uuid') || uuidV4();
                const type = child.getAttribute('data-niche-block-type') || null;

                // const customBody = this.htmlDataProcessor.toData(child);

                const body = this.getInnerHTML(child) || '';

                const headingMatches = isString(body) ? body.match(/^<h([0-9])/) : null;
                const finalHeadingMatches =
                    isObject(body) && isString(body.name)
                        ? body.name.match(/^<h([0-9])/)
                        : headingMatches;
                const matchesHeading =
                    finalHeadingMatches !== null && finalHeadingMatches.length > 1;

                // console.log('block', uuid, type, body, child, customBody);

                if (type === 'heading' || matchesHeading) {
                    return {
                        id,
                        uuid,
                        type: 'heading',
                        role: 'block',
                        size:
                            headingMatches !== null && headingMatches.length > 1
                                ? headingMatches[1]
                                : null,
                        body,
                    };
                }

                if (type === 'text' || child.name === 'p') {
                    // const body = this.getInnerHTML(child);
                    // const body = this.htmlDataProcessor.toData(child);
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

                // console.log('empty block not converted', uuid, type, body, child);

                return null;
            })
            .filter((block) => block !== null);

        console.log('blocks', blocks);

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
