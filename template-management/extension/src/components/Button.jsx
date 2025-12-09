import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@ellucian/ds-icons/lib';

import { Button, CircularProgress } from '@ellucian/react-design-system/core';

const CustomButton = ({ label, color, variant, onClick, startIcon, endIcon, disabled, isLoading, sx = {} }) => {
    return (
        <Button variant={variant} color={color} onClick={onClick}
            // startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : startIcon}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Icon name={startIcon} />}
            endIcon={endIcon ? <Icon name={endIcon} /> : null}
            disabled={disabled || isLoading}
            sx={sx}
        >
            {label}
        </Button >
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
    isLoading: PropTypes.bool,
    sx: PropTypes.object,
};


export default CustomButton;
