require('dotenv').config()
import db from '../models/index'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid';

import emailService from './emailService' 


let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.REACT_APP_URL}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}





let postBookAppointment = (data) => {
    return new Promise( async (thanhcong, thatbai) => {
        try {   
            if(!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName 
                || !data.gender   || !data.phoneNumber || !data.address || !data.reason ){
                thanhcong({
                    errCode : -1,
                    message : "LỖI THIẾU THAM SỐ"
                })
            }else{
                console.log(data)

                let token = uuidv4() // tạo token xác thực 
                let redirectLink = buildUrlEmail(data.doctorId, token)

                // await emailService.sendSimpleEmail({
                //     reciverEmail : data.email,
                //     pantientName : data.fullName,
                //     date : data.date,
                //     doctorName : data.doctorName,
                //     time : data.timeText,
                //     redirectLink : redirectLink,
                //     language : data.language
                // }) 


                // upsert patient
                const user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email : data.email,
                        gender : data.gender,
                        firstName : data.fullName,
                        phonenumber : data.phoneNumber,
                        address : data.address,
                        roleId : 'R3',
                    },
                    raw : true
                });
                // Check Create

                // chổ ni sẽ được code thêm vì check TimeType vs Date vs Patient có tồn tại thì ko add vô 
                // còn chưa có thì add


                let [use, isCreate] = user
                if(use){
                    let booking = await db.Booking.findOrCreate({
                        where: {patientId:use.id, timeType:data.timeType, date :data.date },
                        defaults: {
                            // id : use.id,// test thử
                            statusId : 'S1',
                            doctorId : data.doctorId,
                            patientId : use.id,
                            reason : data.reason,
                            date : data.date,
                            timeType : data.timeType,
                            token : token
                        },
                        raw : true,
                    })

                    let [book, isBook] = booking

                    if(isBook){

                        console.log('gửi mail')

                        await emailService.sendSimpleEmail({
                            reciverEmail : data.email,
                            pantientName : data.fullName,
                            date : data.date,
                            doctorName : data.doctorName,
                            time : data.timeText,
                            redirectLink : redirectLink,
                            language : data.language
                        }) 

                        thanhcong({
                            data : user,
                            errCode : 0,
                            message : "Thành công"
                        })
                    }else{
                        thanhcong({
                            errCode : -2,
                            message : "LỖI THIẾU THAM SỐ"
                        })
                    }

                    console.log('book ', isBook)


                }
            }
        } catch (error) {
            console.log(error)
            thatbai()
        }
    })
}


let postVerifyBookingAppointment = (data) => {
    return new Promise(async(thanhcong, thatbai) => {
        try {
            if(!data.token || !data.doctorId){
                thanhcong({
                    errCode : -1,
                    message : 'LỖI THIẾU THAM SỐ'
                })
            }else{
                let appointment = await db.Booking.findOne({
                    where : {
                        statusId : 'S1', 
                        token : data.token,
                        doctorId : data.doctorId
                    },
                    raw : false
                })  

                if(appointment){
                    appointment.statusId = 'S2'

                    console.log(appointment)

                    await appointment.save()
                    thanhcong({
                        errCode : 0,
                        message: 'thành công'
                    })
                }else{
                    thanhcong({
                        errCode : -1,
                        message: 'Có gì đó sai sai :))'
                    })
                }
            }
        } catch (error) {
            thatbai(error)
        }
    })
}

module.exports = {
    postBookAppointment,
    postVerifyBookingAppointment
}