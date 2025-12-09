import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@ellucian/react-design-system/core';

const CustomSnackbar = ({ message, onClose, snackbarType }) => {
    return (
        <Snackbar
            open={!!message}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            variant={snackbarType}
            message={message}
        />
    );
};

CustomSnackbar.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    snackbarType: PropTypes.string.isRequired
};


export default CustomSnackbar;
