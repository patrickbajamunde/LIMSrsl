import React from 'react'

export const PhysicalModal = ({
    show,
    onClose,
    physicalDetails,
    onChange,
    onSubmit,
    inputLabel,
    inputLabel2,
    inputLabel3,
    inputLabel4,
    inputLabel5,
    inputLabel6,
    inputData1,
    inputData2,
    inputData3,
    inputData4,
    inputData5,
    inputData6
}) => {
    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={onSubmit}>
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">Physical Results Details</h5>
                            <button type="button" className="btn-close" onClick={onClose} />
                        </div>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-12">
                                    <h6 className="fw-bold text-secondary mb-2">Sample Information</h6>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Customer Code</label>
                                    <input
                                        type="text"
                                        className="form-control border-black"
                                        name="customerCode"
                                        value={physicalDetails.customerCode}
                                        onChange={(e) => onChange('customerCode', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Lab Code</label>
                                    <input
                                        type="text"
                                        className="form-control border-black"
                                        name="labCode"
                                        value={physicalDetails.labCode}
                                        onChange={(e) => onChange('labCode', e.target.value)}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Sample Description</label>
                                    <input
                                        type="text"
                                        className="form-control border-black"
                                        name="sampleDescription"
                                        value={physicalDetails.sampleDescription}
                                        onChange={(e) => onChange('sampleDescription', e.target.value)}
                                    />
                                </div>
                                <div className="col-12 mt-3">
                                    <h6 className="fw-bold text-secondary mb-1">Test Details</h6>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label">Test Method</label>
                                    <input
                                        type="text"
                                        className="form-control border-black"
                                        name="testMethod"
                                        value={physicalDetails.testMethod}
                                        onChange={(e) => onChange('testMethod', e.target.value)}
                                    />
                                </div>

                                <div className="col-12 mt-3">
                                    <h6 className="fw-bold text-secondary mb-1">Test Results</h6>
                                </div>

                                {inputData1.trim() !== '' && (
                                    <div className="col-md-4">
                                        <label className="form-label">{inputLabel}</label>
                                        <input
                                            type="text"
                                            className="form-control border-black"
                                            name="physc1Result"
                                            value={physicalDetails.results?.physc1Result}
                                            onChange={(e) => onChange('physc1Result', e.target.value, 'results')}
                                        />
                                    </div>
                                )}

                                {inputData2.trim() !== '' && (
                                    <div className="col-md-4">
                                        <label className="form-label">{inputLabel2}</label>
                                        <input
                                            type="text"
                                            className="form-control border-black"
                                            name="physc2Result"
                                            value={physicalDetails.results?.physc2Result}
                                            onChange={(e) => onChange('physc2Result', e.target.value, 'results')}
                                        />
                                    </div>
                                )}

                                {inputData3.trim() !== '' && (
                                    <div className='col-md-4'>
                                        <label className='form-label'>{inputLabel3}</label>
                                        <input
                                            type='text'
                                            className='form-control border-black'
                                            name='physc3Result'
                                            value={physicalDetails.results?.physc3Result}
                                            onChange={(e) => onChange('physc3Result', e.target.value, 'results')}
                                        />
                                    </div>
                                )}

                                {inputData4.trim() !== '' && (
                                    <div className='col-md-4'>
                                        <label className='form-label'>{inputLabel4}</label>
                                        <input
                                            type='text'
                                            className='form-control border-black'
                                            name='physc4Result'
                                            value={physicalDetails.results?.physc4Result}
                                            onChange={(e) => onChange('physc4Result', e.target.value, 'results')}
                                        />
                                    </div>
                                )}

                                {inputData5.trim() !== '' && (
                                    <div className='col-md-4'>
                                        <label className='form-label'>{inputLabel5}</label>
                                        <input
                                            type='text'
                                            className='form-control border-black'
                                            name='physc5Result'
                                            value={physicalDetails.results?.physc5Result}
                                            onChange={(e) => onChange('physc5Result', e.target.value, 'results')}
                                        />
                                    </div>
                                )}

                                {inputData6.trim() !== '' && (
                                    <div className='col-md-4'>
                                        <label className='form-label'>{inputLabel6}</label>
                                        <input
                                            type='text'
                                            className='form-control border-black'
                                            name='physc6Result'
                                            value={physicalDetails.results?.physc6Result}
                                            onChange={(e) => onChange('physc6Result', e.target.value, 'results')}
                                        />
                                    </div>
                                )}

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
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
    );
}