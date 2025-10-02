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
        type: Number,
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

    clientGender: {
        type: String,
        
    },

    sampleDisposal: {
        type: Date,
        
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


    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

})

export default mongoose.model("Client", clientSchema, "clients");
