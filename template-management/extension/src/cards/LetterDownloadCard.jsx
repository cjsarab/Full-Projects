import React, { useState } from 'react';
import { DataQueryProvider, useDataQuery, userTokenDataConnectQuery } from '@ellucian/experience-extension-extras';
import { Typography, Card, CardContent, List, ListItem, CircularProgress, Box } from '@mui/material';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { postPayloadToEthosPipeline } from '../services';
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';
import { handlePdfGeneration } from '../helpers';
import IconButton from '@mui/material/IconButton';


function LetterDownloadCard() {
    const {
        data,
        dataError,
        isLoading,
    } = useDataQuery({ resource: 'UWS-GET-ACTIVE-TEMPLATES' });

    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();

    const [downloadingTemplates, setDownloadingTemplates] = useState(new Set());

    const getTemplateId = (template) => {
        return template.xstmtvrsTemplateId
    };

    const handleDownloadClicked = async (template) => {

        const templateId = getTemplateId(template)
        setDownloadingTemplates(prev => new Set([...prev, templateId]));

        const templateVersionId = template.xstmtvrsVersId

        try {
            const res = await postPayloadToEthosPipeline({
                templateVersionId
            },
                authenticatedEthosFetch,
                `UWS-DOWNLOAD-LETTER?cardId=${cardId}&cardPrefix=${cardPrefix}`
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

    // return (
    //     <Card variant="outlined">
    //         <CardContent>
    //             <Typography variant="h6" gutterBottom>
    //                 Available Templates
    //             </Typography>
    //             {data && data.length > 0 ? (
    //                 <List>
    //                     {data.map((template, index) => {
    //                         const templateId = getTemplateId(template);
    //                         const isDownloading = downloadingTemplates.has(templateId);

    //                         return (
    //                             <ListItem
    //                                 key={templateId || index}
    //                                 secondaryAction={
    //                                     <CustomButton
    //                                         label=""
    //                                         color="info"
    //                                         variant="contained"
    //                                         isLoading={isDownloading}
    //                                         disabled={isDownloading}
    //                                         onClick={() => handleDownloadClicked(template)}
    //                                         endIcon={<CloudDownloadOutlinedIcon />}
    //                                     />
    //                                 }
    //                             >
    //                                 <ListItemText
    //                                     primary={template.__templateDetails[0]?.xstmtmplTemplateTitle}
    //                                 />
    //                             </ListItem>
    //                         );
    //                     })}
    //                 </List>
    //             ) : (
    //                 <Typography>No templates available.</Typography>
    //             )}
    //         </CardContent>
    //     </Card>
    // );
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Available Templates
                </Typography>
                {data && data.length > 0 ? (
                    <List>
                        {data.map((template, index) => {
                            const templateId = getTemplateId(template);
                            const isDownloading = downloadingTemplates.has(templateId);

                            return (
                                <ListItem key={templateId || index}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <Typography
                                            variant="body1"
                                            sx={{ flexGrow: 1, whiteSpace: 'normal', wordBreak: 'break-word', pr: 2 }}
                                        >
                                            {template.__templateDetails[0]?.xstmtmplTemplateTitle}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleDownloadClicked(template)}
                                        disabled={isDownloading}
                                        sx={{
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            backgroundColor: '#efefef',
                                            width: 40,
                                            height: 40,
                                        }}
                                    >
                                        {isDownloading ? <CircularProgress size={20} /> : <CloudDownloadOutlinedIcon />}
                                    </IconButton>
                                </ListItem>
                            );
                        })}
                    </List>
                ) : (
                    <Typography>No templates available.</Typography>
                )}
            </CardContent>
        </Card>
    );
}

function LetterDownloadCardWithProvider() {
    const options = {
        queryFunction: userTokenDataConnectQuery,
        resource: 'UWS-GET-ACTIVE-TEMPLATES',
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