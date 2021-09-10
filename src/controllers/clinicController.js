import clinicService from '../service/clinicService'

let createNewClinic = async (req,res) => {
    try {
        let infor = await clinicService.createNewClinic(req.body)
        res.status(200).json(infor)

    } catch (error) {
        res.status(200).json({
            errCode : -1,
            message : 'Error from server'
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let infor = await clinicService.getAllClinic()
        res.status(200).json(infor)

    } catch (error) {
        res.status(200).json({
            errCode : -1,
            message : 'Error from server'
        })
    }
}

let getDetaiClinicById = async (req, res) => {
    try {
        let infor = await clinicService.getDetaiClinicById(req.query.id)
        res.status(200).json(infor)

    } catch (error) {
        res.status(200).json({
            errCode : -1,
            message : 'Error from server'
        })
    }
}

module.exports = {
    createNewClinic,
    getAllClinic,
    getDetaiClinicById
}