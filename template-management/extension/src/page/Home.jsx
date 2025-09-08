import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Alert, Typography } from '@mui/material';
import TemplateEditor from '../features/TemplateEditor';
import TemplatePreview from '../features/TemplatePreview';
import TemplateSelector from '../features/TemplateSelector';
import { ActivationDialog, ArchiveDialog, DeleteDialog, NewDraftDialog, NewTemplateDialog, PreviewDialog } from '../components/dialogs';
import CustomSnackbar from '../components/Snackbar';

import { useDialog } from '../contexts/DialogContext';
import { useTemplate } from '../contexts/TemplateContext';

const HomePage = () => {

    const { deleteDialog, activationDialog, previewDialog } = useDialog();
    const { templatesDataError } = useTemplate();

    return (
        <>
            {templatesDataError && (
                <Alert severity="error" variant="outlined" sx={{ ml: 8, mr: 8 }}>
                    <Typography variant="body1"><strong>Status Code:</strong> {templatesDataError?.statusCode || "N/A"}</Typography>
                    <Typography variant="body1"><strong>Message:</strong> {templatesDataError?.message || "Unknown error"}</Typography>
                </Alert>
            )}
            <CustomSnackbar
                message={deleteDialog.snackbarMessage}
                onClose={() => deleteDialog.setSnackbarMessage('')}
            />
            <CustomSnackbar
                message={activationDialog.snackbarMessage}
                onClose={() => activationDialog.setSnackbarMessage('')}
            />

            <Grid container sx={{ p: 8, pt: 2 }} >
                <Grid item md={3} sx={{ overflowY: 'auto', border: '1px solid #ccc', p: 2 }}>
                    <TemplateSelector />
                </Grid>

                <Grid item md={9} container direction="column" >
                    <Grid item sx={{ border: '1px solid #ccc', borderLeft: 'none', p: 2 }}>
                        {previewDialog.isInPreviewMode ? (
                            <TemplatePreview />
                        ) : (
                            <TemplateEditor />
                        )}
                    </Grid>
                </Grid>

                {/* <Grid item xs={2} sx={{ overflowY: 'auto', border: '1px solid #ccc', p: 2 }}>
                    <VariableSelector />
                </Grid> */}
            </Grid >
            <PreviewDialog />
            <NewTemplateDialog />
            <DeleteDialog />
            <NewDraftDialog />
            <ActivationDialog />
            <ArchiveDialog />
        </>
    );
};

HomePage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default HomePage;