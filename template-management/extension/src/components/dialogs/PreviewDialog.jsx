import React, { useEffect } from "react";

import { Dialog, DialogTitle, DialogContent, Typography, TextField, Alert, DialogActions } from "@ellucian/react-design-system/core";
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';

import CustomButton from "../Button";
import { postPayloadToEthosPipeline } from "../../services";

import { useDialog } from "../../contexts/DialogContext";
import { useEditor } from "../../contexts/EditorContext";
import { useTemplate } from "../../contexts/TemplateContext";

import { pipelines } from "../../pipeline-config";

const PreviewDialog = () => {


    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();

    const { data, selection: { selectedTemplate, setPreviewTemplate } } = useTemplate();
    const { previewDialog: dialog } = useDialog();
    const { editorValue } = useEditor();

    useEffect(() => {
        if (!dialog.show) {
            dialog.setError('');
        }
    }, [dialog]);

    const handleDialogAccept = async () => {
        const bannerId = dialog?.inputs?.bannerId?.trim()
        const bannerIdPattern = /^B\d{8}$/;

        if (!bannerIdPattern.test(bannerId)) {
            dialog.setError('Invalid Banner ID. It should start with "B" followed by exactly 8 digits, e.g. B01234567.');
            return;
        }
        if (!editorValue) {
            dialog.setError('Invalid editor value, please contact Registry developer!');
            return;
        }

        try {
            dialog.setIsLoading(true)
            dialog.setWarning('')
            const res = await postPayloadToEthosPipeline({ selectedTemplate, editorValue, bannerId },
                authenticatedEthosFetch,
                `${pipelines.createPreview}?cardId=${cardId}&cardPrefix=${cardPrefix}`
            )
            setPreviewTemplate(res)
            await data.refresh()
            dialog.setIsLoading(false)
            dialog.setShow(false)
            dialog.setIsInPreviewMode(true)
        } catch (error) {
            dialog.setError(`Failed to create preview: ${error.message}`);
            dialog.setIsLoading(false)
        }
    };


    return (
        <Dialog open={dialog.show} onClose={dialog.handleClose} maxWidth="sm">
            <DialogTitle sx={{ mb: 2 }}>Banner ID</DialogTitle>
            <Alert
                alertType="error"
                open={dialog.error}
                onClose={dialog.handleCloseError}
            >
                {dialog.error}
            </Alert>
            <DialogContent sx={{ overflow: "visible", pt: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
                    Enter a valid Banner ID to preview the template:
                </Typography>
                <TextField label="Banner ID"
                    fullWidth
                    value={dialog.inputs.bannerId}
                    maxCharacters={{ max: 9, allowOverflow: false }}
                    onChange={(e) => {
                        dialog.handleInputChange('bannerId', e.target.value.toUpperCase());
                        if (dialog.error) dialog.setError('');
                    }}
                />
            </DialogContent>
            <DialogActions>
                <CustomButton label="Return" color="secondary" onClick={() => dialog.handleClose()} startIcon="arrow-left" />
                <CustomButton
                    label="Accept"
                    isLoading={dialog.isLoading}
                    onClick={() => handleDialogAccept()}
                    startIcon="check"
                />
            </DialogActions>
        </Dialog>
    )
}


export default PreviewDialog;