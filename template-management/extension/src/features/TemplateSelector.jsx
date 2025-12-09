import React from 'react';
import { Box, IconButton, Skeleton, List, ListItemButton, ListItemText, ListItemIcon, Card, CardContent, CardHeader, Tooltip } from '@ellucian/react-design-system/core';
import { Icon } from '@ellucian/ds-icons/lib';


import { useTemplate } from '../contexts/TemplateContext';
import { useDialog } from '../contexts/DialogContext';

const TemplateSelector = () => {

    const { newTemplateDialog } = useDialog();
    const { selection, data } = useTemplate();

    const LoadingTemplatesData = () => {
        return (
            <>
                <Skeleton rectangle={{ width: "100%", height: "48px" }} />
                <br />
                <Skeleton rectangle={{ width: "100%", height: "48px" }} />
                <br />
                <Skeleton rectangle={{ width: "100%", height: "48px" }} />
                <br />
            </>
        )
    }

    return (
        <>
            <Card accent='secondary' raised={false}>
                <CardHeader
                    title="Templates"
                    action={
                        <Tooltip title="New Template">
                            <IconButton
                                color="secondary"
                                onClick={() => newTemplateDialog.handleOpen()}
                            ><Icon name="add" /></IconButton>
                        </Tooltip>
                    }
                />
                <CardContent>
                    {
                        data.isLoading && data.templates.length < 1 && (
                            <LoadingTemplatesData />
                        )
                    }
                    <Box display="flex" flexDirection="column" gap={4}>
                        <List>
                            {data.templates.map((template, index) => {
                                return (
                                    <ListItemButton onClick={() => { selection.handleSelectTemplate(template) }} key={index}>
                                        <ListItemIcon> <Icon name="file-text" /></ListItemIcon>
                                        <ListItemText primary={template?.xstmtmplTemplateTitle} />
                                    </ListItemButton>

                                )
                            })
                            }
                        </List>
                    </Box>
                </CardContent>
            </Card>

        </>
    );
};


export default TemplateSelector;