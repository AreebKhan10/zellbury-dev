import { httpsRequest } from "../util/Request/graphQl"

const _getLoyaltyPoints = async (id) => {
    try {
        return await httpsRequest({
            auth: true,
            query: `{\n  getRedeemedPoints(orderid: ${id}) {\n      redeempoints\n    	cashback\n  }\n}`,
        })
    } catch (error) {
        console.log(error.message)
    }
}

const _getCustomerLoyaltyPoints = async (token) => {
    try {
        return await httpsRequest({
            cookie: true,
            query: `{\n  getCustomeLoyaltyPoints(customer_token: \"${token}\") {\n      customerCode\n      customerName\n      mobile\n      pointsEarned\n      pointsRedeem\n      pointsAvailable\n      cashbackpercent\n  apistatus\n  }\n}`,
        })
    } catch (error) {
        console.log(error.message)
    }
}

const _getWeather = async (city) => {
    try {
        return await httpsRequest({
            cookie: true,
            query: `{\r\n     weather(city: \"${city}\") {\r\n    	 icon\r\n		 weather\r\n         feels_like\r\n     }\r\n}`,
            method: 'POST'
        })
    } catch (error) {
        console.log(error.message)
    }
}


const _getSeggments = async (city) => {
    try {
        return await httpsRequest({
            cookie: true,
            query: "{\r\n  getCustomerProfile(groupid: 1) {\r\n    segment\r\n    message\r\n    help_message\r\n  }\r\n}",
            method: 'POST'
        })
    } catch (error) {
        console.log(error.message)
    }
}

export {
    _getLoyaltyPoints,
    _getCustomerLoyaltyPoints,
    _getWeather,
    _getSeggments
}