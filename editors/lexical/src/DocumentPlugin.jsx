import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection } from 'lexical';
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

                const root = $getRoot();

                console.log('AAAA', DOMParser);

                console.log('AA');

                components.forEach((component) => {
                    const { role, type } = component;
                    if (role === 'block' && type === 'text') {
                        const { body } = component;
                        const dom = parser.parseFromString(body, 'text/html');
                        const newNodes = $generateNodesFromDOM(editor, dom);
                        root.append(...newNodes);
                        return;
                    }
                    if (role === 'block' && type === 'heading') {
                        const { body, size } = component;
                        const dom = parser.parseFromString(
                            `<h${size || 6}>${body}</h${size || 6}>`,
                            'text/html',
                        );
                        const newNodes = $generateNodesFromDOM(editor, dom);
                        console.log(newNodes);
                        root.append(...newNodes);
                        return;
                    }
                    root.append($createComponentNode(component));
                }, []);

                console.log(root);

                // const newState = {
                //     root: {
                //         type: 'root',
                //         children: ,
                //     },
                // };

                // console.log(newState);

                // const editorState = editor.parseEditorState(newState);
                // editor.setEditorState(editorState);
            }),
        [editor, document],
    );
    return null;
}

DocumentPlugin.propTypes = propTypes;
DocumentPlugin.defaultProps = defaultProps;

export default DocumentPlugin;
