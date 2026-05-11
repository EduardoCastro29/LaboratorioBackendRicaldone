const studentLogoutController = {};

studentLogoutController.logout = async (req,res)=>{
    res.clearCookie("authCookie");
    return res.status(200).json({message:"Logout success"});
}

export default studentLogoutController;