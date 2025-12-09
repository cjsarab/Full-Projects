// import React, { useState, useMemo } from "react";
// import PropTypes from "prop-types";
// import { Grid, Box, Typography, StatusLabel } from '@ellucian/react-design-system/core';
// import { useCardInfo, useData } from '@ellucian/experience-extension-utils';

// import { useDialog } from "../../contexts/DialogContext";
// import { useTemplate } from "../../contexts/TemplateContext";
// import { useEditor } from "../../contexts/EditorContext";

// import DraftTemplateTitle from './DraftTemplateTitle';
// import DraftTemplateDescription from './DraftTemplateDescription';
// import { postPayloadToEthosPipeline } from '../../services';

// import CustomButton from '../../components/Button';
// import CustomSnackbar from "../../components/Snackbar";
// import CustomEditor from '../../components/CustomEditor';

// import { pipelines } from '../../pipeline-config';


// const DraftEditorScreen = ({
//     creatorName,
//     creatorBannerId
// }) => {

//     const { previewDialog, deleteDialog } = useDialog();
//     const { selection: {
//         setSelectedTemplate,
//         selectedTemplateVersions,
//         workingTemplateVersion,
//         setWorkingTemplateVersion,
//         handleSelectTemplate,
//         editableTemplate
//     }, data } = useTemplate();
//     const { editorValue } = useEditor();

//     const { authenticatedEthosFetch } = useData();
//     const { cardId, cardPrefix } = useCardInfo();

//     const [isSaving, setIsSaving] = useState(false);
//     const [isPublishing, setIsPublishing] = useState(false);
//     const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

//     const chunkAndUpdateVersion = async () => {
//         if (!editorValue) return;

//         const chunkSize = 4000;
//         const chunks = [];
//         for (let i = 0; i < editorValue.length; i += chunkSize) {
//             chunks.push(editorValue.slice(i, i + chunkSize));
//         }

//         const updatedVersion = { ...workingTemplateVersion };
//         chunks.forEach((chunk, index) => {
//             updatedVersion[`xstmtvrsContent${index + 1}`] = chunk;
//         });

//         // Optionally clear leftover chunk keys if less chunks than before
//         for (let i = chunks.length + 1; i <= 8; i++) {
//             delete updatedVersion[`xstmtvrsContent${i}`];
//         }

//         setWorkingTemplateVersion(updatedVersion);
//         return updatedVersion
//     };

//     const saveDraft = async (versionToSave) => {
//         setSelectedTemplate(editableTemplate);
//         try {
//             await postPayloadToEthosPipeline(
//                 {
//                     workingTemplateVersion: versionToSave,
//                     editableTemplate
//                 },
//                 authenticatedEthosFetch,
//                 `${pipelines.saveDraft}?cardId=${cardId}&cardPrefix=${cardPrefix}`
//             )
//             setSaveSuccessMessage(`Successfully saved draft '${editableTemplate?.xstmtmplTemplateTitle || 'Untitled'}'.`);

//         } catch (err) {
//             console.error(err)
//         }
//     };

//     const publishDraft = async (versionToSave) => {
//         setSelectedTemplate(editableTemplate);
//         try {
//             await postPayloadToEthosPipeline(
//                 {
//                     workingTemplateVersion: {
//                         ...versionToSave,
//                         xstmtvrsStatusEnum: "published",
//                         xstmtvrsVersId: crypto.randomUUID(),
//                     },
//                     editableTemplate
//                 },
//                 authenticatedEthosFetch,
//                 `${pipelines.publishDraft}?cardId=${cardId}&cardPrefix=${cardPrefix}`
//             )
//             setSaveSuccessMessage(`Successfully published draft '${editableTemplate?.xstmtmplTemplateTitle || 'Untitled'}'.`);

//         } catch (err) {
//             console.error(err)
//         }
//     };

//     const handleClickedSave = async () => {
//         setIsSaving(true);
//         const updatedVersion = await chunkAndUpdateVersion();
//         if (updatedVersion) {
//             await saveDraft(updatedVersion);
//         }
//         await data.refresh()
//         setIsSaving(false);
//     }

//     const handleClickedPublish = async () => {
//         setIsPublishing(true);
//         const updatedVersion = await chunkAndUpdateVersion();
//         if (updatedVersion) {
//             await publishDraft(updatedVersion);
//         }
//         await data.refresh()
//         handleSelectTemplate(editableTemplate)
//         setIsPublishing(false);
//     }

//     const handleClickedViewPublishedVersions = () => {
//         setWorkingTemplateVersion(latestPublishedVersion)
//     }

//     const latestPublishedVersion = useMemo(() => {
//         const publishedVersions = selectedTemplateVersions.filter(
//             v => v.xstmtvrsStatusEnum === 'published'
//         );

//         if (publishedVersions.length === 0) return null;

//         return publishedVersions.reduce((latest, highest) =>
//             highest.xstmtvrsVersNumber > latest.xstmtvrsVersNumber ? highest : latest
//         );
//     }, [selectedTemplateVersions]);


//     return (
//         <Grid container spacing={2}>
//             <CustomSnackbar
//                 message={saveSuccessMessage}
//                 onClose={() => setSaveSuccessMessage('')}
//                 severity="success"
//             />

//             <Grid item md={12} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//                 <Box p={2}>
//                     <Grid container spacing={2}>
//                         <Grid item md={3}><DraftTemplateTitle /></Grid>
//                         <Grid item md={4}><DraftTemplateDescription /></Grid>
//                         <Grid item md={2}>
//                             <Box display="flex" flexDirection="column" gap={4} alignItems="center">
//                                 <StatusLabel
//                                     text={workingTemplateVersion?.xstmtvrsStatusEnum}
//                                     type="success" //always draft
//                                     sx={{ minWidth: 120, textAlign: 'center' }}

//                                 />
//                             </Box>
//                         </Grid>
//                         <Grid item md={3}>
//                             <Box display="flex" flexDirection="column" gap={1}>
// {
//     latestPublishedVersion && (
//         <CustomButton
//             label="View Published"
//             color="secondary"
//             onClick={handleClickedViewPublishedVersions}
//             startIcon="show"
//         />
//     )
// }
//                                 <Typography variant="body2">
//                                     <strong>Created by:</strong> {creatorName}
//                                 </Typography>
//                                 <Typography variant="body2">
//                                     <strong>ID:</strong> {creatorBannerId}
//                                 </Typography>
//                             </Box>
//                         </Grid>
//                     </Grid>
//                 </Box>
//                 <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
//                     <CustomEditor />
//                 </Box>
//                 <Box pt={8} display="flex" justifyContent="space-between">
//                     <Box display="flex" gap={4}>
//                         <CustomButton label="Preview"
//                             color="secondary"
//                             onClick={previewDialog.handleOpen}
//                             startIcon="search"
//                         />
//                         <CustomButton label="Save"
//                             isLoading={isSaving}
//                             onClick={handleClickedSave}
//                             startIcon="save"
//                         />
//                     </Box>
//                     <Box display="flex" gap={4}>
//                         <CustomButton label="Publish"
//                             isLoading={isPublishing}
//                             onClick={handleClickedPublish}
//                             startIcon="code-branch"
//                         />
//                         <CustomButton label="Delete"
//                             color="secondary"
//                             onClick={deleteDialog.handleOpen}
//                             startIcon="trash"
//                         />
//                     </Box>
//                 </Box>
//             </Grid >
//         </Grid >
//     )
// }


// DraftEditorScreen.propTypes = {
//     creatorName: PropTypes.string.isRequired,
//     creatorBannerId: PropTypes.string.isRequired,
// };

// export default DraftEditorScreen;

import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Typography, StatusLabel, Card, CardHeader, CardActions, CardContent } from '@ellucian/react-design-system/core';

import { useCardInfo, useData } from '@ellucian/experience-extension-utils';

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
        <Card accent="primary">
            <CustomSnackbar
                message={saveSuccessMessage}
                onClose={() => setSaveSuccessMessage('')}
                severity="success"
            />
            <CardHeader
                title={
                    <Box sx={{ display: "flex", flexDirection: "row", marginLeft: 4, marginRight: 8, justifyContent: 'space-between' }}>
                        <DraftTemplateTitle />
                        <Box sx={{ display: "flex", flexDirection: "column" }} gap={1}>
                            <Typography variant="body2">
                                <strong>Created by:</strong> {creatorName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>ID:</strong> {creatorBannerId}
                            </Typography>
                        </Box>
                    </Box>
                }
                subheader={
                    <Box sx={{ marginLeft: 4 }}>
                        <DraftTemplateDescription />
                    </Box>
                }
                avatar={
                    < StatusLabel
                        text={workingTemplateVersion?.xstmtvrsStatusEnum}
                        type="draft" //always draft
                    />
                }
                action={
                    latestPublishedVersion && (
                        <CustomButton label="View Published Version"
                            color="secondary"
                            onClick={handleClickedViewPublishedVersions}
                            startIcon="show"
                            sx={{ maxHeight: '40px' }}
                        />
                    )
                }
            />
            <CardContent>
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <CustomEditor />
                </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between" }}>
                <Box display="flex" gap={4}>
                    <CustomButton label="Preview"
                        color="secondary"
                        onClick={previewDialog.handleOpen}
                        startIcon="search"
                    />
                    <CustomButton label="Save"
                        isLoading={isSaving}
                        onClick={handleClickedSave}
                        startIcon="save"
                    />
                </Box>
                <Box display="flex" gap={4}>
                    <CustomButton label="Publish"
                        isLoading={isPublishing}
                        onClick={handleClickedPublish}
                        startIcon="code-branch"
                    />
                    <CustomButton label="Delete"
                        color="secondary"
                        onClick={deleteDialog.handleOpen}
                        startIcon="trash"
                    />
                </Box>
            </CardActions>
        </Card >
    )
}


DraftEditorScreen.propTypes = {
    creatorName: PropTypes.string.isRequired,
    creatorBannerId: PropTypes.string.isRequired,
};

export default DraftEditorScreen;