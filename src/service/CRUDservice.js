var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

import db from '../models/index'


// hàm tạo user nhận data từ req.body từ client để đưa vào db
let createNewUser = async data => { 
    return new Promise( async (thanhcong,thatbai)=>{
        try {
            let hashUserPasswordByBcrypt = await hashUserPassword(data.password); // đợi lbr bcrypt băm pw ra đã
            await db.User.create({
                email: data.email,
                password: hashUserPasswordByBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
                phonenumber: data.phonenumber,
            })
            thanhcong('oke')
        } catch (error) {
            thatbai(error)
        }
    })
}

let hashUserPassword = async (pw) => { // băm lại mật khẩu 
    return new Promise((thanhcong, thatbai) => { // trả về một promise 
        try {
            var hash = bcrypt.hashSync(pw, salt); // sử lý băm pw
            thanhcong(hash) // trả về pw đã được băm 
        } catch (error) {
            thatbai(error) // nếu lỗi trả về error exception
        }
    })
}

let getAllUser = async  () => {
    return new Promise( async (thanhcong,thatbai)=>{ // xử lý bất đồng bộ 
        try {
            let users = await db.User.findAll({
                raw : true
            });// lấy ra tất cả trong db
            // thanhcong(JSON.stringify(users, null, 2)) // config array oj
            thanhcong(users)
        } catch (e) {
            consolog.log('ô lỗi rồi');
            thatbai(e);
        }
    })
}

let getInfoById = async (id) => {
    return new Promise( async (thanhcong,thatbai)=>{
        try {
            let user = await db.User.findOne({
                where : { id : id },
                raw : true
            })

            if(user){
                thanhcong(user)
            }else{
                thanhcong(null)
            }

            thanhcong()
        } catch (error) {
            thatbai(error)
        }
    })
}

let updateUserData = (data) => {
    return new Promise( async (thanhcong,thatbai) => {
        try {
            await db.User.update({ 
                email:data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address
            }, {
                where: {
                  id: data.id
                }
            });
            thanhcong('oke')
        } catch (error) {
            thatbai(error)
        }
    })
}

let deleteUser = async (userId) => {
    return new Promise ( async (thanhcong,thatbai)=>{
        try{
            var user = await db.User.findOne({
                where : {id : userId}
            })
            if(user){
                console.log(user)
                await user.destroy();
                // thanhcong(user)
            }
            thanhcong()
        }catch (error) {
            thatbai(error)
        }
    })
}

module.exports = {
    createNewUser,
    getAllUser,
    getInfoById,
    updateUserData,
    deleteUser
}