import { httpsRequest } from "../util/Request/graphQl"

const _getSources = async ({ city, lat, lng, quoteid }) => {
    try {
        return await httpsRequest({
            cookie: true,
            query: `\n{\n  getIdentifiedSources(city: \"${city}\", lat:\"${lat}\", lng:\"${lng}\", quoteid:\"${quoteid}\") { \n    items,\n    sourcename\n  }\n}`,
        })
    } catch (error) {
        console.log(error.message)
    }
}

const _getSourcesWithoutLatLng = async ({ city, quoteid }) => {
    try {
        return await httpsRequest({
            cookie: true,
            query: `\n{\n  getSourceList(city: \"${city}\", quoteid:\"${quoteid}\") { \n    items,\n    sourcename\n  }\n}`,
        })
    } catch (error) {
        console.log(error.message)
    }
}

export {
    _getSources, 
    _getSourcesWithoutLatLng
}