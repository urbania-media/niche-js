import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const propTypes = {
    html: PropTypes.string.isRequired,
};

const defaultProps = {};

function HtmlPlugin({ html }) {
    const [editor] = useLexicalComposerContext();
    useEffect(
        () =>
            editor.update(() => {
                const parser = new DOMParser();

                const root = $getRoot();

                const dom = parser.parseFromString(html, 'text/html');
                const newNodes = $generateNodesFromDOM(editor, dom);
                console.log(html, newNodes);
                root.append(...newNodes);
            }),
        [editor, html],
    );
    return null;
}

HtmlPlugin.propTypes = propTypes;
HtmlPlugin.defaultProps = defaultProps;

export default HtmlPlugin;
