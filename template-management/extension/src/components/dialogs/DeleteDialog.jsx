import React, { useEffect } from "react";

import { Dialog, DialogTitle, DialogContent, Typography, Alert, DialogActions } from "@ellucian/react-design-system/core";
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';
import CustomButton from "../Button";

import { useDialog } from "../../contexts/DialogContext";
import { useTemplate } from "../../contexts/TemplateContext";
import { postPayloadToEthosPipeline } from "../../services";

import { pipelines } from "../../pipeline-config";


const DeleteDialog = () => {

    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();
    const { deleteDialog: dialog } = useDialog();
    const { selection: { selectedTemplate, selectedTemplateVersions, handleSelectTemplate, setWorkingTemplateVersion }, data } = useTemplate();


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
                `${pipelines.deleteDraft}?cardId=${cardId}&cardPrefix=${cardPrefix}`
            )
            await data.refresh()
            handleSelectTemplate(null)
            setWorkingTemplateVersion(null)
            dialog.setIsLoading(false)
            dialog.setShow(false)
            dialog.setSnackbarMessage(`Successfully deleted draft '${templateTitle}'.`)
            dialog.setSnackbarType('success')
        } catch (error) {
            dialog.setError(`Failed to delete template: ${error.message}`);
            dialog.setIsLoading(false)
        }
    };

    const templateTitle = selectedTemplate?.xstmtmplTemplateTitle || "No Template Selected";

    return (
        <Dialog open={dialog.show} onClose={dialog.handleClose} maxWidth="lg">
            <DialogTitle sx={{ mb: 2 }}>Delete Template Draft</DialogTitle>
            <DialogContent sx={{ overflow: "visible", pt: 2 }}>
                <Alert
                    alertType="error"
                    open={dialog.error}
                    onClose={dialog.handleCloseError}
                >
                    {dialog.error}
                </Alert>
                <Alert
                    alertType="warning"
                    open={dialog.warning}
                    onClose={dialog.handleCloseWarning}
                >
                    {dialog.warning}
                </Alert>
                <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
                    Warning! This action will permanently delete the draft {`"${templateTitle}"`}. Are you sure you want to proceed?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <CustomButton label="Return" color="secondary"
                    onClick={() => dialog.handleClose()}
                    startIcon="arrow-left"
                />
                <CustomButton label="Delete"
                    isLoading={dialog.isLoading}
                    onClick={() => handleDialogAccept()}
                    startIcon="trash"
                />
            </DialogActions>
        </Dialog>
    )
}

export default DeleteDialog;