import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, TextField, Alert, DialogActions } from "@mui/material";
import CustomButton from "../Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneIcon from '@mui/icons-material/Done';

import { postPayloadToEthosPipeline } from "../../services";
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';
import { useDataQuery } from '@ellucian/experience-extension-extras';

import { useDialog } from "../../contexts/DialogContext";
import { useTemplate } from "../../contexts/TemplateContext";

import { pipelines } from "../../pipeline-config";

const NewTemplateDialog = () => {

    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();
    const { newTemplateDialog: dialog } = useDialog();
    const { selection: { handleSelectTemplate } } = useTemplate();

    const { refresh: refreshTemplatesData } = useDataQuery({ resource: pipelines.getTemplates });

    const handleDialogAccept = async () => {
        const title = dialog.inputs.title.trim() || "";
        const desc = dialog.inputs.description?.trim() || "";

        const sampleHtml = `
            <div>
                <h1 style="margin-bottom: 0.5em; text-align: center;">${title}</h1>
                <hr style="margin: 2em 0;" />

                <h2>Overview</h2>
                <p>
                Use this template editor to create templates for letters and other documents.
                </p>
                <h2>Key Points</h2>
                <ul>
                <li>Supports <strong>rich text formatting</strong></li>
                <li>Includes <em>headings, lists, and links</em></li>
                <li>Fully customisable via the editor</li>
                <li>Use the variables button in the toolbar to insert variables! ({x})</li>
                </ul>

                <blockquote style="border-left: 4px solid #ccc; padding-left: 1em; color: #666; margin-top: 2em;">
                "Contemplate your next template."
                </blockquote>
            </div>
        `;


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
            const res = await postPayloadToEthosPipeline(
                {
                    "xstmtmplTemplateId": crypto.randomUUID(),
                    "xstmtmplTemplateTitle": title,
                    "xstmtmplTemplateDescription": desc,
                    "xstmtvrsVersId": crypto.randomUUID(),
                    "xstmtvrsContent1": sampleHtml
                },
                authenticatedEthosFetch,
                `${pipelines.createNewTemplate}?cardId=${cardId}&cardPrefix=${cardPrefix}`);
            await refreshTemplatesData();
            handleSelectTemplate(res?.__newTemplateResponse);
            dialog.setShow(false);
            dialog.setIsLoading(false)
        } catch (error) {
            dialog.setError(`Failed to create template: ${error.message}`);
            dialog.setIsLoading(false)
        }
    };


    return (
        <Dialog open={dialog.show} onClose={dialog.handleClose} maxWidth="lg">
            <DialogTitle sx={{ mb: 2 }}>New Template</DialogTitle>
            <DialogContent sx={{ overflow: "visible", pt: 2, minWidth: '500px' }}>
                <Typography variant="body1" gutterBottom>
                    Enter a title for the template:
                </Typography>
                {dialog.error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {dialog.error}
                    </Alert>
                )}
                <TextField
                    fullWidth
                    label="Template Title (*)"
                    value={dialog.inputs.title}
                    variant="outlined"
                    onChange={(e) => {
                        dialog.handleInputChange('title', e.target.value);
                        if (dialog.error) dialog.setError('');
                    }}
                />
                <Typography variant="body1" sx={{ mt: 2 }} gutterBottom>
                    Enter a description for the template:
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    maxRows={6}
                    label="Template Description"
                    value={dialog.inputs.description}
                    variant="outlined"
                    onChange={(e) => {
                        dialog.handleInputChange('description', e.target.value);
                        if (dialog.error) dialog.setError('');
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <CustomButton label="Return" color="error" variant="contained" onClick={() => dialog.handleClose()} startIcon={<ArrowBackIcon />} />
                <CustomButton
                    label="Accept"
                    color="info"
                    variant="contained"
                    isLoading={dialog.isLoading}
                    onClick={() => handleDialogAccept()}
                    endIcon={<DoneIcon />}
                />
            </DialogActions>
        </Dialog>
    )
}

export default NewTemplateDialog;