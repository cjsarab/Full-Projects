import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { DataQueryProvider, userTokenDataConnectQuery, useDataQuery } from '@ellucian/experience-extension-extras';

import { pipelines } from '../pipeline-config';


const VariableContext = createContext();

export const useVariable = () => {
    const context = useContext(VariableContext);
    if (!context) {
        throw new Error('useVariable must be used within VariableProvider');
    }
    return context;
};

const VariableProviderInner = ({ children }) => {

    const useVariableData = () => {
        const {
            data,
            dataError,
            isLoading,
            isRefreshing,
            refresh,
        } = useDataQuery({ resource: pipelines.getVariables });

        return {
            variables: data || [],
            dataError,
            isLoading,
            isRefreshing,
            refresh
        };
    }

    const data = useVariableData()

    return (
        <VariableContext.Provider value={{ data }}>
            {children}
        </VariableContext.Provider>
    );
};

export const VariableProvider = ({ children }) => {
    const options = {
        resource: pipelines.getVariables,
        queryFunction: userTokenDataConnectQuery,
        queryParameters: {
            accept: 'application/json'
        }
    };

    return (
        <DataQueryProvider options={options}>
            <VariableProviderInner>
                {children}
            </VariableProviderInner>
        </DataQueryProvider>
    );
};

VariableProvider.propTypes = {
    children: PropTypes.node.isRequired
};

VariableProviderInner.propTypes = {
    children: PropTypes.node.isRequired
};
