import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DataQueryProvider, userTokenDataConnectQuery, useDataQuery } from '@ellucian/experience-extension-extras';

import { useCardInfo, useData, usePageControl } from '@ellucian/experience-extension-utils';
import { getFromEthosPipeline } from '../services';

import { useDialog } from './DialogContext';

import { pipelines } from '../pipeline-config';


const TemplateContext = createContext();

export const useTemplate = () => {
    const context = useContext(TemplateContext);
    if (!context) {
        throw new Error('useTemplate must be used within TemplateProvider')
    }
    return context;
};

const TemplateProviderInner = ({ children }) => {

    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();
    const { setLoadingStatus } = usePageControl();
    const { previewDialog: { setIsInPreviewMode } } = useDialog();

    const useTemplateSelectionState = () => {
        const [selectedTemplate, setSelectedTemplate] = useState(null);
        const [selectedTemplateVersions, setSelectedTemplateVersions] = useState([]);
        const [workingTemplateVersion, setWorkingTemplateVersion] = useState(null);
        const [editableTemplate, setEditableTemplate] = useState(null);
        const [previewTemplate, setPreviewTemplate] = useState(null);

        const handleSelectTemplate = async (template) => {
            if (template === null) {
                setIsInPreviewMode(false)
                setLoadingStatus(false)
                setSelectedTemplate(null)
                return
            }
            setIsInPreviewMode(false)
            setLoadingStatus(true);
            setSelectedTemplate(template);
            const templateId = template?.xstmtmplTemplateId || '';
            try {
                const response = await getFromEthosPipeline(
                    authenticatedEthosFetch,
                    `${pipelines.getTemplateVersions}?xstmtvrsTemplateId=${templateId}&cardId=${cardId}&cardPrefix=${cardPrefix}`
                );
                setSelectedTemplateVersions(response);
                setLoadingStatus(false);
            } catch (error) {
                console.error('Failed to fetch template versions:', error);
                setSelectedTemplateVersions([]);
                setLoadingStatus(false);
            }
        };

        useEffect(() => {
            if (selectedTemplateVersions && selectedTemplateVersions.length > 0) {
                let workingVersion = selectedTemplateVersions.find(v => v.xstmtvrsStatusEnum === 'draft');

                if (!workingVersion) {
                    // Try to find active published version
                    workingVersion = selectedTemplateVersions.find(v => v.xstmtvrsStatusEnum === 'published' && v.xstmtvrsIsActive === "true");
                }

                if (!workingVersion) {
                    // Fallback: highest version number among published
                    workingVersion = selectedTemplateVersions
                        .filter(v => v.xstmtvrsStatusEnum === 'published')
                        .reduce((highest, current) => {
                            return (!highest || current.xstmtvrsVersNumber > highest.xstmtvrsVersNumber)
                                ? current
                                : highest;
                        }, null);
                }

                setWorkingTemplateVersion(workingVersion);
            }
        }, [selectedTemplateVersions, setWorkingTemplateVersion]);

        useEffect(() => {
            if (selectedTemplate) {
                setEditableTemplate({ ...selectedTemplate });
            }
        }, [selectedTemplate])

        return {
            selectedTemplate,
            setSelectedTemplate,
            selectedTemplateVersions,
            setSelectedTemplateVersions,
            workingTemplateVersion,
            setWorkingTemplateVersion,
            handleSelectTemplate,
            editableTemplate,
            setEditableTemplate,
            previewTemplate,
            setPreviewTemplate
        }
    }

    const useTemplateDataState = () => {
        const {
            data,
            dataError,
            isLoading,
            isRefreshing,
            refresh,
        } = useDataQuery({ resource: pipelines.getTemplates });

        return {
            templates: data || [],
            dataError,
            isLoading,
            isRefreshing,
            refresh
        };
    }

    const selection = useTemplateSelectionState()
    const data = useTemplateDataState()

    return (
        <TemplateContext.Provider value={{
            selection,
            data
        }}>
            {children}
        </TemplateContext.Provider>
    );
};

export const TemplateProvider = ({ children }) => {
    const options = {
        resource: pipelines.getTemplates,
        queryFunction: userTokenDataConnectQuery,
        queryParameters: {
            accept: 'application/json'
        }
    };

    return (
        <DataQueryProvider options={options}>
            <TemplateProviderInner>
                {children}
            </TemplateProviderInner>
        </DataQueryProvider>
    );
};

TemplateProvider.propTypes = {
    children: PropTypes.node.isRequired
};

TemplateProviderInner.propTypes = {
    children: PropTypes.node.isRequired
};
