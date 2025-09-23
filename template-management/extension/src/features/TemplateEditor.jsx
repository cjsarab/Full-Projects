import React, { useState, useEffect } from 'react';
import { Typography } from '@ellucian/react-design-system/core';

import { postPayloadToEthosPipeline } from '../services';
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';

import DraftEditorScreen from './draftEditor/DraftEditorScreen';
import PublishedEditorScreen from './PublishedEditorScreen'

import { useTemplate } from '../contexts/TemplateContext';

import { pipelines } from '../pipeline-config';

const TemplateEditor = () => {

    const [publisherName, setPublisherName] = useState('');
    const [publisherBannerId, setPublisherBannerId] = useState('');
    const [creatorName, setCreatorName] = useState('');
    const [creatorBannerId, setCreatorBannerId] = useState('');

    const { authenticatedEthosFetch } = useData();
    const { cardId, cardPrefix } = useCardInfo();

    const { selection: { workingTemplateVersion } } = useTemplate();

    useEffect(() => {
        const fetchAuthorMetadata = async () => {
            const creatorId = workingTemplateVersion?.xstmtvrsCreatedBy || '';
            const publisherId = workingTemplateVersion?.xstmtvrsPublishedBy || '';
            const archiverId = workingTemplateVersion?.xstmtvrsArchivedBy || '';

            try {
                const result = await postPayloadToEthosPipeline({
                    "xstmtvrsCreatedBy": creatorId,
                    "xstmtvrsPublishedBy": publisherId || "",
                    "xstmtvrsArchivedBy": archiverId || ""
                },
                    authenticatedEthosFetch,
                    `${pipelines.getAuthorMetadata}?cardId=${cardId}&cardPrefix=${cardPrefix}`);
                setCreatorName(result?.__createdBy?.fullName);
                setCreatorBannerId(result?.__createdBy?.bannerId);
                setPublisherName(result?.__publishedBy?.fullName);
                setPublisherBannerId(result?.__publishedBy?.bannerId);

            } catch (err) {
                console.error('Failed to fetch publisher:', err);
                setPublisherName('Unknown');
            }
        };

        fetchAuthorMetadata();
    }, [workingTemplateVersion, authenticatedEthosFetch, cardId, cardPrefix]);

    return (
        <>
            {workingTemplateVersion ? (
                workingTemplateVersion.xstmtvrsStatusEnum === 'draft' ? (
                    <DraftEditorScreen
                        creatorName={creatorName}
                        creatorBannerId={creatorBannerId}
                    />
                ) : workingTemplateVersion.xstmtvrsStatusEnum === 'published' ? (
                    <PublishedEditorScreen
                        publisherName={publisherName}
                        publisherBannerId={publisherBannerId}
                    />
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        Unsupported template status: {workingTemplateVersion.xstmtvrsStatusEnum}
                    </Typography>
                )
            ) : (
                <Typography variant="body1" color="text.secondary">
                    Select a template to begin editing.
                </Typography>
            )}
        </>

    )

}

export default TemplateEditor;
