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

import "./CategoryDetails.style";

import { PureComponent } from "react";
import HeaderMessage from "Component/HeaderMessage";
import Image from "Component/Image";
import TextPlaceholder from "Component/TextPlaceholder";

import Barcode from "react-barcode";
import { CategoryTreeType } from "Type/Category";
import {
  _getCustomWomenContent1,
  _getCustomMenContent1,
} from "Query/CatehoryDetail.query";
import { _getCustomContent2 } from "Query/Home.query";

import history from "Util/History";
import Html from "Component/Html";

/**
 * Category details
 * @class CategoryDetails
 */
export class CategoryDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //states
      loggedIn: false,
      content1: "",
      content2: "",
        loyaltyPoints: {},
        weatherInfo: {},
        seggment: {},
        city: "",
        count: 0,

    };
  }

  static propTypes = {
    category: CategoryTreeType.isRequired,
  };

  renderCategoryName() {
    let { category } = this.props;

    if (category?.url?.substring(1, 4) === "men") {
      console.log(category?.url?.substring(1, 4), "url<-----40");
      localStorage.setItem("CategoryType", "men");
    }

    if (category?.url?.substring(1, 6) === "women") {
      localStorage.setItem("CategoryType", "women");
      console.log(category?.url?.substring(1, 6), "url<-----47");
    }

    localStorage.setItem("CategoryType", "men");

    console.log(name, "<-----name")
    const {
      category: { name, id },
    } = this.props;

    if (id && !name) {
      return null;
    }

    return (
      <h1 block="CategoryDetails" elem="Heading">
        <TextPlaceholder content={name} />
      </h1>
    );
  }

  renderCategoryDescription() {
    const {
      category: { description, id },
    } = this.props;

    console.log(description, "<----------- category");

    if (!id) {
      return this.renderCategoryDescriptionPlaceholder();
    }

    if (!description) {
      return null;
    }

    return <Html content={description} />;
  }

  renderCategoryDescriptionPlaceholder() {
    return (
      <p>
        <TextPlaceholder length="long" />
      </p>
    );
  }

  renderCategoryImagePlaceholder() {
    return (
      <Image
        mix={{ block: "CategoryDetails", elem: "Picture" }}
        objectFit="cover"
        ratio="custom"
        isPlaceholder
      />
    );
  }

  renderCategoryImage() {
    const {
      category: { image, id },
    } = this.props;

    if (!id) {
      return this.renderCategoryImagePlaceholder();
    }

    if (!image) {
      return null;
    }

    return (
      <Image
        mix={{ block: "CategoryDetails", elem: "Picture" }}
        src={image || ""}
        ratio="custom"
        objectFit="cover"
      />
    );
  }

  loginHanlder() {
    // let check = localStorage.getItem("checkHomeLogin")

    // await localStorage.setItem("checkHomeLogin", "asdf")
    // console.log('loginHandler', localStorage.getItem('checkHomeLogin'));
    history.push({ pathname: "/my-account" });
  }

  loginComponent() {
    console.log("Login here --->>>>");
    return (
      <div class="sign-in-wrapper">
        <p>Sign In for the best experience</p>
        <button onClick={() => this.loginHanlder()}>Sign In</button>
      </div>
    );
  }

  async componentWillUpdate() {
    let CategoryType = localStorage.getItem("CategoryType");
    if (CategoryType === "women") {
      localStorage.removeItem("checkHomeLogin");
      let content1Result1;
      let content1Result2;
      let loyaltyPoints = {};
      let weatherResponse = {};
      let seggmentsData = {};

      const getWomenContent = new Promise(async (resolve) => {
        let result = JSON.parse(await _getCustomWomenContent1());
        resolve(result);
      });

      const promise2 = new Promise(async (resolve) => {
        let result = JSON.parse(await _getCustomContent2());
        resolve(result);
      });

      const promise3 = new Promise(async (resolve) => {
        console.log("promise3");
        const tokenData = JSON.parse(localStorage.getItem("auth_token"));
        if (tokenData !== null) {
          console.log("promise3 if", tokenData);
          const { data } = tokenData;
          let result = JSON.parse(await _getCustomerLoyaltyPoints(data));
          resolve(result);
        }
        resolve("");
      });
      const promise4 = new Promise(async (resolve) => {
        console.log("promise4");
        const customerLocalStorage = JSON.parse(
          localStorage.getItem("customer")
        );

        if (customerLocalStorage?.data?.addresses?.length) {
          console.log("customerLocalStorage...........", customerLocalStorage);
          let data = customerLocalStorage?.data?.addresses.filter(
            (item) => item?.id == customerLocalStorage?.data?.default_shipping
          );
          console.log("city...........", data);
          if (data?.length) {
            // getMessagesHandler(data[0].city)
            const response = JSON.parse(await _getWeather(data[0].city));
            resolve(response);
          }
        } else if (customerLocalStorage?.data?.city) {
          // getMessagesHandler(customerLocalStorage?.data?.city)
          const response = JSON.parse(
            await _getWeather(customerLocalStorage?.data?.city)
          );
          resolve(response);
        } else {
          // getMessagesHandler("")
          resolve("");
        }

        // if (customerLocalStorage?.data?.city) {
        //     console.log('promise4 if', customerLocalStorage);

        //     const response = JSON.parse(await _getWeather(customerLocalStorage.data.city))
        //     resolve(response)
        // }
        // resolve('')
      });

      const promise5 = new Promise(async (resolve) => {
        let result = JSON.parse(await _getSeggments());
        console.log("promise 5....segments...", result);
        if (result?.data?.getCustomerProfile?.segment) {
          resolve(result);
        }
        resolve("");
      });

      await Promise.allSettled([
        getWomenContent,
        promise2,
        promise3,
        promise4,
        promise5,
      ]).then((result) => {
        console.log("promiseResult...", result);

        content1Result1 = result[0]?.value;
        content1Result2 = result[1]?.value;
        loyaltyPoints = result[2]?.value || {};
        weatherResponse = result[3]?.value || {};
        seggmentsData = result[4]?.value || {};
      });

      console.log(getWomenContent, "<---------getWomenContent");
      console.log("content1Result1.............", content1Result1);
      console.log("content1Result2.............", content1Result2);
      console.log("loyaltyPoints 327.............", loyaltyPoints);
      console.log("weatherResponse.............", weatherResponse);
      console.log("seggmentsData.............", seggmentsData);

      const tokenData = JSON.parse(localStorage.getItem("auth_token"));

      if (tokenData !== null && this.state.count === 0) {
        if (loyaltyPoints.data.getCustomeLoyaltyPoints === null) {
          const customerLocalStorage = JSON.parse(
            localStorage.getItem("customer")
          );
          let city = "";
          if (customerLocalStorage?.data?.addresses?.length) {
            let data = customerLocalStorage?.data?.addresses.filter(
              (item) => item?.id == customerLocalStorage?.data?.default_shipping
            );
            if (data?.length) city = data[0].city; //const response = JSON.parse(await _getWeather(data[0].city))
          } else {
            city = customerLocalStorage?.data?.city;
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
          });
          return;
        }

        const {
          getCustomeLoyaltyPoints: {
            pointsAvailable = 0,
            cashbackpercent = 5,
            apistatus = false,
          },
        } = loyaltyPoints.data || {};

        const customerLocalStorage = JSON.parse(
          localStorage.getItem("customer")
        );
        let city = "";
        if (customerLocalStorage?.data?.addresses?.length) {
          let data = customerLocalStorage?.data?.addresses.filter(
            (item) => item?.id == customerLocalStorage?.data?.default_shipping
          );
          if (data?.length) city = data[0].city; //const response = JSON.parse(await _getWeather(data[0].city))
        } else {
          city = customerLocalStorage?.data?.city;
        }

        if (
          Object.keys(loyaltyPoints).length === 0 ||
          Object.keys(weatherResponse).length === 0 ||
          Object.keys(seggmentsData).length === 0
        ) {
          console.log("loyaltypoints 345.........>>>", loyaltyPoints);
          this.setState({
            ...this.state,
            loggedIn: true,
            content1: content1Result1.data.cmsPage.content,
            content2: content1Result2.data.cmsPage.content,
            loyaltyPoints: 0,
          });
          return;
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
        });
      } else {
        if (this.state.count === 0) {
          console.log("else..............");
          this.setState({
            ...this.state,
            loggedIn: false,
            content1: content1Result1.data.cmsPage.content,
            content2: content1Result2.data.cmsPage.content,
            loyaltyPoints: 0,
          });
        }
      }
      console.log("DOM Manipulation........component did mount");
    }

    if (CategoryType === "men") {
      let content1Result1;
      const getMenContent = new Promise(async (resolve) => {
        let result = JSON.parse(await _getCustomMenContent1());
        resolve(result);
      });

      await Promise.allSettled([getMenContent]).then((result) => {
        console.log("promiseResult...", result);
        content1Result1 = result[0]?.value;
      });
      console.log(getMenContent, "<---------getMenContent");

      this.setState({
        ...this.state,
        content1: content1Result1.data.cmsPage.content,
      });
      return;
    }
  }

  barcodeGenerator() {
    console.log("Barcode Component ---->>>>>");
    localStorage.removeItem("checkHomeLogin");
    let getCustomerNumber = localStorage.getItem("phone");
    const customerLocalStorage = JSON.parse(localStorage.getItem("customer"));
    if (getCustomerNumber === null) return;
    getCustomerNumber = getCustomerNumber.replace("+92", "");
    console.log("getCustomerNumber...............", getCustomerNumber);
    console.log("states...", this.state);
    console.log("seggments.....", this.state.seggment);
    // debugger;
    if (Object.keys(this.state.seggment).length === 0) {
      console.log("if seggments.....", this.state.seggment);
      return <></>;
    }

    return (
      <>
        <div className="message-banner">
          <div className="message-banner-content">
            <h3 style={{ textTransform: "uppercase" }}>Available Credits</h3>
            <div className="btn-wrapper">
              <button>{this.state?.seggment?.segment}</button>
            </div>
            <h1>{this.state.loyaltyPoints}</h1>
            <p>{this.state?.seggment?.message}</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Barcode
                  value={getCustomerNumber}
                  displayValue={false}
                  background="rgba(0,0,0,0)"
                  height="50"
                  textAlign="center"
                />
              </div>
              <div className="bottom-content">
                <div className="tooltip">
                  ?
                  <span className="tooltiptext fa fa-question">
                    {this.state.seggment.help_message}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sale-message">
          <div className="message-banner-content">
            {/* <h3>icon</h3> */}
            <div style={{ height: "80px" }}>
              <h3>
                <img
                  src={`http://openweathermap.org/img/w/${this.state?.weatherInfo?.icon}.png`}
                  style={{ width: "50px", height: "50px" }}
                />
              </h3>
            </div>
            <div style={{}}>
              <h4>
                It's <strong> {this.state?.weatherInfo?.weather} </strong>in{" "}
                {this.state?.city}
              </h4>
              <p>Feels like {this.state?.weatherInfo?.feels_like}°C</p>
            </div>
            <div style={{ width: "50px", height: "50px" }}></div>
          </div>
        </div>
      </>
    );
    return <Barcode value={getCustomerNumber} displayValue={false} />;
  }


  render() {
    const { content1, content2, seggment, loggedIn } = this.state;

    // const params = this.getRequestQueryParams();
    const barcodeGenerator = this.barcodeGenerator();
    const loginComponent = this.loginComponent();
    console.log(content1, "content1<------------category",barcodeGenerator, loginComponent);

    return (
      <>
        <div className="headerMessage">
          <HeaderMessage />
        </div>

        {/* {
          <div className="header">
            <Html content={content1} />
          </div>
        } */}

        
        {loggedIn === true ? (
             <>{this.barcodeGenerator()}</>
        ) : (
          <div>{this.loginComponent()}</div>
        )}
        {/* <div>{this.loginComponent()}</div> */}

        <article block="CategoryDetails">
          <div block="CategoryDetails" elem="Description">
            {this.renderCategoryName()}
            {this.renderCategoryDescription()}
          </div>
          {this.renderCategoryImage()}
        </article>
      </>
    );
  }
}

export default CategoryDetails;
