import c from "./Common";
module.exports = {
    BUCKET: {
        lists: `${c.BASE_URL}/auth/bucket/list`,
        view: `${c.BASE_URL}/auth/bucket/view`,
        create: `${c.BASE_URL}/auth/bucket/create`,
        update: `${c.BASE_URL}/auth/bucket/update`,
        delete: `${c.BASE_URL}/auth/bucket/delete`,
        addBalls: `${c.BASE_URL}/auth/bucket/add-balls`
    },
    BALL: {
        all: `${c.BASE_URL}/auth/ball/all`,
        lists: `${c.BASE_URL}/auth/ball/list`,
        view: `${c.BASE_URL}/auth/ball/view`,
        create: `${c.BASE_URL}/auth/ball/create`,
        update: `${c.BASE_URL}/auth/ball/update`,
        delete: `${c.BASE_URL}/auth/ball/delete`
    }
}