import { HtmlDataProcessor } from 'ckeditor5/src/engine';

// import markdown2html from './markdown2html/markdown2html';
// import html2markdown, { turndownService } from './html2markdown/html2markdown';

/**
 * This data processor implementation uses GitHub Flavored Markdown as input/output data.
 *
 * See the {@glink features/markdown Markdown output} guide to learn more on how to enable it.
 */
export default class NicheDataProcessor {
    /**
     * HTML data processor used to process HTML produced by the Markdown-to-HTML converter and the other way.
     */
    htmlDataProcessor;

    /**
     * Creates a new instance of the Markdown data processor class.
     */
    constructor(document = null) {
        this.htmlDataProcessor = new HtmlDataProcessor(document);
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
        console.log(data);
        return this.htmlDataProcessor.toView(data);
    }

    /**
     * Converts the provided {@link module:engine/view/documentfragment~DocumentFragment} to data format &mdash; in this
     * case to a Markdown string.
     *
     * @returns Markdown string.
     */
    toData(viewFragment = null) {
        // Convert html to data format
        // const html = this._htmlDP.toData(viewFragment);
        // return html2markdown(html);
        // console.log('toData', viewFragment);

        const children = viewFragment.getChildren();

        console.log(viewFragment);

        const blocks = [...new Array(viewFragment.childCount).keys()].map((index) => {
            const child = viewFragment.getChild(index);
            const type = child.getAttribute('data-block-type') || null;

            if (type !== null) {
                return {
                    type,
                    ...this.getFieldsFromChild(child),
                };
            }

            const headingMatches = (child.name || '').match(/^h([0-9])$/);
            if (headingMatches !== null) {
                return {
                    type: 'heading',
                    size: headingMatches[1],
                    body: this.getInnerHTML(child),
                };
            }

            if (child.name === 'p') {
                return {
                    type: 'text',
                    body: this.htmlDataProcessor.toData(child),
                };
            }

            return null;
        });

        return {
            components: blocks,
        };

        // return this.htmlDataProcessor.toData(viewFragment);
    }

    getFieldsFromChild(child) {
        return [...new Array(child.childCount).keys()].reduce((acc, index) => {
            const subChild = child.getChild(index);
            const isEditable =
                (subChild.getAttribute('data-niche-inline-editable') ||
                    subChild.getAttribute('data-niche-block-editable')) === 'true';

            if (isEditable) {
                const key = subChild.getAttribute('data-niche-key');

                return {
                    ...acc,
                    [key]: this.getInnerHTML(subChild),
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

    /**
     * Registers a {@link module:engine/view/matcher~MatcherPattern} for view elements whose content should be treated as raw data
     * and not processed during the conversion from Markdown to view elements.
     *
     * The raw data can be later accessed by a
     * {@link module:engine/view/element~Element#getCustomProperty custom property of a view element} called `"$rawContent"`.
     *
     * @param pattern The pattern matching all view elements whose content should
     * be treated as raw data.
     */
    registerRawContentMatcher(pattern) {
        this.htmlDataProcessor.registerRawContentMatcher(pattern);
    }

    /**
     * This method does not have any effect on the data processor result. It exists for compatibility with the
     * {@link module:engine/dataprocessor/dataprocessor~DataProcessor `DataProcessor` interface}.
     */
    useFillerType(type) {
        this.htmlDataProcessor.domConverter.blockFillerMode =
            type === 'marked' ? 'markedNbsp' : 'nbsp';
    }
}
