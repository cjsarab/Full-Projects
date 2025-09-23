import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Grid } from '@mui/material';
import { Box, Typography, StatusLabel } from '@ellucian/react-design-system/core';
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PublishIcon from '@mui/icons-material/Publish';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { useDialog } from "../../contexts/DialogContext";
import { useTemplate } from "../../contexts/TemplateContext";
import { useEditor } from "../../contexts/EditorContext";

import DraftTemplateTitle from './DraftTemplateTitle';
import DraftTemplateDescription from './DraftTemplateDescription';
import { postPayloadToEthosPipeline } from '../../services';

import CustomButton from '../../components/Button';
import CustomSnackbar from "../../components/Snackbar";
import CustomEditor from '../../components/CustomEditor';

import { pipelines } from '../../pipeline-config';


const DraftEditorScreen = ({
    creatorName,
    creatorBannerId
}) => {

    const { previewDialog, deleteDialog } = useDialog();
    const { selection: {
        setSelectedTemplate,
        selectedTemplateVersions,
        workingTemplateVersion,
        setWorkingTemplateVersion,
        handleSelectTemplate,
        editableTemplate
    }, data } = useTemplate();
    const { editorValue } = useEditor();

    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();

    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

    const chunkAndUpdateVersion = async () => {
        if (!editorValue) return;

        const chunkSize = 4000;
        const chunks = [];
        for (let i = 0; i < editorValue.length; i += chunkSize) {
            chunks.push(editorValue.slice(i, i + chunkSize));
        }

        const updatedVersion = { ...workingTemplateVersion };
        chunks.forEach((chunk, index) => {
            updatedVersion[`xstmtvrsContent${index + 1}`] = chunk;
        });

        // Optionally clear leftover chunk keys if less chunks than before
        for (let i = chunks.length + 1; i <= 8; i++) {
            delete updatedVersion[`xstmtvrsContent${i}`];
        }

        setWorkingTemplateVersion(updatedVersion);
        return updatedVersion
    };

    const saveDraft = async (versionToSave) => {
        setSelectedTemplate(editableTemplate);
        try {
            await postPayloadToEthosPipeline(
                {
                    workingTemplateVersion: versionToSave,
                    editableTemplate
                },
                authenticatedEthosFetch,
                `${pipelines.saveDraft}?cardId=${cardId}&cardPrefix=${cardPrefix}`
            )
            setSaveSuccessMessage(`Successfully saved draft '${editableTemplate?.xstmtmplTemplateTitle || 'Untitled'}'.`);

        } catch (err) {
            console.error(err)
        }
    };

    const publishDraft = async (versionToSave) => {
        setSelectedTemplate(editableTemplate);
        try {
            await postPayloadToEthosPipeline(
                {
                    workingTemplateVersion: {
                        ...versionToSave,
                        xstmtvrsStatusEnum: "published",
                        xstmtvrsVersId: crypto.randomUUID(),
                    },
                    editableTemplate
                },
                authenticatedEthosFetch,
                `${pipelines.publishDraft}?cardId=${cardId}&cardPrefix=${cardPrefix}`
            )
            setSaveSuccessMessage(`Successfully published draft '${editableTemplate?.xstmtmplTemplateTitle || 'Untitled'}'.`);

        } catch (err) {
            console.error(err)
        }
    };

    const handleClickedSave = async () => {
        setIsSaving(true);
        const updatedVersion = await chunkAndUpdateVersion();
        if (updatedVersion) {
            await saveDraft(updatedVersion);
        }
        await data.refresh()
        setIsSaving(false);
    }

    const handleClickedPublish = async () => {
        setIsPublishing(true);
        const updatedVersion = await chunkAndUpdateVersion();
        if (updatedVersion) {
            await publishDraft(updatedVersion);
        }
        await data.refresh()
        handleSelectTemplate(editableTemplate)
        setIsPublishing(false);
    }

    const handleClickedViewPublishedVersions = () => {
        setWorkingTemplateVersion(latestPublishedVersion)
    }

    const latestPublishedVersion = useMemo(() => {
        const publishedVersions = selectedTemplateVersions.filter(
            v => v.xstmtvrsStatusEnum === 'published'
        );

        if (publishedVersions.length === 0) return null;

        return publishedVersions.reduce((latest, highest) =>
            highest.xstmtvrsVersNumber > latest.xstmtvrsVersNumber ? highest : latest
        );
    }, [selectedTemplateVersions]);


    return (
        <Grid container spacing={2} sx={{ height: '85vh' }}>
            <CustomSnackbar
                message={saveSuccessMessage}
                onClose={() => setSaveSuccessMessage('')}
                severity="success"
            />

            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box p={2}>
                    <Grid container spacing={2} alignItems="flex-start">
                        <Grid item xs={3}><DraftTemplateTitle /></Grid>
                        <Grid item xs={4}><DraftTemplateDescription /></Grid>
                        <Grid item xs={2}>
                            <Box display="flex" flexDirection="column" gap={4} alignItems="center">
                                <StatusLabel
                                    text={workingTemplateVersion?.xstmtvrsStatusEnum}
                                    type="success"
                                    sx={{ minWidth: 120, textAlign: 'center' }}

                                />
                                {/* <StatusLabel
                        text={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'ACTIVE' : 'NOT ACTIVE'}
                        type={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'success' : 'error'}
                        sx={{ minWidth: 120, textAlign: 'center' }} 

                    /> */}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                            <Box display="flex" flexDirection="column" gap={1}>
                                {
                                    latestPublishedVersion && (
                                        <CustomButton
                                            label="View Published"
                                            color="info"
                                            variant="outlined"
                                            onClick={handleClickedViewPublishedVersions}
                                            endIcon={<VisibilityOutlinedIcon />}
                                        />
                                    )
                                }
                                <Typography variant="body2">
                                    <strong>Created by:</strong> {creatorName}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>ID:</strong> {creatorBannerId}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <CustomEditor />
                </Box>
                <Box pt={8} display="flex" justifyContent="space-between">
                    <Box display="flex" gap={4}>
                        <CustomButton label="Preview" color="info" variant="contained"
                            onClick={previewDialog.handleOpen}
                            endIcon={<SearchOutlinedIcon />}
                        />
                        <CustomButton label="Save" color="info" variant="contained"
                            isLoading={isSaving}
                            onClick={handleClickedSave}
                            endIcon={<SaveOutlinedIcon />}
                        />
                    </Box>
                    <Box display="flex" gap={4}>
                        <CustomButton label="Publish" color="success" variant="contained"
                            isLoading={isPublishing}
                            onClick={handleClickedPublish}
                            endIcon={<PublishIcon />}
                        />
                        <CustomButton label="Delete" color="error" variant="contained"
                            onClick={deleteDialog.handleOpen}
                            endIcon={<DeleteOutlineIcon />}
                        />
                    </Box>
                </Box>
            </Grid >
        </Grid >
    )
}


DraftEditorScreen.propTypes = {
    creatorName: PropTypes.string.isRequired,
    creatorBannerId: PropTypes.string.isRequired,
};

export default DraftEditorScreen;