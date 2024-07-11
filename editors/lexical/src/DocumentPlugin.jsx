import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isHeadingNode } from '@lexical/rich-text';
import { $getRoot, $getSelection, $insertNodes, $isElementNode, $isParagraphNode } from 'lexical';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { PropTypes as NichePropTypes } from '@niche-js/core';

import { $createComponentNode } from './ComponentNode';

const propTypes = {
    document: NichePropTypes.document.isRequired,
    onChange: PropTypes.func,
};

const defaultProps = {
    onChange: null,
};

function DocumentPlugin({ document, onChange }) {
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

                const root = $getRoot();
                // Select the root
                // $getRoot().select();
                // $getRoot().replace();

                // $getRoot().select().clear();

                // console.log($getSelection());

                // const children = root.getChildren();
                // children.forEach((child) => {
                //     removeNo
                // })

                root.clear();
                root.append(...newNodes);

                // console.log(newNodes);

                // Insert them at a selection.
                // $insertNodes(newNodes);
            }),
        [editor, document],
    );

    useEffect(
        () =>
            editor.registerUpdateListener(({ editorState }) => {
                if (onChange !== null) {
                    console.log(editorState.toJSON());
                    editorState.read(() => {
                        const root = $getRoot();
                        function generateDOMFromNode(node) {
                            const { element } = node.exportDOM(editor);
                            if ($isElementNode(node)) {
                                const children = node.getChildren();
                                children.forEach((child) => {
                                    const { element: childElement } = child.exportDOM(editor);
                                    element.appendChild(childElement);
                                });
                            }
                            return element;
                        }
                        function generateHTMLFromParagraph(node) {
                            const element = generateDOMFromNode(node);
                            return `<p>${element.innerHTML}</p>`;
                        }
                        function generateHTMLFromHeading(node) {
                            const element = generateDOMFromNode(node);
                            return element.innerHTML;
                        }
                        function generateComponentFromNode(node) {
                            if ($isParagraphNode(node)) {
                                return {
                                    role: 'block',
                                    type: 'text',
                                    body: generateHTMLFromParagraph(node),
                                };
                            }
                            if ($isHeadingNode(node)) {
                                return {
                                    role: 'block',
                                    type: 'heading',
                                    body: generateHTMLFromHeading(node),
                                };
                            }
                            return node.getComponent();
                        }
                        const newComponents = root
                            .getChildren()
                            .map((node) => generateComponentFromNode(node));
                        console.log(newComponents);

                        const newDocument = {
                            ...document,
                            components: newComponents,
                        };
                        // onChange(newDocument);
                    });

                    // const { root: { children }} = editorState.toJSON();
                    // console.log(editorValue);
                    // function convertNodeToComponent(node) {
                    //     if ()
                    // }
                    // const newComponents =
                    // const newDocument = {
                    //     ...document,
                    //     components: newComponents,
                    // };
                    // onChange(newDocument);
                }
            }),
        [editor, onChange, document],
    );

    return null;
}

DocumentPlugin.propTypes = propTypes;
DocumentPlugin.defaultProps = defaultProps;

export default DocumentPlugin;
