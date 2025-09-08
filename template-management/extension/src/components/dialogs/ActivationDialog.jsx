import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Alert, DialogActions } from "@mui/material";
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';

import CustomButton from "../Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

import { useDialog } from "../../contexts/DialogContext";
import { useTemplate } from "../../contexts/TemplateContext";
import { postPayloadToEthosPipeline } from "../../services";

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
                    `UWS-DEACTIVATE-TEMPLATE?cardId=${cardId}&cardPrefix=${cardPrefix}`)
                await data.refresh()
                await handleSelectTemplate(selectedTemplate)
                dialog.setIsLoading(false)
                dialog.setShow(false)
            } catch (error) {
                dialog.setError(`Failed to delete template: ${error.message}`);
                dialog.setIsLoading(false)
            }
        } else if (workingTemplateVersion?.xstmtvrsIsActive === "false") {
            try {
                const templateId = workingTemplateVersion.xstmtvrsTemplateId;
                await postPayloadToEthosPipeline({ workingTemplateVersion }, authenticatedEthosFetch,
                    `UWS-ACTIVATE-TEMPLATE?xstmtvrsTemplateId=${templateId}&cardId=${cardId}&cardPrefix=${cardPrefix}`)
                await data.refresh()
                await handleSelectTemplate(selectedTemplate)
                dialog.setIsLoading(false)
                dialog.setShow(false)
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
        <Dialog open={dialog.show} onClose={dialog.handleClose} maxWidth="lg">
            <DialogTitle sx={{ mb: 2 }}>
                {(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'Deactivate Template' : 'Activate Template'}
            </DialogTitle>

            <DialogContent sx={{ overflow: "visible", pt: 2 }}>
                {/* <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
            {(workingTemplateVersion?.xstmtvrsIsActive === "true")
              ? `Are you sure you want to deactivate the template "${templateTitle}"?`
              : `Are you sure you want to activate the template "${templateTitle}"?`}
          </Typography> */}

                <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
                    {workingTemplateVersion?.xstmtvrsIsActive === "true" ? (
                        `Are you sure you want to deactivate the template "${templateTitle}"?`
                    ) : activeVersion ? (
                        `Version ${activeVersion} already active! Only one version may be active at a time.`
                    ) : (
                        `Are you sure you want to activate the template "${templateTitle}"?`
                    )}
                </Typography>


                {dialog.error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {dialog.error}
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <CustomButton label="Return" color="info" variant="contained"
                    onClick={dialog.handleClose}
                    startIcon={<ArrowBackIcon />}
                />

                <CustomButton
                    label={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'Deactivate' : 'Activate'}
                    color={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'error' : 'success'}
                    variant="contained"
                    onClick={handleDialogAccept}
                    isLoading={dialog.isLoading}
                    disabled={activeVersion && workingTemplateVersion?.xstmtvrsIsActive === "false"}
                    endIcon={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? <BlockOutlinedIcon /> : <CheckOutlinedIcon />}
                />
            </DialogActions>
        </Dialog>

    )
}

export default ActivationDialog;