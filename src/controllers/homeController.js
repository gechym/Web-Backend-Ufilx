import db from '../models/index'
import CRUDservice from '../service/CRUDservice'

let getHomePage = async (req, res) => {
    try {
        res.send('hello word')
    } catch (error) {
        console.log(error)
    }
}

// [GET] /crud
let getCRUD = (req, res) => {
    res.render('crud.ejs')
}

// [GET] /get-crud
let displayGetCRUD = async (req, res) => {
    let users = await CRUDservice.getAllUser();
    return res.render('displayCRUD.ejs',{
        data:users
    })
}
// [POST] /post-crud    
let postCRUD = async (req, res) => { // xử lý bất đồng bộ 
    let msg =  await CRUDservice.createNewUser(req.body); // đợi nó chạy xong 
    console.log(msg); 
    res.send('cút');
}

// [GET] /edit-crud?id=?
let getEditCRUD = async (req, res) => {
    let userId = req.query.id
    if(userId){
        let userData = await CRUDservice.getInfoById(userId)
        if(userData){
            res.render('editCRUD.ejs',{
                data:userData
            })
        }else{
            res.send('Không tồn tại người này')
        }

    }else{
        res.send('Không tồn tại người này')
    }
}

//  [PUT] /put-crud
let putCRUD = async  (req,res) => {
    let data  = req.body
    await CRUDservice.updateUserData(data)
    return res.redirect('/get-crud')
}

// let deleteCRUD = async (req, res) => {
//     let id = req.query.id
//     if(id){
//         await CRUDservice.deleteUser(id)
//         res.redirect('/get-crud')
//     }else{
//         res.send('user not fond')
//     }
// }

let deleteCRUD= async(req,res)=>{
    let id=req.query.id;
    if(id){
        await CRUDservice.deleteUser(id);
        return res.send('xóa thành công');      
    }else{
        return res.send('xóa thất bại');
    }
    
}

module.exports = {
    getHomePage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
}

// module.exports.getHomePage = (req, res) => {
//        return res.send('hello 1')
// }

// class HomeController {
//     getHomePage(req, res){
//         res.send('hello')
//     }
// }

// module.exports = new HomeController()