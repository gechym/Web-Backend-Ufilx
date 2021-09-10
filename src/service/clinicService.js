import db from '../models/index'
require('dotenv').config()
import _ from 'lodash'



let createNewClinic = (data) =>{
    return new Promise(async (thanhcong,thatbai)=> {
        try {
            if(!data.name || !data.imageBase64 || !data.address || !data.descriptionHTML || !data.descriptionMarkdown){
                thanhcong({
                    errCode : -1,
                    message : "LỖI THIẾU THAM SỐ"
                })
            }else{
                await db.Clinic.create({
                    name : data.name,
                    address : data.address,
                    image : data.imageBase64,
                    descriptionHTML : data.descriptionHTML,
                    descriptionMarkdown : data.descriptionMarkdown
                })

                thanhcong({
                    errCode : 0,
                    message : "oke !"
                })
            }
        } catch (error) {
            console.log(error)
            thatbai(error)
        }
    })
}

let getAllClinic = () => {
    return new Promise( async (thanhcong, thatbai)=>{
        try {
            let data = await db.Clinic.findAll();

            if(data && data.length > 0) {
                data = data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary'); // giải mã từ Buffer -> về ảnh ra view
                    return item  
                })
            }

            thanhcong({
                errCode: 0,
                data : data
            })

        } catch (error) {
            console.log(error)
            thatbai(error)
        }
    })
}

let getDetaiClinicById = (id) => {
    return new Promise(async(thanhcong,thatbai)=>{
        try {
            if(!id){
                thanhcong({
                    errCode: -1,
                    message : "Thiết tham số"
                })
            }else{
                
                    let data = await db.Clinic.findOne({
                        where : {id : id},
                        attributes: ['descriptionHTML','descriptionMarkdown','image','name'],//'image','name'
                        raw : true
                    })
                    data.image =new Buffer(data.image, 'base64').toString('binary'); // giải mã từ Buffer -> về ảnh ra view
                    if(data){
                        let doctorClinic = []
                        
                        doctorClinic = await db.Doctor_infor.findAll({
                            where : {clinicId : id},
                            attributes: ['doctorId','provinceId'],
                        })
                        data.doctorClinic = doctorClinic

                        thanhcong({
                            errCode: 0,
                            data : data,
                        })
                    }else{
                        thanhcong({
                            errCode: -2,
                            message : "no specialty",
                            data : {}
                        })
                    }
            }
        } catch (error) {
            console.log(error)
            thatbai(error)
        }

    })
}

module.exports = {
    createNewClinic,
    getAllClinic,
    getDetaiClinicById
}