### About

This extension uses several Data Connect serverless API pipelines to interact with the custom tables.  
Ensure you are familiar with Data Connect and the Experience SDK.

Official documentation: https://resources.elluciancloud.com/bundle/ethos_data_connect/page/c_dc_designer_serverless_apis.html

Ensure Ethos access to the necessary resources
Follow the [Ethos Guide](https://github.com/ellucian-developer/experience-ethos-examples/blob/main/emergency-contacts/docs/ethos-guide.md) to ensure the needed resources are available and you have an API Key that can be used to access them.

### Pipelines
The package and pipelines have been named with a UWS prefix because in Ellucian world all packages and pipelines must be unique across all customers. If you are using these pipelines in your institution, please rename the prefix to something unique to your institution. You will need to update the pipeline names the pipeline-config.js file.

- **Package:** UWS-TEMPLATE-MANAGEMENT
  - **Pipeline:** UWS-GET-TEMPLATES
  - **Pipeline:** UWS-GET-TEMPLATE-VERSIONS
  - **Pipeline:** UWS-CREATE-NEW-TEMPLATE
  - **Pipeline:** UWS-CREATE-NEW-DRAFT
  - **Pipeline:** UWS-SAVE-DRAFT
  - **Pipeline:** UWS-PUBLISH-DRAFT
  - **Pipeline:** UWS-DELETE-DRAFT
  - **Pipeline:** UWS-ACTIVATE-TEMPLATE
  - **Pipeline:** UWS-DEACTIVATE-TEMPLATE
  - **Pipeline:** UWS-GET-AUTHOR-METADATA
  - **Pipeline:** UWS-CREATE-PREVIEW
  - **Pipeline:** UWS-GET-VARIABLES
  - **Pipeline:** UWS-GET-ACTIVE-TEMPLATES
  - **Pipeline:** UWS-DOWNLOAD-LETTER
  - **Pipeline:** UWS-ARCHIVE-TEMPLATE-VERSION

  ### Adding new variables
  New variables can be added by posting the variable to the end point as detailed in the custom-table-extensions readme. Two pipelines must then be updated:
    - **Pipeline:** UWS-CREATE-PREVIEW
    - **Pipeline:** UWS-DOWNLOAD-LETTER

**_NOTE:_**
    Since this extension was developed in Europe we use the BPAPI eu-system-parameter-maintenance to determine the current term code and therefore the correct academic-period. If you have a different method of obtaining the correct academic-period you will need to change some of the fittings in these two pipelines. Other variable extractions may also be specific to UWS; for example we store FT/PT status as an attribute and so the logic gets it from there.
