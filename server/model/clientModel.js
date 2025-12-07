import mongoose from "mongoose";

const sampleModel = new mongoose.Schema({
    
    sampleDescription: {
        type: String,
    },
    methodReq:{
        type: String,
    },
    customerCode: {
        type: String,
    }, 
    labCode:{
        type: String,
    },
    noOfSample:{
        type: Number,
    },
    unitCost:{
        type: String,
    },
    totalCost:{
        type: Number,
    }
});

const coordinatesModel = new mongoose.Schema({
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    }
});


const clientSchema = new mongoose.Schema ({

    requestId:{
        type: String,
        required: true,
        unique: true,
    },
    clientType: {
        type: String,
    },

    clientName: {
        type: String,
    },

    clientAddress: {
        type: String,
    },

    clientEmail: {
        type: String,
    },

    clientContact: {
        type: String,
    },

    clientGender: {
        type: String,
    },

    sampleDisposal: {
        type: Date,
    },

    sampleDisposedBy:{
        type: String,
    },

    reportDue :{
        type: Date,
        
    },

    transactionDate: {
        type: Date,
        default: Date.now,
    },

    receivedBy:{
        type: String,
        
    },

    status:{
        type: String,
    },

    sampleDetails: [sampleModel],

    coordinates: [coordinatesModel],

    locOfFarm: {
        type: String,
    },

    topography:{
        type: String,
    },

    cropsPlanted:{
        type: String,
    },

    area:{
        type: String,       
    },

    samplingDate: {
        type: Date,
    },
    samplingTime: {
        type: String,
    },
    sampleCondition: {
        type: String
    },
    otherMatters:{
        type: String
    },

    orNo:{
        type: String,
    },

    amountPaid:{
        type: Number,
    },

    unPaidBalance:{
        type: Number,
    },

    subTotal:{
        type: Number,
    },

    discount:{
        type: Number,
    },

    totalPhp:{
        type: Number,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

})

export default mongoose.model("Client", clientSchema, "clients");
