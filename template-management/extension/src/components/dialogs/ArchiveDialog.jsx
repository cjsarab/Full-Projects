import React, { useEffect } from "react";

import { Dialog, DialogTitle, DialogContent, Alert, DialogActions } from "@ellucian/react-design-system/core";
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';
import CustomButton from "../Button";

import { useDialog } from "../../contexts/DialogContext";
import { useTemplate } from "../../contexts/TemplateContext";
import { postPayloadToEthosPipeline } from "../../services";

import { pipelines } from "../../pipeline-config";


const ArchiveDialog = () => {

    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();
    const { archiveDialog: dialog } = useDialog();
    const { selection: { selectedTemplate, selectedTemplateVersions, setWorkingTemplateVersion, workingTemplateVersion }, data } = useTemplate();

    useEffect(() => {
        dialog.setWarning('Warning! Once archived, a published version can not be retrieved! Are you sure you want to proceed?');
    }, [dialog]);

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
                `${pipelines.archiveTemplateVersion}?cardId=${cardId}&cardPrefix=${cardPrefix}`
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
        <Dialog open={dialog.show} onClose={dialog.handleClose} maxWidth="md">
            <DialogTitle sx={{ mb: 2 }}>Archive Template</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
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
                    userDismissable={false}
                >
                    {dialog.warning}
                </Alert>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <CustomButton label="Return" color="secondary"
                    onClick={() => dialog.handleClose()}
                    startIcon="arrow-left"
                />
                <CustomButton label="Archive"
                    isLoading={dialog.isLoading}
                    onClick={() => handleDialogAccept()}
                    startIcon="trash"
                />
            </DialogActions>
        </Dialog>
    )
}

export default ArchiveDialog;