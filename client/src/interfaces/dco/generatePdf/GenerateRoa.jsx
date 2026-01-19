import axios from 'axios';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import styles from './Styles';
import image1 from '../../analysts/components/images/DA5.jpg';
import image2 from '../../dco/components/images/unnamed.png'
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

const GenerateRoa = ({ roaId, icon, disabledIcon, copyType, fileType }) => {

    const [report, setReport] = useState(null)

    useEffect(() => {
        axios.get(`http://localhost:8002/api/report/reportData/${roaId}`)
            .then((response) => {
                setReport(response.data);
            })
            .catch((error) => {
                console.error("Error fetching report data:", error);
                setReport(null);
            })
    }, [roaId]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatMethod = (method) => {
        const methodArray = method.split('|');

        const methodHeader = methodArray[0]
        const sub = methodArray[1]

        return (
            <View>
                <Text style={[styles.boldFont, { fontSize: 11 }]}>{methodHeader}{'\n'}</Text>
                <Text style={[{ fontSize: 9, fontWeight: 'normal' }]}>{sub}</Text>
            </View >


        );
    }



    function generatePdf() {
        if (!report || !report.roaDetails) return;
        return (
            <Document>
                <Page style={[styles.body, { marginTop: 5, paddingBottom: 250 }]} size="A4">
                    <View style={styles.roaHeaderCont} fixed>
                        <Image style={styles.roaImage} src={image1} />
                        <View style={{ alignItems: 'justify', marginTop: -10 }} >
                            <Text style={styles.normalFont} >Department of Agriculture Regional Field Office 5</Text>
                            <Text style={styles.boldFont} >INTEGRATED LABORATORIES DIVISION</Text>
                            <Text style={styles.font} >Regional Soils Laboratory</Text>
                            <Text style={styles.normalFont} >San Agustin, Pili, Camarines Sur</Text>
                        </View>
                    </View>

                    <View style={[styles.row, { position: 'absolute', right: 10, color: 'red', fontSize: 8, border: '2 solid red', padding: 5 }]}>
                        <Text>{copyType}</Text>
                    </View>

                    <View style={[styles.boldFont, { marginLeft: 35, marginTop: 15 }]} fixed>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                                <Text>Customer Name: <Text style={{ fontWeight: 'normal' }}></Text>{report.customerName}</Text>
                            </View>
                            <View style={{ width: '40%' }}>
                                <Text>Report ID: <Text style={{ fontWeight: 'normal' }}></Text>{report.reportId}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                                <Text>Address: <Text style={{ fontWeight: 'normal' }}></Text>{report.customerAddress}</Text>
                            </View>
                            <View style={{ width: '40%' }}>
                                <Text>Date Issued: <Text style={{ fontWeight: 'normal' }}></Text>{formatDate(report.dateIssued)}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                                <Text>Contact Number: <Text style={{ fontWeight: 'normal' }}></Text>{report.customerContact}</Text>
                            </View>
                            <View style={{ width: '40%' }}>
                                <Text>Sample Source: <Text style={{ fontWeight: 'normal' }}></Text>{report.sampleSource}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                                <Text>Date Received: <Text style={{ fontWeight: 'normal' }}></Text>{formatDate(report.dateReceived)}</Text>
                            </View>
                        </View>
                        <Text>Date Performed: <Text style={{ fontWeight: 'normal' }}></Text>{report.datePerformed}</Text>
                    </View>

                    <View style={[styles.roaTitle]} fixed>
                        <View style={[styles.row, styles.boldFont]}>
                            <Text style={[{ width: "100%", textAlign: 'center', fontSize: 20 }]}>REPORT OF ANALYSIS</Text>
                        </View>
                    </View>

                    {/*Chemical Analysis Result */}
                    <View style={[styles.roaTable]}>
                        <View style={[styles.row, styles.boldFont, { textAlign: 'center' }]} fixed>
                            <Text style={[styles.roaHeader, styles.specificCell, { width: "12%", textAlign: 'center', paddingVertical: 10 }]}>CUSTOMER CODE</Text>
                            <Text style={[styles.roaHeader, { width: "11%", paddingVertical: 13 }]}>LAB CODE</Text>
                            <Text style={[styles.roaHeader, { width: "15%", paddingVertical: 10 }]}>SAMPLE{'\n'}DESCRIPTION</Text>
                            <View style={[styles.roaHeader, { width: "50%", }]}>
                                <View style={[styles.roaHeader, { width: "100%", borderRight: 0 }]}><Text>CHEMICAL ANALYSIS RESULT</Text></View>
                                {report.method?.method1 !== '' ? (
                                    <View style={[styles.roaHeader, styles.row, { width: "100%", borderBottom: 0, borderRight: 0 }]}>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method1)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method2)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method3)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method4)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method5)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, borderRight: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method6)}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={[styles.roaHeader, styles.row, { width: "100%", borderBottom: 0, borderRight: 0, flex: 1 }]}>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method1)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method2)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method3)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method4)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method5)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, borderRight: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method6)}</Text>
                                        </View>
                                    </View>
                                )}

                            </View>
                            <Text style={[styles.roaHeader, { width: "13%", paddingVertical: 10 }]}>TEST METHOD</Text>
                        </View>

                        {report.roaDetails.map((row, index) => (
                            <View style={styles.row} key={index} wrap={false}>
                                <Text style={[styles.roaCell, styles.specificCell, { width: "12%", display: 'flex', }]}>{row.customerCode}</Text>
                                <Text style={[styles.roaCell, { width: "11%", display: 'flex', }]}>{row.labCode}</Text>
                                <Text style={[styles.roaCell, { width: "15%", display: 'flex', }]}>{row.sampleDescription}</Text>

                                <View style={[styles.roaTable, { width: '50%', margin: 0, display: 'flex' }]}>
                                    <View style={[styles.roaCell, { width: 'auto', padding: 0, textAlign: 'center', display: 'flex', flex: 1 }]}>
                                        <View style={[styles.row, { flex: 1 }]}>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center' }]}>{row.results?.method1Results || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center' }]}>{row.results?.method2Results || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center' }]}>{row.results?.method3Results || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center' }]}>{row.results?.method4Results || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center' }]}>{row.results?.method5Results || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%', borderRight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }]}>{row.results?.method6Results || '-'}</Text>
                                        </View>
                                    </View>
                                </View>

                                <Text style={[styles.roaCell, { fontSize: 7, width: "13%", textAlign: 'justify' }]}>
                                    {row.testMethod?.split(',').map((method, index) => {
                                        const parts = method.trim().split(' - ');
                                        return (
                                            <Text key={index}>
                                                <Text style={{ fontWeight: 'bold' }}>{parts[0]}</Text>
                                                {parts[1] && ` - ${parts[1]}`}
                                                {index < row.testMethod.split(',').length - 1 && '\n'}
                                            </Text>
                                        );
                                    })}
                                </Text>
                            </View>
                        ))}

                    </View>

                    {/*Physical Analysis Result */}

                    <View style={[styles.roaTable, { borderTop: 1, marginTop: 10 }]}>
                        <View style={[styles.row, styles.boldFont, { textAlign: 'center' }]} fixed>
                            <Text style={[styles.roaHeader, styles.specificCell, { width: "12%", textAlign: 'center', paddingVertical: 10 }]}>CUSTOMER CODE</Text>
                            <Text style={[styles.roaHeader, { width: "11%", paddingVertical: 13 }]}>LAB CODE</Text>
                            <Text style={[styles.roaHeader, { width: "15%", paddingVertical: 10 }]}>SAMPLE{'\n'}DESCRIPTION</Text>
                            <View style={[styles.roaHeader, { width: "50%", }]}>
                                <View style={[styles.roaHeader, { width: "100%", borderRight: 0 }]}><Text>PHYSICAL ANALYSIS RESULT</Text></View>
                                {report.physicalMethod?.physical1 !== '' ? (
                                    <View style={[styles.roaHeader, styles.row, { width: "100%", borderBottom: 0, borderRight: 0 }]}>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.physicalMethod?.physical1)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.physicalMethod?.physical2)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.physicalMethod?.physical3)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.physicalMethod?.physical4)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.physicalMethod?.physical5)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, borderRight: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.physicalMethod.physical6)}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={[styles.roaHeader, styles.row, { width: "100%", borderBottom: 0, borderRight: 0, flex: 1 }]}>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.physicalMethod?.physical1)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.physicalMethod?.physical2)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.physicalMethod?.physical3)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.physicalMethod?.physical4)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.physicalMethod?.physical5)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { borderBottom: 0, borderRight: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.physicalMethod.physical6)}</Text>
                                        </View>
                                    </View>
                                )}

                            </View>
                            <Text style={[styles.roaHeader, { width: "13%", paddingVertical: 10 }]}>TEST METHOD</Text>
                        </View>

                        {report.physicalDetails.map((row, index) => (
                            <View style={styles.row} wrap={false}>
                                <Text style={[styles.roaCell, styles.specificCell, { width: "12%", textAlign: 'center' }]}>{row.customerCode}</Text>
                                <Text style={[styles.roaCell, { width: "11%", textAlign: 'center' }]}>{row.labCode}</Text>
                                <Text style={[styles.roaCell, { width: "15%", textAlign: 'center' }]}>{row.sampleDescription}</Text>

                                <View style={[styles.roaTable, { width: "50%", margin: 0 }]}>
                                    <View style={[styles.roaCell, { width: "auto", padding: 0, textAlign: 'center', display: 'flex', flex: 1 }]}>
                                        <View style={[styles.row, { flex: 1 }]} key={index} wrap={false}>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results?.physc1Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results?.physc2Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results?.physc3Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results?.physc4Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results?.physc5Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%', borderRight: 0 }]}>{row.results?.physc6Result || '-'}</Text>
                                        </View>
                                    </View>
                                </View>

                                <Text style={[styles.roaCell, { fontSize: 7, width: "13%", textAlign: 'justify' }]}>{row.testMethod?.split(',').map(m => m.trim()).join('\n')}</Text>
                            </View>
                        ))}
                    </View>

                    {/*SOIL TEST RESULT INTERPRETATION*/}
                    {report?.interpretation?.parameter1 && (
                        <View style={[styles.roaTable, { marginTop: 10 }]}>
                            <View style={{ textAlign: 'center', borderTop: 0, borderBottom: 1 }}>
                                <Text style={[styles.boldFont, { fontSize: 9 }]}>SOIL TEST RESULT INTERPRETATION</Text>
                            </View>
                            <View style={[styles.row, styles.boldFont, { textAlign: 'center' }]} fixed>
                                <Text style={[styles.roaHeader, styles.specificCell, { width: '24%', padding: 2, alignSelf: 'center', fontSize: 9, backgroundColor: 'white' }]}>{report.interpretation.parameter1}</Text>
                                <Text style={[styles.roaHeader, { width: '30%', padding: 2, alignSelf: "center", justifyContent: "center", fontSize: 9, backgroundColor: 'white' }]}>{report.interpretation.parameter2}</Text>
                                <Text style={[styles.roaHeader, { width: '30%', padding: 2, alignSelf: "center", justifyContent: "center", fontSize: 9, backgroundColor: 'white' }]}>{report.interpretation.parameter3}</Text>
                                <Text style={[styles.roaHeader, { width: '20%', padding: 2, alignSelf: "center", justifyContent: "center", fontSize: 9, backgroundColor: 'white' }]}>{report.interpretation.parameter4}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.roaCell, { width: '24%', borderLeft: 1, fontSize: 8 }]}>{report.interpretation.data1}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{report.interpretation.data2}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{report.interpretation.data3}</Text>
                                <Text style={[styles.roaCell, { width: '20%', fontSize: 8 }]}>{report.interpretation.data4}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.roaCell, { width: '24%', borderLeft: 1, fontSize: 8 }]}>{report.interpretation.data5}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{report.interpretation.data6}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{report.interpretation.data7}</Text>
                                <Text style={[styles.roaCell, { width: '20%', fontSize: 8 }]}></Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.roaCell, { width: '24%', borderLeft: 1, fontSize: 8 }]}>{report.interpretation.data8}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{report.interpretation.data9}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{report.interpretation.data10}</Text>
                                <Text style={[styles.roaCell, { width: '20%', fontSize: 8 }]}>{report.interpretation.data11}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.roaCell, { width: '24%', borderLeft: 1, fontSize: 8 }]}>{report.interpretation.data12}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{report.interpretation.data13}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{report.interpretation.data14}</Text>
                                <Text style={[styles.roaCell, { width: '20%', fontSize: 8 }]}></Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.roaCell, { width: '24%', borderLeft: 1, fontSize: 8 }]}>{report.interpretation.data15}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{report.interpretation.data16}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{report.interpretation.data17}</Text>
                                <Text style={[styles.roaCell, { width: '20%', fontSize: 8 }]}>{report.interpretation.data18}</Text>
                            </View>
                        </View>
                    )}

                    <View style={[styles.roaTable, { marginTop: 10 }]}>
                        <View style={[styles.row, { fontSize: 9, textAlign: 'justify', marginTop: 5 }]} fixed>
                            <Text style={styles.italicFont}>Note: The result is based on the sample received and analyzed by the laboratory. This report shall not be reproduced without full approval of the Department of Agriculture Regional Field Office 5 - Integrated Laboratories Division.</Text>
                        </View>
                    </View>

                    <View style={[styles.font, { paddingLeft: 55, bottom: 180, position: 'absolute' }]} fixed>
                        <Text style={{ fontWeight: 'bold', bottom: 35 }}>Analyzed/Examined By:</Text>
                        <Text style={{ fontWeight: 'bold' }}>{report.analyzedBy}</Text>
                        <Text>{report.position}</Text>
                        <Text>PRC License No. {report.analystPRC}</Text>
                    </View>

                    <View style={[styles.font, { paddingLeft: 335, bottom: 180, position: 'absolute' }]} fixed>
                        <Text style={{ fontWeight: 'bold' }}>{report.analyzedBy2}</Text>
                        <Text>{report.position2}</Text>
                        <Text>PRC License No. {report.analystPRC2}</Text>
                    </View>

                    <View style={[styles.row, { position: 'absolute', bottom: 95, gap: 35 }]} fixed>
                        <View style={[styles.font, { paddingLeft: 55 }]}>
                            <Text style={{ fontWeight: 'bold', bottom: 30 }}>Certified By:</Text>
                            <Text style={{ fontWeight: 'bold' }}>FREDERICK A. FORCADELA, Rch</Text>
                            <Text>OIC-Chief, Regional Soils Laboratory</Text>
                            <Text>PRC License No. 0013155 Valid Until 2028</Text>
                        </View>

                        <View style={[styles.font, { paddingLeft: 47 }]}>
                            <Text style={{ fontWeight: 'bold', bottom: 30 }}>Noted By:</Text>
                            <Text style={{ fontWeight: 'bold' }}>ANACLETO B. ESPLANA, RAgr</Text>
                            <Text>OIC-Chief, Integrated Laboratories Division</Text>
                            <Text>PRC LIC.NO.0020472</Text>
                        </View>
                    </View>


                    <View style={[styles.footer, { position: 'absolute', bottom: 20, left: 20, }]} fixed>
                        <View style={[styles.font]}>
                            <Text>ILD-RSL-094-1</Text>
                            <Text>Effectivity Date: April 14,2025</Text>
                        </View>
                    </View>
                    <Image style={[styles.roaUkas, { position: 'absolute', bottom: 42, right: 15 }]} src={image2} fixed />
                    <Text
                        style={[styles.pageNumber, { right: 30 }]}
                        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                        fixed />
                </Page>
            </Document>
        )
    }

    return (
        <>
            {report ? (
                <PDFDownloadLink document={generatePdf()} fileName={`${report.reportId}${fileType}`} style={{ padding: 0 }}>
                    <button className="btn p-0 border-0">
                        {icon}
                    </button>
                </PDFDownloadLink>
            ) : (
                <button className="btn p-0 border-0" disabled>
                    {disabledIcon}
                </button>
            )}
        </>
    )

}

export default GenerateRoa