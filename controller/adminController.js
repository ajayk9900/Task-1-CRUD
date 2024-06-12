const { log } = require('console');
const admin = require('../models/adminModel');
const fs = require('fs')
const path = require('path');
const { options } = require('../routes/admin');
const { check, validationResult } = require('express-validator');

module.exports.addAdmin = async (req, res) => {
    return res.render('addAdmin');
}

// Express-Validator 

// module.exports.insertAdminRecord =
//     check('name').isLength({ min: 5 }).withMessage("Name is required")
// async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.render('addAdmin', { errors: errors.array() });
//         }
//     }
//     catch (err) {
//         console.log(err);
//         return res.redirect('back');
//     }
// }


module.exports.insertAdminRecord = async (req, res) => {
    try {
        let img = '';
        if (req.file) {
            img = await admin.imgPaths + "/" + req.file.filename;
        }
        req.body.adminImg = img;
        req.body.isActive = true;
        req.body.created_date = new Date().toLocaleString();
        req.body.updated_date = new Date().toLocaleString();
        let adminData = await admin.create(req.body);
        if (adminData) {
            console.log("Record inserted successfully");
            return res.redirect('back');
        }
        else {
            console.log("Record not inserted");
            return res.redirect('back');
        }

    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.view_admin = async (req, res) => {
    let search = '';
    if (req.query.search) {
        search = req.query.search;
    }

    let perPage = 2;
    if (req.query.page) {
        page = req.query.page;
    }
    else {
        var page = 0;
    }

    let totalAdminData = await admin.find({
        $or: [
            { 'name': { $regex: '.*' + search + '.*', $options: 'i' } },
            { 'email': { $regex: '.*' + search + '.*', $options: 'i' } },
            { 'number': { $regex: '.*' + search + '.*', $options: 'i' } }
        ]
    }).limit(perPage).skip(perPage * page);


    let adminData = await admin.find({
        $or: [
            { 'name': { $regex: '.*' + search + '.*', $options: 'i' } },
            { 'email': { $regex: '.*' + search + '.*', $options: 'i' } },
            { 'number': { $regex: '.*' + search + '.*', $options: 'i' } }
        ]
    }).countDocuments();
    let perPagedata = Math.ceil(adminData / perPage);
    return res.render('view_admin', {
        totalAdminData: totalAdminData,
        search: search,
        perPagedata: perPagedata,
        perPage: page
    });
}

module.exports.editAdminData = async (req, res) => {
    let editData = await admin.findById(req.params.id);
    return res.render('updateAdmin', { editData });
}

module.exports.editAdminRecord = async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    try {
        if (req.file) {
            let oldData = await admin.findById(req.body.editId);
            // console.log(oldData);
            if (oldData) {
                if (oldData.adminImg) {
                    let fullPath = path.join(__dirname, "..", oldData.adminImg);
                    await fs.unlinkSync(fullPath);
                }
                req.body.adminImg = await admin.imgPaths + "/" + req.file.filename;
                req.body.updated_date = new Date().toLocaleString();
                let updates = await admin.findByIdAndUpdate(req.body.editId, req.body);
                if (updates) {
                    console.log("record updated successfully");
                    return res.redirect('back');
                }
                else {
                    console.log("record not updated");
                    return res.redirect('back');
                }
            }
            else {
                console.log('Record not found');
                return res.redirect('back');
            }
        }
        else {
            let oldData = await admin.findById(req.body.editId);
            if (oldData) {
                req.body.adminImg = oldData.adminImg;
                req.body.updated_date = new Date().toLocaleString();
                let updates = await admin.findByIdAndUpdate(req.body.editId, req.body);
                if (updates) {
                    console.log("Record update");
                    return res.redirect('back');
                }
                else {
                    console.log("Record not update");
                    return res.redirect('back');
                }
            }

        }
    }
    catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

module.exports.deleteAdminData = async (req, res) => {
    try {
        let oldData = await admin.findById(req.params.id);
        if (oldData) {
            let oldImg = oldData.adminImg;
            if (oldImg) {
                let fullPath = path.join(__dirname, "..", oldData.adminImg);
                await fs.unlinkSync(fullPath);
                let deleteData = await admin.findByIdAndDelete(req.params.id);
                if (deleteData) {
                    console.log("Admin record deleted");
                    return res.redirect('back');
                }
                else {
                    console.log('Record not deleted');
                    return res.redirect('back');
                }
            }
            else {
                let deleteData = await admin.findByIdAndDelete(req.params.id);
                if (deleteData) {
                    console.log("Data deleted successfully..");
                    return res.redirect('back');
                }
                else {
                    console.log("Record not found");
                    return res.redirect('back');
                }
            }
        }
        else {
            console.log("Data not found");
            return res.redirect("back");
        }
    }
    catch (err) {
        console.log("Something wrong", err);
        return res.redirect('back');
    }
}

module.exports.isActive = async (req, res) => {
    try {
        if (req.params.id) {
            let active = await admin.findByIdAndUpdate(req.params.id, { isActive: false });
            if (active) {
                console.log("Data deActive Successfully");
                return res.redirect('back');
            }
            else {
                console.log("Data not activated");
                return res.redirect('back');
            }
        }
        else {
            console.log("Data not found");
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log("Something wrong");
        return res.redirect('back');
    }
}

module.exports.deActive = async (req, res) => {
    // console.log(req.params.id);
    try {
        if (req.params.id) {
            let deActive = await admin.findByIdAndUpdate(req.params.id, { isActive: true });
            if (deActive) {
                console.log("Data Active Successfully");
                return res.redirect('back');
            }
            else {
                console.log('Data not activated');
                return res.redirect('back');
            }
        }
        else {
            console.log("Data not found");
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log("Something wrong");
        return res.redirect('back');
    }
}

module.exports.multipleDelete = async (req, res) => {
    console.log(req.body);
    try {
        let deleteData = await admin.deleteMany({ _id: { $in: req.body.adminIds } });
        console.log(deleteData);
    }
    catch (err) {
        console.log("Something wrong", err);
        return res.redirect('back');
    }
}