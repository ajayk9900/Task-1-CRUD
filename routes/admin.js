const express = require('express');
const routs = express.Router();

const admin = require('../models/adminModel');
const adminController = require('../controller/adminController');

routs.get('/', adminController.addAdmin);

routs.post('/insertAdminRecord', admin.uploadImg, adminController.insertAdminRecord);

routs.get('/view_admin', adminController.view_admin);

routs.get('/editAdminData/:id', adminController.editAdminData);

routs.post('/editAdminRecord', admin.uploadImg, adminController.editAdminRecord);

routs.get('/deleteAdminData/:id', adminController.deleteAdminData);

routs.get('/isActive/:id', adminController.isActive);

routs.get('/deActive/:id', adminController.deActive);

routs.post('/multipleDelete', adminController.multipleDelete);

module.exports = routs;