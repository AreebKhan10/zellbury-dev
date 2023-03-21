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

import './MyComplainMyOrders.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Loader from 'Component/Loader';
import MyAccountOrderPopup from 'Component/MyAccountOrderPopup';
import MyAccountOrderTableRow from 'Component/MyAccountOrderTableRow';
import { ordersType } from 'Type/Account';
import isMobile from 'Util/Mobile';

export class MyComplainMyOrders extends PureComponent {
    static propTypes = {
        orderList: ordersType.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    renderPopup() {
        return <MyAccountOrderPopup />;
    }

    renderNoOrders() {
        return (
            <tr block="MyComplainMyOrders" elem="NoOrders">
                { /* eslint-disable-next-line no-magic-numbers */ }
                <td colSpan={ isMobile.any() ? 3 : 4 }>{ __('You have no orders.') }</td>
            </tr>
        );
    }

    renderOrderHeadingRow() {
        return (
            <tr>
                <th>{ __('Order') }</th>
                <th>{ __('Date') }</th>
                <th>{ __('Status') }</th>
                {/* <th block="hidden-mobile">{ __('Total') }</th> */}
            </tr>
        );
    }

    renderTable() {
        return (
            <table block="MyComplainMyOrders" elem="Table">
                <thead>
                    { this.renderOrderHeadingRow() }
                </thead>
                <tbody>
                    { this.renderOrderRows() }
                </tbody>
            </table>
        );
    }

    renderOrderRow = (order) => {
        const { base_order_info: { id } } = order;

        return (
            <MyAccountOrderTableRow
              key={ id }
              order={ order }
            />
        );
    };

    renderOrderRows() {
        const { orderList, isLoading } = this.props;

        if (!isLoading && !orderList.length) {
            return this.renderNoOrders();
        }

        const orders = orderList.length
            ? orderList
            : Array.from({ length: 10 }, (_, id) => ({ base_order_info: { id } }));

        return orders.reduceRight(
            (acc, e) => [...acc, this.renderOrderRow(e)],
            []
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <div block="MyComplainMyOrders">
                <Loader isLoading={ isLoading } />
                { this.renderTable() }
                { this.renderPopup() }
            </div>
        );
    }
}

export default MyComplainMyOrders;
