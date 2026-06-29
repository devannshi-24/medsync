const asyncHandler=(fn)=> async (req,resizeBy,next)=>{
    try{
        await fn(req,resizeBy,next)
    }catch(error){
        resizeBy.status(error.code || 500).json({
            success:false,
            message:error.message
        })
    }
}

export default asyncHandler;