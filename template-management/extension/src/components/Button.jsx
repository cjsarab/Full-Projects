import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { CircularProgress } from '@ellucian/react-design-system/core';

const CustomButton = ({ label, color, variant, onClick, startIcon, endIcon, disabled, isLoading }) => {
    return (
        <Button variant={variant} color={color} onClick={onClick}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : startIcon}
            endIcon={!isLoading ? endIcon : null}
            disabled={disabled || isLoading}
        >
            {label}
        </Button>
    );
}

CustomButton.propTypes = {
    label: PropTypes.string.isRequired,
    color: PropTypes.string,
    variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
    onClick: PropTypes.func.isRequired,
    startIcon: PropTypes.node,
    endIcon: PropTypes.node,
    disabled: PropTypes.bool,
    isLoading: PropTypes.bool
};


export default CustomButton;
