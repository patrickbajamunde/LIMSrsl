import mongoose from "mongoose";

const methodResults = new mongoose.Schema({
    method1Results: { type: String },
    method2Results: { type: String },
    method3Results: { type: String },
    method4Results: { type: String },
    method5Results: { type: String },
    method6Results: { type: String },
})

const roaModel = new mongoose.Schema({
    labCode: {
        type: String,
    },

    customerCode: {
        type: String,
    },

    sampleDescription: {
        type: String,
    },


    result: {
        type: String
    },

    results: methodResults,

    testMethod: {
        type: String
    },
})


const physicResults = new mongoose.Schema({
    physc1Result: { type: String },
    physc2Result: { type: String },
    physc3Result: { type: String },
    physc4Result: { type: String },
    physc5Result: { type: String },
    physc6Result: { type: String },
})

const physicModel = new mongoose.Schema({
    labCode: {
        type: String,
    },

    customerCode: {
        type: String,
    },

    sampleDescription: {
        type: String,
    },

    results: physicResults,

    testMethod: {
        type: String
    },
})

const methodology = new mongoose.Schema({
    method1: { type: String },
    method2: { type: String },
    method3: { type: String },
    method4: { type: String },
    method5: { type: String },
    method6: { type: String },
})

const phyMethodology = new mongoose.Schema({
    physical1: { type: String },
    physical2: { type: String },
    physical3: { type: String },
    physical4: { type: String },
    physical5: { type: String },
    physical6: { type: String },
})

const interpretationTable = new mongoose.Schema({
    parameter1: { type: String },
    parameter2: { type: String },
    parameter3: { type: String },
    parameter4: { type: String },
    data1: { type: String },
    data2: { type: String },
    data3: { type: String },
    data4: { type: String },
    data5: { type: String },
    data6: { type: String },
    data7: { type: String },
    data8: { type: String },
    data9: { type: String },
    data10: { type: String },
    data11: { type: String },
    data12: { type: String },
    data13: { type: String },
    data14: { type: String },
    data15: { type: String },
    data16: { type: String },
    data17: { type: String },
    data18: { type: String },
})

const reportSchema = new mongoose.Schema({

    customerName: {
        type: String,
    },

    customerAddress: {
        type: String,
    },

    customerContact: {
        type: String
    },

    dateReceived: {
        type: Date,
    },

    datePerformed: {
        type: String,
    },

    dateIssued: {
        type: Date
    },

    reportId: {
        type: String,
        unique: true
    },

    analyzedBy: {
        type: String,
    },

    analystPRC: {
        type: String,
    },
    position: {
        type: String,
    },

    analyzedBy2: {
        type: String,
    },
    analystPRC2: {
        type: String,
    },
    position2: {
        type: String,
    },

    status: {
        type: String,
    },

    sampleSource: {
        type: String,
    },

    method: methodology,
    physicalMethod: phyMethodology,
    interpretation: interpretationTable,

    roaDetails: [roaModel],
    physicalDetails: [physicModel],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userName: {
        type: String,
    },
    url:{
        type: String,
    },
    qrCode: {
        type: String,
    }


})

export default mongoose.model("Report", reportSchema, "reports")