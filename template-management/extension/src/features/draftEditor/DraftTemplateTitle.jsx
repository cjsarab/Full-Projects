import React from 'react';
import { Box, Typography } from '@ellucian/react-design-system/core';
import CustomButton from '../../components/Button';

import { useTemplate } from '../../contexts/TemplateContext';
import { useDialog } from '../../contexts/DialogContext';

const DraftTemplateTitle = () => {

    const { selection: { editableTemplate } } = useTemplate();
    const { editTemplateNameDialog } = useDialog();

    const title = editableTemplate?.xstmtmplTemplateTitle || '';

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h3' sx={{ mr: 8 }}>
                {title}
            </Typography>
            <CustomButton label="Edit"
                onClick={editTemplateNameDialog.handleOpen}
                startIcon="edit"
                sx={{ maxHeight: '40px' }}
            />
        </Box>
    );
};

export default DraftTemplateTitle;
