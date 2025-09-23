import React, { useEffect } from "react";

import { Dialog, DialogTitle, DialogContent, Typography, Alert, DialogActions } from "@mui/material";
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';
import CustomButton from "../Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';

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
        <Dialog open={dialog.show} onClose={dialog.handleClose} maxWidth="lg">
            <DialogTitle sx={{ mb: 2 }}>Create New Draft</DialogTitle>
            <DialogContent sx={{ overflow: "visible", pt: 2 }}>
                {!dialog.warning && (
                    <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
                        This action will create a new draft of {`"${templateTitle}"`} based on version {versionNumber}.
                    </Typography>
                )}
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
                <CustomButton label="Return" color="error" variant="contained"
                    onClick={() => dialog.handleClose()}
                    startIcon={<ArrowBackIcon />}
                />
                <CustomButton
                    label="New Draft"
                    color="info"
                    variant="contained"
                    isLoading={dialog.isLoading}
                    onClick={() => handleDialogAccept()}
                    endIcon={<NoteAddOutlinedIcon />}
                />
            </DialogActions>
        </Dialog>
    )
}

export default NewDraftDialog;