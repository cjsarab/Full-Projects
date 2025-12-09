// import React, { useMemo } from "react";
// import PropTypes from "prop-types";


// import { RichTextEditor, Box, Typography, StatusLabel, Grid, Dropdown, DropdownItem, Tooltip } from '@ellucian/react-design-system/core';
// import { Icon } from '@ellucian/ds-icons/lib';
// import CustomButton from '../components/Button';

// import { useDialog } from "../contexts/DialogContext";
// import { useTemplate } from "../contexts/TemplateContext";
// import { useEditor } from "../contexts/EditorContext";

// const PublishedEditorScreen = ({
//     publisherName,
//     publisherBannerId,
// }) => {

//     const { previewDialog, activationDialog, newDraftDialog, archiveDialog } = useDialog();
//     const { selection: { selectedTemplateVersions, workingTemplateVersion, setWorkingTemplateVersion, editableTemplate } } = useTemplate();
//     const { editorValue } = useEditor();

//     const draftVersion = useMemo(() => {
//         return selectedTemplateVersions.find(v => v.xstmtvrsStatusEnum === 'draft') || null;
//     }, [selectedTemplateVersions]);

//     const handleClickedViewDraftVersion = () => {
//         setWorkingTemplateVersion(draftVersion)
//     }

//     return (
//         <Grid container spacing={2} >
//             <Grid item md={12} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//                 <Box p={2}>
//                     <Grid container spacing={2} alignItems="flex-start">
//                         <Grid item md={2}>
//                             <Typography variant="h4" gutterBottom>
//                                 {editableTemplate?.xstmtmplTemplateTitle || 'Untitled Template'}
//                             </Typography>
//                         </Grid>
//                         <Grid item md={2}>
//                             <Tooltip title={editableTemplate?.xstmtmplTemplateDescription || 'No description available.'}>
//                                 <Typography
//                                     variant="body2"
//                                     gutterBottom
//                                     noWrap
//                                     sx={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
//                                 >
//                                     {editableTemplate?.xstmtmplTemplateDescription || 'No description available.'}
//                                 </Typography>
//                             </Tooltip>
//                         </Grid>
//                         <Grid item md={2}>
//                             <Box display="flex" flexDirection="column" gap={4} alignItems="center">
//                                 <StatusLabel text={workingTemplateVersion?.xstmtvrsStatusEnum} type="success"
//                                     sx={{ minWidth: 120, textAlign: 'center' }}

//                                 />
//                                 <StatusLabel
//                                     text={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'ACTIVE' : 'not active'}
//                                     type={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'success' : 'error'}
//                                     sx={{ minWidth: 120, textAlign: 'center' }}
//                                 />
//                             </Box>
//                         </Grid>
//                         <Grid item xs={3}>
//                             <Box display="flex" flexDirection="column" gap={1}>
//                                 <Typography variant="body2">
//                                     <strong>Publisher:</strong> {publisherName}
//                                 </Typography>
//                                 <Typography variant="body2">
//                                     <strong>ID:</strong> {publisherBannerId}
//                                 </Typography>
//                                 <Typography variant="body2">
//                                     <strong>Published:</strong>{' '}
//                                     {workingTemplateVersion?.xstmtvrsPublishedAt
//                                         ? new Date(workingTemplateVersion.xstmtvrsPublishedAt).toLocaleString('en-gb')
//                                         : 'N/A'}
//                                 </Typography>
//                             </Box>
//                         </Grid>
//                         <Grid item xs={3}>
//                             <Box display="flex" flexDirection="column" gap={1}>
// {
//     draftVersion && (
//         <CustomButton label="View Draft" color="secondary" onClick={handleClickedViewDraftVersion} startIcon="show" />
//     )
// }
//                                 <Dropdown
//                                     label="Template Version"
//                                     value={workingTemplateVersion?.xstmtvrsVersNumber || ''}
//                                     onChange={(e) => {
//                                         const selectedVersion = selectedTemplateVersions.find(
//                                             v => v.xstmtvrsVersNumber === e.target.value
//                                         );
//                                         setWorkingTemplateVersion(selectedVersion);
//                                     }}
//                                 >
//                                     {selectedTemplateVersions
//                                         .filter(version => version.xstmtvrsStatusEnum !== 'draft')
//                                         .map((version) => (
//                                             <DropdownItem
//                                                 key={version.xstmtvrsVersNumber}
//                                                 value={version.xstmtvrsVersNumber}
//                                                 label={`Version ${version.xstmtvrsVersNumber}`}
//                                                 LeftIconComponent={<Icon name="hashtag" />}
//                                             />
//                                         ))
//                                     }
//                                 </Dropdown>
//                             </Box>
//                         </Grid>
//                     </Grid>
//                 </Box>
//                 <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
//                     <RichTextEditor
//                         value={editorValue}
//                         readOnly
//                         toolbar={[]}
//                     />
//                 </Box>
//                 <Box pt={8} display="flex" justifyContent="space-between">
//                     <Box display="flex" gap={4}>
//                         <CustomButton label="Preview" color="secondary" onClick={previewDialog.handleOpen} startIcon="search" />
//                         <CustomButton label="Create New Draft" onClick={newDraftDialog.handleOpen} startIcon="file-plus" />
//                     </Box>
//                     <Box display="flex" gap={4}>
//                         <CustomButton
//                             label={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'DEACTIVATE' : 'ACTIVATE'}
//                             onClick={activationDialog.handleOpen}
//                             startIcon={
//                                 (workingTemplateVersion?.xstmtvrsIsActive === "true") ? "error" : "wifi"
//                             } />
//                         <CustomButton
//                             label="Archive"
//                             color="secondary"
//                             onClick={archiveDialog.handleOpen}
//                             startIcon="trash" />
//                     </Box>
//                 </Box>
//             </Grid>
//         </Grid>
//     )
// }


// PublishedEditorScreen.propTypes = {
//     publisherName: PropTypes.string.isRequired,
//     publisherBannerId: PropTypes.string.isRequired,
// };

// export default PublishedEditorScreen;


import React, { useMemo } from "react";
import PropTypes from "prop-types";


import { RichTextEditor, Box, Typography, StatusLabel, Dropdown, DropdownItem, Tooltip, Card, CardHeader, CardActions, CardContent } from '@ellucian/react-design-system/core';
import { Icon } from '@ellucian/ds-icons/lib';
import CustomButton from '../components/Button';

import { useDialog } from "../contexts/DialogContext";
import { useTemplate } from "../contexts/TemplateContext";
import { useEditor } from "../contexts/EditorContext";

const PublishedEditorScreen = ({
    publisherName,
    publisherBannerId,
}) => {

    const { previewDialog, activationDialog, newDraftDialog, archiveDialog } = useDialog();
    const { selection: { selectedTemplateVersions, workingTemplateVersion, setWorkingTemplateVersion, editableTemplate } } = useTemplate();
    const { editorValue } = useEditor();

    const draftVersion = useMemo(() => {
        return selectedTemplateVersions.find(v => v.xstmtvrsStatusEnum === 'draft') || null;
    }, [selectedTemplateVersions]);

    const handleClickedViewDraftVersion = () => {
        setWorkingTemplateVersion(draftVersion)
    }

    return (
        <Card accent="secondary">
            <CardHeader
                title={
                    <Box sx={{ display: "flex", flexDirection: "row", marginLeft: 4, marginRight: 8, justifyContent: 'space-between' }}>
                        <Dropdown
                            label="Template Version"
                            value={workingTemplateVersion?.xstmtvrsVersNumber || ''}
                            onChange={(e) => {
                                const selectedVersion = selectedTemplateVersions.find(
                                    v => v.xstmtvrsVersNumber === e.target.value
                                );
                                setWorkingTemplateVersion(selectedVersion);
                            }}
                            sx={{ minWidth: '250px' }}
                        >
                            {selectedTemplateVersions
                                .filter(version => version.xstmtvrsStatusEnum !== 'draft')
                                .map((version) => (
                                    <DropdownItem
                                        key={version.xstmtvrsVersNumber}
                                        value={version.xstmtvrsVersNumber}
                                        label={`Version ${version.xstmtvrsVersNumber}`}
                                        LeftIconComponent={<Icon name="hashtag" />}
                                    />
                                ))
                            }
                        </Dropdown>
                        <Box sx={{ display: "flex", flexDirection: "column" }} gap={1}>
                            <Typography variant="h4" gutterBottom>{editableTemplate?.xstmtmplTemplateTitle || 'Untitled Template'}</Typography>
                            <Tooltip title={editableTemplate?.xstmtmplTemplateDescription || 'No description available.'}>
                                <Typography
                                    variant="body2"
                                    gutterBottom
                                    noWrap
                                    sx={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                >
                                    {editableTemplate?.xstmtmplTemplateDescription || 'No description available.'}
                                </Typography>
                            </Tooltip>
                        </Box>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography variant="body2">
                                <strong>Publisher:</strong> {publisherName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>ID:</strong> {publisherBannerId}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Published:</strong>{' '}
                                {workingTemplateVersion?.xstmtvrsPublishedAt
                                    ? new Date(workingTemplateVersion.xstmtvrsPublishedAt).toLocaleString('en-gb')
                                    : 'N/A'}
                            </Typography>
                        </Box>
                    </Box>}
                avatar={< Box display="flex" flexDirection="column" gap={4} alignItems="center" >
                    <StatusLabel text={workingTemplateVersion?.xstmtvrsStatusEnum} type="pending"
                        sx={{ minWidth: 120, textAlign: 'center' }}

                    />
                    <StatusLabel
                        text={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'ACTIVE' : 'not active'}
                        type={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'success' : 'error'}
                        sx={{ minWidth: 120, textAlign: 'center' }}
                    />
                </Box >}
                action={
                    draftVersion && (
                        <CustomButton label="View Draft Version" color="secondary" onClick={handleClickedViewDraftVersion} startIcon="show" sx={{ maxHeight: '40px' }} />
                    )
                }
            />
            < CardContent >
                < Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <RichTextEditor
                        value={editorValue}
                        readOnly
                        toolbar={[]}
                    />
                </Box >
            </CardContent >
            <CardActions sx={{ justifyContent: "space-between" }}>
                <Box display="flex" gap={4}>
                    <CustomButton label="Preview" color="secondary" onClick={previewDialog.handleOpen} startIcon="search" />
                    <CustomButton label="Create New Draft" onClick={newDraftDialog.handleOpen} startIcon="file-plus" />
                </Box>
                <Box display="flex" gap={4}>
                    <CustomButton
                        label={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'DEACTIVATE' : 'ACTIVATE'}
                        onClick={activationDialog.handleOpen}
                        startIcon={
                            (workingTemplateVersion?.xstmtvrsIsActive === "true") ? "error" : "wifi"
                        } />
                    <CustomButton
                        label="Archive"
                        color="secondary"
                        onClick={archiveDialog.handleOpen}
                        startIcon="trash" />
                </Box>
            </CardActions>
        </Card >
    )
}


PublishedEditorScreen.propTypes = {
    publisherName: PropTypes.string.isRequired,
    publisherBannerId: PropTypes.string.isRequired,
};

export default PublishedEditorScreen;