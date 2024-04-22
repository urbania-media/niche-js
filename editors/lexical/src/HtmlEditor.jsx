import { LinkNode } from '@lexical/link';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import HtmlPlugin from './HtmlPlugin';
import OnChangePlugin from './OnChangePlugin';
import { createEditor } from 'lexical';

const propTypes = {
    value: PropTypes.string.isRequired,
    theme: PropTypes.objectOf(PropTypes.string),
    nested: PropTypes.bool,
    inline: PropTypes.bool,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    className: PropTypes.string,
};

const defaultProps = {
    theme: {},
    nested: false,
    inline: false,
    onChange: null,
    onError: (e) => console.error(e),
    className: null,
};

function HtmlEditor({ value, theme, nested, inline, onChange, onError, className }) {
    const initialConfig = {
        namespace: 'Niche',
        theme,
        onError,
        nodes: [LinkNode],
    };
    const initialEditor = useMemo(() => nested ? createEditor() : null, [nested]);
    const onEditorChange = useCallback((newEditorState) => {
        console.log(newEditorState.selection);
        console.log(newEditorState.toJSON());
    }, []);
    const LexicalComponent = nested ? LexicalNestedComposer : LexicalComposer;
    const TextPlugin = inline ? PlainTextPlugin : RichTextPlugin;
    return (
        <LexicalComponent initialConfig={initialConfig} initialEditor={initialEditor}>
            <TextPlugin
                contentEditable={<ContentEditable className={className} />}
                // placeholder={<div>Enter some text...</div>}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <LinkPlugin />
            <AutoFocusPlugin />
            <OnChangePlugin onChange={onEditorChange} />
            <HtmlPlugin html={value} />
        </LexicalComponent>
    );
}

HtmlEditor.propTypes = propTypes;
HtmlEditor.defaultProps = defaultProps;

export default HtmlEditor;
