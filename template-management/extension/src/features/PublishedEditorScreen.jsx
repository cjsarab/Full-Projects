import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { RichTextEditor, Box, Typography, StatusLabel } from '@ellucian/react-design-system/core';
import { Grid, FormControl, Select, MenuItem, Tooltip } from '@mui/material';

import CustomButton from '../components/Button';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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
        <Grid container spacing={2} sx={{ height: '85vh' }}>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box p={2}>
                    <Grid container spacing={2} alignItems="flex-start">
                        <Grid item xs={2}>
                            <Typography variant="h4" gutterBottom>
                                {editableTemplate?.xstmtmplTemplateTitle || 'Untitled Template'}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
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
                        </Grid>
                        <Grid item xs={2}>
                            <Box display="flex" flexDirection="column" gap={4} alignItems="center">
                                <StatusLabel text={workingTemplateVersion?.xstmtvrsStatusEnum} type="success"
                                    sx={{ minWidth: 120, textAlign: 'center' }}

                                />
                                <StatusLabel
                                    text={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'ACTIVE' : 'not active'}
                                    type={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'success' : 'error'}
                                    sx={{ minWidth: 120, textAlign: 'center' }}

                                />
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
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
                        </Grid>
                        <Grid item xs={3}>
                            <Box display="flex" flexDirection="column" gap={1}>
                                {
                                    draftVersion && (
                                        <CustomButton label="View Draft" color="info" variant="outlined" onClick={handleClickedViewDraftVersion} endIcon={<VisibilityOutlinedIcon />} />
                                    )
                                }
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={workingTemplateVersion?.xstmtvrsVersNumber || ''}
                                        onChange={(e) => {
                                            const selectedVersion = selectedTemplateVersions.find(
                                                v => v.xstmtvrsVersNumber === e.target.value
                                            );
                                            setWorkingTemplateVersion(selectedVersion);
                                        }}
                                    >
                                        {selectedTemplateVersions
                                            .filter(version => version.xstmtvrsStatusEnum !== 'draft')
                                            .map((version) => (
                                                <MenuItem key={version.xstmtvrsVersNumber} value={version.xstmtvrsVersNumber}>
                                                    Version {version.xstmtvrsVersNumber}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <RichTextEditor
                        value={editorValue}
                        readOnly
                        toolbar={[]}
                    />
                </Box>
                <Box pt={8} display="flex" justifyContent="space-between">
                    <Box display="flex" gap={4}>
                        <CustomButton label="Preview" color="info" variant="contained" onClick={previewDialog.handleOpen} endIcon={<SearchOutlinedIcon />} />
                        <CustomButton label="Create New Draft" color="info" variant="outlined" onClick={newDraftDialog.handleOpen} endIcon={<NoteAddOutlinedIcon />} />
                    </Box>
                    <Box display="flex" gap={4}>
                        <CustomButton
                            label={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'DEACTIVATE' : 'ACTIVATE'}
                            color={(workingTemplateVersion?.xstmtvrsIsActive === "true") ? 'error' : 'success'}
                            variant="outlined"
                            onClick={activationDialog.handleOpen}
                            endIcon={
                                (workingTemplateVersion?.xstmtvrsIsActive === "true") ? <BlockOutlinedIcon /> : <CheckOutlinedIcon />
                            } />
                        <CustomButton
                            label="Archive"
                            color="error"
                            variant="contained"
                            onClick={archiveDialog.handleOpen}
                            endIcon={<DeleteOutlineIcon />} />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}


PublishedEditorScreen.propTypes = {
    publisherName: PropTypes.string.isRequired,
    publisherBannerId: PropTypes.string.isRequired,
};

export default PublishedEditorScreen;