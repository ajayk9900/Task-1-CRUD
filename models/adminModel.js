const mongoose = require('mongoose');
const multer = require('multer');
const imgPath = '/uploads';
const path = require('path');

const adminSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    number : {
        type : String,
        required : true
    },
    adminImg : {
        type : String,
        required : true
    },
    created_date : {
        type : String,
        required : true
    },
    updated_date : {
        type : String,
        required : true
    },
    isActive :{
        type : Boolean,
        required : true
    }
})

const adminStorage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,path.join(__dirname,"..",imgPath))
    },
    filename : (req,file,cb)=>{
        cb(null,file.fieldname+" - "+Date.now());
    }
})

adminSchema.statics.uploadImg = multer({storage : adminStorage}).single("adminImg");
adminSchema.statics.imgPaths = imgPath;

const admin = mongoose.model('Admin', adminSchema);
module.exports = admin;