import patientService from '../service/patientService'

let postBookAppointment = async (req, res) => {
    try {
        let response = await patientService.postBookAppointment(req.body)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            errCode : -1,
            message : "error sever"
        })
    }
}

let postVerifyBookingAppointment = async (req, res) => {
    try {
        await setTimeout( async ()=>{
            let response = await patientService.postVerifyBookingAppointment(req.body)
            res.status(200).json(response)
        }, 5000)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            errCode : -1,
            message : "error sever"
        })
    }
}

module.exports = {
    postBookAppointment,
    postVerifyBookingAppointment,
}