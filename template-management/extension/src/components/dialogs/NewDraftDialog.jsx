import React, { useEffect } from "react";
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';

import { Dialog, DialogTitle, DialogContent, Typography, Alert, DialogActions } from "@ellucian/react-design-system/core";
import CustomButton from "../Button";

import { useDialog } from "../../contexts/DialogContext";
import { useTemplate } from "../../contexts/TemplateContext";
import { postPayloadToEthosPipeline } from "../../services";
import { pipelines } from "../../pipeline-config";


const NewDraftDialog = () => {

    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();
    const { newDraftDialog: dialog } = useDialog();
    const { selection: { selectedTemplate, selectedTemplateVersions, workingTemplateVersion, handleSelectTemplate }, data } = useTemplate();


    useEffect(() => {
        if (selectedTemplateVersions) {
            const draft = selectedTemplateVersions.find(v => v.xstmtvrsStatusEnum === 'draft');
            if (draft) {
                dialog.setWarning('Warning! Only one draft may exist per template. This action will overwrite your current draft!');
            } else {
                dialog.setWarning('')
            }
        }
    }, [dialog, selectedTemplateVersions]);


    const handleDialogAccept = async () => {
        dialog.setError('')

        if (!selectedTemplate) {
            dialog.setError('No template selected for deletion.');
            return;
        }
        try {
            dialog.setIsLoading(true)
            dialog.setWarning('')
            await postPayloadToEthosPipeline({
                workingTemplateVersion,
                newId: crypto.randomUUID(),
                selectedTemplateVersions
            },
                authenticatedEthosFetch,
                `${pipelines.createNewDraft}?cardId=${cardId}&cardPrefix=${cardPrefix}`
            )
            await data.refresh()
            handleSelectTemplate(selectedTemplate)
            dialog.setIsLoading(false)
            dialog.setShow(false)
        } catch (error) {
            dialog.setError(`Failed to delete template: ${error.message}`);
            dialog.setIsLoading(false)
        }
    };

    const templateTitle = selectedTemplate?.xstmtmplTemplateTitle || "No Template Selected";
    const versionNumber = workingTemplateVersion?.xstmtvrsVersNumber || "No Version Selected";

    return (
        <Dialog open={dialog.show} onClose={dialog.handleClose} maxWidth="md">
            <DialogTitle sx={{ mb: 2 }}>Create New Draft</DialogTitle>
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
                    userDismissable={false}
                >
                    {dialog.warning}
                </Alert>
                {!dialog.warning && (
                    <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
                        This action will create a new draft of {`"${templateTitle}"`} based on version {versionNumber}.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <CustomButton label="Return" color="secondary" onClick={() => dialog.handleClose()} startIcon="arrow-left" />
                <CustomButton
                    label="New Draft"
                    isLoading={dialog.isLoading}
                    onClick={() => handleDialogAccept()}
                    startIcon="file-plus"
                />
            </DialogActions>
        </Dialog>
    )
}

export default NewDraftDialog;