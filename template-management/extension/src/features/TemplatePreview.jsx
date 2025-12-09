import React, { useState } from 'react';
import { RichTextRenderer, Card, CardHeader, CardContent, Box, Typography, Divider, Tooltip, IconButton } from '@ellucian/react-design-system/core';
import { Icon } from '@ellucian/ds-icons/lib';

import CustomButton from '../components/Button';

import { useTemplate } from "../contexts/TemplateContext";
import { useDialog } from "../contexts/DialogContext";
import { handlePdfGeneration } from '../helpers';


const TemplatePreview = () => {

    const { selection: { previewTemplate } } = useTemplate();
    const { previewDialog: dialog } = useDialog();

    const [setIsDownloading] = useState(false);

    const html = previewTemplate.__renderedHtml;
    const title = previewTemplate.__selectedTemplateTitle;
    const characterCount = html ? html.length : 0;

    const handleDownloadClicked = async () => {
        setIsDownloading(true)
        await handlePdfGeneration(html, previewTemplate)
        setIsDownloading(false)
    }

    return (
        <Card accent="secondary">
            <CardHeader
                avatar={<CustomButton label="Return" color="secondary"
                    onClick={() => dialog.setIsInPreviewMode(false)}
                    startIcon="arrow-left"
                />}
                title={<Typography textAlign='center' variant='h3'>Template Title: {title}</Typography>}
                subheader={<Typography variant="body2" textAlign='center'>Character count: {characterCount}/32000</Typography>}
                action={<Tooltip title="Download Template">
                    <IconButton
                        color="secondary"
                        onClick={() => handleDownloadClicked()}
                    ><Icon name="download" /></IconButton>
                </Tooltip>}
            />
            <CardContent>
                <Divider />
                <Box sx={{ overflowY: 'auto', maxHeight: '100%' }}>
                    <RichTextRenderer content={html} />
                </Box>
            </CardContent>
        </Card>
        // <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
        //     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        // <CustomButton label="Return" color="secondary"
        //     onClick={() => dialog.setIsInPreviewMode(false)}
        //     startIcon="arrow-left"
        // />
        // <Typography textAlign='center' variant='h6'>Template: {title}</Typography>
        //         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        // <Typography variant="body2">Character count: {characterCount}/32000</Typography>
        // <CustomButton label="Download"
        //     isLoading={isDownloading}
        //     disabled={isDownloading}
        //     onClick={() => handleDownloadClicked()}
        //     startIcon="download"
        //     sx={{ ml: 2 }}
        // />
        //         </Box>
        //     </Box>
        //     <Divider />
        // <Box sx={{ overflowY: 'auto', maxHeight: '100%' }}>
        //     <RichTextRenderer content={html} />
        // </Box>
        // </Box>
    );
}

export default TemplatePreview;
