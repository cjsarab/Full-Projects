import React, { useEffect } from "react";

import { Dialog, DialogTitle, DialogContent, Typography, Alert, DialogActions } from "@mui/material";
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';
import CustomButton from "../Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { useDialog } from "../../contexts/DialogContext";
import { useTemplate } from "../../contexts/TemplateContext";
import { postPayloadToEthosPipeline } from "../../services";


const DeleteDialog = () => {

    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();
    const { deleteDialog: dialog } = useDialog();
    const { selection: { selectedTemplate, selectedTemplateVersions, handleSelectTemplate }, data } = useTemplate();


    useEffect(() => {
        if (dialog.show) {
            const publishedVersions = selectedTemplateVersions.filter(
                v => v.xstmtvrsStatusEnum === 'published'
            );

            if (publishedVersions.length === 0) {
                dialog.setWarning('Warning! There are no published versions. This template will be permanently deleted!');
            } else {
                dialog.setWarning('');
            }
        }
    }, [dialog, selectedTemplateVersions]);

    const handleDialogAccept = async () => {
        if (!selectedTemplate) {
            dialog.setError('No template selected for deletion.');
            return;
        }
        try {
            dialog.setIsLoading(true)
            await postPayloadToEthosPipeline({
                selectedTemplate,
                selectedTemplateVersion: selectedTemplateVersions.find(v => v.xstmtvrsStatusEnum === 'draft')
            },
                authenticatedEthosFetch,
                `UWS-DELETE-DRAFT?cardId=${cardId}&cardPrefix=${cardPrefix}`
            )
            await data.refresh()
            handleSelectTemplate(null)
            // setWorkingTemplateVersion(null)
            dialog.setIsLoading(false)
            dialog.setShow(false)
            dialog.setSnackbarMessage(`Successfully deleted draft '${templateTitle}'.`)
        } catch (error) {
            dialog.setError(`Failed to delete template: ${error.message}`);
            dialog.setIsLoading(false)
        }
    };

    const templateTitle = selectedTemplate?.xstmtmplTemplateTitle || "No Template Selected";

    return (
        <Dialog open={dialog.show} onClose={dialog.handleClose} maxWidth="lg">
            <DialogTitle sx={{ mb: 2 }}>Delete Template</DialogTitle>
            <DialogContent sx={{ overflow: "visible", pt: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
                    Warning! This action will permanently delete the draft {`"${templateTitle}"`}. Are you sure you want to proceed?
                </Typography>
                {dialog.error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {dialog.error}
                    </Alert>
                )}
                {dialog.warning && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        {dialog.warning}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <CustomButton label="Return" color="info" variant="contained"
                    onClick={() => dialog.handleClose()}
                    startIcon={<ArrowBackIcon />}
                />
                <CustomButton label="Delete" color="error" variant="contained"
                    isLoading={dialog.isLoading}
                    onClick={() => handleDialogAccept()}
                    endIcon={<DeleteOutlineIcon />}
                />
            </DialogActions>
        </Dialog>
    )
}

export default DeleteDialog;