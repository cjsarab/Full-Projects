import React from 'react';
import { Typography } from '@ellucian/react-design-system/core';

import { useTemplate } from '../../contexts/TemplateContext';

const DraftTemplateDescription = () => {

    const { selection: { editableTemplate } } = useTemplate();

    const description = editableTemplate?.xstmtmplTemplateDescription || '';

    return (
        <Typography variant='body2' sx={{ mr: 8 }}>
            {description}
        </Typography>
    );
};

export default DraftTemplateDescription;
