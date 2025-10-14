import axios from 'axios';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import styles from './Styles';
import image1 from '../../analysts/components/images/DA5.jpg';
import image2 from '../../dco/components/images/unnamed.png'
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

const GenerateRoa = ({ roaId, icon, disabledIcon }) => {

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
                            <Text style={[styles.roaHeader, styles.specificCell, { width: "15%", padding: 5, alignSelf: 'center' }]}>CUSTOMER CODE</Text>
                            <Text style={[styles.roaHeader, { width: "11%", padding: 5, alignSelf: "center", justifyContent: "center" }]}>LAB CODE</Text>
                            <Text style={[styles.roaHeader, { width: "18%", padding: 5, alignSelf: "center", justifyContent: "center" }]}>SAMPLE {'\n'}DESCRIPTION</Text>

                            <View style={[styles.roaTable, { width: "50%", margin: 0, }]}>
                                {report.method.map((row, index) => (
                                    <View style={[styles.roaHeader, { width: "100%", }]}>
                                        <Text style={[{ padding: 2 }]}>CHEMICAL ANALYSIS RESULT </Text>
                                        <View style={styles.row} key={index} wrap={false}>
                                            <Text style={[styles.roaHeader, styles.row, { height: 19, borderBottom: 0, borderTop: 1, paddingTop: 4 }]}>{row.method1}</Text>
                                            <Text style={[styles.roaHeader, { borderBottom: 0, borderTop: 1, height: 19, paddingTop: 4 }]}>{row.method2}</Text>
                                            <Text style={[styles.roaHeader, { borderBottom: 0, borderTop: 1, height: 19, paddingTop: 4 }]}>{row.method3}</Text>
                                            <Text style={[styles.roaHeader, { borderBottom: 0, borderTop: 1, height: 19, paddingTop: 4 }]}>{row.method4}</Text>
                                            <Text style={[styles.roaHeader, { borderBottom: 0, borderTop: 1, height: 19, paddingTop: 4 }]}>{row.method5}</Text>
                                            <Text style={[styles.roaHeader, { borderBottom: 0, borderTop: 1, borderRight: 0, height: 19, paddingTop: 4 }]}>{row.method6}</Text>
                                        </View>
                                    </View>
                                ))}


                            </View>

                            <Text style={[styles.roaHeader, { width: "17%", paddingTop: 12 }]}>TEST METHOD</Text>
                        </View>

                        {report.roaDetails.map((row, index) => (
                            <View style={styles.row} key={index} wrap={false}>
                                <Text style={[styles.roaCell, styles.specificCell, { width: "15%", textAlign: 'center' }]}>{row.customerCode}</Text>
                                <Text style={[styles.roaCell, { width: "11%", textAlign: 'center' }]}>{row.labCode}</Text>
                                <Text style={[styles.roaCell, { width: "18%", textAlign: 'center' }]}>{row.sampleDescription}</Text>

                                <View style={[styles.roaTable, { width: "50%", margin: 0 }]}>
                                    <View style={[styles.roaCell, { width: "100%", padding: 0, textAlign: 'center' }]}>
                                        <View style={styles.row}>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results[0]?.method1Results || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results[0]?.method2Results || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results[0]?.method3Results || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results[0]?.method4Results || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results[0]?.method5Results || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%', borderRight: 0 }]}>{row.results[0]?.method6Results || '-'}</Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={[styles.roaCell, { width: "17%", textAlign: 'center' }]}>{row.testMethod}</Text>
                            </View>
                        ))}

                    </View>

                    {/*Physical Analysis Result */}

                    <View style={[styles.roaTable, { borderTop: 1, marginTop: 10 }]}>
                        <View style={[styles.row, styles.boldFont, { textAlign: 'center' }]} fixed>
                            <Text style={[styles.roaHeader, styles.specificCell, { width: "15%", padding: 5, alignSelf: 'center' }]}>CUSTOMER CODE</Text>
                            <Text style={[styles.roaHeader, { width: "11%", padding: 5, alignSelf: "center", justifyContent: "center" }]}>LAB CODE</Text>
                            <Text style={[styles.roaHeader, { width: "18%", padding: 5, alignSelf: "center", justifyContent: "center" }]}>SAMPLE {'\n'}DESCRIPTION</Text>

                            <View style={[styles.roaTable, { width: "50%", margin: 0, }]}>

                                {report.physicalMethod.map((row, index) => (
                                    <View style={[styles.roaHeader, { width: "100%", }]}>
                                        <Text style={[{ padding: 2 }]}>PHYSICAL ANALYSIS RESULT </Text>
                                        <View style={styles.row} key={index} wrap={false}>
                                            <Text style={[styles.roaHeader, styles.row, { height: 19, borderBottom: 0, borderTop: 1, paddingTop: 4 }]}>{row.physical1}</Text>
                                            <Text style={[styles.roaHeader, { borderBottom: 0, borderTop: 1, height: 19, paddingTop: 4 }]}>{row.physical2}</Text>
                                            <Text style={[styles.roaHeader, { borderBottom: 0, borderTop: 1, height: 19, paddingTop: 4 }]}>{row.physical3}</Text>
                                            <Text style={[styles.roaHeader, { borderBottom: 0, borderTop: 1, height: 19, paddingTop: 4 }]}>{row.physical4}</Text>
                                            <Text style={[styles.roaHeader, { borderBottom: 0, borderTop: 1, height: 19, paddingTop: 4 }]}>{row.physical5}</Text>
                                            <Text style={[styles.roaHeader, { borderBottom: 0, borderTop: 1, borderRight: 0, height: 19, paddingTop: 4 }]}>{row.physical6}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            <Text style={[styles.roaHeader, { width: "17%", paddingTop: 12 }]}>TEST METHOD</Text>
                        </View>

                        {report.physicalDetails.map((row, index) => (
                            <View style={styles.row} wrap={false}>
                                <Text style={[styles.roaCell, styles.specificCell, { width: "15%", textAlign: 'center' }]}>{row.customerCode}</Text>
                                <Text style={[styles.roaCell, { width: "11%", textAlign: 'center' }]}>{row.labCode}</Text>
                                <Text style={[styles.roaCell, { width: "18%", textAlign: 'center' }]}>{row.sampleDescription}</Text>

                                <View style={[styles.roaTable, { width: "50%", margin: 0 }]}>
                                    <View style={[styles.roaCell, { width: "100%", padding: 0, textAlign: 'center' }]}>
                                        <View style={styles.row}>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results[0]?.physc1Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results[0]?.physc2Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results[0]?.physc3Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results[0]?.physc4Result || '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%' }]}>{row.results[0]?.physc5Result|| '-'}</Text>
                                            <Text style={[styles.roaCell, { borderBottom: 0, borderTop: 0, width: '20%', borderRight: 0 }]}>{row.results[0]?.physc6Result || '-'}</Text>
                                        </View>
                                    </View>
                                </View>

                                <Text style={[styles.roaCell, { width: "17%", textAlign: 'center' }]}>{row.testMethod}</Text>
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
                <PDFDownloadLink document={generatePdf()} fileName={report.reportId} style={{ padding: 0 }}>
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