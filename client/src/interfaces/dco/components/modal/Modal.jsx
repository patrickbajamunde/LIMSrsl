import React from 'react';

export const RoaModal = ({ show, onClose, reportDetails, onChange, onSubmit }) => {

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={onSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Add Report Details</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Customer Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="customerCode"
                  value={reportDetails.customerCode}
                  onChange={(e) => onChange('customerCode', e.target.value)}

                />
              </div>

              <div className="mb-3">
                <label className="form-label">Lab Code Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="labCode"
                  value={reportDetails.labCode}
                  onChange={(e) => onChange('labCode', e.target.value)}

                />
              </div>

              <div className="mb-3">
                <label className="form-label">Sample Description</label>
                <input
                  type="text"
                  className="form-control"
                  name="sampleDescription"
                  value={reportDetails.sampleDescription}
                  onChange={(e) => onChange('sampleDescription', e.target.value)}

                />
              </div>

              <div className="mb-3">
                <label className="form-label">Test Method</label>
                <input
                  type="text"
                  className="form-control"
                  name="testMethod"
                  value={reportDetails.testMethod}
                  onChange={(e) => onChange('testMethod', e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Result</label>
                <input
                  type="text"
                  className="form-control"
                  name="result"
                  value={reportDetails.result}
                  onChange={(e) => onChange('result', e.target.value)}

                />
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
  )

}