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

import './CmsPage.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import Barcode from 'react-barcode'
import Html from 'Component/Html';
import TextPlaceholder from 'Component/TextPlaceholder';
import { BlockListType } from 'Type/CMS';
import { _getCustomContent1, _getCustomContent2 } from 'Query/Home.query';
import { _getCustomerLoyaltyPoints, _getWeather } from 'Query/Loyalty.query';

export class CmsPage extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        isBreadcrumbsActive: PropTypes.bool,
        page: BlockListType.isRequired
    };

    static defaultProps = {
        isBreadcrumbsActive: true
    };

    state = {
        content1: '',
        content2: '',
        loyaltyPoints: ''
    }

    renderHeading() {
        const { page: { content_heading } } = this.props;

        if (!content_heading) {
            return null;
        }

        return (
            <h1 block="CmsPage" elem="Heading">
                <TextPlaceholder content={content_heading} />
            </h1>
        );
    }

    renderContent() {
        const {
            isLoading,
            page: { content }
        } = this.props;

        if (isLoading) {
            return (
                <>
                    <div block="CmsPage" elem="SectionPlaceholder" />
                    <div block="CmsPage" elem="SectionPlaceholder" />
                    <div block="CmsPage" elem="SectionPlaceholder" />
                </>
            );
        }

        if (!isLoading && !content) {
            return null;
        }


        return (<>
            {this.state.content1 !== '' && <Html content={this.state.content1} />}
            {this.state.content1 !== '' && this.state.content2 !== '' && this.barcodeGenerator()}
            {this.state.content1 !== '' && this.state.content2 !== '' && <p>{this?.state?.loyaltyPoints}</p>}
            {this.state.content2 !== '' && <Html content={this.state.content2} />}
            {this.state.content2 === '' && <Html content={content} />}
        </>)



        return (<>
            {/* {this.barcodeGenerator()}
            <p>{this?.state?.loyaltyPoints}</p> */}
            <Html content={content} />
        </>);
    }

    componentDidUpdate() {
        console.log('DOM Manipulation........component did update');

    }
    async componentDidMount() {
        let content1Result1 = JSON.parse(await _getCustomContent1())
        let content1Result2 = JSON.parse(await _getCustomContent2())
        console.log('content1Result1.............', content1Result1);
        console.log('content1Result2.............', content1Result2);

        const { data } = JSON.parse(localStorage.getItem("auth_token"))
        if (data !== null) {
            console.log('if..............');
            try {
                const { data: { city } } = JSON.parse(localStorage.getItem('customer'))
                const weatherResponse = await _getWeather(city)
                console.log("weather response...", weatherResponse);
            } catch (error) {
                console.log('weather api calling error...', error);
            }
            const response = await _getCustomerLoyaltyPoints(data)

            const { getCustomeLoyaltyPoints: { pointsAvailable = 0, cashbackpercent = 5, apistatus = false } } = JSON.parse(response).data || {};
            this.setState({
                ...this.state,
                content1: content1Result1.data.cmsPage.content,
                content2: content1Result2.data.cmsPage.content,
                loyaltyPoints: pointsAvailable
            })
        } else {
            console.log('else..............');
            this.setState({
                ...this.state,
                content1: content1Result1.data.cmsPage.content,
                content2: content1Result2.data.cmsPage.content,
                loyaltyPoints: 0
            })
        }
        console.log('DOM Manipulation........component did mount');
    }

    barcodeGenerator() {
        let getCustomerNumber = localStorage.getItem('phone')
        if (getCustomerNumber === null) return
        getCustomerNumber = getCustomerNumber.replace('+92', '0')
        console.log("getCustomerNumber...............", getCustomerNumber);

        return <Barcode value={getCustomerNumber} displayValue={false} />
    }

    

    render() {
        const { page, isBreadcrumbsActive } = this.props;
        const { page_width } = page;
        console.log('this.state.content2...........', this.state);
        return (
            <main
                block="CmsPage"
                mods={{ isBreadcrumbsHidden: !isBreadcrumbsActive }}
            >
                <div block="CmsPage" elem="Wrapper" mods={{ page_width }}>
                    {this.renderHeading()}
                    <div block="CmsPage" elem="Content">
                        {/* {this.state.content2 !== '' && <Html content={this.state.content2} />} */}
                        {this.renderContent()}
                    </div>
                </div>
            </main>
        );
    }
}

export default CmsPage;
