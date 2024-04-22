import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const propTypes = {
    onChange: PropTypes.func,
};

const defaultProps = {
    onChange: null,
};

function OnChangePlugin({ onChange }) {
    const [editor] = useLexicalComposerContext();
    useEffect(
        () =>
            editor.registerUpdateListener(({ editorState }) => {
                onChange(editorState);
            }),
        [editor, onChange],
    );
    return null;
}

OnChangePlugin.propTypes = propTypes;
OnChangePlugin.defaultProps = defaultProps;

export default OnChangePlugin;
