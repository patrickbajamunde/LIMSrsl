import React from 'react'
import './styles/arf.css'
import axios from 'axios';
import { useState } from 'react';
import { RoaModal } from '../components/modal/Modal';
import { PhysicalModal } from '../components/modal/PhysicalModal';
import QRCode from 'qrcode';


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

  const interpretationPreset = {
    'water': {
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
    'rice and corn': {
      parameter1: 'pH or soil reaction:',
      parameter2: 'Nitrogen(N):',
      parameter3: 'Phosphorus(P):',
      parameter4: 'Potassium(K):',
      data1: 'Intensely acidic       =   < 5.0',
      data2: 'L =  Low                           =     0-2 %OM',
      data3: 'L = Low                           =     0-2 ppm',
      data4: 'D = Deficient    ',
      data5: 'Moderately acidic  =  5.1– 5.5',
      data6: 'ML = Moderately Low  =    2.1 – 3.5 %OM',
      data7: 'ML = Moderately Low  =   2.1-6 ppm',
      data8: 'Slightly acidic          =  5.6 – 6.5',
      data9: 'MH=  Moderately High = 3.6-4.5 %OM  ',
      data10: 'MH=  Moderately High =   6.1-10 ppm',
      data11: 'S = Sufficient    ',
      data12: 'Neutral                     =  6.6 – 7.0',
      data13: 'H = High                            =   4.6-5.5 %OM',
      data14: 'H = High                            =  10.1-15 ppm',
      data15: 'Slightly alkaline       =  7.1 – 8.0',
      data16: 'VH = Very High                =   >5.5 %OM',
      data17: 'VH = Very High              =   15.1->20 ppm',
      data18: '',
    },
    'high value': {
      parameter1: 'pH or soil reaction:',
      parameter2: 'Nitrogen(N):',
      parameter3: 'Phosphorus(P):',
      parameter4: 'Potassium(K):',
      data1: 'Intensely acidic       =   < 5.0',
      data2: 'L =  Low                           =     0-2 %OM',
      data3: 'L = Low                           =     0-6 ppm',
      data4: 'D = Deficient    ',
      data5: 'Moderately acidic  =  5.1– 5.5',
      data6: 'ML = Moderately Low  =    2.1 – 3.5 %OM',
      data7: 'ML = Moderately Low  =   7-10 ppm',
      data8: 'Slightly acidic          =  5.6 – 6.5',
      data9: 'H=  High                         = 3.6-4.5 %OM',
      data10: 'MH=  Moderately High =   11-15 ppm',
      data11: 'S = Sufficient    ',
      data12: 'Neutral                     =  6.6 – 7.0',
      data13: 'VH = Very High                =   >4.5 %OM ',
      data14: 'H = High                            =  16-20 ppm ',
      data15: 'Slightly alkaline       =  7.1 – 8.0',
      data16: '',
      data17: 'VH = Very High                =   >20 ppm',
      data18: '',
    },
    'regular soil': {
      parameter1: 'pH or soil reaction:',
      parameter2: 'Nitrogen(N):',
      parameter3: 'Phosphorus(P):',
      parameter4: 'Potassium(K):',
      data1: 'Intensely acidic       =   < 5.0',
      data2: 'L=Low          = <2.0 % OM',
      data3: 'L=Low           = <10 ppm',
      data4: 'D=Deficient    = < 75 ppm',
      data5: 'Moderately acidic  =  5.1– 5.5',
      data6: 'M=Medium = 2.1-4.5 % OM',
      data7: 'M=Medium = 10-20 ppm',
      data8: 'Slightly acidic          =  5.6 – 6.5',
      data9: 'H-High         = >4.5 % OM',
      data10: 'H=High         = >20 ppm',
      data11: 'S=Sufficient    = > 75 ppm',
      data12: 'Neutral                     =  6.6 – 7.0',
      data13: '',
      data14: '',
      data15: 'Slightly alkaline       =  7.1 – 8.0',
      data16: '',
      data17: '',
      data18: '',
    }
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
    url: '',
    qrCode: '',
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

    interpretation: interpretationPreset['regular soil']
  }


  const analystPRC = (analyzedBy) => {
    const PrcTable = {
      "MARYFRANIE I. BELANO, RChT": "0004756",
      "KRIZZA ASHLEY V. BALOLOY, RChT": "0007263",
      "JENNIS A. RABLANDO, RChT": "0000628",
    }
    return PrcTable[analyzedBy] || "";
  }


  const designation = (analyzedBy) => {
    const DesignationTable = {
      "MARYFRANIE I. BELANO, RChT": "Laboratory Analyst",
      "KRIZZA ASHLEY V. BALOLOY, RChT": "Laboratory Analyst",
      "JENNIS A. RABLANDO, RChT": "Laboratory Analyst"
    }
    return DesignationTable[analyzedBy] || "";
  }

  const methodName = (method) => {
    const methodTable = {
      "pH|(1 Soil: 1 H2O)": "pH - Potentiometric Method",
      "EC|(mS/cm)": "EC - Conductometric Method",
      "%OM": "OM/N - Walkley-Black Method",
      "P|(STK)": "P - Olsen P Method",
      "K|(STK)": "K - STK Method",
      "NO3-N|(ppm)": "NO3-N - Kjeldahl Method",
      "PO4|(ppm)": "PO4 - Vanadomolybdate Method",
    }
    return methodTable[method] || "";
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

  const [interpretationType, setInterpretationType] = useState('regular soil');


  const handleInterpretationTypeChange = (e) => {
    const newType = e.target.value;
    setInterpretationType(newType);  // Only for UI state
    setResult({
      ...result,
      interpretation: interpretationPreset[newType]  // Only send interpretation data
    });
  };

  const qrGenerator = async (url) => {
    if (!url || url.trim() === '') return;

    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
        }
      });

      setResult(prev => ({
        ...prev,
        qrCode: qrDataUrl
      }));
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

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
    } else if (name === 'url') {
      setResult({ ...result, [name]: value });
      if (value.trim() !== '') {
        qrGenerator(value);  // Generate QR code when URL is entered
      }
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

  const reportSubmit = (e) => {
    setRoaReport([...roaReport, reportDetails,]);
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
  }

  const physicalResultHandler = (e) => {
    setPhysicalReport([...physicalReport, physicalDetails])
    setPhysicalDetails({
      labCode: '',
      customerCode: '',
      sampleDescription: '',
      results: {
        physc1Result: ''
      },
      testMethod: ''
    })
    setPhysicalModal(false)
  }

  const submitForm = async (e) => {
    e.preventDefault();
    const form = { ...result, roaDetails: roaReport, physicalDetails: physicalReport };
    await axios.post("http://localhost:8002/api/report/newReport", form, {
      withCredentials: true,
    })
      .then((response) => {
        setRoaReport([])
        setPhysicalReport([])
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
          url: '',
          qrCode: '',
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
              <input type="text" className="form-control border-dark" name='url' onChange={inputHandler} value={result.url} placeholder="Enter link here" />
            </div>
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
                    <option value="MARYFRANIE I. BELANO, RChT">Maryfranie I. Belano</option>
                    <option value="KRIZZA ASHLEY V. BALOLOY, RChT">Krizza Ashley V. Baloloy</option>
                    <option value="JENNIS A. RABLANDO, RChT">Jennis A. Reblando</option>
                  </select>
                </div>

                <div className='col-md-6'>
                  <label className='form-label '>Date Issued: </label>
                  <input type="date" className="date form-control border-dark" name='dateIssued' onChange={inputHandler} value={result.dateIssued} placeholder="" />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Analyzed By: </label>
                  <select className='form-select border-dark' name='analyzedBy2' onChange={inputHandler} value={result.analyzedBy2}>
                    <option defaultValue="Choose...">Choose...</option>
                    <option value="MARYFRANIE I. BELANO, RChT">Maryfranie I. Belano</option>
                    <option value="KRIZZA ASHLEY V. BALOLOY, RChT">Krizza Ashley V. Baloloy</option>
                    <option value="JENNIS A. RABLANDO, RChT">Jennis A. Reblando</option>
                  </select>
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

                <div className='col-md-2'>
                  <label className='form-label'>First Parameter</label>
                  <select className='form-select border-dark' name='method1' data-parent='method' onChange={inputHandler} value={result.method.method1}>
                    <option value="">Choose...</option>
                    <option value="pH|(1 Soil: 1 H2O)">pH (1 Soil: 1 H2O)</option>
                    <option value="EC|(mS/cm)">EC (mS/cm)</option>
                    <option value="%OM">%OM</option>
                    <option value="%N">%N</option>
                    <option value="P|(STK)">P (STK)</option>
                    <option value="K|(STK)">K (STK)</option>
                    <option value="NO3-N|(ppm)">NO3-N (ppm)</option>
                    <option value="PO4|(ppm)">PO4 (ppm)</option>
                  </select>
                </div>

                {result.method.method1.trim() !== '' && (
                  <div className='col-md-2'>
                    <label className='form-label'>Second Parameter</label>
                    <select className='form-select border-dark' name='method2' data-parent='method' onChange={inputHandler} value={result.method.method2}>
                      <option value="">Choose...</option>
                      <option value="pH|(1 Soil: 1 H2O)">pH (1 Soil: 1 H2O)</option>
                      <option value="EC|(mS/cm)">EC (mS/cm)</option>
                      <option value="%OM">%OM</option>
                      <option value="%N">%N</option>
                      <option value="P|(STK)">P (STK)</option>
                      <option value="K|(STK)">K (STK)</option>
                      <option value="NO3-N|(ppm)">NO3-N (ppm)</option>
                      <option value="PO4|(ppm)">PO4 (ppm)</option>
                    </select>
                  </div>
                )}

                {result.method.method2.trim() !== '' && (
                  <div className='col-md-2'>
                    <label className='form-label'>Third Parameter</label>
                    <select className='form-select border-dark' name='method3' data-parent='method' onChange={inputHandler} value={result.method.method3}>
                      <option value="">Choose...</option>
                      <option value="pH|(1 Soil: 1 H2O)">pH (1 Soil: 1 H2O)</option>
                      <option value="EC|(mS/cm)">EC (mS/cm)</option>
                      <option value="%OM">%OM</option>
                      <option value="%N">%N</option>
                      <option value="P|(STK)">P (STK)</option>
                      <option value="K|(STK)">K (STK)</option>
                      <option value="NO3-N|(ppm)">NO3-N (ppm)</option>
                      <option value="PO4|(ppm)">PO4 (ppm)</option>
                    </select>
                  </div>
                )}

                {result.method.method3.trim() !== '' && (
                  <div className='col-md-2'>
                    <label className='form-label'>Fourth Parameter</label>
                    <select className='form-select border-dark' name='method4' data-parent='method' onChange={inputHandler} value={result.method.method4}>
                      <option value="">Choose...</option>
                      <option value="pH|(1 Soil: 1 H2O)">pH (1 Soil: 1 H2O)</option>
                      <option value="EC|(mS/cm)">EC (mS/cm)</option>
                      <option value="%OM">%OM</option>
                      <option value="%N">%N</option>
                      <option value="P|(STK)">P (STK)</option>
                      <option value="K|(STK)">K (STK)</option>
                      <option value="NO3-N|(ppm)">NO3-N (ppm)</option>
                      <option value="PO4|(ppm)">PO4 (ppm)</option>
                    </select>
                  </div>
                )}


                {result.method.method4.trim() !== '' && (
                  <div className='col-md-2'>
                    <label className='form-label'>Fifth Parameter</label>
                    <select className='form-select border-dark' name='method5' data-parent='method' onChange={inputHandler} value={result.method.method5}>
                      <option value="">Choose...</option>
                      <option value="pH|(1 Soil: 1 H2O)">pH (1 Soil: 1 H2O)</option>
                      <option value="EC|(mS/cm)">EC (mS/cm)</option>
                      <option value="%OM">%OM</option>
                      <option value="%N">%N</option>
                      <option value="P|(STK)">P (STK)</option>
                      <option value="K|(STK)">K (STK)</option>
                      <option value="NO3-N|(ppm)">NO3-N (ppm)</option>
                      <option value="PO4|(ppm)">PO4 (ppm)</option>
                    </select>
                  </div>
                )}
                {result.method.method5.trim() !== '' && (
                  <div className='col-md-2'>
                    <label className='form-label'>Sixth Parameter</label>
                    <select className='form-select border-dark' name='method6' data-parent='method' onChange={inputHandler} value={result.method.method6}>
                      <option value="">Choose...</option>
                      <option value="pH|(1 Soil: 1 H2O)">pH (1 Soil: 1 H2O)</option>
                      <option value="EC|(mS/cm)">EC (mS/cm)</option>
                      <option value="%OM">%OM</option>
                      <option value="%N">%N</option>
                      <option value="P|(STK)">P (STK)</option>
                      <option value="K|(STK)">K (STK)</option>
                      <option value="NO3-N|(ppm)">NO3-N (ppm)</option>
                      <option value="PO4|(ppm)">PO4 (ppm)</option>
                    </select>
                  </div>
                )}
              </div>
              <div className='d-flex mt-3'>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const methodsArray = [
                      result.method.method1,
                      result.method.method2,
                      result.method.method3,
                      result.method.method4,
                      result.method.method5,
                      result.method.method6
                    ].filter(method => method && method.trim() !== '');

                    // Map each method to its full name, then join
                    const selectedMethods = methodsArray
                      .map(method => methodName(method))
                      .join(', ');

                    setReportDetails({
                      ...reportDetails,
                      testMethod: selectedMethods
                    });
                    setShowModal(true);
                  }}>
                  <i className="bi bi-plus-lg me-2 fs-6"></i>Add Sample Details
                </button>
              </div>

              {/*Table for ROA Details */}
              <div className="row mt-2">
                <div className="col-12">
                  <table className="table table-bordered border-dark ">
                    <thead className="table-primary border-dark">
                      <tr className='text-center'>
                        <th rowSpan="4">CUSTOMER CODE</th>
                        <th rowSpan="2">LAB CODE</th>
                        <th rowSpan="2">SAMPLE DESCRIPTION</th>
                        <th colSpan="6">CHEMICAL ANALYSIS RESULT</th>
                        <th rowSpan="2">TEST METHOD</th>
                      </tr>
                      <tr className='text-center'>
                        <th>{result.method.method1.replace('|', '\n')}</th>
                        <th>{result.method.method2.replace('|', '\n')}</th>
                        <th>{result.method.method3.replace('|', '\n')}</th>
                        <th>{result.method.method4.replace('|', '\n')}</th>
                        <th>{result.method.method5.replace('|', '\n')}</th>
                        <th>{result.method.method6.replace('|', '\n')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roaReport.length > 0 ? (
                        roaReport.map((reportItem, index) => (
                          <tr key={index}>
                            <td>{reportItem.customerCode}</td>
                            <td>{reportItem.labCode}</td>
                            <td>{reportItem.sampleDescription}</td>
                            <td className='text-center'>{reportItem.results.method1Results || '-'}</td>
                            <td className='text-center'>{reportItem.results.method2Results || '-'}</td>
                            <td className='text-center'>{reportItem.results.method3Results || '-'}</td>
                            <td className='text-center'>{reportItem.results.method4Results || '-'}</td>
                            <td className='text-center'>{reportItem.results.method5Results || '-'}</td>
                            <td className='text-center'>{reportItem.results.method6Results || '-'}</td>
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

            {/*Physical Analysis Result*/}
            <div className='card p-4 mb-3 mt-3 shadow-sm border'>
              <h5 className='mb-4 text-primary fw-bold'>Physical Analysis Result</h5>
              <div className='row g-4'>
                <div className='col-md-2'>
                  <label className='form-label'>First Parameter</label>
                  <select type='text' className='date form-select border-dark' name='physical1' data-parent='physicalMethod' onChange={inputHandler} value={result.physicalMethod.physical1}>
                    <option value="">Choose...</option>
                    <option value="pH (1 Soil: 1 H2O)">pH (1 Soil: 1 H2O)</option>
                    <option value="EC (mS/cm)">EC (mS/cm)</option>
                    <option value="%OM">%OM</option>
                    <option value="%N">%N</option>
                    <option value="P (STK)">P (STK)</option>
                    <option value="K (STK)">K (STK)</option>
                    <option value="NO3-N (ppm)">NO3-N (ppm)</option>
                    <option value="PO4 (ppm)">PO4 (ppm)</option>
                  </select>
                </div>

                {result.physicalMethod.physical1.trim() !== '' && (
                  <div className='col-md-2'>
                    <label className='form-label'>Second Parameter</label>
                    <select type='text' className='date form-select border-dark' name='physical2' data-parent='physicalMethod' onChange={inputHandler} value={result.physicalMethod.physical2}>
                      <option value="">Choose...</option>
                      <option value="pH (1 Soil: 1 H2O)">pH (1 Soil: 1 H2O)</option>
                      <option value="EC (mS/cm)">EC (mS/cm)</option>
                      <option value="%OM">%OM</option>
                      <option value="%N">%N</option>
                      <option value="P (STK)">P (STK)</option>
                      <option value="K (STK)">K (STK)</option>
                      <option value="NO3-N (ppm)">NO3-N (ppm)</option>
                      <option value="PO4 (ppm)">PO4 (ppm)</option>
                    </select>
                  </div>
                )}

                {result.physicalMethod.physical2.trim() !== '' && (
                  <div className='col-md-2'>
                    <label className='form-label'>Third Parameter</label>
                    <select type='text' className='date form-select border-dark' name='physical3' data-parent='physicalMethod' onChange={inputHandler} value={result.physicalMethod.physical3}>
                      <option value="">Choose...</option>
                      <option value="pH (1 Soil: 1 H2O)">pH (1 Soil: 1 H2O)</option>
                      <option value="EC (mS/cm)">EC (mS/cm)</option>
                      <option value="%OM">%OM</option>
                      <option value="%N">%N</option>
                      <option value="P (STK)">P (STK)</option>
                      <option value="K (STK)">K (STK)</option>
                      <option value="NO3-N (ppm)">NO3-N (ppm)</option>
                      <option value="PO4 (ppm)">PO4 (ppm)</option>
                    </select>
                  </div>
                )}

                {result.physicalMethod.physical3.trim() !== '' && (
                  <div className='col-md-2'>
                    <label className='form-label'>Fourth Parameter</label>
                    <select type='text' className='date form-select border-dark' name='physical4' data-parent='physicalMethod' onChange={inputHandler} value={result.physicalMethod.physical4}>
                      <option value="">Choose...</option>
                      <option value="pH (1 Soil: 1 H2O)">pH (1 Soil: 1 H2O)</option>
                      <option value="EC (mS/cm)">EC (mS/cm)</option>
                      <option value="%OM">%OM</option>
                      <option value="%N">%N</option>
                      <option value="P (STK)">P (STK)</option>
                      <option value="K (STK)">K (STK)</option>
                      <option value="NO3-N (ppm)">NO3-N (ppm)</option>
                      <option value="PO4 (ppm)">PO4 (ppm)</option>
                    </select>
                  </div>
                )}

                {result.physicalMethod.physical4.trim() !== '' && (
                  <div className='col-md-2'>
                    <label className='form-label'>Fifth Parameter</label>
                    <select type='text' className='date form-select border-dark' name='physical5' data-parent='physicalMethod' onChange={inputHandler} value={result.physicalMethod.physical5}>
                      <option value="">Choose...</option>
                      <option value="pH (1 Soil: 1 H2O)">pH (1 Soil: 1 H2O)</option>
                      <option value="EC (mS/cm)">EC (mS/cm)</option>
                      <option value="%OM">%OM</option>
                      <option value="%N">%N</option>
                      <option value="P (STK)">P (STK)</option>
                      <option value="K (STK)">K (STK)</option>
                      <option value="NO3-N (ppm)">NO3-N (ppm)</option>
                      <option value="PO4 (ppm)">PO4 (ppm)</option>
                    </select>
                  </div>
                )}

                {result.physicalMethod.physical5.trim() !== '' && (
                  <div className='col-md-2'>
                    <label className='form-label'>Sixth Parameter</label>
                    <select type='text' className='date form-select border-dark' name='physical6' data-parent='physicalMethod' onChange={inputHandler} value={result.physicalMethod.physical6}>
                      <option value="">Choose...</option>
                      <option value="pH (1 Soil: 1 H2O)">pH (1 Soil: 1 H2O)</option>
                      <option value="EC (mS/cm)">EC (mS/cm)</option>
                      <option value="%OM">%OM</option>
                      <option value="%N">%N</option>
                      <option value="P (STK)">P (STK)</option>
                      <option value="K (STK)">K (STK)</option>
                      <option value="NO3-N (ppm)">NO3-N (ppm)</option>
                      <option value="PO4 (ppm)">PO4 (ppm)</option>
                    </select>
                  </div>
                )}
              </div>
              <div className='d-flex mt-3'>
                <button
                  type="button"
                  className="btn btn-primary" onClick={() => {
                    const methodsArray = [
                      result.physicalMethod.physical1,
                      result.physicalMethod.physical2,
                      result.physicalMethod.physical3,
                      result.physicalMethod.physical4,
                      result.physicalMethod.physical5,
                      result.physicalMethod.physical6
                    ].filter(method => method && method.trim() !== '');

                    // Map each method to its full name, then join
                    const selectedMethods = methodsArray
                      .map(method => methodName(method))
                      .join(', ');

                    setPhysicalDetails({
                      ...physicalDetails,
                      testMethod: selectedMethods
                    });
                    setPhysicalModal(true);
                  }}>
                  <i className="bi bi-plus-lg me-2 fs-6"></i>Add Sample Details
                </button>
              </div>

              {/*Table for ROA Details */}
              <div className="row mt-2">
                <div className="col-12">
                  <table className="table table-bordered border-dark">
                    <thead className="table-primary border-dark">
                      <tr className='text-center'>
                        <th rowSpan="4">CUSTOMER CODE</th>
                        <th rowSpan="2">LAB CODE</th>
                        <th rowSpan="2">SAMPLE DESCRIPTION</th>
                        <th colSpan="6">PHYSICAL ANALYSIS RESULT</th>
                        <th rowSpan="2">TEST METHOD</th>
                      </tr>
                      <tr className='text-center'>
                        <th>{result.physicalMethod.physical1}</th>
                        <th>{result.physicalMethod.physical2}</th>
                        <th>{result.physicalMethod.physical3}</th>
                        <th>{result.physicalMethod.physical4}</th>
                        <th>{result.physicalMethod.physical5}</th>
                        <th>{result.physicalMethod.physical6}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {physicalReport.length > 0 ? (
                        physicalReport.map((physicalItem, index) => (
                          <tr key={index}>
                            <td>{physicalItem.customerCode}</td>
                            <td>{physicalItem.labCode}</td>
                            <td>{physicalItem.sampleDescription}</td>
                            <td className='text-center'>{physicalItem.results.physc1Result || '-'}</td>
                            <td className='text-center'>{physicalItem.results.physc2Result || '-'}</td>
                            <td className='text-center'>{physicalItem.results.physc3Result || '-'}</td>
                            <td className='text-center'>{physicalItem.results.physc4Result || '-'}</td>
                            <td className='text-center'>{physicalItem.results.physc5Result || '-'}</td>
                            <td className='text-center'>{physicalItem.results.physc6Result || '-'}</td>
                            <td>{physicalItem.testMethod}</td>
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

            <div className='card p-4 mb-3 mt-3 shadow-sm border'>
              <h5 className='mb-4 text-primary fw-bold'>Interpretation Table</h5>
              <div>
                <label className='form-label'>Select result interpretation</label>
                <select className='form-select border-dark' value={interpretationType} onChange={handleInterpretationTypeChange}>
                  <option value='water'>Water</option>
                  <option value='rice and corn'>Rice and Corn</option>
                  <option value='high value'>High Value</option>
                  <option value='regular soil'>Regular Soil</option>
                </select>
              </div>
              <div className='row mt-2'>
                <div className='col-12'>
                  <table className='table table-bordered border-dark'>
                    <thead className='table-primary border-dark'>
                      <tr className='text-center'>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='parameter1' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.parameter1} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='parameter2' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.parameter2} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='parameter3' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.parameter3} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='parameter4' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.parameter4} /></td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='text-center'>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data1' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data1} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data2' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data2} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data3' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data3} /></td>
                        <td rowSpan='2'><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data4' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data4} /></td>
                      </tr>
                      <tr className='text-center'>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data5' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data5} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data6' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data6} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data7' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data7} /></td>
                      </tr>
                      <tr className='text-center'>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data8' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data8} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data9' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data9} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data10' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data10} /></td>
                        <td rowSpan='2'><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data11' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data11} /></td>
                      </tr>
                      <tr className='text-center'>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data12' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data12} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data13' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data13} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data14' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data14} /></td>

                      </tr>
                      <tr className='text-center'>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data15' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data15} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data16' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data16} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data17' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data17} /></td>
                        <td><input type='text' className='form-control border-0 shadow-none bg-transparent' name='data18' data-parent='interpretation' onChange={inputHandler} value={result.interpretation.data18} /></td>
                      </tr>
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
        onSubmit={reportSubmit}
        inputLabel={result.method.method1.replace('|', ' ')}
        inputLabel2={result.method.method2.replace('|', ' ')}
        inputLabel3={result.method.method3.replace('|', ' ')}
        inputLabel4={result.method.method4.replace('|', ' ')}
        inputLabel5={result.method.method5.replace('|', ' ')}
        inputLabel6={result.method.method6.replace('|', ' ')}
        inputData1={result.method.method1}
        inputData2={result.method.method2}
        inputData3={result.method.method3}
        inputData4={result.method.method4}
        inputData5={result.method.method5}
        inputData6={result.method.method6}
      />

      <PhysicalModal
        show={physicalModal}
        onClose={() => {
          setPhysicalModal(false);
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
        onSubmit={physicalResultHandler}
        inputLabel={result.physicalMethod.physical1}
        inputLabel2={result.physicalMethod.physical2}
        inputLabel3={result.physicalMethod.physical3}
        inputLabel4={result.physicalMethod.physical4}
        inputLabel5={result.physicalMethod.physical5}
        inputLabel6={result.physicalMethod.physical6}
        inputData1={result.physicalMethod.physical1}
        inputData2={result.physicalMethod.physical2}
        inputData3={result.physicalMethod.physical3}
        inputData4={result.physicalMethod.physical4}
        inputData5={result.physicalMethod.physical5}
        inputData6={result.physicalMethod.physical6}
      />
    </div>
  )
}

export default RoaForm