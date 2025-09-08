import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const DialogContext = createContext();

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within DialogProvider');
    }
    return context;
};

export const DialogProvider = ({ children }) => {

    const [isInPreviewMode, setIsInPreviewMode] = useState(false);

    const useDialogState = (initialInputs = {}) => {
        const [show, setShow] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [warning, setWarning] = useState('');
        const [error, setError] = useState('');
        const [snackbarMessage, setSnackbarMessage] = useState('');
        const [inputs, setInputs] = useState(initialInputs);

        const handleInputChange = (field, value) => {
            setInputs((prev) => ({
                ...prev,
                [field]: value
            }))
        }

        // const handleOpen = () => setShow(true);
        // const handleClose = () => setShow(false);
        const handleOpen = () => {
            setError('');
            setWarning('');
            setShow(true);
        };
        const handleClose = () => {
            setError('');
            setWarning('');
            setShow(false);
        };



        return {
            show,
            setShow,
            isLoading,
            setIsLoading,
            warning,
            setWarning,
            error,
            setError,
            snackbarMessage,
            setSnackbarMessage,
            inputs,
            setInputs,
            handleInputChange,
            handleOpen,
            handleClose
        }
    }

    const previewDialog = {
        ...useDialogState(),
        isInPreviewMode,
        setIsInPreviewMode,
    };

    const newTemplateDialog = { ...useDialogState() };
    const deleteDialog = { ...useDialogState() };
    const newDraftDialog = { ...useDialogState() };
    const activationDialog = { ...useDialogState() };
    const archiveDialog = { ...useDialogState() };

    return (
        <DialogContext.Provider value={{

            previewDialog,
            newTemplateDialog,
            deleteDialog,
            activationDialog,
            newDraftDialog,
            archiveDialog

        }}>
            {children}
        </DialogContext.Provider>
    );
};


DialogProvider.propTypes = {
    children: PropTypes.node.isRequired
};