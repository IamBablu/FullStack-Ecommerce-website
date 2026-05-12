const AsyncHandler = (requestHandler) =>{
    console.log("hiiiii")
    return (req, res, next)=>{
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    }
}

export {AsyncHandler}