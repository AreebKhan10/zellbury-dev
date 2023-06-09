/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { Provider as UnstatedProvider } from 'unstated';

import Router from 'Component/Router';
import SharedTransition from 'Component/SharedTransition';
import SomethingWentWrong from 'Route/SomethingWentWrong';
import configureStore from 'Store';

export class App extends PureComponent {
    productionFunctions = [
        this.disableReactDevTools.bind(this),
        this.injectComment.bind(this)
    ];

    developmentFunctions = [
        this.enableHotReload.bind(this)
    ];

    rootComponents = [
        this.renderRouter.bind(this),
        this.renderSharedTransition.bind(this)
    ];

    contextProviders = [
        this.renderRedux.bind(this),
        this.renderUnStated.bind(this)
    ];

    state = {
        isSomethingWentWrong: false,
        errorDetails: {}
    };

    constructor(props) {
        super(props);

        this.configureAppBasedOnEnvironment();
    }

    componentDidCatch(err, info) {
        this.setState({
            isSomethingWentWrong: true,
            errorDetails: { err, info }
        });
    }

    renderRedux(children) {
        return (
            <Provider store={ configureStore() } key="redux">
                { children }
            </Provider>
        );
    }

    renderUnStated(children) {
        return (
            <UnstatedProvider key="unstated">
                { children }
            </UnstatedProvider>
        );
    }

    enableHotReload() {
        if (module.hot) {
            module.hot.accept();
        }
    }

    injectComment() {
        const comment = document.createComment('Powered by ScandiPWA (scandipwa.com)');
        document.querySelector('html').appendChild(comment);
    }

    /**
     * Disable react-dev-tools
     * @link https://github.com/facebook/react-devtools/issues/191#issuecomment-367905536
     */
    disableReactDevTools() {
        if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
            // eslint-disable-next-line no-restricted-syntax, fp/no-loops
            for (const [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
                window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] = typeof value === 'function' ? () => {} : null;
            }
        }
    }

    configureAppBasedOnEnvironment() {
        const functionsToRun = process.env.NODE_ENV === 'production'
            ? this.productionFunctions
            : this.developmentFunctions;

        functionsToRun.forEach((func) => func());
    }

    handleErrorReset = () => {
        this.setState({ isSomethingWentWrong: false });
    };

    renderSharedTransition() {
        return (
            <SharedTransition key="transition" />
        );
    }

    renderRouter() {
        return (
            <Router key="router" />
        );
    }

    renderRootComponents = () => this.rootComponents.map((render) => render());

    renderContextProviders() {
        const { isSomethingWentWrong } = this.state;

        const child = isSomethingWentWrong
            ? this.renderSomethingWentWrong
            : this.renderRootComponents;

        return this.contextProviders.reduce(
            (acc, render) => render(acc),
            [child()]
        );
    }

    renderSomethingWentWrong = () => {
        const { errorDetails } = this.state;

        return (
            <SomethingWentWrong
              onClick={ this.handleErrorReset }
              errorDetails={ errorDetails }
            />
        );
    };

    // componentDidMount() {
    //     console.log('links if condition');
    //     const link = document.createElement("link");
    //     link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
    //     link.rel = "stylesheet";
    //     document.head.appendChild(link);

    //     console.log('script if condition');
    //     const script = document.createElement("script");
    //     script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
    //     script.defer = true;
    //     document.body.appendChild(script);
    // }

    render() {
        return this.renderContextProviders();
    }
}

export default App;
