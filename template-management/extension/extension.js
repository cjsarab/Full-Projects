module.exports = {
    name: 'template-management',
    publisher: 'UWS',
    cards: [
        {
            type: 'TemplateManagementCard',
            source: './src/cards/TemplateManagementCard',
            title: 'Template Management',
            displayCardType: 'Template Management Card',
            description: 'Allows staff to manage templates for various letters.',
            pageRoute: {
                route: '/',
                excludeClickSelectors: ['*']
            }
        },
        {
            type: 'LetterDownloadCard',
            source: './src/cards/LetterDownloadCard',
            title: 'Letter Download',
            displayCardType: 'Letter Download Card',
            description: 'Allows students to download letters.'
        }
    ],
    configuration: {
        server: [
            {
                key: 'ethosApiKey',
                label: 'Ethos API Key',
                type: 'password',
                require: true
            },
        ],
    },
    page: {
        source: './src/page/router.jsx'
    }
};