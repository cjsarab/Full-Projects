import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { Grid } from '@mui/material';
import { Alert, Typography, Grid } from '@ellucian/react-design-system/core';
import TemplateEditor from '../features/TemplateEditor';
import TemplatePreview from '../features/TemplatePreview';
import TemplateSelector from '../features/TemplateSelector';
import { ActivationDialog, ArchiveDialog, DeleteDialog, NewDraftDialog, NewTemplateDialog, PreviewDialog, EditTemplateNameDialog } from '../components/dialogs';
import CustomSnackbar from '../components/Snackbar';

import { useDialog } from '../contexts/DialogContext';
import { useTemplate } from '../contexts/TemplateContext';

const HomePage = () => {

    const { deleteDialog, activationDialog, previewDialog } = useDialog();
    const { data: { dataError: templatesDataError } } = useTemplate();

    const [showError, setShowError] = useState(false);
    useEffect(() => {
        setShowError(!!templatesDataError);
    }, [templatesDataError]);

    return (
        <>
            <CustomSnackbar
                snackbarType={deleteDialog.snackbarType}
                message={deleteDialog.snackbarMessage}
                onClose={() => deleteDialog.setSnackbarMessage('')}
            />
            <CustomSnackbar
                snackbarType={activationDialog.snackbarType}
                message={activationDialog.snackbarMessage}
                onClose={() => activationDialog.setSnackbarMessage('')}
            />

            <Grid container sx={{ p: 8, pt: 2 }} >
                <Alert alertType='error' variant="inline"
                    open={showError}
                    onClose={() => setShowError(false)}
                >
                    <Typography variant="body1"><strong>Status Code:</strong> {templatesDataError?.statusCode || "N/A"}</Typography>
                    <Typography variant="body1"><strong>Message:</strong> {templatesDataError?.message || "Unknown error"}</Typography>
                </Alert>
                <Grid item md={3} sx={{ overflowY: 'auto' }}>
                    <TemplateSelector />
                </Grid>

                <Grid item md={9} container direction="column" >
                    <Grid item sx={{ p: 2 }}>
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
                {/* Had an idea to create a sidebar on the other side with descriptions of variables for user */}
            </Grid >
            <PreviewDialog />
            <NewTemplateDialog />
            <DeleteDialog />
            <NewDraftDialog />
            <ActivationDialog />
            <ArchiveDialog />
            <EditTemplateNameDialog />
        </>
    );
};

HomePage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default HomePage;