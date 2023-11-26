const config = require("./../config/frontend");

module.exports = {
    APP_NAME: config.APP_NAME,
    BASE_URL: config.BASE,
    width: "1440px",
    API_STATUS: {
        SUCCESS: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204,
        MOVED_PERMANENTLY: 301,
        FOUND: 302,
        SEE_OTHER: 303,
        NOT_MODIFIED: 304,
        TEMPORARY_REDIRECT: 307,
        PERMANENT_REDIRECT: 308,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        CONFLICT: 409,
        TOO_MANY_REQUESTS: 429,
        INTERNAL_SERVER_ERROR: 500,
        SERVICE_UNAVAILABLE: 503,
        UNPROCESSABLE_ENTITY: 422,
        PRECONDITION_FAILED: 412
    },
    SESSION_KEY: "shSDFGfgoifdg34tsDGFfsdgaljsf"
}