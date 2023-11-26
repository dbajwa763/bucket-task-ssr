const moment = require("moment");
const momentTimezone = require("moment-timezone");
const path = require('path');
const fs = require('fs');
const {getData} = require("./QueryHelper");

const handleException = async(e,res = null) => {
    let fileName = `error-${moment().format('YYYY-MM-DD')}.log`;
    let filePath = path.join(__dirname,'../express-static','logs',fileName);
    const regex = /\((.*):(\d+):(\d+)\)$/
    const errorSplit = e.stack.split("\n")
    let lines = [];
    for(let i = 0;i < errorSplit.length;i++){
        const match = regex.exec(e.stack.split("\n")[i]);
        if(match){
            lines.push({filepath: match[1].split('\\').slice(-2).join('\\'),line: match[2],column: match[3]})
        }
    }
    const errorObj = {date: moment().format('YYYY-MM-DD H:mm:ss'),message: e.message,code: e.code,location: lines};
    // Create directory if it doesn't exist
    const directory = path.dirname(filePath);
    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory,{recursive: true});
    }
    fs.appendFile(filePath,JSON.stringify(errorObj) + `\n`,function(err){
        if(err){
            return console.log(err);
        }
    });
    if(res){
        if(e.code === "ER_PARSE_ERROR"){
            return res.status(500).send({status: 500,message: "Something went wrong. Please try again."});
        }else if(e.code === "ER_NO_SUCH_TABLE"){
            return res.status(500).send({status: 500,message: "Something went wrong. Please try again."});
        }else if(e.code === "ER_BAD_FIELD_ERROR"){
            return res.status(500).send({status: 500,message: "Something went wrong. Please try again."});
        }else if(e.code === "url_invalid"){
            return res.status(500).send({status: 500,message: e.message});
        }else{
            return res.status(500).send({status: 500,message: "Something went wrong. Please try again."});
        }
    }
    return;
}
const createSlug = async(connection,slug,table,field,callback) => {
    let uniqueId = await uniqueSlug(slug);
    const data = await getData(connection,table,"*",`${field} = '${uniqueId}'`);
    if(data.length){
        return await createSlug(connection,slug,table,field,callback);
    }else{
        return uniqueId;
    }
}
const uniqueSlug = async(slug) => {
    let currDate = moment();
    let month = currDate.format("M");
    let day = currDate.format("D");
    let year = currDate.format("YYYY");
    let uniqueId = slug + month + day + year + Math.floor(Math.random() * 100000);
    return uniqueId;
}
const dateConvertToUTC = async(data) => {
    let timeZone = "";
    let date = "";
    let time = "";
    let days = 0;
    let addMin = 0;
    if(data){
        timeZone = data.timeZone || ""
        date = data.date || ""
        time = data.time || ""
        days = data.days || 0
        addMin = data.addMin || 0
    }
    if(!timeZone){
        timeZone = momentTimezone.tz.guess();
    }
    let conDate = moment.utc().add(days,"days").add(addMin,"minutes");
    let convertedDate = {date: "",time: "",totalDate: "",timestamp: ""};
    if(date && time){
        conDate = moment.tz(`${date} ${time}`,timeZone).utc().add(days,"days").add(addMin,"minutes");
    }else if(date){
        conDate = moment.tz(`${date}`,timeZone).utc().add(days,"days").add(addMin,"minutes");
    }
    convertedDate.date = conDate.format("YYYY-MM-DD");
    convertedDate.time = conDate.format("HH:mm:ss");
    convertedDate.totalDate = convertedDate.date + " " + convertedDate.time;
    convertedDate.timestamp = conDate.unix();
    return convertedDate;
}
const capitalizeName = async(str) => {
    const arr = str.split(" ");
    for(var i=0;i<arr.length;i++){
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
    }
    return arr.join(" ");
}
const ballInBucket = async(buckets,balls) => {
    let allBuckets = [];
    buckets.map(async(bucket,bucketIndex) => {
        allBuckets.push(bucket);
        if(bucket.capacity){
            let fillBalls = [];
            balls.map(async(ball,ballIndex) => {
                if(ball.volume && bucket.capacity >= ball.capacity){
                    let reminder = 0,value = 0;
                    value = parseInt(bucket.capacity / ball.capacity);
                    reminder = (bucket.capacity % ball.capacity);
                    if(value > ball.volume){
                        value = ball.volume;
                        reminder = (bucket.capacity - (ball.capacity * parseInt(ball.volume)));
                    }
                    reminder = isFloat(reminder) ? parseFloat(reminder).toFixed(2) : parseInt(reminder);
                    let ballData = Object.assign({},ball);
                    ballData.volume = value;
                    fillBalls.push(ballData);
                    bucket.capacity = reminder;
                    buckets[bucketIndex]["capacity"] = reminder;
                    balls[ballIndex]["volume"] = parseInt(parseInt(ball.volume) - parseInt(value));
                }
            });
            allBuckets[bucketIndex]["balls"] = fillBalls;
        }
    });
    let remainingBalls = balls.filter(ball => ball.volume > 0);
    return {allBuckets,remainingBalls};
}
const isFloat = (n) => {
    return n === +n && n !== (n|0);
}
module.exports = {
    handleException,
    createSlug,
    dateConvertToUTC,
    capitalizeName,
    ballInBucket
}
/*

 Bucket A - 0
    value = 20 / 2.5 => 8
    reminder = 20 % 2.5 => 0
 Bucket B - 18
    value = 18 / 2 => 9
    reminder = 18 % 2 => 0
    if(9 > 2){
        value = 2
        reminder = 18 - 5 => 13
    }
 Bucket C - 12
 Bucket D - 10
 Bucket E -  8


 Pink (2.5 inch) - 2
 Red (2 inch) - 10
 Blue (1 inch) - 10
 Orange (0.8 inch) - 10
 Green (0.5 inch) - 10
*/