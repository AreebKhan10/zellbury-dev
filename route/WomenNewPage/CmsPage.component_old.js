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
import { _getCustomerLoyaltyPoints, _getSeggments, _getWeather } from 'Query/Loyalty.query';
import history from 'Util/History';
import { MyAccountOverlay } from 'Component/MyAccountOverlay/MyAccountOverlay.component';

export class CmsPage extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        isBreadcrumbsActive: PropTypes.bool,
        page: BlockListType.isRequired,
        onSignIn: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isBreadcrumbsActive: true
    };

    state = {
        loggedIn: false,
        content1: '',
        content2: '',
        loyaltyPoints: '',
        weatherInfo: '',
        seggment: '',
        city: '',
        count: 0
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
            {this.state.loggedIn === true ? (
                <>
                    {this.state.loyaltyPoints === {} || this.state.weatherInfo === {} || this.state.seggment === {} ? null : this.barcodeGenerator()}
                </>
            ) : this.state.content2 !== '' && this.state.content1 !== '' && this.loginComponent()}
            {this.state.content2 !== '' && <Html content={this.state.content2} />}
            {this.state.content2 === '' && this.state.content1 === '' && <>
                <div block="CmsPage" elem="SectionPlaceholder" />
                <div block="CmsPage" elem="SectionPlaceholder" />
                <div block="CmsPage" elem="SectionPlaceholder" />
            </>}
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
        localStorage.removeItem('checkHomeLogin')
        let content1Result1
        let content1Result2
        let loyaltyPoints
        let weatherResponse
        let seggmentsData


        const promise1 = new Promise(async (resolve) => {
            let result = JSON.parse(await _getCustomContent1())
            resolve(result)
        })
        const promise2 = new Promise(async (resolve) => {
            let result = JSON.parse(await _getCustomContent2())
            resolve(result)
        })

        const promise3 = new Promise(async (resolve) => {

            console.log('promise3');
            const tokenData = JSON.parse(localStorage.getItem("auth_token"))
            if (tokenData !== null) {
                console.log('promise3 if', tokenData);
                const { data } = tokenData
                let result = JSON.parse(await _getCustomerLoyaltyPoints(data))
                resolve(result)
            }
            resolve('')
        })
        const promise4 = new Promise(async (resolve) => {
            console.log('promise4');
            const customerLocalStorage = JSON.parse(localStorage.getItem('customer'))

            if (customerLocalStorage?.data?.addresses?.length) {
                console.log('customerLocalStorage...........', customerLocalStorage);
                let data = customerLocalStorage?.data?.addresses.filter(item => item?.id == customerLocalStorage?.data?.default_shipping)
                console.log('city...........', data);
                if (data?.length) {
                    // getMessagesHandler(data[0].city)
                    const response = JSON.parse(await _getWeather(data[0].city))
                    resolve(response)
                }
            } else if (customerLocalStorage?.data?.city) {
                // getMessagesHandler(customerLocalStorage?.data?.city)
                const response = JSON.parse(await _getWeather(customerLocalStorage?.data?.city))
                resolve(response)
            }
            else {
                // getMessagesHandler("")
                resolve('')
            }


            // if (customerLocalStorage?.data?.city) {
            //     console.log('promise4 if', customerLocalStorage);

            //     const response = JSON.parse(await _getWeather(customerLocalStorage.data.city))
            //     resolve(response)
            // }
            // resolve('')
        })

        const promise5 = new Promise(async (resolve) => {
            let result = JSON.parse(await _getSeggments())
            console.log("promise 5....segments...", result);
            if (result?.data?.getCustomerProfile?.segment) {
                resolve(result)
            }
            resolve("")
        })

        await Promise.allSettled([promise1, promise2, promise3, promise4, promise5]).then((result) => {
            console.log('promiseResult...', result);
            content1Result1 = result[0]?.value
            content1Result2 = result[1]?.value
            loyaltyPoints = result[2]?.value || {}
            weatherResponse = result[3]?.value || {}
            seggmentsData = result[4]?.value || {}
        })

        console.log('content1Result1.............', content1Result1);
        console.log('content1Result2.............', content1Result2);
        console.log('loyaltyPoints.............', loyaltyPoints);
        console.log('weatherResponse.............', weatherResponse);
        console.log('seggmentsData.............', seggmentsData);

        const tokenData = JSON.parse(localStorage.getItem("auth_token"))
        if (tokenData !== null && this.state.count === 0) {
            const { getCustomeLoyaltyPoints: { pointsAvailable = 0, cashbackpercent = 5, apistatus = false } } = loyaltyPoints.data || {};
            const customerLocalStorage = JSON.parse(localStorage.getItem('customer'))
            let city = ''
            if (customerLocalStorage?.data?.addresses?.length) {
                let data = customerLocalStorage?.data?.addresses.filter(item => item?.id == customerLocalStorage?.data?.default_shipping)
                if (data?.length) city = data[0].city//const response = JSON.parse(await _getWeather(data[0].city))
            } else {
                city = customerLocalStorage?.data?.city
            }
            this.setState({
                ...this.state,
                loggedIn: true,
                content1: content1Result1.data.cmsPage.content,
                content2: content1Result2.data.cmsPage.content,
                loyaltyPoints: pointsAvailable,
                weatherInfo: { ...weatherResponse.data.weather },
                seggment: { ...seggmentsData.data.getCustomerProfile },
                city,
                count: 1,
            })
        } else {
            if (this.state.count === 0) {
                console.log('else..............');
                this.setState({
                    ...this.state,
                    loggedIn: false,
                    content1: content1Result1.data.cmsPage.content,
                    content2: content1Result2.data.cmsPage.content,
                    loyaltyPoints: 0
                })
            }
        }
        console.log('DOM Manipulation........component did mount');
    }

    loginHanlder() {
        // let check = localStorage.getItem("checkHomeLogin")

        // await localStorage.setItem("checkHomeLogin", "asdf")
        // console.log('loginHandler', localStorage.getItem('checkHomeLogin'));
        history.push({ pathname: '/my-account' })
    }

    // renderLoginOverlay() {
    //     const { onSignIn } = this.props;
    //     console.log('renderLoginOberlay...', this.props);
    //     return (
    //         <MyAccountOverlay
    //             onSignIn={onSignIn}
    //         />
    //     );
    // }
    loginComponent() {
        return <div class="sign-in-wrapper">
            <p>Sign In for the best experience</p>
            <button onClick={() => this.loginHanlder()}>Sign In</button>
        </div>
    }

    // componentWillUnmount() {
    //     console.log('component will unmount...');
    //     localStorage.removeItem('checkHomeLogin')
    // }

    barcodeGenerator() {
        localStorage.removeItem('checkHomeLogin')
        let getCustomerNumber = localStorage.getItem('phone')
        const customerLocalStorage = JSON.parse(localStorage.getItem('customer'))
        if (getCustomerNumber === null) return
        getCustomerNumber = getCustomerNumber.replace('+92', '')
        console.log("getCustomerNumber...............", getCustomerNumber);
        console.log('states...', this.state);

        return (
            <>
                <div className="message-banner">
                    <div className="message-banner-content">
                        <h3 style={{ textTransform: 'uppercase' }}>Available Credits</h3>
                        <div className="btn-wrapper">
                            <button>{this.state?.seggment?.segment}</button>
                        </div>
                        <h1>{this.state.loyaltyPoints}</h1>
                        <p>{this.state?.seggment?.message}</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Barcode value={getCustomerNumber} displayValue={false} background="rgba(0,0,0,0)" height="50" textAlign="center" />
                            </div>
                            <div className="bottom-content">
                                <div className="tooltip">?
                                    <span className="tooltiptext fa fa-question">{this.state.seggment.help_message}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sale-message">
                    <div className="message-banner-content">
                        {/* <h3>icon</h3> */}
                        <div style={{ height: '80px' }}>
                            <h3><img src={`http://openweathermap.org/img/w/${this.state?.weatherInfo?.icon}.png`} style={{ width: '50px', height: '50px' }} /></h3>
                        </div>
                        <div style={{}}>
                            <h4>It's <strong> {this.state?.weatherInfo?.weather} </strong>in {this.state?.city}</h4>
                            <p>Feels like {this.state?.weatherInfo?.feels_like}°C</p>
                        </div>
                        <div style={{ width: '50px', height: '50px' }}>

                        </div>
                    </div>
                </div>
            </>
        )
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
