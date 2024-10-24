export const API_BASE_URL = 'http://localhost:5000';

const API_ROUTER = {
    LOGIN: `${API_BASE_URL}/api/homepage/login`,
    SIGNUP: `${API_BASE_URL}/api/homepage/signup`,
    
    //Account
    GET_ACCOUNT: `${API_BASE_URL}/api/homepage/get-account/:id/:param`,
    UPDATE_ACCOUNT: `${API_BASE_URL}/api/homepage/account/update-account`,
    CHANGEPWD: `${API_BASE_URL}/api/homepage/account/change-password`,
    DELETE_ACCOUNT: `${API_BASE_URL}/api/homepage/account/delete-account`,

    //Service Web
    GET_SERWEB: `${API_BASE_URL}/api/homepage/service/web/getall`,
    CREATE_SERWEB: `${API_BASE_URL}/api/homepage/service/web/create`,
    UPDATE_SERWEB: `${API_BASE_URL}/api/homepage/service/web/upate`,
    DELETE_SERWEB: `${API_BASE_URL}/api/homepage/service/web/delete`,

    //Content Web
    GET_CONTENTWEB: `${API_BASE_URL}/api/homepage/service/web/get-content/:id/ref`,
    CREATE_CONTENTWEB: `${API_BASE_URL}/api/homepage/service/web/content/create`,
    UPDATE_CONTENTWEB: `${API_BASE_URL}/api/homepage/service/web/content/update`,
    DELETE_CONTENTWEB: `${API_BASE_URL}/api/homepage/service/web/content/delete`,

    //Service App
    GET_SERAPP: `${API_BASE_URL}/api/homepage/service/app/get-all`,
    CREATE_SERAPP: `${API_BASE_URL}/api/homepage/service/app/create`,
    UPDATE_SERAPP: `${API_BASE_URL}/api/homepage/service/app/update`,
    DELETE_SERAPP: `${API_BASE_URL}/api/homepage/service/app/delete`,

    //Content App
    GET_CONTENTAPP: `${API_BASE_URL}/api/homepage/service/app/get-content/:id/ref`,
    CREATE_CONTENTAPP: `${API_BASE_URL}/api/homepage/service/app/content/create`,
    UPDATE_CONTENTAPP: `${API_BASE_URL}/api/homepage/service/app/content/update`,
    DELETE_CONTENTAPP: `${API_BASE_URL}/api/homepage/service/app/content/delete`,

    //Blog
    GET_BLOGRANDOM: `${API_BASE_URL}/api/homepage/service/blog/get-blogs/isRandom/:page`,
    SEARCHBLOG: `${API_BASE_URL}/api/homepage/service/blog/get-blogs/:search/:page`,
    GETORTHERBLOG: `${API_BASE_URL}/api/homepage/service/blog/get-orther-blogs/:id/:page`,
    CREATE_BLOG: `${API_BASE_URL}/api/homepage/service/blog/create`,
    UPDATE_BLOG: `${API_BASE_URL}/api/homepage/service/blog/update`,
    DELETE_BLOG: `${API_BASE_URL}/api/homepage/service/blog/delete`,

    //Blog Content
    GETBC: `${API_BASE_URL}/api/homepage/service/blog/content/get/:blogid`,
    CREATEBC: `${API_BASE_URL}/api/homepage/service/blog/content/create`,
    UPDATEBC: `${API_BASE_URL}/api/homepage/service/blog/content/update`,
    DELETEBC: `${API_BASE_URL}/api/homepage/service/blog/content/delete/:id/:scope`,
}

export default API_ROUTER;