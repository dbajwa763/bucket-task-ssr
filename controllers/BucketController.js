const Promise = require("bluebird");
const db = require("../database/db");
const helpers = require("../helpers/Common");
const {API_STATUS} = require("../constants/Common");
const t = require("./../constants/Tables");
const messages = require("./../constants/Messages");
const {insertData,updateData,getData} = require("../helpers/QueryHelper");

module.exports = {
    /**
     * Get Bucket List
     * @param {*} req - Request object
     * @param {*} res - Response object
     */
    getBucketList: async function(req,res){
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
            const bucketsQuery = `SELECT id,name,slug,capacity,status FROM ${t.BUCKETS} 
                WHERE ${WHERE}
                ORDER BY ${sort_column} ${sort_by}
                LIMIT ? OFFSET ?`;
            const countQuery = `SELECT COUNT(id) as count FROM ${t.BUCKETS} WHERE ${WHERE}`;
            const [buckets,[{count}]] = await Promise.all([
                connection.queryAsync(bucketsQuery,[...params,parseInt(limit),offset]),
                connection.queryAsync(countQuery,params)
            ]);
            const totalCount = parseInt(count);
            const numPages = Math.ceil(totalCount / parseInt(limit));
            return res.status(API_STATUS.SUCCESS).send({
                status: API_STATUS.SUCCESS,
                message: messages.success,
                resData: {
                    data: buckets,
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
     * Get Single Bucket
     * @param {*} req - Request object
     * @param {*} res - Response object
     */
    getSingleBucket: async function(req,res){
        let connection;
        try{
            let {slug} = req.query;
            connection = await db.getConnectionAsync();
            const [bucket] = await getData(connection,t.BUCKETS,`id,name,slug,capacity,status`,`slug = '${slug}'`);
            if(!bucket){
                return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.NO_CONTENT,message: messages.bucket.notFound});
            }
            return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.SUCCESS,message: messages.success,data: bucket});
        }catch(e){
            helpers.handleException(e,res);
        }finally{
            if(connection){
                connection.release(); // Release the connection back to the pool
            }
        }
    },
    /**
     * Create Bucket
     * @param {*} req - Request object
     * @param {*} res - Response object
     */
    createBucket: async function(req,res){
        let {name,capacity,status} = req.body;
        let connection;
        try{
            connection = await db.getConnectionAsync();
            const currentDateTime = (await helpers.dateConvertToUTC()).totalDate;
            const slug = await helpers.createSlug(connection,"BT",t.BUCKETS,"slug");
            name = await helpers.capitalizeName(`${name}`);
            const bucketData = {name,slug,capacity,status,created_at: currentDateTime,updated_at: currentDateTime};
            await insertData(connection,t.BUCKETS,bucketData);
            return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.SUCCESS,message: messages.bucket.create});
        }catch(e){
            helpers.handleException(e,res);
        }finally{
            if(connection){
                connection.release();
            }
        }
    },
    /**
     * Edit Bucket
     * @param {*} req - Request object
     * @param {*} res - Response object
     */
    editBucket: async function(req,res){
        let connection;
        let {slug,name,capacity,status} = req.body;
        try {
            connection = await db.getConnectionAsync();
            const currentDateTime = (await helpers.dateConvertToUTC()).totalDate;
            name = await helpers.capitalizeName(`${name}`);
            const bucketData = {name,capacity,status,updated_at: currentDateTime};
            await updateData(connection,t.BUCKETS,bucketData,`slug = '${slug}'`);
            return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.SUCCESS,message: messages.bucket.update});
        }catch(e){
            helpers.handleException(e,res);
        }finally{
            if(connection){
                connection.release();
            }
        }
    },
    /**
     * Delete Bucket
     * @param {*} req - Request object
     * @param {*} res - Response object
     */
    deleteBucket: async function(req,res){
        let connection;
        let {slug} = req.params;
        try {
            connection = await db.getConnectionAsync();
            const currentDateTime = (await helpers.dateConvertToUTC()).totalDate;
            const bucketData = {is_deleted:1,updated_at: currentDateTime};
            await updateData(connection,t.BUCKETS,bucketData,`slug = '${slug}'`);
            return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.SUCCESS,message: messages.bucket.delete});
        }catch(e){
            helpers.handleException(e,res);
        }finally{
            if(connection){
                connection.release();
            }
        }
    },
    /**
     * Add Ball in Bucket
     * @param {*} req - Request object
     * @param {*} res - Response object
     */
    AddBallInBucket: async function(req,res){
        let connection;
        let {balls} = req.body;
        try {
            connection = await db.getConnectionAsync();
            const currentDateTime = (await helpers.dateConvertToUTC()).totalDate;
            const buckets = await getData(connection,t.BUCKETS,`id,name,slug,capacity,capacity as totalCapacity`,`is_deleted = 0 AND status = 1`);
            if(buckets.length){
                let {allBuckets,remainingBalls} = await helpers.ballInBucket(buckets,balls);
                const suggestionData = {buckets: JSON.stringify(allBuckets),balls: JSON.stringify(remainingBalls),created_at: currentDateTime,updated_at: currentDateTime};
                await insertData(connection,t.BUCKET_SUGGESTIONS,suggestionData);
                return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.SUCCESS,message: messages.success,allBuckets,remainingBalls});
            }
            return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.NO_CONTENT,message: messages.error});
        }catch(e){
            helpers.handleException(e,res);
        }finally{
            if(connection){
                connection.release();
            }
        }
    }
}