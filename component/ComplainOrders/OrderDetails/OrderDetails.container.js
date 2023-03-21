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
 
 import OrderDetails from './OrderDetails.component';
 import BrowserDatabase from 'Util/BrowserDatabase';
 import { fetchQuery } from 'Util/Request';
 
 export const OrderDispatcher = import(
     /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
     'Store/Order/Order.dispatcher'
 );
 
 export const mapStateToProps = (state) => ({
     orderList: state.OrderReducer.orderList,
     isLoading: state.OrderReducer.isLoading
 });
 
 export const mapDispatchToProps = (dispatch) => ({
     getOrderList: () => OrderDispatcher.then(
         ({ default: dispatcher }) => dispatcher.requestOrders(dispatch)
     )
 });
 
 export class OrderDetailsContainer extends PureComponent {
     static propTypes = {
         getOrderList: PropTypes.func.isRequired
     };

     state = {
        order: {}
     }
     
    //  requestOrderDetails(order_id) {
    //     return fetchQuery(OrderQuery.getOrderByIdQuery(parseInt(order_id))).then(
    //         (resOrder) => {
    //             let { getOrderById } = resOrder;

    //             console.log('resOrder', resOrder);
    //             // this.requestTrackingDetails(getOrderById.base_order_info.increment_id);

    //             // this.callOneSignal(getOrderById.base_order_info.id);
    //             //this.requestTrackingDetails('7001016969');
    //             let orders = BrowserDatabase.getItem('orders');
    //             if (orders && (orders.findIndex(x => x.base_order_info.id == getOrderById.base_order_info.id) > -1)) {
    //                 let indexOfOrder = orders.findIndex(x => x.base_order_info.id == getOrderById.base_order_info.id);
    //                 getOrderById.base_order_info.delivery_date = orders[indexOfOrder].base_order_info.delivery_date;
    //             }
    //             this.setState({ order: getOrderById });
    //             return getOrderById
    //         },
    //         (err) => {
    //             this.setState({ isLoading: false });
    //             // showNotification('error', __('Error getting Order by ID!'));
    //         }
    //     );
    // }
 
     render() {
         return (
             <>
                {/* {this. requestOrderDetails(38653)} */}
                <OrderDetails
                    { ...this.props }
                />
             </>
             
         );
     }
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailsContainer);