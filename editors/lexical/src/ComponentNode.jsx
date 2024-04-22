/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import React from 'react';

import ComponentNodeComponent from './ComponentNodeComponent';

export class ComponentNode extends DecoratorBlockNode {
    static getType() {
        return 'component';
    }

    static clone(node) {
        return new ComponentNode(node.__component, node.__format, node.__key);
    }

    static importJSON(serializedNode) {
        const node = $createComponentNode(serializedNode.component);
        node.setFormat(serializedNode.format);
        return node;
    }

    constructor(component, format, key) {
        super(format, key);
        this.__component = component;
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
            type: 'component',
            version: 1,
            component: this.__component,
        };
    }

    updateDOM() {
        return false;
    }

    getId() {
        return this.__id;
    }

    isInline() {
        return false;
    }

    getTextContent() {
        return `https://www.figma.com/file/${this.__id}`;
    }

    decorate(editor, config) {
        return <ComponentNodeComponent component={this.__component} />;
    }
}

export function $createComponentNode(component) {
    return new ComponentNode(component);
}

export function $isComponentNode(node) {
    return node instanceof ComponentNode;
}
