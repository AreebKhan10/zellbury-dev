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
import {
    _getCustomWomenContent1,
    _getCustomMenContent1,
    _getCustomWomenContent2,
    _getCustomMenContent2,
    _manSlider
  } from "Query/CatehoryDetail.query";
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
        content0:"",
        content1: '',
        content2: '',
        loyaltyPoints: {},
        weatherInfo: {},
        seggment: {},
        city: '',
        count: 0
    }
    loginHanlder() {
        // let check = localStorage.getItem("checkHomeLogin")

        // await localStorage.setItem("checkHomeLogin", "asdf")
        // console.log('loginHandler', localStorage.getItem('checkHomeLogin'));
        history.push({ pathname: '/my-account' })
    }

    loginComponent() {


        console.log("Login here --->>>>")
        return <div class="sign-in-wrapper">
            <p>Sign In for the best experience</p>
            <button onClick={() => this.loginHanlder()}>Sign In</button>
        </div>
    }

    getRequestQueryParams() {
        console.log(" --Query->>>>")

        const {
            location,
            match,
            pageIdentifiers: identifier,
            pageIds: id
        } = this.props;

        if (identifier) {
            return { identifier };
        }

        if (id !== -1) {
            return { id };
        }

        const urlKey = getUrlParam(match, location);

        return {
            identifier: urlKey
        };
    }

    barcodeGenerator() {

        console.log("Barcode Component ---->>>>>")
        localStorage.removeItem('checkHomeLogin')
        let getCustomerNumber = localStorage.getItem('phone')
        const customerLocalStorage = JSON.parse(localStorage.getItem('customer'))
        if (getCustomerNumber === null) return
        getCustomerNumber = getCustomerNumber.replace('+92', '')
        console.log("getCustomerNumber...............", getCustomerNumber);
        console.log('states...', this.state);
        console.log('seggments.....', this.state.seggment);
        debugger
        if(Object.keys(this.state.seggment).length === 0){
            console.log('if seggments.....', this.state.seggment);
            return <></>
        }

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
    
        
        console.log('states 167...', this.state);
        const {content0,content1,content2,seggment,loggedIn} = this.state
        


        const params = this.getRequestQueryParams();
        const barcodeGenerator = this.barcodeGenerator()
        const loginComponent = this.loginComponent()
         
        
        console.log('params........', params);
        console.log("content1->>>",content1)
        console.log("content0->>>",content0)
        console.log("content1->>>",content2)

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



        if(params?.identifier === "home" ){
            
        return (<>

            {content1 !== '' && <Html content={content1} />}

            
            {loggedIn === true ? (

                <>
                    {seggment !== {} && barcodeGenerator}
                </>
            ) : content2 !== '' && content1 !== '' && loginComponent}
            {content2 !== '' && <Html content={content2} />}
            {content2 === '' && content1 === '' && <>
                <div block="CmsPage" elem="SectionPlaceholder" />
                <div block="CmsPage" elem="SectionPlaceholder" />
                <div block="CmsPage" elem="SectionPlaceholder" />
            </>}
        </>)

        }else{

        return (<>
            {/* {this.barcodeGenerator()}
            <p>{this?.state?.loyaltyPoints}</p> */}
            <Html content={content} />
        </>);
        }

    }

    // componentDidUpdate() {
    //     console.log('DOM Manipulation........component did update');

    // }
    


    async componentDidUpdate() {
        localStorage.removeItem('checkHomeLogin')
        
        const pageType = localStorage.getItem('PageType');
        let content1Result0
        let content1Result1
        let content1Result2
        let loyaltyPoints = {}
        let weatherResponse = {}
        let seggmentsData = {}
        var promise0
        var promise1
        var promise2



        const {
        
            item
            
        } = this.props;


        if(pageType === "Women"){

            promise1 = new Promise(async (resolve) => {
                let result = JSON.parse(await _getCustomWomenContent1())
                resolve(result)
            })


            promise2 = new Promise(async (resolve) => {
                let result = JSON.parse(await _getCustomWomenContent2())
                resolve(result)
            })

        }

        if(pageType === "men"){
            promise0 = new Promise(async (resolve) => {
                // let result = JSON.parse(await _getCustomMenContent1())
                let result = JSON.parse(await _manSlider())
                console.log(result, "<----- RESULT")
                resolve(result)
            })



            promise1 = new Promise(async (resolve) => {
                let result = JSON.parse(await _getCustomMenContent1())
                // let result = JSON.parse(await _manSlider())
                resolve(result)
            })

            promise2 = new Promise(async (resolve) => {
                let result = JSON.parse(await _getCustomMenContent2())
                resolve(result)
            })
        }

        if(pageType === "home"){
            promise1 = new Promise(async (resolve) => {
                let result = JSON.parse(await _getCustomContent1())
                resolve(result)
            })

            promise2 = new Promise(async (resolve) => {
                let result = JSON.parse(await _getCustomContent2())
                resolve(result)
            })
        }


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

        console.log(promise1, "<----promise1")
        await Promise.allSettled([promise0, promise1, promise2, promise3, promise4, promise5]).then((result) => {
            console.log('promiseResult...', result);
            content1Result0 = result[0]?.value
            content1Result1 = result[1]?.value
            content1Result2 = result[2]?.value
            loyaltyPoints = result[3]?.value || {}
            weatherResponse = result[4]?.value || {}
            seggmentsData = result[5]?.value || {}
        })

        console.log('content1Result0.............', content1Result0);
        console.log('content1Result1.............', content1Result1);
        console.log('content1Result2.............', content1Result2);
        console.log('loyaltyPoints 327.............', loyaltyPoints);
        console.log('weatherResponse.............', weatherResponse);
        console.log('seggmentsData.............', seggmentsData);

        const tokenData = JSON.parse(localStorage.getItem("auth_token"))

        if (tokenData !== null && this.state.count === 0) {
          
            if(loyaltyPoints.data.getCustomeLoyaltyPoints === null){

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
                    content0: {...content1Result0},
                    content1: content1Result1.data.cmsPage.content,
                    content2: content1Result2.data.cmsPage.content,
                    loyaltyPoints: pointsAvailable,
                    weatherInfo: { ...weatherResponse?.data?.weather },
                    seggment: { ...seggmentsData?.data?.getCustomerProfile },
                    city,
                    count: 1,
                })
                return 
            }

                const { getCustomeLoyaltyPoints: { pointsAvailable = 0, cashbackpercent = 5, apistatus = false } } = loyaltyPoints.data || {};
            
            
            const customerLocalStorage = JSON.parse(localStorage.getItem('customer'))
            let city = ''
            if (customerLocalStorage?.data?.addresses?.length) {
                let data = customerLocalStorage?.data?.addresses.filter(item => item?.id == customerLocalStorage?.data?.default_shipping)
                if (data?.length) city = data[0].city//const response = JSON.parse(await _getWeather(data[0].city))
            } else {
                city = customerLocalStorage?.data?.city
            }
            

            if(Object.keys(loyaltyPoints).length   === 0 || Object.keys(weatherResponse).length   === 0  || Object.keys(seggmentsData).length  === 0){
                console.log("loyaltypoints 345.........>>>", loyaltyPoints)
                this.setState({
                    ...this.state,
                    loggedIn: true,
                    content1: content1Result1.data.cmsPage.content,
                    content2: content1Result2.data.cmsPage.content,
                    loyaltyPoints: 0
                })
                return 
            }
            this.setState({
                ...this.state,
                loggedIn: true,
                content1: content1Result1.data.cmsPage.content,
                content2: content1Result2.data.cmsPage.content,
                loyaltyPoints: pointsAvailable,
                weatherInfo: { ...weatherResponse?.data?.weather },
                seggment: { ...seggmentsData?.data?.getCustomerProfile },
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

   

    // renderLoginOverlay() {
    //     const { onSignIn } = this.props;
    //     console.log('renderLoginOberlay...', this.props);
    //     return (
    //         <MyAccountOverlay
    //             onSignIn={onSignIn}
    //         />
    //     );
    // }
   

    // componentWillUnmount() {
    //     console.log('component will unmount...');
    //     localStorage.removeItem('checkHomeLogin')
    // }

   



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
