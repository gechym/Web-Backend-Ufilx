require('dotenv').config()
const nodemailer = require("nodemailer");
import moment, { months } from 'moment';
import localization from 'moment/locale/vi';


let sendSimpleEmail = async (dataSend) => {
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: process.env.EMAIL_APP, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

                    // reciverEmail : data.email,
                    // pantientName : data.fullName,
                    // time : data.timeText,
                    // date : data.date,
                    // doctorName : data.doctorName,
                    // time : data.timeText,
                    // redirectLink : 'https://mail.google.com/mail/u/0/#inbox',

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"BookingCase.vn 🏥" <nguyenducbao166@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông Tin đặt lịch khám bệnh", // Subject line
        text: "", // plain text body
        html: getBodyHTML(dataSend)
    });

}


let getBodyHTML = (dataSend) => {
    if(dataSend.language === 'vi'){
        return `
        <h3>Xin Chào ${dataSend.pantientName} <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="25px"> </h3>
        <p>Bạn mới đặt lịch thành công ở <a href="#">BookingCase.vn</a></p>
        <p><b>Thông tin đặt lịch khám bệnh</b></p>
        <div>
            <b>Bác Sĩ</b> :<i><b> ${dataSend.doctorName}</b></i>
        </div>
        <div>
            <b>Thời Gian Đặt lịch</b> : <i>${moment.unix(+dataSend.date / 1000).format('dddd - DD/MM/YYYY')}  - ${dataSend.time}</i></b>
        </div>
        <div>
            <p>
                Nếu các thông tin bạn cung cấp cho chúng tôi là đúng sự thật thì vui lòng click vào đừng link dưới để bên hệ thống chúng tôi xác nhận bạn đã đặt lịch thành công

            </p>
            <a style="
                background-color: #4CAF50; 
                border: none;
                color: white;
                padding: 5px 15px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                border-radius : 10px;
            "  href="${dataSend.redirectLink}" target="_blank">Link xác nhận</a>
        </div>
        `
    }else{
        return`
            <h3> Hello ${dataSend.pantientName} <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="25px"> </h3>
            <p> You have successfully booked an appointment at <a href="#"> BookingCase.vn </a> </p>
            <p> <b> Medical Examination Information </b> </p>
            <div>
                <b>Doctor </b>: <i> <b> ${dataSend.doctorName} </b> </i>
            </div>
            <div>
                <b>Time Set Calendar</b>: <i> ${moment.unix (+ dataSend.date / 1000) .format ('dddd - DD/MM/YYYY')} - ${dataSend.time} </b> </i> </b>
            </div>
            <div>
                <p>
                    If the information you provide us, I am true, please click the link below to have our system confirm that you have successfully booked.

                </p>
                <a style="
                    background-color: #4CAF50; 
                    border: none;
                    color: white;
                    padding: 5px 15px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius : 10px;
                    " 
                    href="${dataSend.redirectLink}" target="_blank">Verified link </a>
            </div>
        `
    }
}


let sendAttachment = async (dataSend) => {
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: process.env.EMAIL_APP, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

                    // reciverEmail : data.email,
                    // pantientName : data.fullName,
                    // time : data.timeText,
                    // date : data.date,
                    // doctorName : data.doctorName,
                    // time : data.timeText,
                    // redirectLink : 'https://mail.google.com/mail/u/0/#inbox',

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"BookingCase.vn 🏥" <nguyenducbao166@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Hóa Đơn khám bệnh - Đơn thuốc", // Subject line
        text: "", // plain text body
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments : [
            // {   // encoded string as an attachment
            //     filename: `${dataSend.name}-hoadon.jpg`,
            //     content:dataSend.imgBase64.split('base64,')[1],
            //     encoding: 'base64'
            // },
            {   // use URL as an attachment
                filename :`${dataSend.name}-hoadon.jpg`,
                path: dataSend.imgBase64
            },
        ],


    });

}


let getBodyHTMLEmailRemedy = (dataSend) => {
    if(dataSend.language === 'vi'){
        return `
        <h3>Xin Chào ${dataSend.name}  <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="25px"> </h3>
        <p><a href="#">BookingCase.vn</a></p>
        <p><b>Cảm ơn bạn đã sử dụng dịch vụ khám bệnh bên chúng tôi</b></p>
        <div>
            <p>
                Thông tin đơn thuốc được gửi theo ảnh đính kèm. 
            </p>
        </div>
        `
    }else{
        return`
            <h3> Hello ${dataSend.name}  <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="25px"> </h3>
            <p> You have successfully booked an appointment at <a href="#"> BookingCase.vn </a> </p>
            <p> <b> Medical Examination Information </b> </p>
            <div>
                <p>
                    If the information you provide us, I am true, please click the link below to have our system confirm that you have successfully booked.
                </p>
            </div>
        `
    }
}



module.exports = {
    sendSimpleEmail,
    sendAttachment
}


