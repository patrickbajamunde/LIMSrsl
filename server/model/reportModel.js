import mongoose from "mongoose";

const roaModel = new mongoose.Schema({
     labCode:{
        type: String,
    },

    customerCode:{
        type: String,
    },

    sampleDescription:{
        type: String,
    },


    result:{
        type: String
    },

    testMethod:{
        type: String
    },
})

const reportSchema = new mongoose.Schema({
    
    customerName:{
        type: String,
    },

    customerAddress:{
        type: String,
    },

    customerContact:{
        type: String
    },

    dateReceived:{
        type: Date,
    },

    datePerformed:{
        type: String,
    },

    dateIssued:{
        type: Date
    },

    reportId:{
        type: String,
        unique: true
    },

    analyzedBy:{
        type: String,
    },  

    analystPRC:{
        type: String,
    },

    status:{
        type: String,
    },

    sampleSource:{
        type: String,
    },

    method1:{type: String},
    method2:{type: String},
    method3:{type: String},
    method4:{type: String},
    method5:{type: String},
    method6:{type: String},
    roaDetails: [roaModel],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },


})

export default mongoose.model("Report", reportSchema, "reports")