
const adminAuth = (req,res, next) => {
    console.log("Admin auth is being checked");
    const token = 'abcd';
    const isAuthenticated = token === 'abcd';
    if(!isAuthenticated){
        res.status(401).send("User is not authenticated")
    }else{
        next();
    }
}

module.exports = {adminAuth};