import React, { useState } from 'react';
import { RichTextRenderer } from '@ellucian/react-design-system/core';
import { Box, Typography, Divider } from '@mui/material';
import CustomButton from '../components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTemplate } from "../contexts/TemplateContext";
import { useDialog } from "../contexts/DialogContext";
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { handlePdfGeneration } from '../helpers';


const TemplatePreview = () => {

    const { selection: { previewTemplate } } = useTemplate();
    const { previewDialog: dialog } = useDialog();

    const [isDownloading, setIsDownloading] = useState(false);

    const html = previewTemplate.__renderedHtml;
    const title = previewTemplate.__selectedTemplateTitle;
    const characterCount = html ? html.length : 0;

    const handleDownloadClicked = async () => {
        setIsDownloading(true)
        await handlePdfGeneration(html, previewTemplate)
        setIsDownloading(false)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #ccc', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <CustomButton label="Return" color="error" variant="contained"
                    onClick={() => dialog.setIsInPreviewMode(false)}
                    startIcon={<ArrowBackIcon />}
                />
                <Typography textAlign='center' variant='h6'>Template: {title}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">Character count: {characterCount}/32000</Typography>
                    <CustomButton label="Download" color="info" variant="contained"
                        isLoading={isDownloading}
                        disabled={isDownloading}
                        onClick={() => handleDownloadClicked()}
                        endIcon={<CloudDownloadOutlinedIcon />}
                        sx={{ ml: 2 }}
                    />
                </Box>
            </Box>
            <Divider />
            <Box sx={{ overflowY: 'auto', maxHeight: '100%' }}>
                <RichTextRenderer content={html} />
            </Box>
        </Box>
    );
}

export default TemplatePreview;
