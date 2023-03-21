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

// import { ParcelStatus } from 'Route/ParcelStatus';
import { PureComponent } from 'react';
import './MyOrderComplainPage.style';
import MyOrdersListing from 'Component/MyOrdersListing';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ContentWrapper from 'Component/ContentWrapper';
import OrderOptions from 'Component/ComplainOrders/OrderOptions';

export class MyOrderComplainPage extends PureComponent {
   
    state = {
        value: 0,
        showOrderOptions: false,
    }

    handleChange = (event, newValue) =>{
        this.setState({value: newValue});
    }

    handleChangeOrder = () => {
        console.log("we are in handleChange Order");
        // const { showOrderOptions } = this.state;
        this.setState({ showOrderOptions: true });
    }

    renderContent() {
        const { value, showOrderOptions } = this.state;

        return (
            <ContentWrapper
              label={ __('My Order Complain Page') }
              wrapperMix={ { block: 'MyOrderComplainPage', elem: 'Wrapper' } }
            >
                <Tabs inkBarStyle={{background: 'blue'}} value={value} onChange={this.handleChange} aria-label="ordersTab">
                    <Tab label="Active Orders" />
                    <Tab label="Delivered Orders" />
                </Tabs>
                {value === 0 && (
                    <div value={value} index={0}>
                       {!showOrderOptions && <MyOrdersListing handleChangeOrder={ this.handleChangeOrder }/>}
                       {showOrderOptions && <OrderOptions />}
                    </div>
                )}
                {value === 1 && (
                    <div value={value} index={1}>
                        <OrderOptions />
                    </div>
                )}
            </ContentWrapper>
        );
    }


    render() {
        return (
            <div>
                { this.renderContent() }
            </div>
        );
    }
}

export default MyOrderComplainPage;
