import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Alert, DialogActions } from "@ellucian/react-design-system/core";
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';

import CustomButton from "../Button";

import { useDialog } from "../../contexts/DialogContext";
import { useTemplate } from "../../contexts/TemplateContext";
import { postPayloadToEthosPipeline } from "../../services";

import { pipelines } from "../../pipeline-config";

const ActivationDialog = () => {

    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();
    const { activationDialog: dialog } = useDialog();
    const { selection: { selectedTemplate, selectedTemplateVersions, workingTemplateVersion, handleSelectTemplate }, data } = useTemplate();


    useEffect(() => {
        if (!dialog.show) {
            dialog.setError('');
        }
    }, [dialog]);

    const activeVersion = selectedTemplateVersions.find(v => v.xstmtvrsIsActive === "true")?.xstmtvrsVersNumber;

    const handleDialogAccept = async () => {
        dialog.setError('')
        if (!selectedTemplate) {
            dialog.setError('No template selected for activation.');
            return;
        }
        dialog.setIsLoading(true)
        dialog.setWarning('')
        if (workingTemplateVersion?.xstmtvrsIsActive === "true") {
            try {
                await postPayloadToEthosPipeline({ workingTemplateVersion }, authenticatedEthosFetch,
                    `${pipelines.deactivateTemplate}?cardId=${cardId}&cardPrefix=${cardPrefix}`)
                await data.refresh()
                await handleSelectTemplate(selectedTemplate)
                dialog.setIsLoading(false)
                dialog.setShow(false)
                dialog.setSnackbarMessage(`Successfully deactivated template '${templateTitle}'.`)
                dialog.setSnackbarType('success')
            } catch (error) {
                dialog.setError(`Failed to deactivate template: ${error.message}`);
                dialog.setIsLoading(false)
            }
        } else if (workingTemplateVersion?.xstmtvrsIsActive === "false") {
            try {
                const templateId = workingTemplateVersion.xstmtvrsTemplateId;
                await postPayloadToEthosPipeline({ workingTemplateVersion }, authenticatedEthosFetch,
                    `${pipelines.activateTemplate}?xstmtvrsTemplateId=${templateId}&cardId=${cardId}&cardPrefix=${cardPrefix}`)
                await data.refresh()
                await handleSelectTemplate(selectedTemplate)
                dialog.setIsLoading(false)
                dialog.setShow(false)
                dialog.setSnackbarMessage(`Successfully activated template '${templateTitle}'.`)
                dialog.setSnackbarType('success')
            } catch (error) {
                dialog.setError(`Failed to activate template: ${error.message}`);
                dialog.setIsLoading(false)
            }
        } else {
            return
        }
    };

    const templateTitle = selectedTemplate?.xstmtmplTemplateTitle || "No Template Selected";

    return (
        <Dialog open={dialog.show} onClose={dialog.handleClose} maxWidth="md">
            <DialogTitle sx={{ mb: 2 }}>
                {(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'Deactivate Template' : 'Activate Template'}
            </DialogTitle>
            <DialogContent sx={{ overflow: "visible", pt: 2 }}>
                <Alert alertType="error"
                    open={dialog.error}
                    onClose={dialog.handleCloseError}
                >
                    {dialog.error}
                </Alert>


                <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
                    {workingTemplateVersion?.xstmtvrsIsActive === "true" ? (
                        `Are you sure you want to deactivate the template "${templateTitle}"?`
                    ) : activeVersion ? (
                        `Version ${activeVersion} already active! Only one version may be active at a time.`
                    ) : (
                        `Are you sure you want to activate the template "${templateTitle}"?`
                    )}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <CustomButton label="Return" color="secondary"
                    onClick={dialog.handleClose}
                    startIcon="arrow-left"
                />

                <CustomButton
                    label={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'Deactivate' : 'Activate'}
                    onClick={handleDialogAccept}
                    isLoading={dialog.isLoading}
                    disabled={activeVersion && workingTemplateVersion?.xstmtvrsIsActive === "false"}
                    startIcon={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? "error" : "wifi"}
                />
            </DialogActions>
        </Dialog>

    )
}

export default ActivationDialog;