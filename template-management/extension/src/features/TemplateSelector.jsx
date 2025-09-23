import React from 'react';
import { Skeleton } from '@mui/material';
import { Box, Divider, List, ListItemButton, ListItem, ListItemIcon, ListItemText, Typography } from '@ellucian/react-design-system/core';
import AddIcon from '@mui/icons-material/Add';
import { Icon } from '@ellucian/ds-icons/lib';
import CustomButton from '../components/Button';


import { useTemplate } from '../contexts/TemplateContext';
import { useDialog } from '../contexts/DialogContext';

const TemplateSelector = () => {

    const { newTemplateDialog } = useDialog();
    const { selection, data } = useTemplate();

    const LoadingTemplatesData = () => {
        return (
            <>
                <List sx={{ mt: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
                    {[...Array(5)].map((_, index) => (
                        <ListItemButton key={index}>
                            <Skeleton variant="text" animation="wave" width="100%" height={40} />
                        </ListItemButton>
                    ))}
                </List>
            </>
        )
    }

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h3">Templates</Typography>
                    <CustomButton label="New" color='info' variant="outlined"
                        onClick={() => newTemplateDialog.handleOpen()}
                        startIcon={<AddIcon />}
                    />
                </Box>

                <Divider />
                {
                    data.isLoading && (
                        <LoadingTemplatesData />
                    )
                }
                <List sx={{ mt: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
                    {data.templates.map((template) => (
                        <ListItem key={template.id}>
                            <ListItemIcon>
                                <Icon name="file-text" large />
                            </ListItemIcon>
                            <ListItemButton
                                selected={selection.selectedTemplate?.id === template.id}
                                onClick={() => selection.handleSelectTemplate(template)}
                            >

                                <ListItemText primary={template.xstmtmplTemplateTitle} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </>
    );
};


export default TemplateSelector;