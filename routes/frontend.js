module.exports = function({server,app}){
    server.get("/",(req,res) => app.render(req,res,"/Dashboard"));
    server.get("/buckets",(req,res) => app.render(req,res,"/Buckets"));
    server.get("/balls",(req,res) => app.render(req,res,"/Balls"));
    server.get("/bucket-suggestions",(req,res) => app.render(req,res,"/BucketSuggestion"));
    server.get("/many-request",(req,res) => app.render(req,res,"/ManyRequest"));
    server.get("/forbidden",(req,res) => app.render(req,res,"/Forbidden"));
    server.get("/not-found",(req,res) => app.render(req,res,"/NotFound"));
    server.all("*",(req,res) => app.render(req,res,"/NotFound"));
}