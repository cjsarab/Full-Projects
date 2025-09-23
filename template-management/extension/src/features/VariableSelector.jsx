import React from 'react';
import { Box, Divider, List, ListItemButton, ListItemText, Typography, Skeleton } from '@mui/material';


import { useDialog } from '../contexts/DialogContext';
import { useVariable } from '../contexts/VariableContext';

const VariableSelector = () => {

    const { data, selection } = useVariable();

    const LoadingVariablesData = () => {
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
                    <Typography variant="h6">Variables</Typography>
                </Box>

                <Divider />
                {
                    data.isLoading && (
                        <LoadingVariablesData />
                    )
                }
                <List sx={{ mt: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
                    {data?.variables?.map((variable) => (
                        <ListItemButton
                            key={variable.id}
                            // selected={selection.selectedTemplate?.id === variable.id}
                            onClick={() => selection.handleSelectVariable(variable)}
                        >
                            <ListItemText primary={variable.xstmvrblVariableLabel} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </>
    );
};


export default VariableSelector;