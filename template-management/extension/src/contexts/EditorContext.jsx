import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTemplate } from './TemplateContext';
import PropTypes from 'prop-types';

const EditorContext = createContext();

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within EditorProvider');
    }
    return context;
};

export const EditorProvider = ({ children }) => {
    const { selection: { workingTemplateVersion } } = useTemplate();

    const [editorValue, setEditorValue] = useState('');

    useEffect(() => {
        console.log('EditorProvider workingTemplateVersion', workingTemplateVersion);
        if (!workingTemplateVersion) return;
        let combined = '';
        for (let i = 1; i <= 8; i++) {
            combined += workingTemplateVersion[`xstmtvrsContent${i}`] || '';
        }
        setEditorValue(combined);
    }, [workingTemplateVersion]);

    const handleEditorChange = useCallback((value) => {
        setEditorValue(value);
    }, []);

    return (
        <EditorContext.Provider value={{ editorValue, setEditorValue, handleEditorChange }}>
            {children}
        </EditorContext.Provider>
    );
};

EditorProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
