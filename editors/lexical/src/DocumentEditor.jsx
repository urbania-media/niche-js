import { LinkNode } from '@lexical/link';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode } from '@lexical/rich-text';
import classNames from 'classnames';
import { $getRoot, $getSelection } from 'lexical';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';

import { PropTypes as NichePropTypes } from '@niche-js/core';

import { ComponentNode } from './ComponentNode';
import DocumentPlugin from './DocumentPlugin';
import OnChangePlugin from './OnChangePlugin';

const propTypes = {
    value: NichePropTypes.document.isRequired,
    theme: PropTypes.objectOf(PropTypes.string),
    onChange: PropTypes.func,
    onError: PropTypes.func,
    className: PropTypes.string,
};

const defaultProps = {
    theme: {},
    onChange: null,
    onError: (e) => console.error(e),
    className: null,
};

function DocumentEditor({ value, theme, onChange, onError, className }) {
    const initialConfig = {
        namespace: 'Niche',
        theme,
        onError,
        nodes: [LinkNode, ComponentNode, HeadingNode],
    };
    console.log(value);
    const onEditorChange = useCallback((newEditorState) => {
        console.log(newEditorState.selection);
        console.log(newEditorState.toJSON());
    }, []);
    return (
        <LexicalComposer initialConfig={initialConfig}>
            <RichTextPlugin
                contentEditable={<ContentEditable className={className} />}
                placeholder={<div>Enter some text...</div>}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <LinkPlugin />
            <AutoFocusPlugin />
            <OnChangePlugin onChange={onEditorChange} />
            <DocumentPlugin document={value} />
        </LexicalComposer>
    );
}

DocumentEditor.propTypes = propTypes;
DocumentEditor.defaultProps = defaultProps;

export default DocumentEditor;
