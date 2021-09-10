import db from '../models/index'
require('dotenv').config()
import _ from 'lodash'

let createNewSpecailty = (data) => {
    return new Promise(async(thanhcong, thatbai) => {
        try {
            // name : '',
            // imageBase64 : '',
            // descriptionHTML : '',
            // descriptionMarkdown : '',
            if(!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown){
                thanhcong({
                    errCode : -1,
                    message : "LỖI THIẾU THAM SỐ"
                })
            }else{
                await db.Specialty.create({
                    name : data.name,
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


let getAllSpecialty = () => {
    return new Promise( async (thanhcong, thatbai)=>{
        try {
            let data = await db.Specialty.findAll();

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

let getDetaiSpecialtyById = async (id, location) => {
    return new Promise(async(thanhcong,thatbai)=>{
        try {
            if(!id || !location){
                thanhcong({
                    errCode: -1,
                    message : "Thiết tham số"
                })
            }else{
                
                    let data = await db.Specialty.findOne({
                        where : {id : id},
                        attributes: ['descriptionHTML','descriptionMarkdown','image','name'],//'image','name'
                        raw : true
                    })
                    data.image =new Buffer(data.image, 'base64').toString('binary'); // giải mã từ Buffer -> về ảnh ra view
                    if(data){
                        let doctorSpecialty = []

                        if(location === 'ALL'){
                            doctorSpecialty = await db.Doctor_infor.findAll({
                                where : {specialtyId : id},
                                attributes: ['doctorId','provinceId'],
                            })
                        }else{
                            doctorSpecialty = await db.Doctor_infor.findAll({
                                where : {specialtyId : id, provinceId : location},
                                attributes: ['doctorId','provinceId'],
                            })
                        }

                        data.doctorSpecialty = doctorSpecialty

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
    createNewSpecailty,
    getAllSpecialty,
    getDetaiSpecialtyById
}


