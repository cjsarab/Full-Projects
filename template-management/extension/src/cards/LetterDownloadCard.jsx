import React, { useState } from 'react';
import { DataQueryProvider, useDataQuery, userTokenDataConnectQuery } from '@ellucian/experience-extension-extras';
import { Typography, List, ListItem, ListItemIcon, CircularProgress, Box, IconButton, ListItemText } from '@ellucian/react-design-system/core';
import { Download, Icon } from '@ellucian/ds-icons/lib';
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';
import { postPayloadToEthosPipeline } from '../services';
import { handlePdfGeneration } from '../helpers';
import { pipelines } from '../pipeline-config';


function LetterDownloadCard() {
    const { data, dataError, isLoading } = useDataQuery({ resource: pipelines.getActiveTemplates });

    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();

    const [downloadingTemplates, setDownloadingTemplates] = useState(new Set());

    const getTemplateId = (template) => {
        return template.xstmtvrsTemplateId
    };

    const handleDownloadClicked = async (template) => {

        const templateId = getTemplateId(template)
        setDownloadingTemplates(prev => new Set([...prev, templateId]));

        const templateVersionId = template?.xstmtvrsVersId

        try {
            const res = await postPayloadToEthosPipeline({
                templateVersionId
            },
                authenticatedEthosFetch,
                `${pipelines.downloadLetter}?cardId=${cardId}&cardPrefix=${cardPrefix}`
            );
            handlePdfGeneration(res, template)
        } catch (error) {
            console.error('Error downloading the document:', error);
        } finally {
            setDownloadingTemplates(prev => {
                const newSet = new Set(prev);
                newSet.delete(templateId);
                return newSet;
            });
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (dataError) {
        return (
            <Box textAlign="center">
                <Typography color="error">Error loading templates. Please try again later.</Typography>
            </Box>
        );
    }

    return (
        <Box p={4}>
            {data && data.length > 0 ? (
                <List>
                    {data.map((template) => {
                        const templateId = getTemplateId(template);
                        const isDownloading = downloadingTemplates.has(templateId);

                        return (
                            <ListItem key={templateId}>
                                <ListItemIcon>
                                    <Icon
                                        name="file-text"
                                        large
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={template.__templateDetails[0]?.xstmtmplTemplateTitle}
                                />
                                <IconButton color="primary"
                                    onClick={() => handleDownloadClicked(template)}
                                    disabled={isDownloading}
                                >
                                    {isDownloading ? <CircularProgress size={20} /> : <Download />}
                                </IconButton>
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                <Typography>No templates available.</Typography>
            )}
        </Box>
    );
}

function LetterDownloadCardWithProvider() {
    const options = {
        queryFunction: userTokenDataConnectQuery,
        resource: pipelines.getActiveTemplates,
        queryParameters: {
            accept: 'application/json'
        }
    };

    return (
        <DataQueryProvider options={options}>
            <LetterDownloadCard />
        </DataQueryProvider>
    );
}

export default LetterDownloadCardWithProvider;