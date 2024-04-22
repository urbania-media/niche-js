import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection, $insertNodes } from 'lexical';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { PropTypes as NichePropTypes } from '@niche-js/core';

import { $createComponentNode } from './ComponentNode';

const propTypes = {
    document: NichePropTypes.document.isRequired,
};

const defaultProps = {};

function DocumentPlugin({ document }) {
    const [editor] = useLexicalComposerContext();
    useEffect(
        () =>
            editor.update(() => {
                const { components = [] } = document || {};
                const parser = new DOMParser();

                const newNodes = components.reduce((allNodes, component) => {
                    const { role, type } = component;
                    if (role === 'block' && type === 'text') {
                        const { body } = component;
                        const dom = parser.parseFromString(body, 'text/html');
                        const componentNodes = $generateNodesFromDOM(editor, dom);
                        return [...allNodes, ...componentNodes];
                    }
                    if (role === 'block' && type === 'heading') {
                        const { body, size } = component;
                        const dom = parser.parseFromString(
                            `<h${size || 6}>${body}</h${size || 6}>`,
                            'text/html',
                        );
                        const componentNodes = $generateNodesFromDOM(editor, dom);
                        return [...allNodes, ...componentNodes];
                    }

                    return [...allNodes, $createComponentNode(component)];
                }, []);

                // Select the root
                $getRoot().select();

                // Insert them at a selection.
                $insertNodes(newNodes);
            }),
        [editor, document],
    );
    return null;
}

DocumentPlugin.propTypes = propTypes;
DocumentPlugin.defaultProps = defaultProps;

export default DocumentPlugin;
