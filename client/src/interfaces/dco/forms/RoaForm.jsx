import React from 'react'
import './styles/arf.css'
import axios from 'axios';
import { useState } from 'react';
import { RoaModal } from '../components/modal/Modal';


function RoaForm() {

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
    method1: "",
    method2: "",
    method3: "",
    method4: "",
    method5: "",
    method6: "",
  }

  const analystPRC = (analyzedBy) => {
    const PrcTable = {
      "Katrina Louise C. Gonzales": "0015522",
      "Danica Mae B. Rodriguez": "0015235",
      "Mellen B. Perion": "0015215",
    }
    return PrcTable[analyzedBy] || "";
  }


  const [result, setResult] = useState(report);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showModal, setShowModal] = useState(false)
  const [roaReport, setRoaReport] = useState([]) //holds sample details in an array
  const [reportDetails, setReportDetails] = useState({
    labCode: '',
    customerCode: '',
    sampleDescription: '',
    result: '',
    testMethod: ''
  });// state of report details before change in the modal

  const inputHandler = (e) => {
    const { name, value } = e.target;
    if (name === 'analyzedBy' || name === 'datePerformed') {
      const prc = analystPRC(value);
      setResult({
        ...result,
        [name]: value,
        analystPRC: prc,
      });
    } else if (name === 'datePerformedFrom') {
      setDateFrom(value);
    }
    else if (name === 'datePerformedTo') {
      setDateTo(value);
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

  const reportInputHandler = (name, value) => {
    setReportDetails(prev => ({ ...prev, [name]: value }));
  }

  const reportSubmit = (e) => {
    setRoaReport([...roaReport, reportDetails]);
    setReportDetails({
      labCode: '',
      customerCode: '',
      sampleDescription: '',
      result: '',
      testMethod: ''
    });
    setShowModal(false);
  }

  const submitForm = async (e) => {
    e.preventDefault();
    const form = { ...result, roaDetails: roaReport };
    await axios.post("http://localhost:8002/api/report/newReport", form, {
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
          sampleSource: "",
          method1: "",
          method2: "",
          method3: "",
          method4: "",
          method5: "",
          method6: "",
        })
        console.log("Report created successfully.")
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className='d-flex mt-3'>
      <div className=' analysis card container-fluid shadow-sm border bordered-darker mb-5'>
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
              <div className='row g-4'>
                <div className='col-md-6'>
                  <label className='form-label'>Report Id: </label>
                  <input type="text" className="date form-control border-dark" name='reportId' id='reportId' onChange={inputHandler} value={result.reportId} placeholder="" />
                </div>

                <div className='col-md-6'>
                  <label className='form-label'>Analyzed By: </label>
                  <select className='form-select border-dark' name='analyzedBy' onChange={inputHandler} value={result.analyzedBy}>
                    <option defaultValue="Choose...">Choose...</option>
                    <option value="Katrina Louise C. Gonzales">Katrina Louise C. Gonzales</option>
                    <option value="Mellen B. Perion">Mellen B. Perion</option>
                    <option value="Danica Mae B. Rodriguez">Danica Mae B. Rodriguez</option>
                  </select>
                </div>

                <div className='col-md-6'>
                  <label className='form-label '>Date Issued: </label>
                  <input type="date" className="date form-control border-dark" name='dateIssued' onChange={inputHandler} value={result.dateIssued} placeholder="" />
                </div>

                <div className="col-md-6">
                  <label className='form-label '>Date Received: </label>
                  <input type="date" className="date form-control border-dark" name='dateReceived' onChange={inputHandler} value={result.dateReceived} placeholder="" />
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

            {/*BORDER*/}
            <div className='container-fluid shadow-sm border border-secondary border-1 mt-3'>
            </div>

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

            {/*BORDER*/}
            <div className='container-fluid border border-secondary border-1 mt-3'></div>

            {/*Chemical Analysis Result*/}
            <div className='card p-4 mb-3 mt-3 shadow-sm border'>
              <h5 className='mb-4 text-primary fw-bold'>Chemical Analysis Result</h5>
              <div className='row g-4'>
                <div className='col-md-6'>
                  <label className='form-label'>First Method</label>
                  <input type='text' className='date form-control border-dark' name='method1' onChange={inputHandler} value={result.method1} placeholder='e.g. pH, NPK' />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Second Method</label>
                  <input type='text' className='date form-control border-dark' name='method2' onChange={inputHandler} value={result.method2} placeholder='e.g. pH, NPK' />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Third Method</label>
                  <input type='text' className='date form-control border-dark' name='method3' onChange={inputHandler} value={result.method3} placeholder='e.g. pH, NPK' />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Fourth Method</label>
                  <input type='text' className='date form-control border-dark' name='method4' onChange={inputHandler} value={result.method4} placeholder='e.g. pH, NPK' />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Fifth Method</label>
                  <input type='text' className='date form-control border-dark' name='method5' onChange={inputHandler} value={result.method5} placeholder='e.g. pH, NPK' />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Sixth Method</label>
                  <input type='text' className='date form-control border-dark' name='method6' onChange={inputHandler} value={result.method6} placeholder='e.g. pH, NPK' />
                </div>
              </div>
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
                      </tr>
                      <tr className='text-center'>
                        <th>{result.method1}</th>
                        <th>{result.method2}</th>
                        <th>{result.method3}</th>
                        <th>{result.method4}</th>
                        <th>{result.method5}</th>
                        <th>{result.method6}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roaReport.length > 0 ? (
                        roaReport.map((reportItem, index) => (
                          <tr key={index}>
                            <td>{reportItem.customerCode}</td>
                            <td>{reportItem.labCode}</td>
                            <td>{reportItem.sampleDescription}</td>
                            <td className='text-center'>{reportItem.result || '-'}</td>
                            <td className='text-center'>{reportItem.method2 || '-'}</td>
                            <td className='text-center'>{reportItem.method3 || '-'}</td>
                            <td className='text-center'>{reportItem.method4 || '-'}</td>
                            <td className='text-center'>{reportItem.method5 || '-'}</td>
                            <td className='text-center'>{reportItem.method6 || '-'}</td>
                            <td>{reportItem.testMethod}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center">No samples added yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/*BORDER*/}
            <div className='container-fluid border border-secondary border-1 mt-3'></div>

            {/*Chemical Analysis Result*/}
            <div className='card p-4 mb-3 mt-3 shadow-sm border'>
              <h5 className='mb-4 text-primary fw-bold'>Physical Analysis Result</h5>
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
                        <th>CUSTOMER CODE</th>
                        <th>LAB CODE</th>
                        <th>SAMPLE DESCRIPTION</th>
                        <th>RESULT</th>
                        <th>TEST METHOD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roaReport.length > 0 ? (
                        roaReport.map((reportItem, index) => (
                          <tr key={index}>
                            <td>{reportItem.customerCode}</td>
                            <td>{reportItem.labCode}</td>
                            <td>{reportItem.sampleDescription}</td>
                            <td>{reportItem.testMethod}</td>
                            <td>{reportItem.result}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6 " className="text-center">No samples added yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className='col-md-6 gap-3 offset-md-6 d-flex justify-content-end pe-3'>
              <button className="btn btn-primary col-md-2">Save</button>
            </div>
          </form>

        </div>
      </div>
      <RoaModal
        show={showModal}
        onClose={() => {
          setShowModal(false)
          setReportDetails({
            labCode: '',
            sampleCode: '',
            sampleDescription: '',
            sampleParam: '',
            result: '',
            testMethod: ''
          })
        }}
        reportDetails={reportDetails}
        onChange={reportInputHandler}
        onSubmit={reportSubmit}
        inputLabel={result.method1}
        inputLabel2={result.method2}
        inputData1={result.method1}
        inputData2={result.method2}

      />
    </div>
  )
}

export default RoaForm