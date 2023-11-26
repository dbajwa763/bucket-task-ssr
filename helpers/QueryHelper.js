module.exports = {
    /**
     * insert data
     * @param {*} connection
     * @param {*} table
     * @param {*} data
     * @returns
     */
    async insertData(connection,table,data){
        try{
            const savedObj = await connection.queryAsync(`INSERT INTO ${table} SET ?`,{...data});
            return savedObj;
        }catch(e){
            throw e;
        }
    },
    /**
     * update data
     * @param {*} connection
     * @param {*} table
     * @param {*} data
     * @param {*} condition
     * @returns
     */
    async updateData(connection,table,data,condition){
        try{
            const updatedObj = await connection.queryAsync(`UPDATE ${table} SET ? WHERE ${condition}`,{...data});
            return updatedObj;
        }catch(e){
            throw e;
        }
    },
    /**
     * delete data common helper
     * @param {*} connection
     * @param {*} table
     * @param {*} condition
     * @returns
     */
    async deleteData(connection,table,condition){
        try{
            const deleteObj = await connection.queryAsync(`DELETE FROM ${table} WHERE ${condition}`);
            return deleteObj;
        }catch(e){
            throw e;
        }
    },
    /**
     *
     * @param {*} connection
     * @param {*} table
     * @param {*} condition
     * @returns
     */
    async getData(connection,table,columns,condition){
        try{
            columns = columns ? columns : "*";
            const data = await connection.queryAsync(`SELECT ${columns} FROM ${table} WHERE ${condition}`);
            return data;
        }catch(error){
            throw error;
        }
    }
};