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

import './FabricLightThickDetails.style';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { orderType } from 'Type/Account';
import { _cancelOrder, _orderDetailById } from 'Query/Complain.query';
import history from 'Util/History';
import ExchangeFromStorePopup from 'Component/ExchangeFromStorePopup';
// import history from 'Util/History';
export class MissingItemMessageDetails extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        showNotification: PropTypes.func.isRequired,
        order: orderType.isRequired,
        complainData: PropTypes.object.isRequired,
        showConfirmPopup: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
    };

    state = {
        address: null,
        fieldValid: true,
        errorMsg: "",
        quantity: 1,
    }

    // componentDidMount() {
    //     const { complainData } = this.props;
    //     if (!complainData) {
    //         history.push("/ordercomplain/orderslist");
    //     }
    // }


    contactSupportHandler = (dataContactSupport) => {
        
        history.push('/ordercomplain/delivered-orders/exchange-order', dataContactSupport)
    }

    renderContent() {
        const { location, complainData } = this.props;
        const { success } = this.state;
        return (
            <div className="fabric-light-thick-detail-section">
                <div class="detail-section">
                    
                    hello world
                </div>
            </div>
        )
    }

    handlePopupConfirm = () => {
        const { hidePopup, setHeaderState } = this.props;
        hidePopup();
        setHeaderState({ name: 'order-complain', title: 'Complain form', onBackClick: () => history.goBack() });
    }

    renderConfirmPopup = () => {
        return <ExchangeFromStorePopup title="Are you sure?" handlePopupConfirm={this.handlePopupConfirm} />
    }

    render() {

        return (
            <>
                <div className="centered">
                    {this.renderContent()}
                    {this.renderConfirmPopup()}

                </div>

            </>
        );
    }
}


export default MissingItemMessageDetails;