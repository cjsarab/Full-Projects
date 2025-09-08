import React, { useState } from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { useTemplate } from '../../contexts/TemplateContext';

const
    DraftTemplateTitle = () => {

        const { selection: { editableTemplate, setEditableTemplate } } = useTemplate();
        const [isEditing, setIsEditing] = useState(false);

        const handleSave = () => {
            setIsEditing(false);
        };

        const handleEdit = () => {
            setIsEditing(true);
        };
        const maxLength = 30

        const handleChange = (e) => {
            setEditableTemplate({
                ...editableTemplate,
                xstmtmplTemplateTitle: e.target.value,
            });
        };

        const title = editableTemplate?.xstmtmplTemplateTitle || '';

        return (
            <Box mb={2} sx={{ maxWidth: 400 }}>
                <TextField label="Template Title" placeholder="Enter template title" variant="outlined"
                    value={title}
                    // onChange={(e) => onTitleChange(e.target.value)}
                    onChange={handleChange}
                    fullWidth
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
                        {title.length}/{maxLength} characters
                    </Box>
                )}
            </Box>
        );
    };

export default DraftTemplateTitle;
