import React, { useEffect } from "react";

import { Dialog, DialogTitle, DialogContent, Typography, TextField, Alert, DialogActions } from "@mui/material";
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';

import CustomButton from "../Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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

    console.log('selectedTemplate', selectedTemplate)


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
        <Dialog open={dialog.show} maxWidth="lg">
            <DialogTitle sx={{ mb: 2 }}>Banner ID</DialogTitle>
            <DialogContent sx={{ overflow: "visible", pt: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
                    Please enter a valid Banner ID to preview the template.
                </Typography>
                {dialog.error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {dialog.error}
                    </Alert>
                )}
                <TextField fullWidth variant="outlined"
                    label="Enter Banner ID"
                    value={dialog.inputs.bannerId}
                    onChange={(e) => {
                        dialog.handleInputChange('bannerId', e.target.value.toUpperCase());
                        if (dialog.error) dialog.setError('');
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <CustomButton label="Return" color="error" variant="contained"
                    onClick={() => dialog.handleClose()}
                    startIcon={<ArrowBackIcon />}
                />
                <CustomButton label="Accept & Preview" color="info" variant="contained"
                    isLoading={dialog.isLoading}
                    onClick={() => handleDialogAccept()}
                    endIcon={<VisibilityOutlinedIcon />}
                />
            </DialogActions>
        </Dialog>
    )
}


export default PreviewDialog;