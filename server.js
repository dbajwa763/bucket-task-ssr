const dev = process.env.NODE_ENV !== "production";
const app = require("next")({dev});
const express = require("express");

app.prepare().then(() => {
    const config = require("./config/backend");
    const fConfig = require("./config/frontend");
    if(!config.PORT){
        throw new Error("PORT is required in config File");
    }
    if(!fConfig.BASE){
        throw new Error("BASE url is required in config File");
    }
    if(!config.DB){
        throw new Error("DB credentials are required in config File");
    }
    if(!config.DB.connectionLimit){
        throw new Error("DB.connectionLimit is required in config File");
    }
    if(!config.DB.host){
        throw new Error("DB.host is required in config File");
    }
    if(!config.DB.user){
        throw new Error("DB.user is required in config File");
    }
    if(!config.DB.password && !dev){
        throw new Error("DB.password is required in config File");
    }
    if(!config.DB.database){
        throw new Error("DB.database is required in config File");
    }
    const server = new express();
    require("./routes/middleware")({server,app,dev});
    server.use("/auth",require("./routes/auth"));
    server.use(express.static("express-static"));
    require("./routes/frontend")({server,app});

    const PORT = config.PORT;
    let http = require("http").Server(server);
    http.listen(PORT);
    const ENV = process.env.NODE_ENV || "dev";
    console.log("* * * * * * * * * * * * * *");
    console.log("* Bucket Task SSR Started *");
    console.log(`* PORT: ${PORT} ${" ".repeat(17 - PORT.toString().length)}*`);
    console.log(`* ENV : ${ENV} ${" ".repeat(17 - ENV.length)}*`);
    console.log("* * * * * * * * * * * * * *");
}).catch((e) => {
    console.log("* * * ERROR * * *");
    console.log(e);
    console.log(e.message);
    console.log("* * * ERROR * * *");
    process.exit(1);
});