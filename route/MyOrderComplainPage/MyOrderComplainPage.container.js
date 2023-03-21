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
import MyOrderComplainPage from './MyOrderComplainPage.component';

export class MyOrderComplainPageContainer extends PureComponent {

    render() {
        return (
            <MyOrderComplainPage
                {...this.props}
                {...this.state}
            />
        );
    }
}

export default MyOrderComplainPageContainer
