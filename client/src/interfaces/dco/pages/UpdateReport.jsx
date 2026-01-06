import React from 'react'
import '../forms/styles/arf.css'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { RoaModal } from '../components/modal/Modal';
import { PhysicalModal } from '../components/modal/PhysicalModal';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function UpdateReport() {

  const defReportId = () => {
    const now = new Date()
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0')

    const rfcal = 'RSL'
    const roa = 'ROA';

    const numberSeries = '0000';
    return `${year}-${month}-${rfcal}-${roa}-${numberSeries}`
  }

  const report = {
    customerName: "",
    customerAddress: "",
    customerContact: "",
    dateReceived: "",
    datePerformed: "",
    dateIssued: "",
    reportId: defReportId(),
    analyzedBy: "",
    status: "For release",
    sampleSource: "",
    method: [{
      method1: '',
      method2: '',
      method3: '',
      method4: '',
      method5: '',
      method6: '',
    }],
    physicalMethod: [{
      physical1: '',
      physical2: '',
      physical3: '',
      physical4: '',
      physical5: '',
      physical6: ''
    }]
  }

  const analystPRC = (analyzedBy) => {
    const PrcTable = {
      "Maryfranie I. Belano, RChT": "0004756",
      "Krizza Ashley V. Baloloy, RChT": "0007263"
    }
    return PrcTable[analyzedBy] || "";
  }

  const designation = (analyzedBy) => {
    const DesignationTable = {
      "Maryfranie I. Belano, RChT": "Laboratory Analyst",
      "Krizza Ashley V. Baloloy, RChT": "Laboratory Analyst"
    }
    return DesignationTable[analyzedBy] || "";
  }

  const [result, setResult] = useState(report);

  //date setState
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  //modal setState
  const [showModal, setShowModal] = useState(false)
  const [physicalModal, setPhysicalModal] = useState(false)

  const [roaReport, setRoaReport] = useState([]) //holds sample details in an array
  const [physicalReport, setPhysicalReport] = useState([])

  const [reportDetails, setReportDetails] = useState({
    labCode: '',
    customerCode: '',
    sampleDescription: '',
    results: {
      method1Results: ''
    },
    testMethod: ''
  });// state of report details before change in the modal

  const [physicalDetails, setPhysicalDetails] = useState({
    labCode: '',
    customerCode: '',
    sampleDescription: '',
    results: {
      physc1Result: ''
    },
    testMethod: ''
  })

  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();

  const location = useLocation();
  const backRoute = location.state?.from || "/Dco/ForRelease/"
  const navigate = useNavigate()

  const inputHandler = (e) => {
    const { name, value, dataset } = e.target;
    if (name === 'analyzedBy' || name === 'datePerformed') {
      const prc = analystPRC(value);
      const position = designation(value);
      setResult({
        ...result,
        [name]: value,
        analystPRC: prc,
        position: position,
      });
    } else if (name === 'analyzedBy2') {
      const prc = analystPRC(value);
      const position = designation(value);
      setResult({
        ...result,
        [name]: value,
        analystPRC2: prc,
        position2: position,
      });
    } else if (name === 'datePerformedFrom') {
      setDateFrom(value);
    }
    else if (name === 'datePerformedTo') {
      setDateTo(value);
    }
    else if (dataset.parent) {
      setResult({
        ...result,
        [dataset.parent]: {
          ...result[dataset.parent],
          [name]: value
        }
      });
    }
    else {
      setResult({ ...result, [name]: value });
    }
  }

  const formatDateRange = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    const fromMonth = from.toLocaleDateString('en-US', { month: 'long' });
    const fromDay = from.getDate();
    const fromYear = from.getFullYear();

    const toMonth = to.toLocaleDateString('en-US', { month: 'long' });
    const toDay = to.getDate();
    const toYear = to.getFullYear();

    // Same month and year: "January 15 - 20, 2024"
    if (fromMonth === toMonth && fromYear === toYear) {
      return `${fromMonth} ${fromDay} - ${toDay}, ${fromYear}`;
    }
    // Same year, different months: "January 15 - February 20, 2024"
    else if (fromYear === toYear) {
      return `${fromMonth} ${fromDay} - ${toMonth} ${toDay}, ${fromYear}`;
    }
    // Different years: "December 15, 2023 - January 20, 2024"
    else {
      return `${fromMonth} ${fromDay}, ${fromYear} - ${toMonth} ${toDay}, ${toYear}`;
    }
  };

  const addDateRange = () => {
    if (dateFrom && dateTo) {
      const dateRange = formatDateRange(dateFrom, dateTo);
      const currentDates = result.datePerformed ? result.datePerformed + ', ' : '';

      setResult(prev => ({
        ...prev,
        datePerformed: currentDates + dateRange
      }));
      setDateFrom('');
      setDateTo('');
    }
  };

  const reportInputHandler = (name, value, parent) => {
    if (parent) {
      setReportDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [name]: value
        }
      }));
    } else {
      setReportDetails(prev => ({ ...prev, [name]: value }));
    }

  }

  const physicalInputHandler = (name, value, parent) => {
    if (parent) {
      setPhysicalDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [name]: value
        }
      }));
    } else {
      setPhysicalDetails(prev => ({ ...prev, [name]: value }))
    }
  }

  const openEditModal = (index) => {
    const reportToEdit = result.roaDetails[index];
    setReportDetails({
      customerCode: reportToEdit.customerCode,
      labCode: reportToEdit.labCode,
      sampleDescription: reportToEdit.sampleDescription,
      results: {
        method1Results: reportToEdit.results.method1Results,
        method2Results: reportToEdit.results.method2Results,
        method3Results: reportToEdit.results.method3Results,
        method4Results: reportToEdit.results.method4Results,
        method5Results: reportToEdit.results.method5Results,
        method6Results: reportToEdit.results.method6Results,
      },
      testMethod: reportToEdit.testMethod
    });
    setEditingIndex(index);
    setIsEditing(true);
    setShowModal(true)
  };

  const physicalEditModal = (index) => {
    const physicalReport = result.physicalDetails[index];
    setPhysicalDetails({
      customerCode: physicalReport.customerCode,
      labCode: physicalReport.labCode,
      sampleDescription: physicalReport.sampleDescription,
      results: {
        physc1Result: physicalReport.results.physc1Result,
        physc2Result: physicalReport.results.physc2Result,
        physc3Result: physicalReport.results.physc3Result,
        physc4Result: physicalReport.results.physc4Result,
        physc5Result: physicalReport.results.physc5Result,
        physc6Result: physicalReport.results.physc6Result,
      },
      testMethod: physicalReport.testMethod
    })
    setEditingIndex(index);
    setIsEditing(true);
    setPhysicalModal(true)
  };

  const deleteReport = (index) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      const updatedReport = result.roaDetails.filter((_, i) => i !== index);
      setResult({
        ...result,
        roaDetails: updatedReport
      });
    }
  }

  const deletePhysical = (index) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      const updatedPhysical = result.physicalDetails.filter((_, i) => i !== index);
      setResult({
        ...result,
        physicalDetails: updatedPhysical
      });
    }
  }


  const submitReport = (e) => {
    e.preventDefault();
    if (isEditing && editingIndex !== null) {
      const updatedReport = [...result.roaDetails];
      updatedReport[editingIndex] = reportDetails
      setResult({
        ...result,
        roaDetails: updatedReport
      });
    } else {
      const updatedReport = result.roaDetails ? [...result.roaDetails, reportDetails] : [reportDetails];
      setResult({
        ...result,
        roaDetails: updatedReport
      });
    }
    setReportDetails({
      labCode: '',
      customerCode: '',
      sampleDescription: '',
      results: {
        method1Results: ''
      },
      testMethod: ''
    });
    setShowModal(false);
    setIsEditing(false);
    setEditingIndex(null);
  }

  const submitPhysical = (e) => {
    e.preventDefault();
    if (isEditing && editingIndex !== null) {
      const updatedPhysical = [...result.physicalDetails];
      updatedPhysical[editingIndex] = physicalDetails
      setResult({
        ...result,
        physicalDetails: updatedPhysical
      });
    } else {
      const updatedPhysical = result.roaDetails ? [...result.physicalDetails, physicalDetails] : [physicalDetails];
      setResult({
        ...result,
        physicalDetails: updatedPhysical
      });
    }
    setPhysicalDetails({
      labCode: '',
      customerCode: '',
      sampleDescription: '',
      results: {
        physc1Result: ''
      },
      testMethod: ''
    });
    setPhysicalModal(false);
    setIsEditing(false);
    setEditingIndex(null);
  }


  const submitForm = async (e) => {
    e.preventDefault();
    const form = { ...result };
    await axios.put(`http://localhost:8002/api/report/update/report/${id}`, form, {
      withCredentials: true,
    })
      .then((response) => {
        setRoaReport([])
        setResult({
          customerName: "",
          customerAddress: "",
          customerContact: "",
          dateReceived: "",
          datePerformed: "",
          dateIssued: "",
          reportId: "",
          analyzedBy: "",
          analyzedBy2: "",
          sampleSource: "",
          method: {
            method1: '',
            method2: '',
            method3: '',
            method4: '',
            method5: '',
            method6: '',
          },
          physicalMethod: {
            physical1: '',
            physical2: '',
            physical3: '',
            physical4: '',
            physical5: '',
            physical6: ''
          },
          interpretation: {
            parameter1: '',
            parameter2: '',
            parameter3: '',
            parameter4: '',
            data1: '',
            data2: '',
            data3: '',
            data4: '',
            data5: '',
            data6: '',
            data7: '',
            data8: '',
            data9: '',
            data10: '',
            data11: '',
            data12: '',
            data13: '',
            data14: '',
            data15: '',
            data16: '',
            data17: '',
            data18: '',
          },
        })
        console.log("Report created successfully.")
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    axios.get(`http://localhost:8002/api/report/reportData/${id}`)
      .then((response) => {
        setResult(response.data)
      })
      .catch((error) => {
        console.error("Error fetching report details", error)
        setResult(null)
      })
  }, [id]);
  function formatDateForInput(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  }

  return (
    <div className='d-flex mt-3'>
      <div className='analysis card container-fluid shadow-sm border bordered-darker mb-5'>
        <div className='row g-6'>
          <div className='head container rounded-top' style={{ backgroundColor: '#003e8fff' }}>

            <div className='mt-1'>
              <i className='bi bi-info-circle text-white fs-5 ms-1 me-1' />
              <span className='ms-2 fs-5 text-white'>ROA Form</span>
            </div>
          </div>
          <form className='mt-4 mb-4' onSubmit={submitForm}>
            <div className='card p-4 mb-3 shadow-sm border'>
              <h5 className='mb-4 text-primary fw-bold'>Report Details</h5>
              <div className="row g-4">

                <div className="col-md-6">
                  <label htmlFor="clientType" className='form-label'>Report Id: </label>
                  <input type="tel" className="date form-control border-dark" name='reportId' onChange={inputHandler} value={result.reportId} placeholder="" />
                </div>

                <div className="col-md-6">
                  <label htmlFor="clientType" className=' form-label '>Analyzed By: </label>
                  <select className='form-select border-dark' name='analyzedBy' onChange={inputHandler} value={result.analyzedBy}>
                    <option defaultValue="Choose...">Choose...</option>
                    <option value="Maryfranie I. Belano, RChT">Maryfranie I. Belano</option>
                  </select>
                </div>

                <div className='col-md-6'>
                  <label className='form-label '>Date Issued: </label>
                  <input type="date" className="date form-control border-dark" name='dateIssued' onChange={inputHandler} value={formatDateForInput(result.dateIssued)} placeholder="" />
                </div>

                <div className='col-md-6'>
                  <label className='form-label'>Analyzed By: </label>
                  <select className='form-select border-dark' name='analyzedBy2' onChange={inputHandler} value={result.analyzedBy2}>
                    <option defaultValue="Choose...">Choose...</option>
                    <option value="Maryfranie I. Belano, RChT">Maryfranie I. Belano</option>
                    <option value="Krizza Ashley V. Baloloy, RChT">Krizza Ashley V. Baloloy</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className='form-label '>Date Received: </label>
                  <input type="date" className="date form-control border-dark" name='dateReceived' onChange={inputHandler} value={formatDateForInput(result.dateReceived)} placeholder="" />
                </div>

                <div className='col-md-6'>
                  {/*Date Performed*/}
                  <div className="col">
                    <div className='col-md'>
                      <div className='row'>
                        <label className=" col-md-3 col-form-label">Date Performed:</label>
                        <div className='col-md-9'>
                          <input type="text" className="date form-control border-dark" id="datePerformed" name="datePerformed" onChange={inputHandler} value={result.datePerformed} placeholder="" />
                        </div>
                      </div>
                    </div>

                    <div className=" row mt-4">

                      {/*FROM*/}
                      <div className="col-sm-5">
                        <div className="row ">
                          <label className="col-sm-4 col-form-label">From</label>
                          <div className="col-md-8">
                            <input
                              type="date"
                              className="form-control border-dark"
                              id="datePerformedFrom"
                              name="datePerformedFrom"
                              onChange={inputHandler}
                              value={dateFrom}

                            />
                          </div>
                        </div>
                      </div>

                      {/*TO*/}
                      <div className="col-sm-5">
                        <div className="row ">
                          <label className="col-sm-4 col-form-label ">To</label>
                          <div className="col-md-8">
                            <input
                              type="date"
                              className="form-control border-dark"
                              id="datePerformedTo"
                              name="datePerformedTo"
                              onChange={inputHandler}
                              value={dateTo}

                            />
                          </div>
                        </div>
                      </div>

                      {/*BUTTON*/}
                      <div className='col-sm d-flex align-items-center justify-content-center'>
                        <button type='button' className='btn btn-primary' onClick={addDateRange}><i className="bi bi-plus-lg fs-8"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>

            <div className='container-fluid shadow-sm border border-secondary border-1 mt-3' />

            {/*Customer Details*/}
            <div className='card p-4 mb-3 shadow-sm border mt-3'>
              <h5 className='mb-4 text-primary fw-bold'>Customer Details</h5>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className='form-label'>Customer Name:</label>
                  <input type="text" className="date form-control border-dark" name='customerName' onChange={inputHandler} value={result.customerName} placeholder="e.g. John P. Doe" />
                </div>

                <div className="col-md-6">
                  <label className='form-label'>Contact No./Email:</label>
                  <input type="tel" className="form-control border-dark" id="mobile" name='customerContact' onChange={inputHandler} value={result.customerContact} placeholder="e.g. 09123456789" />
                </div>

                <div className='col-md-6'>
                  <label className='form-label'>Address:</label>
                  <input type="text" className="date form-control border-dark" name='customerAddress' onChange={inputHandler} value={result.customerAddress} placeholder="Street, Barangay, City" />
                </div>

                <div className='col-md-6'>
                  <label className='form-label'>Sample Source:</label>
                  <input type="text" className="date form-control border-dark" name='sampleSource' onChange={inputHandler} value={result.sampleSource} placeholder="Street, Barangay, City" />
                </div>
              </div>
            </div>

            <div className='container-fluid border border-secondary border-1 mt-3' />

            <div className='card p-4 mb-3 mt-3 shadow-sm border'>
              <h5 className='mb-4 text-primary fw-bold'>Chemical Analysis Result</h5>

              <div className='d-flex mt-3'>
                <button
                  type="button"
                  className="btn btn-primary" onClick={() => setShowModal(true)}>
                  <i className="bi bi-plus-lg me-2 fs-6"></i>Add Sample Details
                </button>
              </div>

              {/*Table for ROA Details */}
              <div className="row mt-2">
                <div className="col-12">
                  <table className="table table-bordered">
                    <thead className="table-primary">
                      <tr className='text-center'>
                        <th rowSpan="4">CUSTOMER CODE</th>
                        <th rowSpan="2">LAB CODE</th>
                        <th rowSpan="2">SAMPLE DESCRIPTION</th>
                        <th colSpan="6">CHEMICAL ANALYSIS RESULT</th>
                        <th rowSpan="2">TEST METHOD</th>
                        <th rowSpan="2">ACTION</th>
                      </tr>
                      <tr className='text-center'>
                        <th>{result.method?.method1}</th>
                        <th>{result.method?.method2}</th>
                        <th>{result.method?.method3}</th>
                        <th>{result.method?.method4}</th>
                        <th>{result.method?.method5}</th>
                        <th>{result.method?.method6}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.roaDetails && result.roaDetails.length > 0 ? (
                        result.roaDetails.map((reportItem, index) => (
                          <tr key={index}>
                            <td>{reportItem.customerCode}</td>
                            <td>{reportItem.labCode}</td>
                            <td>{reportItem.sampleDescription}</td>

                            <td className='text-center'>{reportItem.results?.method1Results || '-'}</td>
                            <td className='text-center'>{reportItem.results?.method2Results || '-'}</td>
                            <td className='text-center'>{reportItem.results?.method3Results || '-'}</td>
                            <td className='text-center'>{reportItem.results?.method4Results || '-'}</td>
                            <td className='text-center'>{reportItem.results?.method5Results || '-'}</td>
                            <td className='text-center'>{reportItem.results?.method6Results || '-'}</td>
                            <td>{reportItem.testMethod}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => openEditModal(index)}
                                title="Edit Sample"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteReport(index)}
                                title="Delete Sample"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-center">No samples added yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className='card p-4 mb-3 mt-3 shadow-sm border'>
              <h5 className='mb-4 text-primary fw-bold'>Physical Analysis Result</h5>

              <div className='d-flex mt-3'>
                <button
                  type="button"
                  className="btn btn-primary" onClick={() => setPhysicalModal(true)}>
                  <i className="bi bi-plus-lg me-2 fs-6"></i>Add Sample Details
                </button>
              </div>

              {/*Table for ROA Details */}
              <div className="row mt-2">
                <div className="col-12">
                  <table className="table table-bordered">
                    <thead className="table-primary">
                      <tr className='text-center'>
                        <th rowSpan="4">CUSTOMER CODE</th>
                        <th rowSpan="2">LAB CODE</th>
                        <th rowSpan="2">SAMPLE DESCRIPTION</th>
                        <th colSpan="6">Physical ANALYSIS RESULT</th>
                        <th rowSpan="2">TEST METHOD</th>
                        <th rowSpan="2">ACTION</th>
                      </tr>
                      <tr className='text-center'>
                        <th>{result.physicalMethod?.physical1}</th>
                        <th>{result.physicalMethod?.physical2}</th>
                        <th>{result.physicalMethod?.physical3}</th>
                        <th>{result.physicalMethod?.physical4}</th>
                        <th>{result.physicalMethod?.physical5}</th>
                        <th>{result.physicalMethod?.physical6}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.physicalDetails && result.physicalDetails.length > 0 ? (
                        result.physicalDetails.map((reportItem, index) => (
                          <tr key={index}>
                            <td>{reportItem.customerCode}</td>
                            <td>{reportItem.labCode}</td>
                            <td>{reportItem.sampleDescription}</td>

                            <td className='text-center'>{reportItem.results?.physc1Result || '-'}</td>
                            <td className='text-center'>{reportItem.results?.physc2Result || '-'}</td>
                            <td className='text-center'>{reportItem.results?.physc3Result || '-'}</td>
                            <td className='text-center'>{reportItem.results?.physc4Result || '-'}</td>
                            <td className='text-center'>{reportItem.results?.physc5Result || '-'}</td>
                            <td className='text-center'>{reportItem.results?.physc6Result || '-'}</td>
                            <td>{reportItem.testMethod}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => physicalEditModal(index)}
                                title="Edit Sample"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deletePhysical(index)}
                                title="Delete Sample"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-center">No samples added yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className='container-fluid border border-secondary border-1 mt-3'></div>

            <div className='card p-4 mb-3 mt-3 shadow-sm border'>
              <h5 className='mb-4 text-primary fw-bold'>Interpretation Table</h5>
              <div className='row mt-2'>
                <div className='col-12'>
                  <table className='table table-bordered border-dark'>
                    <thead className='table-primary border-dark'>
                      <tr className='text-center'>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='parameter1' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.parameter1} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='parameter2' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.parameter2} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='parameter3' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.parameter3} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='parameter4' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.parameter4} /></td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='text-center'>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data1' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data1} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data2' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data2} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data3' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data3} /></td>
                        <td rowSpan='2'><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data4' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data4} /></td>
                      </tr>
                      <tr className='text-center'>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data5' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data5} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data6' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data6} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data7' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data7} /></td>
                      </tr>
                      <tr className='text-center'>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data8' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data8} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data9' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data9} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data10' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data10} /></td>
                        <td rowSpan='2'><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data11' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data11} /></td>
                      </tr>
                      <tr className='text-center'>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data12' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data12} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data13' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data13} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data14' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data14} /></td>

                      </tr>
                      <tr className='text-center'>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data15' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data15} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data16' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data16} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data17' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data17} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data18' data-parent='interpretation' onChange={inputHandler} value={result.interpretation?.data18} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>


            <div className='col-md-6 gap-3 offset-md-6 d-flex justify-content-end pe-3'>
              <button type='button' className="btn btn-primary col-md-2" onClick={() => navigate(backRoute)}>Back</button>
              <button type='submit' className="btn btn-primary col-md-2" onClick={submitForm}>Save</button>
            </div>
          </form>

        </div>
      </div>
      <RoaModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setReportDetails({
            labCode: '',
            customerCode: '',
            sampleDescription: '',
            results: {
              method1Results: ''
            },
            testMethod: ''
          });
        }}
        reportDetails={reportDetails}
        onChange={reportInputHandler}
        onSubmit={submitReport}
        inputLabel={result.method?.method1}
        inputLabel2={result.method?.method2}
        inputLabel3={result.method?.method3}
        inputLabel4={result.method?.method4}
        inputLabel5={result.method?.method5}
        inputLabel6={result.method?.method6}
        inputData1={result.method?.method1}
        inputData2={result.method?.method2}
        inputData3={result.method?.method3}
        inputData4={result.method?.method4}
        inputData5={result.method?.method5}
        inputData6={result.method?.method6}
      />

      <PhysicalModal
        show={physicalModal}
        onClose={() => {
          setPhysicalModal(false)
          setPhysicalDetails({
            labCode: '',
            customerCode: '',
            sampleDescription: '',
            results: {
              physc1Result: ''
            },
            testMethod: ''
          });
        }}
        physicalDetails={physicalDetails}
        onChange={physicalInputHandler}
        onSubmit={submitPhysical}
        inputLabel={result.physicalMethod?.physical1}
        inputLabel2={result.physicalMethod?.physical2}
        inputLabel3={result.physicalMethod?.physical3}
        inputLabel4={result.physicalMethod?.physical4}
        inputLabel5={result.physicalMethod?.physical5}
        inputLabel6={result.physicalMethod?.physical6}
        inputData1={result.physicalMethod?.physical1}
        inputData2={result.physicalMethod?.physical2}
        inputData3={result.physicalMethod?.physical3}
        inputData4={result.physicalMethod?.physical4}
        inputData5={result.physicalMethod?.physical5}
        inputData6={result.physicalMethod?.physical6}
      />


    </div>
  )
}

export default UpdateReport