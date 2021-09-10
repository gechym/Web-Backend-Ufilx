// import CRUDservice from '../service/CRUDservice'
import UserService from '../service/UserService'


let handleLogin = async (req,res) => {
    // let data = await CRUDservice.getAllUser()
    let email = req.body.email
    let password = req.body.password

    
    if(!email || !password){
        
        res.status(500).json({ // trả về lỗi 500 sẽ rơi vô catch bên FE để log lỗi ra view
            ErrCode : 1,
            message : 'Không được để trống phần nào'
        })
    }else{
        let userData = await UserService.handleUserLogin(email, password);
        res.status(200).json({
            errCode : userData.errCode,
            errMessage : userData.errMessage,
            user : userData.user
        })
    }




}

let handleGetAllUser = async (req, res) => {
    let id = req.query.id // id  all
    
    if(!id){
        return res.status(500).json({
            errCode : 0,
            errMessage : 'Lỗi',
            users : []
        })
    }
    let users = await UserService.getAllUser(id)
    return res.status(200).json({
        errCode : 0,
        errMessage : 'oke',
        users : users
    })
}

let handleCreateNewUser = async (req,res) => {
    let message = await UserService.createNewUser(req.body);
    console.log(message)
    return res.status(200).json(message)
}

let handleDeleteUser = async (req,res) => {
    if(!req.body.id){
        console.log(req.body.id)

        res.status(200).json({
            errCode : 1,
            messageCode : 'Người dùng không tồn tại'
        })
    }else{
        let message = await UserService.deleteUser(req.body.id)
        res.status(200).json(message)
    }

}

let handleEditUser = async (req,res) => {
    let data = req.body
    if(!data.id){
        res.status(200).json({
            errorCode : 1,
            messageCode : 'Người dùng không tồn tại 1'
        })
    }else{
        console.log('check')
        let message = await UserService.updateUser(data)
        res.status(200).json(message)
    }
}

let getAllCode = async (req, res) => {
    try {
        await setTimeout( async () => {
            let data = await UserService.getAllCodeService(req.query.type)
            res.status(200).json(data)
        },1000)
    } catch (error) { // trường hợp ko kết nối đc server
        console.log("check error" ,error)
        res.status(200).json({
            errCode: -1,
            errMessage : "LỖI KẾT NỐI SERVER"
        })
    }
}


module.exports = {
    handleLogin,
    handleGetAllUser,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode,
}