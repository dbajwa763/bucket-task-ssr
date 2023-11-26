const Promise = require("bluebird");
const db = require("../database/db");
const helpers = require("../helpers/Common");
const {API_STATUS} = require("../constants/Common");
const t = require("./../constants/Tables");
const messages = require("./../constants/Messages");
const {insertData,updateData,getData} = require("../helpers/QueryHelper");

module.exports = {
    /**
     * Get All Active Balls
     * @param {*} req - Request object
     * @param {*} res - Response object
     */
    getBalls: async function(req,res){
        let connection;
        try{
            connection = await db.getConnectionAsync();
            const balls = await getData(connection,t.BALLS,`id,name,slug,capacity,'' as volume`,`is_deleted = 0 AND status = 1`);
            return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.SUCCESS,message: messages.success,balls});
        }catch(e){
            helpers.handleException(e,res);
        }finally{
            if(connection){
                connection.release(); // Release the connection back to the pool
            }
        }
    },
    /**
     * Get Ball List
     * @param {*} req - Request object
     * @param {*} res - Response object
     */
    getBallList: async function(req,res){
        let connection;
        try{
            let {page,query = "",limit,sort_column,sort_by} = req.query;
            limit = limit ? limit : 10;
            page = page ? page : 1;
            sort_column = sort_column ? sort_column : "id";
            sort_by = sort_by ? sort_by : "DESC";
            const offset = (parseInt(page) - 1) * parseInt(limit);
            connection = await db.getConnectionAsync();
            let WHERE = "is_deleted = 0";
            const params = [];
            if(query){
                WHERE += " AND (name LIKE ? OR capacity LIKE ?)";
                params.push(`%${query}%`,`%${query}%`);
            }
            if(sort_column == "status"){
                sort_by  = (sort_by == "asc" ? "DESC" : "ASC");
            }
            const ballsQuery = `SELECT id,name,slug,capacity,status FROM ${t.BALLS} 
                WHERE ${WHERE}
                ORDER BY ${sort_column} ${sort_by}
                LIMIT ? OFFSET ?`;
            const countQuery = `SELECT COUNT(id) as count FROM ${t.BALLS} WHERE ${WHERE}`;
            const [balls,[{count}]] = await Promise.all([
                connection.queryAsync(ballsQuery,[...params,parseInt(limit),offset]),
                connection.queryAsync(countQuery,params)
            ]);
            const totalCount = parseInt(count);
            const numPages = Math.ceil(totalCount / parseInt(limit));
            return res.status(API_STATUS.SUCCESS).send({
                status: API_STATUS.SUCCESS,
                message: messages.success,
                resData: {
                    data: balls,
                    current: parseInt(page),
                    previous: parseInt(page) > 1 ? parseInt(page) - 1 : undefined,
                    next: parseInt(page) < numPages ? parseInt(page) + 1 : undefined,
                    totalData: totalCount,
                    totalPages: numPages
                }
            });
        }catch(e){
            helpers.handleException(e,res);
        }finally{
            if(connection){
                connection.release(); // Release the connection back to the pool
            }
        }
    },
    /**
     * Get Single Ball
     * @param {*} req - Request object
     * @param {*} res - Response object
     */
    getSingleBall: async function(req,res){
        let connection;
        try{
            let {slug} = req.query;
            connection = await db.getConnectionAsync();
            const [ball] = await getData(connection,t.BALLS,`id,name,slug,capacity,status`,`slug = '${slug}'`);
            if(!ball){
                return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.NO_CONTENT,message: messages.ball.notFound});
            }
            return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.SUCCESS,message: messages.success,data: ball});
        }catch(e){
            helpers.handleException(e,res);
        }finally{
            if(connection){
                connection.release(); // Release the connection back to the pool
            }
        }
    },
    /**
     * Create Ball
     * @param {*} req - Request object
     * @param {*} res - Response object
     */
    createBall: async function(req,res){
        let connection;
        let {name,capacity,status} = req.body;
        try{
            connection = await db.getConnectionAsync();
            const currentDateTime = (await helpers.dateConvertToUTC()).totalDate;
            const slug = await helpers.createSlug(connection,"BL",t.BALLS,"slug");
            name = await helpers.capitalizeName(`${name}`);
            const ballData = {name,slug,capacity,status,created_at: currentDateTime,updated_at: currentDateTime};
            await insertData(connection,t.BALLS,ballData);
            return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.SUCCESS,message: messages.ball.create});
        }catch(e){
            helpers.handleException(e,res);
        }finally{
            if(connection){
                connection.release();
            }
        }
    },
    /**
     * Edit Ball
     * @param {*} req - Request object
     * @param {*} res - Response object
     */
    editBall: async function(req,res){
        let connection;
        let {slug,name,capacity,status} = req.body;
        try {
            connection = await db.getConnectionAsync();
            const currentDateTime = (await helpers.dateConvertToUTC()).totalDate;
            name = await helpers.capitalizeName(`${name}`);
            const ballData = {name,capacity,status,updated_at: currentDateTime};
            await updateData(connection,t.BALLS,ballData,`slug = '${slug}'`);
            return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.SUCCESS,message: messages.ball.update});
        }catch(e){
            helpers.handleException(e,res);
        }finally{
            if(connection){
                connection.release();
            }
        }
    },

    /**
     * Delete Ball
     * @param {*} req - Request object
     * @param {*} res - Response object
     */
    deleteBall: async function(req,res){
        let connection;
        let {slug} = req.params;
        try {
            connection = await db.getConnectionAsync();
            const currentDateTime = (await helpers.dateConvertToUTC()).totalDate;
            const ballData = {is_deleted:1,updated_at: currentDateTime};
            await updateData(connection,t.BALLS,ballData,`slug = '${slug}'`);
            return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.SUCCESS,message: messages.ball.delete});
        }catch(e){
            helpers.handleException(e,res);
        }finally{
            if(connection){
                connection.release();
            }
        }
    }
}