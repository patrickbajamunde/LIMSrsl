import React from 'react'
import TestPdf from '../generatePdf/testPdf'
import { PDFViewer } from '@react-pdf/renderer'
import GenerateRoa from "../generatePdf/GenerateRoa"; 

function Testing() {
    return (
        <div className='d-flex '>
            <div className=' analysis container-fluid mb-5'>
                <PDFViewer width="100%" height="1000px">
                    <TestPdf />
                </PDFViewer>
            </div>
        </div>
    )
}

export default Testing