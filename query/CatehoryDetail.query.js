import { httpsRequest } from "../util/Request/graphQl"


// let GroupId = 1
// if(localStorage.getItem("customer") !== null){

//     const { data } = JSON.parse(localStorage.getItem("customer"))

//     GroupId = data.group_id ;
//     customerID= data.customer_id
// }

// console.log(customerID, "<==customerID")

const _getCustomWomenContent1 = async (code) => {
    try {
        return await httpsRequest({
            auth: false,
            query: "{\r\n  cmsPage(\r\n    identifier: \"women-1\"\r\n  ) {\r\n    identifier\r\n    meta_keywords\r\n    meta_title\r\n    meta_description\r\n    page_layout\r\n    content\r\n    content_heading\r\n    title\r\n    url_key\r\n  }\r\n}",
            cookie: true

        })
    } catch (error) {
        console.log(error.message)
    }
}

const _getCustomWomenContent2 = async (code) => {
    try {
        return await httpsRequest({
            auth: false,
            query: "{\r\n  cmsPage(\r\n    identifier: \"women-2\"\r\n  ) {\r\n    identifier\r\n    meta_keywords\r\n    meta_title\r\n    meta_description\r\n    page_layout\r\n    content\r\n    content_heading\r\n    title\r\n    url_key\r\n  }\r\n}",
            cookie: true

        })
    } catch (error) {
        console.log(error.message)
    }
}

const _getCustomMenContent1 = async (code) => {
    try {
        return await httpsRequest({
            auth: false,
            query: "{\r\n  cmsPage(\r\n    identifier: \"men-1\"\r\n  ) {\r\n    identifier\r\n    meta_keywords\r\n    meta_title\r\n    meta_description\r\n    page_layout\r\n    content\r\n    content_heading\r\n    title\r\n    url_key\r\n  }\r\n}",
            cookie: true

        })
    } catch (error) {
        console.log(error.message)
    }
}

const _manCards = async (customerID) => {
    try {
       
        return await httpsRequest({
            cookie: true,
            // query: `{\r\n  MenSlider(customer_id:${customerID}) {\r\n    slider_id\r\n    title\r\n    slides{\r\n        slide_id\r\n        slide_text\r\n        is_active\r\n        title\r\n        desktop_image\r\n        mobile_image\r\n    }\r\n    \r\n  }\r\n}`,
            query:  `{\r\n MenCards(customer_id:${customerID}) {\r\n    menu_id\r\n    title\r\n    items{\r\n        item_id\r\n        url\r\n        is_active\r\n        title\r\n        icon\r\n        item_class\r\n        category_id\r\n    }\r\n    \r\n  }\r\n}`,
            method: 'POST'
        })
    } catch (error) {
        console.log(error.message)
    }
}
const _womenSlider = async (customerID) => {
    try {
  
        return await httpsRequest({
            cookie: true,
            // query: `{\r\n  MenSlider(customer_id:${customerID}) {\r\n    slider_id\r\n    title\r\n    slides{\r\n        slide_id\r\n        slide_text\r\n        is_active\r\n        title\r\n        desktop_image\r\n        mobile_image\r\n    }\r\n    \r\n  }\r\n}`,
            query:  `{\r\n  WomenSlider(customer_id:${customerID}) {\r\n    slider_id\r\n    title\r\n    slides{\r\n        slide_id\r\n        slide_text\r\n        is_active\r\n        title\r\n        desktop_image\r\n        mobile_image\r\n        slide_link\r\n    }\r\n   }\r\n}`,
            method: 'POST'
        })
    } catch (error) {
        console.log(error.message)
    }
}

const _MenSlider = async (customerID) => {
    try {
  
        return await httpsRequest({
            cookie: true,
            
            // query: `{\r\n  MenSlider(customer_id:${customerID}) {\r\n    slider_id\r\n    title\r\n    slides{\r\n        slide_id\r\n        slide_text\r\n        is_active\r\n        title\r\n        desktop_image\r\n        mobile_image\r\n    }\r\n    \r\n  }\r\n}`,
            query:  `{\r\n  MenSlider(customer_id:${customerID}) {\r\n    slider_id\r\n    title\r\n    slides{\r\n        slide_id\r\n        slide_text\r\n        is_active\r\n        title\r\n        desktop_image\r\n        mobile_image\r\n        slide_link\r\n    }\r\n   }\r\n}`,
            method: 'POST'
        })
    } catch (error) {
        console.log(error.message)
    }
}



const _womenCards = async (customerID) => {
    try {
       
        
        return await httpsRequest({
            cookie: true,
            // query: `{\r\n  MenSlider(customer_id:${customerID}) {\r\n    slider_id\r\n    title\r\n    slides{\r\n        slide_id\r\n        slide_text\r\n        is_active\r\n        title\r\n        desktop_image\r\n        mobile_image\r\n    }\r\n    \r\n  }\r\n}`,
            query:  `{\r\n WomenCards(customer_id:${customerID}) {\r\n    menu_id\r\n    title\r\n    items{\r\n        item_id\r\n        url\r\n        is_active\r\n        title\r\n        icon\r\n        item_class\r\n        category_id\r\n    }\r\n    \r\n  }\r\n}`,
            method: 'POST'
        })
    } catch (error) {
        console.log(error.message)
    }
}






const _getCustomMenContent2 = async (code) => {
    try {
        return await httpsRequest({
            auth: false,
            query: "{\r\n  cmsPage(\r\n    identifier: \"men-2\"\r\n  ) {\r\n    identifier\r\n    meta_keywords\r\n    meta_title\r\n    meta_description\r\n    page_layout\r\n    content\r\n    content_heading\r\n    title\r\n    url_key\r\n  }\r\n}",
            cookie: true

        })
    } catch (error) {
        console.log(error.message)
    }
}







export {
    _getCustomWomenContent1,
    _getCustomMenContent1,
    _getCustomWomenContent2,
    _getCustomMenContent2,
    _manCards,
    _womenCards,
    _womenSlider,
    _MenSlider
}