import doctorService from '../service/doctorService'

let getTopdoctorHome = async (req, res) => {
    let limit = req.query.limit
    if(!limit){ limit = 10 } // lấy tối đa 1 bản ghi
    try {
        let response = await doctorService.getTopdoctorHome(+limit)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            errCode : -1,
            message : 'Error from server'
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let response = await doctorService.getAllDoctors()
        res.status(200).json(response)
    } catch (error) {
        res.status(200).json({
            errCode : -1,
            message : 'Error from server'
        })
    }
}

let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body)
        res.status(200).json(response)
    } catch (error) {
        res.status(200).json({
            errCode : -1,
            message : 'Error from server'
        })
    }
}

let getDetailDoctorById = async (req,res) => {
    try {
        if(!req.query.id){
            res.status(200).json({
                errCode : 3,
                message : "Người dùng không tồn tại"
            })
        }else{
            let infor = await doctorService.getDetailDoctorByIdService(req.query.id)
            res.status(200).json(infor)
        }
    } catch (error) {
        res.status(200).json({
            errCode : 1,
            message : "server error !!"
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedule(req.body)
        res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            errCode : -1,
            message : "error sever"
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let schedule = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
        res.status(200).json(schedule)
    } catch (error) {
        res.status(200).json({
            errCode : -1,
            message : "error sever"
        })
    }
}



let getExtraInforDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId)
        res.status(200).json(infor)
    } catch (error) {
        res.status(200).json({
            errCode : -1,
            message : "error sever"
        })
    }
}

let getProfileDoctorbyId = async (req, res) => {
    try {
        let infor = await doctorService.getProfileDoctorbyId(req.query.doctorId)
        res.status(200).json(infor)
    } catch (error) {
        res.status(200).json({
            errCode : -1,
            message : "error sever"
        })
    }
}


let getListPatientForDoctor = async (req, res) => {
    try {
        let infor = await doctorService.getListPatientForDoctor(req.query.doctorId,req.query.date)
        res.status(200).json(infor)
    } catch (error) {
        res.status(200).json({
            errCode : -1,
            message : "error sever"
        })
    }
}

let sendremedy = async (req, res) => {
    try {
        let infor = await doctorService.sendremedy(req.body)
        res.status(200).json(infor)
    } catch (error) {
        res.status(200).json({
            errCode : -1,
            message : "error sever"
        })
    }
}

module.exports = {
    getTopdoctorHome,
    getAllDoctors,
    postInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorbyId,
    getListPatientForDoctor,
    sendremedy
}