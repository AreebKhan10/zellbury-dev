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

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { CUSTOMER_ACCOUNT, CUSTOMER_ACCOUNT_PAGE } from 'Component/Header/Header.config';
import { updateMeta } from 'Store/Meta/Meta.action';
import { isSignedIn } from '../../util/Auth/Token';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import {
    ADDRESS_BOOK,
    DASHBOARD,
    MY_ORDERS,
    MY_WISHLIST,
    NEWSLETTER_SUBSCRIPTION
} from 'Type/Account';
import { HistoryType, LocationType, MatchType } from 'Type/Common';
import isMobile from 'Util/Mobile';

import { TotalsType } from 'Type/MiniCart';
import { STATE_SIGN_IN, STATE_LOGGED_IN } from 'Component/MyAccountOverlay/MyAccountOverlay.config';

import MyAccount from './MyAccount.component';
import { MY_ACCOUNT_URL } from './MyAccount.config';

export const BreadcrumbsDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);
export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals,
    isSignedIn: state.MyAccountReducer.isSignedIn
});

export const mapDispatchToProps = (dispatch) => ({
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    requestCustomerData: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestCustomerData(dispatch)
    ),
    toggleOverlayByKey: (key) => dispatch(toggleOverlayByKey(key)),
    updateMeta: (meta) => dispatch(updateMeta(meta))
});

export class MyAccountContainer extends PureComponent {
    static propTypes = {
        changeHeaderState: PropTypes.func.isRequired,
        requestCustomerData: PropTypes.func.isRequired,
        updateBreadcrumbs: PropTypes.func.isRequired,
        toggleOverlayByKey: PropTypes.func.isRequired,
        updateMeta: PropTypes.func.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        match: MatchType.isRequired,
        location: LocationType.isRequired,
        totals: TotalsType.isRequired,
        history: HistoryType.isRequired
    };

    static navigateToSelectedTab(props, state = {}) {
        const {
            match: {
                params: {
                    tab: historyActiveTab = DASHBOARD
                } = {}
            } = {}
        } = props;

        const { activeTab } = state;

        if (activeTab !== historyActiveTab) {
            return { activeTab: historyActiveTab };
        }

        return null;
    }

    tabMap = {
        [DASHBOARD]: {
            url: '/dashboard',
            name: __('Dashboard')
        },
        [ADDRESS_BOOK]: {
            url: '/address-book',
            name: __('Address book')
        },
        [MY_ORDERS]: {
            url: '/my-orders',
            name: __('My orders')
        },
        [MY_WISHLIST]: {
            url: '/my-wishlist',
            name: __('My wishlist')
        },
        [NEWSLETTER_SUBSCRIPTION]: {
            url: '/newsletter-subscription',
            name: __('Newsletter Subscription')
        }
    };

    containerFunctions = {
        changeActiveTab: this.changeActiveTab.bind(this),
        onSignIn: this.onSignIn.bind(this),
        onSignOut: this.onSignOut.bind(this)
    };

    constructor(props) {
        super(props);

        const {
            isSignedIn,
            updateMeta,
            toggleOverlayByKey
        } = this.props;

        this.state = MyAccountContainer.navigateToSelectedTab(this.props) || {};

        this.setState(
            { loginState: isSignedIn ? STATE_LOGGED_IN : STATE_SIGN_IN }
        );

        if (!isSignedIn) {
            toggleOverlayByKey(CUSTOMER_ACCOUNT);
        }

        updateMeta({ title: __('My account') });

        this.redirectIfNotSignedIn();
        this.onSignIn();
        this.updateBreadcrumbs();
    }

    static getDerivedStateFromProps(props, state) {
        return MyAccountContainer.navigateToSelectedTab(props, state);
    }

    componentDidUpdate(_, prevState) {
        const { prevActiveTab, loginState: oldMyAccountState } = prevState;
        const { activeTab, loginState: newMyAccountState } = this.state;
        const {
            isSignedIn,
            history,
            totals: cartTotals
        } = this.props;

        this.redirectIfNotSignedIn();

        /*this.setState({ loginState: STATE_LOGGED_IN });
        if (isSignedIn) {
            if (oldMyAccountState === newMyAccountState) return;
    
            if (newMyAccountState === STATE_LOGGED_IN) {
                if(cartTotals) {
                    const { items_qty } = cartTotals;
                    if(items_qty > 0) {
                        history.push({ pathname: '/checkout/shipping' });
                    }
                }
            }
        }*/

        if (prevActiveTab !== activeTab) {
            this.updateBreadcrumbs();
        }
    }

    componentDidUpdate(){
        let element = document.querySelector(".NavigationTabs") 
        console.log(isSignedIn(),element, "<----MAKSOOD")
        if(element ){
            if(window.location.pathname == "/my-account"  && window.innerWidth <=767 && !isSignedIn()){
                element.style.display = "none"
            }else{
                element.style.display = "block"
            }
        }
    }

    onSignOut() {
        console.log("sIGNOUT wORKING")
        let element = document.querySelector(".NavigationTabs") 
        if(element){
            element.style.display = "block"
        }
        const { toggleOverlayByKey } = this.props;
        this.setState({ activeTab: DASHBOARD });
        this.setState({ state: STATE_SIGN_IN });
        toggleOverlayByKey(CUSTOMER_ACCOUNT);
    }

    onSignIn() {
        console.log("modal working")
        let element = document.querySelector(".NavigationTabs") 
        if(element){
            element.style.display = "block"
        }
        const {
            requestCustomerData,
            changeHeaderState,
            isSignedIn,
            history,
            totals: cartTotals
        } = this.props;

        if (isSignedIn) {
            requestCustomerData();

            /*if(cartTotals) {
                const { items_qty } = cartTotals;
                if(items_qty > 0) {
                    history.push({ pathname: '/checkout/shipping' });
                }
            }*/
        }

        changeHeaderState({
            title: 'My account',
            name: CUSTOMER_ACCOUNT_PAGE,
            onBackClick: () => history.push('/')
        });
        /*const currentPage = window.location.pathname;
        if (currentPage !== '/checkout') {
            changeHeaderState({
                title: 'My account',
                name: CUSTOMER_ACCOUNT_PAGE,
                onBackClick: () => history.push('/')
            });
        }*/
    }

    changeActiveTab(activeTab) {
        const { history } = this.props;
        const { [activeTab]: { url } } = this.tabMap;
        history.push(`${MY_ACCOUNT_URL}${url}`);
    }

    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const { activeTab } = this.state;
        const { url, name } = this.tabMap[activeTab];

        updateBreadcrumbs([
            { url: `${MY_ACCOUNT_URL}${url}`, name },
            { name: __('My Account'), url: `${MY_ACCOUNT_URL}/${DASHBOARD}` }
        ]);
    }

    redirectIfNotSignedIn() {
        const {
            isSignedIn,
            history,
            location: { pathname }
        } = this.props;

        if (isSignedIn) { // do nothing for signed-in users
            return;
        }

        if (isMobile.any()) { // do not redirect on mobile
            return;
        }

        if (pathname === '/forgot-password') { // forward the forgot password state
            history.push({ pathname: '/', state: { isForgotPassword: true } });
            return;
        }

        history.push({ pathname: '/' });
    }

    render() {
        return (
            <MyAccount
                {...this.props}
                {...this.state}
                {...this.containerFunctions}
                tabMap={this.tabMap}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountContainer);
