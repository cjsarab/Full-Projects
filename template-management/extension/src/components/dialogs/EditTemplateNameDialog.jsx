import React from "react";
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';
import { useDataQuery } from '@ellucian/experience-extension-extras';

import { Dialog, DialogTitle, DialogContent, Typography, TextField, Alert, DialogActions } from "@ellucian/react-design-system/core";
import CustomButton from "../Button";

import { useDialog } from "../../contexts/DialogContext";
import { useTemplate } from "../../contexts/TemplateContext";
import { putPayloadToEthosPipeline } from "../../services";
import { pipelines } from "../../pipeline-config";


const EditTemplateNameDialog = () => {

    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();
    const { editTemplateNameDialog: dialog } = useDialog();
    const { selection: { handleSelectTemplate, selectedTemplate } } = useTemplate();

    const { refresh: refreshTemplatesData } = useDataQuery({ resource: pipelines.getTemplates });

    const handleDialogAccept = async () => {
        const title = dialog?.inputs?.title?.trim() || "";
        const desc = dialog?.inputs?.description?.trim() || "";

        // Basic title validation
        if (!title) {
            dialog.setError('Template title is required.');
            return;
        }
        if (title.length > 30) {
            dialog.setError('Template title must be 30 characters or less.');
            return;
        }

        if (desc.length > 200) {
            dialog.setError('Description is too long (max 200 characters).');
            return;
        }
        dialog.setError('');

        try {
            dialog.setIsLoading(true)
            const res = await putPayloadToEthosPipeline(
                {
                    "xstmtmplId": selectedTemplate?.id,
                    "xstmtmplTemplateId": selectedTemplate?.xstmtmplTemplateId,
                    "xstmtmplTemplateTitle": title,
                    "xstmtmplTemplateDescription": desc,
                    "xstmtmplCreatedAtTimestamp": selectedTemplate?.xstmtmplCreatedAtTimestamp,
                    "xstmtmplCreatedBy": selectedTemplate?.xstmtmplCreatedBy
                },
                authenticatedEthosFetch,
                `${pipelines.editTemplateName}?cardId=${cardId}&cardPrefix=${cardPrefix}`);
            await refreshTemplatesData();
            handleSelectTemplate(res?.__editedTemplateResponse);
            dialog.setShow(false);
            dialog.setIsLoading(false)
        } catch (error) {
            dialog.setError(`Failed to edit template name/desc: ${error.message}`);
            dialog.setIsLoading(false)
        }
    };

    console.log(selectedTemplate)

    // useEffect(() => {
    //     if (!dialog.show || !selectedTemplate) return;
    //     dialog.handleInputChange('title', selectedTemplate?.xstmtmplTemplateTitle);
    //     dialog.handleInputChange('description', selectedTemplate?.xstmtmplTemplateDescription);
    // }, [dialog, selectedTemplate])
    // useEffect(() => {
    //     if (!show || !selectedTemplate) return;

    //     handleInputChange('title', selectedTemplate.xstmtmplTemplateTitle || '');
    //     handleInputChange('description', selectedTemplate.xstmtmplTemplateDescription || '');
    // }, [selectedTemplate, show, handleInputChange]);


    return (
        <Dialog open={dialog.show} onClose={dialog.handleClose} maxWidth="lg">
            <DialogTitle sx={{ mb: 2 }}>Edit Template Name and Description</DialogTitle>
            <Alert
                alertType="error"
                open={dialog.error}
                onClose={dialog.handleCloseError}
            >
                {dialog.error}
            </Alert>
            <DialogContent >
                <Typography variant="body1" gutterBottom>
                    Enter a title for the template:
                </Typography>
                <TextField label="Template Title"
                    required
                    maxCharacters={{ max: 30, allowOverflow: false }}
                    fullWidth
                    value={dialog.inputs.title}
                    onChange={(e) => {
                        dialog.handleInputChange('title', e.target.value);
                        if (dialog.error) dialog.setError('');
                    }}
                />
                <Typography variant="body1" gutterBottom>
                    Enter a description for the template:
                </Typography>
                <TextField label="Template Description"
                    maxCharacters={{ max: 200, allowOverflow: false }}
                    fullWidth
                    value={dialog.inputs.description}
                    multiline
                    onChange={(e) => {
                        dialog.handleInputChange('description', e.target.value);
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

export default EditTemplateNameDialog;