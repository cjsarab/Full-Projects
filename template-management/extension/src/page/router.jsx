import React from 'react';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import { DialogProvider } from '../contexts/DialogContext';
import { TemplateProvider } from '../contexts/TemplateContext';
import { VariableProvider } from '../contexts/VariableContext';
import { EditorProvider } from '../contexts/EditorContext';

import Home from './Home';

// for more information on react router: https://v5.reactrouter.com/web/guides/quick-start

const RouterPage = (props) => {
    return (
        <DialogProvider>
            <TemplateProvider >
                <VariableProvider>
                    <EditorProvider>
                        <Router basename={props.pageInfo.basePath}>
                            <Switch>
                                <Route path='/'>
                                    <Home {...props} />
                                </Route>
                            </Switch>
                        </Router>
                    </EditorProvider>
                </VariableProvider>
            </TemplateProvider>
        </DialogProvider>
    );
};

RouterPage.propTypes = {
    pageInfo: PropTypes.object
};

export default RouterPage;