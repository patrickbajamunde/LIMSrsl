import React, { use, useState } from 'react'
import './styles/arf.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Arf() {

  const client = {
    requestId: "",
    clientType: "",
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    clientContact: "",
    clientGender: "",
    sampleDisposal: "",
    sampleDisposedBy: "",
    reportDue: "",
    transactionDate: "",
    receivedBy: "",
    locOfFarm: "",
    topography: "",
    cropsPlanted: "",
    area: "",
    coordinates: {
      latitude: "",
      longitude: ""
    },
    samplingDate: "",
    samplingTime: "",
    sampleCondition: "",
    otherMatters: ""
  }

  const customerCategory = (clientType) => {
    const categoryMap = {
      "Regulatory": "RG",
      "Rice Program": "RP",
      "Corn Program": "CP",
      "High Value Crops Program": "HV",
      "Research Division": "RD",
      "LGU": "LG",
      "Student": "ST",
      "Private": "PR",
      "Farmer": "FR",
      "Government Agency": "GA",
      "Research": "RS"
    }
    return categoryMap[clientType] || "";
  }

  const testMethodPrice = (methodReq) => {
    const methodPriceMap = {
      "Method 1": 100,
      "Method 2": 200
    }

    return methodPriceMap[methodReq] || 0;
  }

  const [request, setRequest] = useState(client); // State to hold request data

  const [showModal, setShowModal] = useState(false);// state to modal activity
  const [sample, setSample] = useState([]); // State to hold sample details in an array
  const [sampleDetail, setSampleDetail] = useState({
    sampleDescription: "",
    methodReq: "",
    labCode: "",
    customerCode: "",
    noOfSample: "",
    unitCost: "",
    totalCost: ""
  }); // State to hold current state of sample details in the modal




  const [successMessage, setSuccessMessage] = useState("")

  const requestIdGenerator = (clientType) => {
    const getCategoryId = customerCategory(clientType)
    if (!getCategoryId) return '';

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const rfcal = 'RSL';
    const ar = 'AR';

    const defaultSequence = '0000';
    return `${year}-${month}-${rfcal}-${ar}-${defaultSequence}-${getCategoryId}`;
  }

  const computeCost = (unitCost, noOfSample) => {
    const getUnitCost = testMethodPrice(unitCost);
    const getSampleQuantity = parseInt(noOfSample);

    const totalCost = getUnitCost * getSampleQuantity;

    return totalCost;
  }


  const inputHandler = (e) => {
    const { name, value, dataset } = e.target;

    // Check if it has a data-parent attribute (nested property)
    if (dataset.parent) {
      setRequest({
        ...request,
        [dataset.parent]: {
          ...request[dataset.parent],
          [name]: value
        }
      });
    } else if (name === 'clientType') {
      const categoryId = requestIdGenerator(value);
      setRequest({
        ...request,
        clientType: value,
        requestId: categoryId,
      });

    } else {
      setRequest({ ...request, [name]: value });
    }
  };

  // Handler for modal sample inputs
  const sampleInputHandler = (e) => {
    const { name, value } = e.target;
    if (name === 'methodReq') {
      setSampleDetail({
        ...sampleDetail,
        methodReq: value,
        unitCost: testMethodPrice(value),
        totalCost: computeCost(value, sampleDetail.noOfSample)
      });
    } else {
      setSampleDetail({ ...sampleDetail, [name]: value });
    }
  }

  // Handler for submitting sample details
  const sampleSubmit = (e) => {
    setSample([...sample, sampleDetail]); // add new sampleDetail to samples array
    setSampleDetail({
      sampleDescription: "",
      parameterReq: "",
      methodReq: "",
      labCode: "",
      sampleCode: "",
      noOfSample: "",
      unitCost: "",
      totalCost: ""
    }); // reset the inputs of sampleDetails
    setShowModal(false); // close modal after adding sample
  }

  const submitForm = async (e) => {
    e.preventDefault();
    const form = { ...request, sampleDetails: sample, };
    await axios.post("http://localhost:8002/api/client/newClient", form,
      {
        withCredentials: true,
      }
    )
      .then((response) => {
        setSample([]); // Clear sample details after submission
        setRequest({
          requestId: "",
          clientType: "",
          clientName: "",
          clientAddress: "",
          clientEmail: "",
          clientContact: "",
          clientGender: "",
          sampleDisposal: "",
          sampleDisposedBy: "",
          reportDue: "",
          transactionDate: "",
          receivedBy: "",
          locOfFarm: "",
          topography: "",
          cropsPlanted: "",
          area: "",
          coordinates: {
            latitude: "",
            longitude: ""
          },
          samplingDate: "",
          samplingTime: "",
          sampleCondition: "",
          otherMatters: ""

        }); // Reset request form
        setSuccessMessage("Form submitted successfully!");

        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (

    <div className='d-flex mt-3 '>
      <div className=' analysis card container-fluid shadow-sm border bordered-darker  mb-5'>
        <div className='row g-6'>
          <div className='message col-md-4'>
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
          </div>
          <div className='head container rounded-top' style={{ backgroundColor: '#003e8fff' }}>

            <div className='mt-1'>
              <i className='bi bi-info-circle text-white fs-5 ms-1 me-1' />
              <span className='ms-2 fs-5 text-white'>Analysis Receiving Form</span>
            </div>
          </div>

          <form className='mt-3 mb-4' onSubmit={submitForm}>
            {/* --- Request Details --- */}
            <div className='card p-4 mb-3 shadow-sm border'>
              <h5 className='mb-4 text-primary fw-bold'>Request Details</h5>
              <div className='row g-4'>
                <div className='col-md-6'>
                  <label className='form-label'>Type Of Customer</label>
                  <select id='clientType' name="clientType" onChange={inputHandler} value={request.clientType} className='form-select border-dark'>
                    <option value="">Choose...</option>
                    <option value="Regulatory">Regulatory</option>
                    <option value="Corn Program">Corn Program</option>
                    <option value="Rice Program">Rice Program</option>
                    <option value="LGU">LGU</option>
                    <option value="Student">Student</option>
                    <option value="Private">Private</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Government Agency">Government Agency</option>
                    <option value="High Value Crops Program">High Value Crops Program</option>
                    <option value="Research">Research</option>
                  </select>
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Request ID</label>
                  <input type="text" className="form-control border border-dark" id="requestId" name="requestId" onChange={inputHandler} value={request.requestId} placeholder="Auto-generated" />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Transaction Date</label>
                  <input type="date" className="form-control border border-dark" id="transactionDate" name='transactionDate' value={request.transactionDate} onChange={inputHandler} />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Received By</label>
                  <select id='receivedBy' name='receivedBy' onChange={inputHandler} value={request.receivedBy} className='form-select border-dark'>
                    <option value="">Choose...</option>
                    <option value="Susan P. Bergantin">Susan P. Bergantin</option>
                    <option value="Jessa Mae M. Luces">Jessa Mae M. Luces</option>
                  </select>
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Location of Farm</label>
                  <input type="text" className="form-control border border-dark" id="locOfFarm" name='locOfFarm' value={request.locOfFarm} onChange={inputHandler} placeholder="Barangay, Municipality, Province" />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Topography</label>
                  <input type="text" className="form-control border border-dark" id="topography" name="topography" onChange={inputHandler} value={request.topography} placeholder="e.g. Upland, Lowland" />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Crops Planted</label>
                  <input type="text" className="form-control border border-dark" id="cropsPlanted" name='cropsPlanted' value={request.cropsPlanted} onChange={inputHandler} placeholder="e.g. Rice, Corn" />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Area</label>
                  <input type="text" className="form-control border border-dark" id="area" name="area" onChange={inputHandler} value={request.area} placeholder="e.g. 1.5" />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Longitude</label>
                  <input type="text" className="form-control border border-dark" data-parent='coordinates' id="longitude" name='longitude' value={request.coordinates.longitude} onChange={inputHandler} placeholder="e.g. 123.4567" />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Latitude</label>
                  <input type="text" className="form-control border border-dark" id="latitude" data-parent='coordinates' name="latitude" onChange={inputHandler} value={request.coordinates.latitude} placeholder="e.g. 10.1234" />
                </div>
              </div>
            </div>

            <div className='container-fluid shadow-sm border border-secondary border-1 mt-3'>
            </div>
            {/* --- Customer Details --- */}
            <div className='card p-4 mb-3 shadow-sm border mt-3'>
              <h5 className='mb-4 text-primary fw-bold'>Customer Details</h5>
              <div className='row g-4'>

                <div className='col-md-6'>
                  <label className='form-label'>Customer Name</label>
                  <input type="text" className="form-control border border-dark" id="clientName" name='clientName' value={request.clientName} onChange={inputHandler} placeholder="Full Name" />
                </div>

                <div className='col-md-6'>
                  <label className='form-label'>Email Address</label>
                  <input type="email" className="form-control border border-dark" id="clientEmail" name='clientEmail' value={request.clientEmail} onChange={inputHandler} placeholder="example@email.com" />
                </div>

                <div className='col-md-6'>
                  <label className='form-label'>Contact Number</label>
                  <input type="tel" className="form-control border border-dark" id="clientContact" name='clientContact' value={request.clientContact || ''} onChange={inputHandler} placeholder="09XXXXXXXXX" />
                </div>

                <div className='col-md-6'>
                  <label className='form-label'>Address</label>
                  <input type="text" className="form-control border border-dark" id="clientAddress" name='clientAddress' value={request.clientAddress} onChange={inputHandler} placeholder="Street, Barangay, City" />
                </div>

                <div className='col-md-6'>
                  <label className='form-label'>Gender</label>
                  <select id='clientGender' name="clientGender" onChange={inputHandler} value={request.clientGender} className='form-select border-dark'>
                    <option value="">Choose...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            <div className='container-fluid border border-secondary border-1 mt-3'></div>

            {/*Laboratory Services*/}

            <div className='card p-4 mb-3 mt-3 shadow-sm border'>
              <h5 className='mb-4 text-primary fw-bold'>Laboratory Services</h5>
              <div className="row g-4">

                <div className='col-md-6'>
                  <label className='form-label'>Date of Sample Disposal:</label>
                  <input type="date" className="form-control border border-dark" id="sampleDisposal" name='sampleDisposal' value={request.sampleDisposal} onChange={inputHandler} placeholder="" />
                </div>

                <div className='col-md-6'>
                  <label className='form-label'>Report Due Date:</label>
                  <input type="date" className="form-control border border-dark" id="reportDue" name='reportDue' value={request.reportDue} onChange={inputHandler} placeholder="" />
                </div>

                <div className='col-md-6'>
                  <label className='form-label'>Sample Disposed By:</label>
                  <input type="text" className="form-control border border-dark" id="sampleDisposedBy   " name='sampleDisposedBy' value={request.sampleDisposedBy} onChange={inputHandler} placeholder="" />
                </div>
              </div>
              <div className='d-flex justify-content-between align-items-center mb-3 mt-4'>
                <button
                  type="button"
                  className="btn btn-primary" onClick={() => setShowModal(true)}>
                  <i className="bi bi-plus-lg me-2 fs-6"></i>Add Sample Details
                </button>
              </div>
              <div className="row">
                <div className="col-12">
                  <table className="table table-bordered rounded">
                    <thead className="table-primary">
                      <tr>
                        <th>No. of Samples</th>
                        <th>Customer Code</th>
                        <th>Lab Code</th>
                        <th>Sample Description</th>
                        <th>Test Requested - Test Method</th>
                        <th>Unit Cost</th>
                        <th>Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sample.length > 0 ? (
                        sample.map((sampleItem, index) => (
                          <tr key={index}>
                            <td>{sampleItem.noOfSample}</td>
                            <td>{sampleItem.customerCode}</td>
                            <td>{sampleItem.labCode}</td>
                            <td>{sampleItem.sampleDescription}</td>
                            <td>{sampleItem.methodReq}</td>
                            <td>{sampleItem.unitCost}</td>
                            <td>{sampleItem.totalCost}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">No samples added yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className='container-fluid border border-secondary border-1 mt-3'></div>
            {/*Other Matters*/}
            <div className='card p-4 mb-3 shadow-sm border mt-3'>
              <h5 className='mb-4 text-primary fw-bold'>Sample Remarks</h5>
              <div className="row g-4">

                <div className='col-md-6'>
                  <label className='form-label'>Sampling Date:</label>
                  <input type="date" className="form-control border border-dark" id="samplingDate" name='samplingDate' value={request.samplingDate} onChange={inputHandler} placeholder="" />
                </div>

                <div className='col-md-6'>
                  <label className='form-label'>Sample Condition:</label>
                  <input type="text" className="form-control border border-dark" id="sampleCondition" name='sampleCondition' value={request.sampleCondition} onChange={inputHandler} placeholder="" />
                </div>

                <div className='col-md-6'>
                  <label className='form-label'>Sampling Time:</label>
                  <input type="time" className="form-control border border-dark" id="samplingTime   " name='samplingTime' value={request.samplingTime} onChange={inputHandler} placeholder="" />
                </div>

                <div className='col-md-6'>
                  <label className='form-label'>Other Matters:</label>
                  <input type="text" className="form-control border border-dark" id="otherMatters" name='otherMatters' value={request.otherMatters} onChange={inputHandler} placeholder="" />
                </div>
              </div>
            </div>

            <div className='col-md-6 gap-3 offset-md-6 d-flex justify-content-end pe-3'>
              <button type="button" className="btn btn-primary col-md-3" onClick={submitForm}>Submit Request</button>
            </div>
          </form>
        </div>
      </div>
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={sampleSubmit} method="post">

                <div className="modal-header">
                  <h5 className="modal-title">Add Sample Details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>

                <div className="modal-body">

                  <div>
                    <label className='form-label'>No. of Samples</label>
                    <input
                      type='text'
                      className='form-control border-dark'
                      name='noOfSample'
                      value={sampleDetail.noOfSample}
                      onChange={sampleInputHandler}
                    />
                  </div>

                  <div>
                    <label className='form-label'>Customer Code</label>
                    <input
                      type='text'
                      className='form-control border-dark'
                      name='customerCode'
                      value={sampleDetail.customerCode}
                      onChange={sampleInputHandler}
                    />
                  </div>

                  <div>
                    <label className='form-label'>Lab Code</label>
                    <input
                      type='text'
                      className='form-control border-dark'
                      name='labCode'
                      value={sampleDetail.labCode}
                      onChange={sampleInputHandler}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Sample Description</label>
                    <input
                      type="text"
                      className="form-control border border-dark"
                      name="sampleDescription"
                      value={sampleDetail.sampleDescription}
                      onChange={sampleInputHandler}
                      required
                    />
                  </div>

                  <div className='col-md-6'>
                    <label className='form-label'>Test Requested - Test Method</label>
                    <select id='methodReq' name='methodReq' onChange={sampleInputHandler} value={sampleDetail.methodReq} className='form-select border-dark'>
                      <option value="">Choose...</option>
                      <option value="Method 1">Method 1</option>
                      <option value="Method 2">Method 2</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Unit Cost</label>
                    <input
                      type="text"
                      className="form-control border border-dark"
                      name="unitCost"
                      value={sampleDetail.unitCost}
                      onChange={sampleInputHandler}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Total Cost</label>
                    <input
                      type="text"
                      className="form-control border border-dark"
                      name="totalCost"
                      value={sampleDetail.totalCost}
                      onChange={sampleInputHandler}
                      required
                    />
                  </div>

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowModal(false);
                    setSampleDetail({
                      sampleDescription: "",
                      methodReq: "",
                      labCode: "",
                      customerCode: "",
                      noOfSample: "",
                      unitCost: "",
                      totalCost: ""
                    });
                  }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Arf
