import React from 'react'
import { RichTextEditor } from '@ellucian/react-design-system/core';
import { useEditor } from '../contexts/EditorContext';
import { useTemplate } from '../contexts/TemplateContext';
import { useVariable } from '../contexts/VariableContext';


const CustomEditor = () => {

    const { editorValue, handleEditorChange } = useEditor();
    const { selection: { workingTemplateVersion } } = useTemplate();
    const { data: { variables } } = useVariable();

    const customToolbar = [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': 1 }, { 'header': 2 }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        ['blockquote'],
        ['link', 'image', 'video'],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['substitutionVariables'],
    ];

    const substitutionVariableList = Array.isArray(variables)
        ? variables.map(({ xstmvrblVariableValue, xstmvrblVariableLabel }) => ({
            value: xstmvrblVariableValue,
            label: xstmvrblVariableLabel
        })) : [];

    return (
        <RichTextEditor
            value={editorValue}
            onChange={handleEditorChange}
            key={workingTemplateVersion?.xstmtvrsTemplateVersionId}
            toolbar={customToolbar}
            substitutionVariableList={substitutionVariableList}
        />
    )
}

export default CustomEditor