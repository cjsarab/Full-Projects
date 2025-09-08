import React, { useState } from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { useTemplate } from '../../contexts/TemplateContext';



const DraftTemplateDescription = () => {
    const [isEditing, setIsEditing] = useState(false);

    const { selection: { editableTemplate, setEditableTemplate } } = useTemplate();

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };
    const maxLength = 200

    const handleChange = (e) => {
        setEditableTemplate({
            ...editableTemplate,
            xstmtmplTemplateDescription: e.target.value,
        });
    };

    const description = editableTemplate?.xstmtmplTemplateDescription || '';

    return (
        <Box mb={2} sx={{ maxWidth: 400 }}>
            <TextField
                label="Template Description"
                value={description}
                onChange={handleChange}
                placeholder="Enter description..."
                variant="outlined"
                fullWidth
                multiline
                maxRows={4}
                disabled={!isEditing}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={isEditing ? handleSave : handleEdit}>
                                {isEditing ? <SaveOutlinedIcon /> : <EditOutlinedIcon />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                inputProps={{
                    maxLength: maxLength
                }}
            />
            {isEditing && (
                <Box
                    sx={{
                        textAlign: 'right',
                        fontSize: '0.85rem',
                        color: 'text.secondary',
                        mt: 0.85
                    }}
                >
                    {description.length}/{maxLength} characters
                </Box>
            )}
        </Box>
    );
};

export default DraftTemplateDescription;
