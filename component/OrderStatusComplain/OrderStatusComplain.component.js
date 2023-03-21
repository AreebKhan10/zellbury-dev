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

 import './OrderStatusComplain.style';

 import PropTypes from 'prop-types';
 import { PureComponent } from 'react';
 
 import Loader from 'Component/Loader';
 
 export class OrderStatusComplain extends PureComponent {
     static propTypes = {
         isLoading: PropTypes.bool.isRequired
     };
 
     render() {
         const { isLoading } = this.props;
 
         return (
             <div block="OrderStatusComplain">
                <div block="OrderStatusComplain" elem="Buttons">
                    <button
                      type="text"
                      block="Orders not Received"
                      elem="Button"
                      mix={ { block: 'Button' } }
                    >
                        { __('Orders not Received') }
                    </button>
                </div>
             </div>
         );
     }
 }
 
 export default OrderStatusComplain;
 