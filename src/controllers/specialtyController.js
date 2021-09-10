import specialtyServive from '../service/specialtyServive'


let createNewSpecailty = async (req, res) => {
    try {
        let infor = await specialtyServive.createNewSpecailty(req.body)
        res.status(200).json(infor)

    } catch (error) {
        res.status(200).json({
            errCode : -1,
            message : 'Error from server'
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let infor = await specialtyServive.getAllSpecialty()
        res.status(200).json(infor)

    } catch (error) {
        res.status(200).json({
            errCode : -1,
            message : 'Error from server'
        })
    }
}


let getDetaiSpecialtyById = async (req, res) => {
    try {
        let infor = await specialtyServive.getDetaiSpecialtyById(req.query.id, req.query.location)
        res.status(200).json(infor)

    } catch (error) {
        res.status(200).json({
            errCode : -1,
            message : 'Error from server'
        })
    }
}


module.exports = {
    createNewSpecailty,
    getAllSpecialty,
    getDetaiSpecialtyById
}