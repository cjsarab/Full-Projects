import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar, Alert } from '@mui/material';

const CustomSnackbar = ({ message, onClose, severity }) => {
    return (
        <Snackbar
            open={!!message}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            severity={severity}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};

CustomSnackbar.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired
};


export default CustomSnackbar;
