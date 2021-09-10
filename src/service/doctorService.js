import db from '../models/index'
require('dotenv').config()
import _ from 'lodash'
import emailService from './emailService' 


const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE 


let getTopdoctorHome = (limit) => {
    return new Promise(async(thanhcong, thatbai)=>{
        try {
            let users = await db.User.findAll(
                {
                limit : limit, // giới bạn bản ghi đucợ lấy ra
                where:{roleId : 'R2'}, // Ứng vs bác sĩ
                order: [['createdAt', 'DESC']], // sort
                attributes: { 
                    // include: [], // define columns that you want to show
                    exclude: ['password'] // define columns that you don't want 
                },
                include: [
                    { model:db.Allcode, as : 'positionData', attributes : ['valueEn', 'valueVi'] },
                    { model:db.Allcode, as : 'genderData', attributes : ['valueEn', 'valueVi'] }
                ],
                // raw : false,
                // raw : true, 
                nest : true
            }

            )
            thanhcong({
                errCode : 0,
                data : users
            })
        } catch (error) {
            thatbai(error)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (thanhcong, thatbai) => {
        try {
            let doctors = await db.User.findAll({
                where :{roleId : 'R2'},
                attributes: { 
                    // include: [], // define columns that you want to show
                    exclude: ['password', 'image'] // define columns that you don't want 
                },
                include : [
                    { model:db.Markdown,},
                    { model:db.Allcode, as : 'positionData', attributes : ['valueEn', 'valueVi'] },
                    { 
                        model:db.Doctor_infor,
                        include : [
                            { model:db.Allcode, as : 'priceTypeData', attributes : ['valueEn', 'valueVi'] },
                            { model:db.Allcode, as : 'provinceTypeData', attributes : ['valueEn', 'valueVi'] },
                            { model:db.Allcode, as : 'paymentTypeData', attributes : ['valueEn', 'valueVi'] }
                        ]
                    },

                ],

                order: [['firstName', 'ASC']],// sắp xếp theo
                raw : true,
                nest : true
            })
            thanhcong({
                errCode : 0,
                data : doctors
            })
        } catch (error) {
            thatbai(error)
        }
    })
}


let checkrequiredFields = (data) => {
    let arr = [ 'doctorId','contentHTML','contentMarkdown',
                'action','selectedPrice','selectedProvince',
                'selectedPayment','nameClinic','addressClinic',
                'note','specialtyId','clinicId'
            ]

    let isValid = true
    let element = ''
    for(let i = 0;i<arr.length; i++){
        if(!data[arr[i]]){
            isValid = false
            element = arr[i]
            return {
                isValid,
                element
            }
        }
    }
    return {
        isValid,
        element
    }
}


let saveDetailInfoDoctor = (data) => {
    return new Promise( async (thanhcong,thatbai) => {
        try {

            let check = checkrequiredFields(data)


            if(!check.isValid){
                thanhcong({
                    errCode : -1,
                    message : "LỖI THIẾU THAM SỐ "+check.element
                })
            }else{
                if(data.action === "CREATE"){
                    
                    await db.Markdown.create({
                            doctorId : data.doctorId,
                            contentHTML : data.contentHTML,
                            contentMarkdown : data.contentMarkdown,
                            description : data.description
                    })
                    thanhcong({
                        errCode : 0,
                        message : "Save info doctor success !"
                    })
                }
                if(data.action === "EDIT"){
                    let markdown = await db.Markdown.findOne({
                        where : {doctorId : data.doctorId},
                    })
                    if(markdown){
                        markdown.contentHTML = data.contentHTML
                        markdown.contentMarkdown = data.contentMarkdown
                        markdown.description = data.description

                        await markdown.save();

                        thanhcong({
                            errCode : 0,
                            message : "Save info doctor success !"
                        })
                    }else{
                        thanhcong({
                            errCode : -3,
                            message : "Server errer"
                        })
                    }
                }
                let DoctorInfor = await db.Doctor_infor.findOne({
                    where : {
                        doctorId : data.doctorId,
                    },
                    raw : false
                })
    
                if(DoctorInfor){// update
                    DoctorInfor.doctorId = data.doctorId
                    DoctorInfor.priceId = data.selectedPrice
                    DoctorInfor.provinceId = data.selectedProvince
                    DoctorInfor.paymentId = data.selectedPayment
                    DoctorInfor.nameClinic = data.nameClinic
                    DoctorInfor.addressClinic = data.addressClinic
                    DoctorInfor.note = data.note
                    DoctorInfor.specialtyId = data.specialtyId
                    DoctorInfor.clinicId = data.clinicId

                    await DoctorInfor.save();
                }else{//create
                    await db.Doctor_infor.create({
                        doctorId : data.doctorId,
                        priceId : data.selectedPrice,
                        provinceId : data.selectedProvince,
                        paymentId : data.selectedPayment,
                        nameClinic : data.nameClinic,
                        addressClinic : data.addressClinic,
                        note : data.note,
                        specialtyId : data.specialtyId,
                        clinicId : data.clinicId
                    })
                }
            }



        } catch (error) {
            console.log(error)
            thatbai(error)
        }
    })
}

let getDetailDoctorByIdService = (id) => {
    return new Promise( async (thanhcong, thatbai) => {
        try {
            if(!id){
                thanhcong({
                    errCode : 1,
                    errMessage : "lỗi rồi"
                })
            }else{
                let data = await db.User.findOne({
                    where : {id : id},
                    attributes : {
                        exclude : ['password']
                    },
                    include : [
                        { model:db.Markdown,},
                        { model:db.Allcode, as : 'positionData', attributes : ['valueEn', 'valueVi'] },
                        { 
                            model:db.Doctor_infor,
                            include : [
                                { model:db.Allcode, as : 'priceTypeData', attributes : ['valueEn', 'valueVi'] },
                                { model:db.Allcode, as : 'provinceTypeData', attributes : ['valueEn', 'valueVi'] },
                                { model:db.Allcode, as : 'paymentTypeData', attributes : ['valueEn', 'valueVi'] }
                            ]
                        },

                    ],

                    // raw : true,
                    raw : false,
                    nest : true
                })

                if(data && data.image){ // xử lý ảnh bên db
                    data.image = new Buffer(data.image, 'base64').toString('binary'); // giải mã từ Buffer -> về ảnh ra view
                }

                thanhcong({
                    errCode : 0,
                    data : data
                })
            }
        } catch (error) {
            console.log(error)
            thatbai(error)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async(thanhcong,thatbai)=>{
        try {
            console.log("check",data)
            if(!data.arrSchedule && !data.doctorId && !data.date){
                thanhcong({
                    errCode : -1,
                    message : "Thiếu tham số"
                })
            }else{
                let schedule = data.arrSchedule
                if( schedule && schedule.length > 0){
                    schedule = schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }

                let existing = await db.Schedule.findAll({
                    where :{doctorId : data.doctorId, date : data.date},
                    attributes :['timeType','date','doctorId','maxNumber'],
                    raw : true
                })
                
                // Formating lại kiểu datetime của db về kiểu timetate để so sánh
                // if( existing && existing.length > 0){
                //     existing = existing.map((item) => {
                //         item.date = new Date(item.date).getTime();
                //         return item
                //     })
                // }
                // tìm sự khác biệt
                let toCreate = _.differenceWith(schedule, existing,(a, b)=>{
                    return a.timeType === b.timeType && a.date === b.date
                })
                
                // console.log("--------------------------------------0")
                // console.log("check data from clinet", schedule)
                // console.log("--------------------------------------1")
                // console.log("check data from server", existing)
                // console.log("--------------------------------------2")
                // console.log("check data from toCreate", toCreate)
                if(toCreate && toCreate.length > 0){
                    await db.Schedule.bulkCreate(toCreate) // sưu nhiều atruongwf vào db
                }
            }

            thanhcong({
                errCode : 0,
                message : "thanh cong"
            })
        } catch (error) {
            console.log(error)
            thatbai(error)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise( async (thanhcong,thatbai) => {
        try {
            if(!doctorId || !date){
                thanhcong({
                    errCode : -1,
                    message : "thiết tham số"
                })
            }else{

                let data = await db.Schedule.findAll({  
                    where : {doctorId : doctorId, date : date },
                    include : [
                        { model:db.Allcode, as : 'timeTypeData', attributes : ['valueEn', 'valueVi'] },
                        { model:db.User, as : 'doctorData', attributes : ['firstName', 'lastName'] },
                    ],
                    // raw : true,
                    raw : false,
                    nest : true
                })

                thanhcong({
                    errCode : 0,
                    data : data
                })
            }
        } catch (error) {
            console.log(error)
            thatbai(error)
        }
    })
}

let getExtraInforDoctorById = (id) => {
    return new Promise( async (thanhcong,thatbai)=>{
        try {
            if(!id){
                thanhcong({
                    errCode : -1,
                    message : "thiếu tham số"
                })
            }else{
                let data = await db.Doctor_infor.findOne({
                    where : {doctorId : id},
                    include : [
                        { model:db.Allcode, as : 'priceTypeData', attributes : ['valueEn', 'valueVi'] },
                        { model:db.Allcode, as : 'provinceTypeData', attributes : ['valueEn', 'valueVi'] },
                        { model:db.Allcode, as : 'paymentTypeData', attributes : ['valueEn', 'valueVi'] }
                    ],
                    raw : false,
                    nest : true                       
                })

                if(data) {
                    thanhcong({
                        errCode : 0,
                        data : data
                    })
                }else{
                    thanhcong({
                        errCode  : -2,
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

let getProfileDoctorbyId = (id) => {
    return new Promise( async (thanhcong,thatbai)=>{
        try {
            if(!id){
                thanhcong({
                    errCode : 1,
                    errCode : "thiếu tham số"
                })
            }else{
                let data = await db.User.findOne({
                    where : {id : id},
                    attributes : {
                        exclude : ['password']
                    },
                    include : [
                        { model:db.Markdown,},
                        { model:db.Allcode, as : 'positionData', attributes : ['valueEn', 'valueVi'] },
                        { 
                            model:db.Doctor_infor,
                            include : [
                                { model:db.Allcode, as : 'priceTypeData', attributes : ['valueEn', 'valueVi'] },
                                { model:db.Allcode, as : 'paymentTypeData', attributes : ['valueEn', 'valueVi'] },
                                { model:db.Allcode, as : 'provinceTypeData', attributes : ['valueEn', 'valueVi'] }
                            ]
                        },

                    ],

                    // raw : true,
                    raw : false,
                    nest : true 
                })

                if(data && data.image){ // xử lý ảnh bên db
                    data.image = new Buffer(data.image, 'base64').toString('binary'); // giải mã từ Buffer -> về ảnh ra view
                }

                thanhcong({
                    errCode : 0,
                    data : data
                })
            }
        } catch (error) {
            console.log(error)
            thatbai()
        }
    })
}

let getListPatientForDoctor = (id , date) => {
    return new Promise( async (thanhcong,thatbai) => {
        try {
            if(!id || !date){
                thanhcong({
                    errCode : 1,
                    errCode : "thiếu tham số"
                })
            }else{
                let data = await db.Booking.findAll({
                    where : {doctorId : id, statusId : 'S2' , date : date},
                    include : [
                        { model:db.Allcode, as : 'timeTypeDataPatient', attributes : ['valueEn', 'valueVi'] },
                        { 
                            model:db.User, as :'patientData',
                            include : [
                                { model:db.Allcode, as : 'genderData', attributes : ['valueEn', 'valueVi'] },
                            ]
                        },
                        
                    ]
                })
                thanhcong({
                    errCode : 1,
                    data : data
                })
            }
        } catch (error) {
            console.log(error)
            thatbai()
        }
    })
}



let sendremedy = (data) => {
    return new Promise( async (thanhcong, thatbai) => {
        try {
            if(!data.email || !data.doctorId || !data.patientId || !data.timeType || !data.id){
                thanhcong({
                    errCode : 1,
                    errCode : "thiếu tham số"
                })
            }else{
                //update
                let appointment = await db.Booking.findOne({
                    where : {
                        doctorId : data.doctorId ,
                        patientId : data.patientId ,
                        timeType : data.timeType,
                        id : data.id
                    },
                    raw : false
                })

                if(appointment){
                    appointment.statusId = 'S3'
                    await appointment.save()

                    // send email

                    await emailService.sendAttachment({
                        email : data.email,
                        name : data.name,
                        imgBase64 : data.imgBase64,
                        language : data.language,
                    })


                    thanhcong({
                        errCode : 0,
                        message : "oke"
                    })

                }else{
                    thanhcong({
                        errCode : 1,
                        errCode : "thiếu tham số"
                    })
                }


            }
        } catch (error) {
            console.log(error)
            thatbai()
        }
    }) 
}


module.exports = {
    getTopdoctorHome,
    getAllDoctors,
    saveDetailInfoDoctor,
    getDetailDoctorByIdService,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorbyId,
    getListPatientForDoctor,
    sendremedy
}