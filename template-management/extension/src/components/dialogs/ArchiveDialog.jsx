import React from "react";

import { Dialog, DialogTitle, DialogContent, Typography, Alert, DialogActions } from "@mui/material";
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';
import CustomButton from "../Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { useDialog } from "../../contexts/DialogContext";
import { useTemplate } from "../../contexts/TemplateContext";
import { postPayloadToEthosPipeline } from "../../services";


const ArchiveDialog = () => {

    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();
    const { archiveDialog: dialog } = useDialog();
    const { selection: { selectedTemplate, selectedTemplateVersions, setWorkingTemplateVersion, workingTemplateVersion }, data } = useTemplate();

    const handleDialogAccept = async () => {
        if (!selectedTemplate) {
            dialog.setError('No template selected for archival.');
            return;
        }
        if (!workingTemplateVersion) {
            dialog.setError('No template version selected.');
            return;
        }
        if (workingTemplateVersion.xstmtvrsStatusEnum !== "published") {
            dialog.setError('Only a published version can be archived.');
            return;
        }
        if (workingTemplateVersion.xstmtvrsIsActive === "true") {
            dialog.setError('An active version cannot be archived. Inactivate template first.');
            return;
        }

        const publishedCount = selectedTemplateVersions.filter(v => v.xstmtvrsStatusEnum === "published").length;
        if (publishedCount <= 1) {
            dialog.setError('Cannot archive only published template!');
            return;
        }
        try {
            dialog.setIsLoading(true)
            await postPayloadToEthosPipeline({
                selectedTemplate,
                workingTemplateVersion
            },
                authenticatedEthosFetch,
                `UWS-ARCHIVE-TEMPLATE-VERSION?cardId=${cardId}&cardPrefix=${cardPrefix}`
            )
            await data.refresh()
            setWorkingTemplateVersion(null)
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
            <DialogTitle sx={{ mb: 2 }}>Archive Template</DialogTitle>
            <DialogContent sx={{ overflow: "visible", pt: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
                    Warning! Once archived, a published version can not be retrieved! Are you sure you want to proceed?
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
                <CustomButton label="Archive" color="error" variant="contained"
                    isLoading={dialog.isLoading}
                    onClick={() => handleDialogAccept()}
                    endIcon={<DeleteOutlineIcon />}
                />
            </DialogActions>
        </Dialog>
    )
}

export default ArchiveDialog;