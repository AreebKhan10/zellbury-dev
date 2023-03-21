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

import './MenNew.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { _getHeaderMessages } from 'Query/Home.query';
import Footer from 'Component/Footer';
import InstallPrompt from 'Component/InstallPrompt';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import CmsPage from 'Route/CmsPage';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';

import BrowserDatabase from 'Util/BrowserDatabase';
import React from 'react';
import MyAccountOrderTableRow from 'Component/MyAccountOrderTableRow';
import HeaderMessage from 'Component/HeaderMessage';
import { ordersType } from 'Type/Account';
import isMobile from 'Util/Mobile';
import BottomSheet from 'Component/BottomSheet'
export const OrderDispatcher = import(
    'Store/Order/Order.dispatcher'
);
import { isSignedIn } from 'Util/Auth';
import { formateDotedDate } from 'Util/Order';



// import TextCarousel from 'Component/TextCarousel';
export const mapStateToProps = (state) => ({
    pageIdentifiers: state.ConfigReducer.cms_home_page,
    orderList: state.OrderReducer.orderList,
    isLoading: state.OrderReducer.isLoading
});

export const mapDispatchToProps = (dispatch) => ({
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    getOrderList: () => OrderDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestOrders(dispatch)
    )
});

export class MenNewContainer extends PureComponent {
    static propTypes = {
        changeHeaderState: PropTypes.func.isRequired,
        getOrderList: PropTypes.func.isRequired
    };

    state = {
        headerMessage: [],
        messageBool: false,
        background_color: '',
        foreground_color: ''
        
    }

    // async getMessagesHandler(city) {




    //     let getMessages = JSON.parse(await _getHeaderMessages(city))
    //     console.log("getting message: .........................", getMessages);
    //     if (getMessages?.data?.topBar?.background_color !== null) {
    //         this.setState({
    //             headerMessage: [...getMessages.data.topBar.text_messages],
    //             messageBool: true,
    //             background_color: getMessages.data.topBar.background_color,
    //             foreground_color: getMessages.data.topBar.foreground_color
    //         })
    //     }
    // }

    componentDidMount() {
        console.log("test component")
        const { changeHeaderState, getOrderList } = this.props;
        if (isSignedIn()) {
            getOrderList();
        }

        // let customer = JSON.parse(localStorage.getItem('customer'))
        // if (customer?.data?.addresses[customer?.data.addresses.length - 1].city) { this.getMessagesHandler(customer?.data?.addresses[customer?.data?.addresses?.length - 1]?.city) }
        // else if (customer?.data?.addresses[1]?.city) { this.getMessagesHandler(customer?.data?.addresses[1]?.city) }
        // else { this.getMessagesHandler("") }

        changeHeaderState({
            name: DEFAULT_STATE_NAME,
            isHiddenOnMobile: true
        });

        

    }
    // ===========================================================================================
    static propTypes = {
        orderList: ordersType.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    renderNoOrders() {
        return (
            <tr block="BottomStepper" elem="NoOrders">
                { /* eslint-disable-next-line no-magic-numbers */}
                <td colSpan={isMobile.any() ? 3 : 4}>{__('You have no orders.')}</td>
            </tr>
        );
    }

    renderOrderHeadingRow() {
        return (
            <tr>
                <th>{__('Order')}</th>
                <th>{__('Date')}</th>
                <th>{__('Status')}</th>
                <th block="hidden-mobile">{__('Total')}</th>
            </tr>
        );
    }

    renderTable() {
        return (
            <table block="BottomStepper" elem="Table">
                <thead>
                    {this.renderOrderHeadingRow()}
                </thead>
                <tbody>
                    {this.renderOrderRows()}
                </tbody>
            </table>
        );
    }

    renderOrderRow = (order) => {
        const { base_order_info: { id } } = order;

        return (
            <MyAccountOrderTableRow
                key={id}
                redirectForStatus={true}
                order={order}
            />
        );
    };

    renderOrderRows() {
        const { orderList, isLoading } = this.props;

        if (!isLoading && !orderList.length) {
            return this.renderNoOrders();
        }
        let userData = BrowserDatabase.getItem('customer'); //JSON.parse(localStorage.getItem('customer'));
        if (!userData) {
            userData = { firstname: '' };
        }
        const orders = orderList.length
            ? orderList
            : Array.from({ length: 10 }, (_, id) => ({ base_order_info: { id } }));
        let hours = 48 * 60 * 60 * 1000; /* ms */
        // return orders.filter(x => x.base_order_info.status_label && ((x.base_order_info.status_label.toLowerCase() == 'processing' || x.base_order_info.status_label.toLowerCase() == 'pending') || (x.base_order_info.status_label.toLowerCase() == 'complete' && (new Date() - new Date(x.base_order_info.created_at)) < hours))).reduceRight(
        //     (acc, e) => [...acc, this.renderOrderRow(e)],
        //     []
        // );

        let filteredOrders = orders.filter(x => x.base_order_info.status_label && ((x.base_order_info.status_label.toLowerCase() == 'processing' || x.base_order_info.status_label.toLowerCase() == 'confirmed' || x.base_order_info.status_label.toLowerCase() == 'shipped') || (x.base_order_info.status_label.toLowerCase() == 'complete' && (!x.base_order_info.delivery_date || ((new Date() - new Date(x.base_order_info.delivery_date.replace(/ /g, "T"))) < hours)))));
        return (<>{filteredOrders.length > 0 && <BottomSheet orders={filteredOrders.length <= 3 ? filteredOrders : filteredOrders.sort(function (a, b) {
            return (b.base_order_info.id - a.base_order_info.id);
        }).slice(0, 3)} userData={userData}></BottomSheet>}</>)
    }

    renderBottomStepper() {
        return (
            <div block="BottomStepper">
                {this.renderOrderRows()}
            </div>
        );
    }
   

    // ===========================================================================================
    render() {
        return (
            <div block="HomePage">
                <HeaderMessage/>
                {/* <TextCarousel /> */}
                {/* <div style={{ width: '100%', padding: '20px', backgroundColor: '#CC0066', justifyContent: 'center', alignItems: 'center' }}>
                    <p>Due to Heavy Rain, Order Deliveries might get affected in Several Cities.</p>
                </div> */}
                <InstallPrompt />
                <CmsPage {...this.props} />
                {isSignedIn() && this.renderBottomStepper()}
                <Footer isVisibleOnMobile />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenNewContainer);
