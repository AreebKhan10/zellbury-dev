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

 import './OrderDetails.style';

 import PropTypes from 'prop-types';
 import { PureComponent } from 'react';
 
 import Loader from 'Component/Loader';
 import { fetchQuery } from 'Util/Request';
 import OrderQuery from 'Query/Order.query';
 import { orderType } from 'Type/Account';
import BrowserDatabase from 'Util/BrowserDatabase';
 
 export class OrderDetails extends PureComponent {
     static propTypes = {
         isLoading: PropTypes.bool.isRequired,
         detailData: PropTypes.object.isRequired,
         order: orderType.isRequired,
     };

    renderOrderSummaryTable(data) {
        const { order: { base_order_info: { redeempoints, cashback, apistatus } }, cashbackpercent } = this.props;
        return (
            <div block="CheckoutOrderSummary" elem="OrderTotals">
                <h3
                    block="CheckoutOrderSummary"
                    elem="Header"
                    mix={{ block: 'CheckoutPage', elem: 'Heading', mods: { hasDivider: true } }}
                >
                    <span>{__('Order Summary')}</span>
                </h3>
                <hr />
                <ul>
                    <li style={{ marginTop: "8px" }} block="CheckoutOrderSummary" elem="SummaryItem">
                        <span block="CheckoutOrderSummary" elem="Text">
                            Subtotal
                        </span>
                        <span block="CheckoutOrderSummary" elem="Text">
                            {numberWithCommas(data.sub_total)}
                        </span>
                    </li>
                    {apistatus && <li block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span block="CheckoutOrderSummary" elem="Text">
                            Loyalty Redeemed
                        </span>
                        <span style={{ color: "#DC6D6D", fontWeight: "bold" }} block="CheckoutOrderSummary" elem="Text">
                            - Rs {numberWithCommas(redeempoints.split(".")[0])}
                        </span>
                    </li>}
                    <li style={{ paddingBottom: "15px", borderBottom: "1px solid #f0f0f0" }} block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span block="CheckoutOrderSummary" elem="Text">
                            Tax
                        </span>
                        <span block="CheckoutOrderSummary" elem="Text">
                            Rs 0
                        </span>
                    </li>

                    <li style={{ marginTop: "8px" }} block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span block="CheckoutOrderSummary" elem="Text">
                            Grand total
                        </span>
                        <span block="CheckoutOrderSummary" elem="Text">
                            {numberWithCommas(data.grand_total)}
                        </span>
                    </li>

                    <li block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span style={{ textAlign: "left" }} block="CheckoutOrderSummary" elem="Text">
                            <p>Loyalty Credit {cashbackpercent}%</p>
                            <span>*Loyalty points earned accumalate once the order is delivered</span>
                        </span>
                        <span style={{ color: "#03a685", fontWeight: "bold" }} block="CheckoutOrderSummary" elem="Text">
                            Rs {numberWithCommas(cashback)}
                        </span>
                    </li>
                </ul>
            </div>
        )
    }
 
     render() {
         const { isLoading, detailData } = this.props;

         console.log('detialOptionData', detailData);

         return (
             <>
                <div className="centered">
                    {detailData.title && <h3 className="pageTitle">{detailData.title}</h3>}
                    
                    {detailData.secondarySubTitle && <h4 className="orderDeliverySec">{detailData.secondarySubTitle}</h4>}
                    
                    {detailData.subTitle && <h4 className="orderDeliverySec">{detailData.subTitle}</h4>}

                    {detailData.content && <p className="content">{detailData.content}</p>}
                    {detailData.detailsTracking && <p className="subContent">You can see the detailed tracking below</p>}
                    {detailData.textAreaHeading && <p className="inputHeading">{detailData.textAreaHeading}</p>}
                    {detailData.textArea && <div><textarea className="textAreaSec"></textarea></div>}
                    {detailData.detailsTracking && <div className="detaileTrackingHeading">Detailed Tracking</div>}
                    {detailData.detailsTracking && <p>No Details Found</p>};
                    {detailData.noteHeading && <p className="noteHead">Note</p>}
                    {detailData.content3 && <p>{detailData.content3}</p>}
                    {detailData.content4 && <p>{detailData.content4}</p>}
                    {detailData.noteHeadingSecondary && <div className="detaileTrackingHeading">Note</div> }
                    {detailData.noteHeadingSecondary && <p className="noteContent">Beware of the replica/counterfelt items sold in the market under our brands name. If you wish to purchase original Zellbury products, please purchase at from one of our stores or our website</p> }
                    {detailData.submitBtnLabel && <div><button type="text" className="submitBtn">{detailData.submitBtnLabel}</button></div>}
                </div>
                
            </>
         );
     }
 }
 
 
 export default OrderDetails;