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

    status: {
        type: String,
    },

    sampleSource: {
        type: String,
    },

    method: methodology,
    physicalMethod: phyMethodology,

    roaDetails: [roaModel],
    physicalDetails: [physicModel],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },


})

export default mongoose.model("Report", reportSchema, "reports")