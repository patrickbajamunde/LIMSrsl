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
        axios.get(`http://192.168.100.177:8002/api/report/reportData/${roaId}`)
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
                            <Text style={[styles.roaHeader, styles.specificCell, { minHeight: 'auto', width: "12%", paddingBottom: 7, paddingTop: 9  }]}>CUSTOMER CODE</Text>
                            <Text style={[styles.roaHeader, { minHeight: 'auto', width: "11%", paddingBottom: 7, paddingTop: 12 }]}>LAB CODE</Text>
                            <Text style={[styles.roaHeader, { minHeight: 'auto', width: "15%",  paddingBottom: 7, paddingTop: 7}]}>SAMPLE {'\n'}DESCRIPTION</Text>

                            <View style={[styles.roaTable, { width: "50%", margin: 0, }]}>
                                <View style={[styles.roaHeader, { width: "auto", display: 'flex', flex: 1 }]}>
                                    <Text style={[{ padding: 2 }]}>CHEMICAL ANALYSIS RESULT </Text>
                                    <View style={[styles.row, { flex: 1 }]}>
                                        <Text style={[styles.roaHeader, styles.row, { fontSize: 8, display: 'flex', borderBottom: 0, borderTop: 1, paddingTop: 4 }]}>{report.method?.method1}</Text>
                                        <Text style={[styles.roaHeader, { fontSize: 8, borderBottom: 0, borderTop: 1, display: 'flex', paddingTop: 4 }]}>{report.method?.method2}</Text>
                                        <Text style={[styles.roaHeader, { fontSize: 8, borderBottom: 0, borderTop: 1, display: 'flex', paddingTop: 4 }]}>{report.method?.method3}</Text>
                                        <Text style={[styles.roaHeader, { fontSize: 8, borderBottom: 0, borderTop: 1, display: 'flex', paddingTop: 4 }]}>{report.method?.method4}</Text>
                                        <Text style={[styles.roaHeader, { fontSize: 8, borderBottom: 0, borderTop: 1, display: 'flex', paddingTop: 4 }]}>{report.method?.method5}</Text>
                                        <Text style={[styles.roaHeader, { fontSize: 8, borderBottom: 0, borderTop: 1, borderRight: 0, display: 'flex', paddingTop: 4 }]}>{report.method?.method6}</Text>
                                    </View>
                                </View>
                            </View>

                            <Text style={[styles.roaHeader, { width: "13%", paddingTop: 9 }]}>TEST METHOD</Text>
                        </View>

                        {report.roaDetails.map((row, index) => (
                            <View style={styles.row} key={index} wrap={false}>
                                <Text style={[styles.roaCell, styles.specificCell, { width: "12%", textAlign: 'center', display: 'flex', alignItems: 'center' }]}>{row.customerCode}</Text>
                                <Text style={[styles.roaCell, { width: "11%", textAlign: 'center', display: 'flex', alignItems: 'center' }]}>{row.labCode}</Text>
                                <Text style={[styles.roaCell, { width: "15%", textAlign: 'center', display: 'flex', alignItems: 'center' }]}>{row.sampleDescription}</Text>

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

                                <Text style={[styles.roaCell, { width: "13%", textAlign: 'center', display: 'flex', alignItems: 'center' }]}>{row.testMethod}</Text>
                            </View>
                        ))}

                    </View>

                    {/*Physical Analysis Result */}

                    <View style={[styles.roaTable, { borderTop: 1, marginTop: 10 }]}>
                        <View style={[styles.row, styles.boldFont, { textAlign: 'center' }]} fixed>
                            <Text style={[styles.roaHeader, styles.specificCell, { minHeight: 'auto', width: "12%", paddingBottom: 7, paddingTop: 9  }]}>CUSTOMER CODE</Text>
                            <Text style={[styles.roaHeader, { minHeight: 'auto', width: "11%", paddingBottom: 7, paddingTop: 12}]}>LAB CODE</Text>
                            <Text style={[styles.roaHeader, { minHeight: 'auto', width: "15%", paddingBottom: 7, paddingTop: 7 }]}>SAMPLE {'\n'}DESCRIPTION</Text>

                            <View style={[styles.roaTable, { width: "50%", margin: 0, }]}>
                                <View style={[styles.roaHeader, { width: "auto", display: 'flex', flex: 1 }]}>
                                    <Text style={[{ padding: 2 }]}>PHYSICAL ANALYSIS RESULT </Text>
                                    <View style={[styles.row, { flex: 1 }]}>
                                        <Text style={[styles.roaHeader, styles.row, { fontSize: 8, minHeight: 'auto', borderBottom: 0, borderTop: 1, paddingTop: 4 }]}>{report.physicalMethod.physical1}</Text>
                                        <Text style={[styles.roaHeader, { fontSize: 8, borderBottom: 0, borderTop: 1, minHeight: 'auto', paddingTop: 4 }]}>{report.physicalMethod.physical2}</Text>
                                        <Text style={[styles.roaHeader, { fontSize: 8, borderBottom: 0, borderTop: 1, minHeight: 'auto', paddingTop: 4 }]}>{report.physicalMethod.physical3}</Text>
                                        <Text style={[styles.roaHeader, { fontSize: 8, borderBottom: 0, borderTop: 1, minHeight: 'auto', paddingTop: 4 }]}>{report.physicalMethod.physical4}</Text>
                                        <Text style={[styles.roaHeader, { fontSize: 8, borderBottom: 0, borderTop: 1, minHeight: 'auto', paddingTop: 4 }]}>{report.physicalMethod.physical5}</Text>
                                        <Text style={[styles.roaHeader, { fontSize: 8, borderBottom: 0, borderTop: 1, borderRight: 0, minHeight: 'auto', paddingTop: 4 }]}>{report.physicalMethod.physical6}</Text>
                                    </View>
                                </View>
                            </View>

                            <Text style={[styles.roaHeader, { width: "13%", paddingTop: 9 }]}>TEST METHOD</Text>
                        </View>

                        {report.physicalDetails.map((row, index) => (
                            <View style={styles.row} wrap={false}>
                                <Text style={[styles.roaCell, styles.specificCell, { width: "12%", textAlign: 'center' }]}>{row.customerCode}</Text>
                                <Text style={[styles.roaCell, { width: "11%", textAlign: 'center' }]}>{row.labCode}</Text>
                                <Text style={[styles.roaCell, { width: "15%", textAlign: 'center' }]}>{row.sampleDescription}</Text>

                                <View style={[styles.roaTable, { width: "50%", margin: 0 }]}>
                                    <View style={[styles.roaCell, { width: "auto", padding: 0, textAlign: 'center', display: 'flex', flex: 1  }]}>
                                        <View style={[styles.row, {flex: 1}]} key={index} wrap={false}>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results?.physc1Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results?.physc2Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results?.physc3Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results?.physc4Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results?.physc5Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%', borderRight: 0 }]}>{row.results?.physc6Result || '-'}</Text>
                                        </View>
                                    </View>
                                </View>

                                <Text style={[styles.roaCell, { width: "13%", textAlign: 'center' }]}>{row.testMethod}</Text>
                            </View>
                        ))}
                    </View>

                    {/*SOIL TEST RESULT INTERPRETATION*/}

                    <View style={[styles.roaTable, { borderTop: 1, marginTop: 10 }]}>
                        <View style={[styles.row, styles.boldFont, { textAlign: 'center' }]} fixed>
                            <Text style={[styles.roaHeader, styles.specificCell, { width: '30%', padding: 2, alignSelf: 'center', fontSize: 9, backgroundColor: 'white' }]}>pH or Soil reaction:</Text>
                            <Text style={[styles.roaHeader, { width: '30%', padding: 2, alignSelf: "center", justifyContent: "center", fontSize: 9, backgroundColor: 'white' }]}>Nitrogen(N):</Text>
                            <Text style={[styles.roaHeader, { width: '30%', padding: 2, alignSelf: "center", justifyContent: "center", fontSize: 9, backgroundColor: 'white' }]}>Phosphorous(P):</Text>
                            <Text style={[styles.roaHeader, { width: '30%', padding: 2, alignSelf: "center", justifyContent: "center", fontSize: 9, backgroundColor: 'white' }]}>Potassium(K)</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={[styles.roaCell, { width: '30%', borderLeft: 1 }]}></Text>
                            <Text style={[styles.roaCell, { width: '30%' }]}></Text>
                            <Text style={[styles.roaCell, { width: '30%' }]}></Text>
                            <Text style={[styles.roaCell, { width: '30%' }]}></Text>
                        </View>

                        <View style={[styles.row, { fontSize: 9, textAlign: 'justify', marginTop: 5 }]} fixed>
                            <Text style={styles.italicFont}>Note: The result is based on the sample received and analyzed by the laboratory. This report shall not be reproduced without full approval of the Department of Agriculture Regional Field Office 5 - Integrated Laboratories Division.</Text>
                        </View>
                    </View>

                    <View style={[styles.font, { paddingLeft: 55, bottom: 180, position: 'absolute' }]} fixed>
                        <Text style={{ fontWeight: 'bold', bottom: 35 }}>Analyzed/Examined By:</Text>
                        <Text style={{ fontWeight: 'bold' }}>{report.analyzedBy}</Text>
                        <Text>Chemist, PRC License No. {report.analystPRC}</Text>
                    </View>

                    <View style={[styles.row, { position: 'absolute', bottom: 95, gap: 35 }]} fixed>
                        <View style={[styles.font, { paddingLeft: 55 }]}>
                            <Text style={{ fontWeight: 'bold', bottom: 30 }}>Certified By:</Text>
                            <Text style={{ fontWeight: 'bold' }}>FREDERICK A. FORCADELA, Rch</Text>
                            <Text>OIC-Chief, Regional Soils Laboratory</Text>
                            <Text>PRC License No. 0013155 Valid Until 2028</Text>
                        </View>

                        <View style={[styles.font, { paddingLeft: 72 }]}>
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