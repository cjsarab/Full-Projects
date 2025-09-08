import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { Typography, Button } from '@ellucian/react-design-system/core';
import { FileEdit } from '@ellucian/ds-icons/lib';

const styles = () => ({
    card: {
        marginTop: 0,
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40,
        cursor: 'default'
    }
});

const SupportNeedsByCrnCard = (props) => {
    const { classes, cardControl: { navigateToPage } } = props;

    return (
        <div className={classes.card}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>
                    <FileEdit />
                </div>
                <Typography variant="body1" gutterBottom>
                    Create, edit and maintain templates.
                </Typography>
                <Button style={{ marginTop: '1rem' }} onClick={navigateToPage}>Begin</Button>
            </div>
        </div>
    );
};

SupportNeedsByCrnCard.propTypes = {
    classes: PropTypes.object.isRequired,
    cardControl: PropTypes.object.isRequired,
};

export default withStyles(styles)(SupportNeedsByCrnCard);