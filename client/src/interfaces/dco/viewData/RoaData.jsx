import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import GenerateRoa from '../generatePdf/GenerateRoa';


function RoaData() {

    const [reportDetails, setReportDetails] = useState(null);
    const { id } = useParams();
    const location = useLocation();
    const backRoute = location.state?.from || "/Dco/ForRelease/";
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://192.168.100.177:8002/api/report/reportData/${id}`)
            .then((response) => {
                setReportDetails(response.data)
            })
            .catch((error) => {
                console.error("Error fetching report details", error)
                setReportDetails(null)
            })
    }, [id]);

    function formatDate(dateStr) {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <>
            <div className="d-flex pt-3">
                <div className="col card border-0 analysis shadow-sm container-fluid mb-5">
                    {reportDetails ? (
                        <>
                            {/*HEADER*/}
                            <div className="row card-header text-white" style={{ backgroundColor: '#003e8fff' }}>
                                <div className="rounded-circle justify-content-center d-flex align-items-center bg-white bg-opacity-25 mt-3"
                                    style={{ width: '80px', height: '80px' }}>
                                    <i className='bi bi-file-earmark-text fs-2' />
                                </div>
                                <div className="col">
                                    <div className="row">
                                        <span className='fw-bold fs-2'>Report of Analysis</span>
                                        <span className='fs-5 text-decoration-underline'>Report ID: {reportDetails.reportId}</span>
                                        <span className='fs-5 text-decoration-underline'>Analyzed By: {reportDetails.analyzedBy}, {reportDetails.analyzedBy2}</span>
                                    </div>
                                </div>
                            </div>


                            {/*Customer Information*/}
                            <div className='row p-3'>
                                <span className='fs-3 px-1 d-flex justify-items-center'><i className='bi bi-person fs-2 me-2 text-success ' />Customer Information</span>
                            </div>
                            <div className="row m-1 p-1 gap-5">
                                <div className="col">
                                    <div className="row g-3">
                                        <div className="card pt-2 pb-2 ps-3">
                                            <span className='fw-bold text-secondary'>
                                                CUSTOMER NAME
                                            </span>
                                            <span className='fs-5 fw-semibold'>
                                                {reportDetails.customerName || '-'}
                                            </span>
                                        </div>
                                        <div className="card pt-2 pb-2 ps-3">
                                            <span className='fw-bold text-secondary'>
                                                CONTACT
                                            </span>
                                            <span className='fs-5 fw-semibold'>
                                                {reportDetails.customerContact || '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className='row g-3'>
                                        <div className="card pt-2 pb-2 ps-3">
                                            <span className='fw-bold text-secondary'>
                                                ADDRESS
                                            </span>
                                            <span className='fs-5 fw-semibold'>
                                                {reportDetails.customerAddress || '-'}
                                            </span>
                                        </div>
                                        <div className="card pt-2 pb-2 ps-3">
                                            <span className='fw-bold text-secondary'>
                                                SAMPLE SOURCE
                                            </span>
                                            <span className='fs-5 fw-semibold'>
                                                {reportDetails.sampleSource || '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*Important Dates*/}
                            <div className="row p-3 pb-0">
                                <span className='fs-3 px-1 d-flex justify-items-center'>
                                    <i className='bi bi-calendar-event fs-2 me-2 text-primary' />
                                    Important Dates
                                </span>
                            </div>
                            <div className="row m-1 p-3 gap-5">
                                <div className="col">
                                    <div className='row pt-3 pb-3 border-start border-4 border-primary bg-primary bg-opacity-25 rounded'>
                                        <span className='fw-bold fs-5 text-primary'>Date Received</span>
                                        <span className='fs-4'>{formatDate(reportDetails.dateReceived)}</span>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className='row pt-3 pb-3 border-start border-4 border-warning bg-warning bg-opacity-25 rounded'>
                                        <span className='fw-bold fs-5 text-warning'>Date Performed</span>
                                        <span className='fs-4'>{reportDetails.datePerformed}</span>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className='row pt-3 pb-3 border-start border-4 border-danger bg-danger bg-opacity-25 rounded'>
                                        <span className='fw-bold fs-5 text-danger'>Date Issued</span>
                                        <span className='fs-4'>{formatDate(reportDetails.dateIssued)}</span>

                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Loading report details...{/* Or "Report not found" if you prefer */}</p>
                    )}

                    {/*Report Details*/}

                    {/*Chemical Analysis Report*/}
                    <div className='row p-3 pb-0'>
                        <span className='fs-3 px-1 d-flex justify-items-center'>
                            <i className='bi bi-file-medical fs-2 me-2 text-danger' />
                            Report Details
                        </span>
                    </div>
                    <div className='col-12 p-4'>
                        <div className='table-responsive border shadow-sm rounded'>
                            <table className='table table-striped table-borderless table-hover'>
                                <thead className='tableHead'>
                                    <tr className='text-center'>
                                        <th rowSpan="4" className='align-content-center'>CUSTOMER CODE</th>
                                        <th rowSpan="2" className='align-content-center'>LAB CODE</th>
                                        <th rowSpan="2" className='align-content-center'>SAMPLE DESCRIPTION</th>
                                        <th colSpan="6" >CHEMICAL ANALYSIS RESULT</th>
                                        <th rowSpan="2" className='align-content-center'>TEST METHOD</th>
                                    </tr>

                                    {reportDetails && reportDetails.method ? (
                                        <tr className='text-center'>
                                            <th>{reportDetails.method.method1.replace('|', '\n')}</th>
                                            <th>{reportDetails.method.method2.replace('|', '\n')}</th>
                                            <th>{reportDetails.method.method3.replace('|', '\n')}</th>
                                            <th>{reportDetails.method.method4.replace('|', '\n')}</th>
                                            <th>{reportDetails.method.method5.replace('|', '\n')}</th>
                                            <th>{reportDetails.method.method6.replace('|', '\n')}</th>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="text-center">No data available</td>
                                        </tr>
                                    )}

                                </thead>
                                <tbody>
                                    {reportDetails && reportDetails.roaDetails.length > 0 ? (
                                        reportDetails.roaDetails.map((reportItem, index) => (
                                            <tr className='text-center' key={index}>
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
                                            </tr>
                                        ))
                                    ) :
                                        (
                                            <tr>
                                                <td colSpan="10" className="text-center">No data available</td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/*Physical Analysis Report*/}
                    <div className='col-12 p-4'>
                        <div className='table-responsive border rounded shadow-sm'>
                            <table className='table table-striped table-borderless table-hover'>
                                <thead className='tableHead'>
                                    <tr className='text-center'>
                                        <th rowSpan="4" className='align-content-center'>CUSTOMER CODE</th>
                                        <th rowSpan="2" className='align-content-center'>LAB CODE</th>
                                        <th rowSpan="2" className='align-content-center'>SAMPLE DESCRIPTION</th>
                                        <th colSpan="6" >PHYSICAL ANALYSIS RESULT</th>
                                        <th rowSpan="2" className='align-content-center'>TEST METHOD</th>
                                    </tr>

                                    {reportDetails && reportDetails.physicalMethod ? (
                                        <tr className='text-center'>
                                            <th>{reportDetails.physicalMethod.physical1}</th>
                                            <th>{reportDetails.physicalMethod.physical2}</th>
                                            <th>{reportDetails.physicalMethod.physical3}</th>
                                            <th>{reportDetails.physicalMethod.physical4}</th>
                                            <th>{reportDetails.physicalMethod.physical5}</th>
                                            <th>{reportDetails.physicalMethod.physical6}</th>
                                        </tr>
                                    ) : (
                                        <td colSpan="10" className="text-center">'-'</td>
                                    )}


                                </thead>
                                <tbody>
                                    {reportDetails && reportDetails.physicalDetails.length > 0 ? (
                                        reportDetails.physicalDetails.map((reportItem, index) => (
                                            <tr className='text-center' key={index}>
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
                                            </tr>
                                        ))
                                    ) :
                                        (
                                            <tr>
                                                <td colSpan="10" className="text-center">No data available</td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='row p-3 pb-0'>
                        <span className='fs-3 px-1 d-flex justify-items-center'>
                            <i className='bi bi-table fs-2 me-2 text-success' />
                            Interpretation Table
                        </span>
                    </div>
                    <div className='col-12 p-4'>
                        <div className='table-responsive border rounded shadow-sm'>
                            <table className='table table-striped table-borderless table-hover'>
                                <thead className='table-primary border-dark'>
                                    {reportDetails && reportDetails.interpretation ? (
                                        <tr className='text-center'>
                                            <th>{reportDetails.interpretation.parameter1}</th>
                                            <th>{reportDetails.interpretation.parameter2}</th>
                                            <th>{reportDetails.interpretation.parameter3}</th>
                                            <th>{reportDetails.interpretation.parameter4}</th>
                                        </tr>
                                    ) : (
                                        <td colSpan="10" className="text-center">'-'</td>
                                    )}
                                </thead>
                                {reportDetails && reportDetails.interpretation ? (
                                    <tbody>
                                        <tr className='text-center'>
                                            <td>{reportDetails.interpretation.data1}</td>
                                            <td>{reportDetails.interpretation.data2}</td>
                                            <td>{reportDetails.interpretation.data3}</td>
                                            <td>{reportDetails.interpretation.data4}</td>
                                        </tr>
                                        <tr className='text-center'>
                                            <td>{reportDetails.interpretation.data5}</td>
                                            <td>{reportDetails.interpretation.data6}</td>
                                            <td>{reportDetails.interpretation.data7}</td>
                                        </tr>
                                        <tr className='text-center'>
                                            <td>{reportDetails.interpretation.data8}</td>
                                            <td>{reportDetails.interpretation.data9}</td>
                                            <td>{reportDetails.interpretation.data10}</td>
                                            <td>{reportDetails.interpretation.data11}</td>
                                        </tr>
                                        <tr className='text-center'>
                                            <td>{reportDetails.interpretation.data12}</td>
                                            <td>{reportDetails.interpretation.data13}</td>
                                            <td>{reportDetails.interpretation.data14}</td>
                                        </tr>
                                        <tr className='text-center'>
                                            <td>{reportDetails.interpretation.data15}</td>
                                            <td>{reportDetails.interpretation.data16}</td>
                                            <td>{reportDetails.interpretation.data17}</td>
                                            <td>{reportDetails.interpretation.data18}</td>
                                        </tr>
                                    </tbody>
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </table>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 justify-content-center pb-4">
                        <GenerateRoa roaId={reportDetails ? reportDetails._id : null}
                            copyType="CUSTOMER COPY"
                            fileType='_Customer_Copy'
                            icon={<button type='button' className='btn btn-primary text-white fw-bold'>Customer Copy</button>}
                        />
                        <GenerateRoa roaId={reportDetails ? reportDetails._id : null}
                            copyType="LABORATORY COPY"
                            fileType='_Laboratory_Copy'
                            icon={<button type='button' className='btn btn-primary text-white fw-bold'>Laboratory Copy</button>}
                        />
                        {reportDetails && reportDetails.status === 'For release' && (
                            <button type='button' className="btn btn-success text-white fw-bold" onClick={() => navigate(`/Dco/updateRoa/${id}`, { state: { from: `/Dco/reportDetails/${id}` } })}>
                                Edit Report
                            </button>
                        )}

                        <button type='button' className="btn btn-danger text-white fw-bold" onClick={() => navigate(backRoute)}>
                            <span className='text-white fw-bold ps-4 pe-4'>Back</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RoaData