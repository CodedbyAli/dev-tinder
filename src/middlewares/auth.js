
const adminAuth = (req,res, next) => {
    console.log("Admin auth is being checked");
    const token = 'hfabfkkdsbkfbkjfe';
    const isAuthenticated = token === 'hfabfkkdsbkfbkjfe';
    if(!isAuthenticated){
        res.status(401).send("User is not authenticated")
    }else{
        next();
    }
}

const userAuth = (req,res, next) => {
    console.log("User auth is being checked");
    const token = 'hfjkeshfkwehfhewi';
    const isAuthenticated = token === 'hfjkeshfkwehfhewi';
    if(!isAuthenticated){
        res.status(401).send("User is not authenticated")
    }else{
        next();
    }
}

module.exports = {adminAuth,userAuth};