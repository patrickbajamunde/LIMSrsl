import axios from 'axios';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import styles from './Styles';
import image1 from '../../analysts/components/images/DA5.jpg';
import image2 from '../../dco/components/images/unnamed.png'
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

const GenerateRoa = ({ roaId, icon, disabledIcon, copyType, fileType, copyCode }) => {

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
                <Text style={[styles.boldFont, { fontSize: 10 }]}>{methodHeader}{'\n'}</Text>
                <Text style={[{ fontSize: 9, fontWeight: 'normal' }]}>{sub}</Text>
            </View >


        );
    }

    const resultFormat = (result) => {
        if(!result) return '';
        
        const resultArray = result.split(' ');

        const resultIndex1 = resultArray[0]
        const resultIndex2 = resultArray[1]

        return (
            <View style={{ flexDirection: 'column' }}>
                <Text style={[styles.boldFont, { fontSize: 10 }]} hyphenationCallback={word => [word]}>{resultIndex1}</Text>
                <Text style={[styles.boldFont, { color: 'red', fontSize: 10 }]} hyphenationCallback={word => [word]}>{resultIndex2}</Text>
            </View>
        )
    }

    const colorChanger = (method) => {
        if (method === 'P|(ppm)') {
            return { color: 'red' };
        }
        return {};
    }

    const interPretationColor = (str) => {
       const str1 = str.substring(0, 4);
       const str2 = str.substring(4);
       
       return (
        <View style={styles.row}>
            <Text style={[styles.normalFont, {fontSize: 8, color: 'red'}]}>{str1}</Text>
            <Text style={[styles.normalFont, {fontSize: 8}]}>{str2}</Text>
        </View>
       )
    }



    function generatePdf() {
        if (!report || !report.roaDetails) return;

        const checkMethod = (testMethod) => {
            if (!testMethod || testMethod.trim().length === 0) {
                return {
                    borderBottomWidth: 0,
                    borderRightWidth: 0,
                };
            }
            return {};
        };


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


                    <View style={[styles.row, { position: 'absolute', right: 50, top: 25 }]} fixed>
                        <Image src={report.qrCode} style={{ width: 80, height: 80 }} />
                    </View>
                    <View style={[styles.row, { position: 'absolute', right: 45, top: 5, color: 'red', fontSize: 8, border: '2 solid red', padding: 5 }]} fixed>
                        <Text>{copyType}</Text>
                    </View>

                    <View style={[styles.boldFont, { marginLeft: 35, marginTop: 15 }]} fixed>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                                <Text>Customer Name: <Text style={{ fontWeight: 'normal' }}></Text>{report.customerName}</Text>
                            </View>
                            <View style={{ width: '40%' }}>
                                <Text>Report ID: <Text style={{ fontWeight: 'normal' }}></Text>{report.reportId}-{copyCode}</Text>
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
                        {/* HEADER ROW */}
                        <View style={[styles.row, styles.boldFont, { textAlign: 'center' }]} fixed>
                            <Text style={[styles.roaHeader, styles.specificCell, { width: "12%", textAlign: 'center', paddingVertical: 10, fontSize: 10 }]}>CUSTOMER CODE</Text>
                            <Text style={[styles.roaHeader, { width: "11%", paddingVertical: 13, fontSize: 10 }]}>LAB CODE</Text>
                            <Text style={[styles.roaHeader, { width: "15%", paddingVertical: 10, fontSize: 10 }]}>SAMPLE{'\n'}DESCRIPTION</Text>
                            <View style={[styles.roaHeader, { width: "50%" }]}>
                                <View style={[styles.roaHeader, { width: "100%", borderRight: 0 }]}><Text>CHEMICAL ANALYSIS RESULT</Text></View>
                                {report.method?.method1 !== '' ? (
                                    <View style={[styles.roaHeader, styles.row, { width: "100%", borderBottom: 0, borderRight: 0, flexGrow: 1 }]}>
                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method1)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method2)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method3)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method4)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method5)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { width: "16.65%", borderBottom: 0, borderRight: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method6)}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={[styles.roaHeader, styles.row, { width: "100%", borderBottom: 0, borderRight: 0, flex: 1 }]}>
                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method1)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method2)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method3)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method4)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method5)}</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { width: "16.65%", borderBottom: 0, borderRight: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ paddingVertical: 2 }}>{formatMethod(report.method?.method6)}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                            <View style={[styles.roaHeader, { width: '13%', paddingVertical: 10, }]}>
                                <Text style={[{ fontSize: 10 }]}>TEST</Text>
                                <Text style={[{ fontSize: 10 }]}>METHOD</Text>
                            </View>
                        </View>

                        {/* DATA ROWS */}
                        <View style={[styles.row, { alignItems: 'stretch' }]}>  {/* ✅ Changed from minHeight to alignItems */}
                            <View style={{ width: "88%" }}>  {/* ✅ Removed flex: 1 from here */}
                                {report.roaDetails.map((row, index) => (
                                    <View style={[styles.row, { flexGrow: 1 }]} key={index} wrap={false}>
                                        <View style={[styles.roaCell, styles.specificCell, { width: "13.64%", fontSize: 10 }]}>
                                            <Text>{row.customerCode?.substring(0, 8)}</Text>
                                            <Text>{row.customerCode?.substring(8, 18)}</Text>
                                            <Text>{row.customerCode?.substring(18)}</Text>
                                        </View>
                                        <View style={[styles.roaCell, { width: "12.5%", fontSize: 10, paddingHorizontal: 0 }]}>
                                            <Text>{row.labCode?.substring(0, 8)}</Text>
                                            <Text>{row.labCode?.substring(8, 18)}</Text>
                                            <Text>{row.labCode?.substring(18)}</Text>
                                        </View>
                                        <Text style={[styles.roaCell, { width: "17.05%", textAlign: 'center' }]}>
                                            {row.sampleDescription}
                                        </Text>

                                        {/* Chemical Results: 50/88 = 56.82% */}
                                        <View style={{ width: '56.82%', flexDirection: 'row' }}>
                                            <View style={[styles.roaCell, colorChanger(report.method?.method1), { width: '16.67%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                {resultFormat(row.results?.method1Results)}
                                            </View>
                                            <View style={[styles.roaCell, colorChanger(report.method?.method2), { width: '16.67%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                {resultFormat(row.results?.method2Results)}
                                            </View>
                                            <View style={[styles.roaCell, colorChanger(report.method?.method3), { width: '16.68%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                {resultFormat(row.results?.method3Results)}
                                            </View>
                                            <View style={[styles.roaCell, colorChanger(report.method?.method4), { width: '16.70%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                {resultFormat(row.results?.method4Results)}
                                            </View>
                                            <View style={[styles.roaCell, colorChanger(report.method?.method5), { width: '16.74%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                {resultFormat(row.results?.method5Results)}
                                            </View>
                                            <View style={[styles.roaCell,  colorChanger(report.method?.method6), { width: '16.98%', textAlign: 'center', borderTop: 0, fontSize: 10 }]} >
                                                {resultFormat(row.results?.method6Results)}
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            <View style={[styles.roaCell, checkMethod(report.roaDetails[0]?.testMethod), { fontSize: 7, width: "13%", paddingHorizontal: 1, paddingVertical: 2, alignSelf: 'stretch' }]}>
                                {report.roaDetails[0]?.testMethod?.split(',').map((method, index) => {
                                    const parts = method.trim().split(' - ');
                                    return (
                                        <Text key={index} hyphenationCallback={word => [word]}>
                                            <Text style={{ fontWeight: 'bold' }}>{parts[0]}</Text>
                                            {parts[1] && ` - ${parts[1]}`}
                                            {index < report.roaDetails[0]?.testMethod.split(',').length - 1 && '\n'}
                                        </Text>
                                    );
                                })}
                            </View>
                        </View>
                    </View>

                    <View style={[styles.roaTable, { marginTop: 10, borderTop: 1 }]}>
                        {/* HEADER ROW */}
                        <View style={[styles.row, styles.boldFont, { textAlign: 'center', fontSize: 10 }]} fixed>


                            {report.physicalDetails[0]?.testMethod === 'MC - Gravimetric Method, WHC - Tapping Method, TEXTURE - Hydrometer Method' ?
                                (
                                    <View style={[styles.row, styles.boldFont, {}]} fixed>
                                        <Text style={[styles.roaHeader, styles.specificCell, { width: "11%", textAlign: 'center', paddingVertical: 10, fontSize: 10 }]}>CUSTOMER CODE</Text>
                                        <View style={[styles.roaHeader, { width: '10%', paddingVertical: 13 }]}>
                                            <Text style={[{ fontSize: 10 }]}>LAB</Text>
                                            <Text style={[{ fontSize: 10 }]}>CODE</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { width: "13%", paddingVertical: 10 }]}>
                                            <Text style={[{ fontSize: 10 }]}>SAMPLE</Text>
                                            <Text style={[{ fontSize: 10, textAlign: 'center' }]}>DESCRIPTION</Text>
                                        </View>
                                        <View style={[styles.roaHeader, { width: "60%", fontSize: 10 }]}>
                                            <View style={[styles.roaHeader, { width: "100%", borderRight: 0 }]}><Text>PHYSICAL ANALYSIS RESULT</Text></View>
                                            {report.method?.method1 === '' ?
                                                (
                                                    <View style={[styles.roaHeader, styles.row, { width: "100%", borderBottom: 0, borderRight: 0, flex: 1 }]}>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical1)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical2)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical3)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical4)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical5)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.65%", borderBottom: 0, borderRight: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical6)}</Text>
                                                        </View>
                                                    </View>

                                                ) : (
                                                    <View style={[styles.roaHeader, styles.row, { width: "100%", borderBottom: 0, borderRight: 0, flexGrow: 1 }]}>
                                                        <View style={[styles.roaHeader, { width: "14.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical1)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical2)}</Text>
                                                        </View>
                                                        <View style={[{ width: "69%", flexDirection: 'column' }]}>
                                                            <View style={[styles.roaHeader, { width: "100%", borderRight: 0 }]}>
                                                                <Text>TEXTURE</Text>
                                                            </View>
                                                            <View style={[styles.roaHeader, styles.row, { width: "100%", borderBottom: 0, borderRight: 0, flexGrow: 1 }]}>
                                                                <View style={[styles.roaHeader, { width: "26%", borderBottom: 0, alignItems: 'center', justifyContent: 'center', }]}>
                                                                    <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical3)}</Text>
                                                                </View>
                                                                <View style={[styles.roaHeader, { width: "26%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                                    <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical4)}</Text>
                                                                </View>
                                                                <View style={[styles.roaHeader, { width: "30%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                                    <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical5)}</Text>
                                                                </View>
                                                                <View style={[styles.roaHeader, { width: "55%", borderBottom: 0, borderRight: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                                    <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical6)}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )}
                                        </View>
                                        <View style={[styles.roaHeader, { width: '13%', paddingVertical: 10, }]}>
                                            <Text style={[{ fontSize: 10 }]}>TEST</Text>
                                            <Text style={[{ fontSize: 10 }]}>METHOD</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={[styles.row, styles.boldFont, { textAlign: 'center', fontSize: 10 }]} fixed>
                                        <Text style={[styles.roaHeader, styles.specificCell, { width: "12%", textAlign: 'center', paddingVertical: 10, fontSize: 10 }]}>CUSTOMER CODE</Text>
                                        <Text style={[styles.roaHeader, { width: "11%", paddingVertical: 13, fontSize: 10 }]}>LAB CODE</Text>
                                        <Text style={[styles.roaHeader, { width: "15%", paddingVertical: 10, fontSize: 10 }]}>SAMPLE{'\n'}DESCRIPTION</Text>
                                        <View style={[styles.roaHeader, { width: "50%" }]}>
                                            <View style={[styles.roaHeader, { width: "100%", borderRight: 0 }]}><Text>PHYSICAL ANALYSIS RESULT</Text></View>
                                            {report.method?.method1 === '' ?
                                                (
                                                    <View style={[styles.roaHeader, styles.row, { width: "100%", borderBottom: 0, borderRight: 0, flex: 1 }]}>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical1)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical2)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical3)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical4)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical5)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.65%", borderBottom: 0, borderRight: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical6)}</Text>
                                                        </View>
                                                    </View>

                                                ) : report.physicalDetails[0]?.testMethod === 'TEXTURE - Hydrometer Method' ? (
                                                    <View style={[styles.roaHeader, styles.row, { width: "100%", borderBottom: 0, borderRight: 0, flexGrow: 1 }]}>
                                                        <View style={[{ width: "100%", flexDirection: 'column' }]}>
                                                            <View style={[styles.roaHeader, { width: "100%", borderRight: 0 }]}>
                                                                <Text>TEXTURE</Text>
                                                            </View>
                                                            <View style={[styles.roaHeader, styles.row, { width: "100%", borderBottom: 0, borderRight: 0, flexGrow: 1 }]}>
                                                                <View style={[styles.roaHeader, { width: "20%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                                    <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical1)}</Text>
                                                                </View>
                                                                <View style={[styles.roaHeader, { width: "20%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                                    <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical2)}</Text>
                                                                </View>
                                                                <View style={[styles.roaHeader, { width: "22%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                                    <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical3)}</Text>
                                                                </View>
                                                                <View style={[styles.roaHeader, { width: "35%", borderBottom: 0, borderRight: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                                    <Text style={{ padding: 0, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical4)}</Text>
                                                                </View>
                                                            </View>
                                                        </View>

                                                    </View>
                                                ) : (
                                                    <View style={[styles.roaHeader, styles.row, { width: "100%", borderBottom: 0, borderRight: 0, flexGrow: 1 }]}>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical1)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical2)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical3)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical4)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.67%", borderBottom: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical5)}</Text>
                                                        </View>
                                                        <View style={[styles.roaHeader, { width: "16.65%", borderBottom: 0, borderRight: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                                            <Text style={{ paddingVertical: 2, fontSize: 10 }}>{formatMethod(report.physicalMethod?.physical6)}</Text>
                                                        </View>
                                                    </View>
                                                )}

                                        </View>
                                        <Text style={[styles.roaHeader, { width: "13%", paddingVertical: 10 }]}>TEST METHOD</Text>
                                    </View>
                                )
                            }




                        </View>

                        {/* DATA ROWS */}
                        {report.physicalDetails[0]?.testMethod === 'MC - Gravimetric Method, WHC - Tapping Method, TEXTURE - Hydrometer Method' ?
                            (
                                <View style={[styles.row, { alignItems: 'stretch' }]}>  {/* ✅ Changed from minHeight to alignItems */}
                                    <View style={{ width: "92%" }}>  {/* ✅ Removed flex: 1 from here */}
                                        {report.physicalDetails.map((row, index) => (
                                            <View style={[styles.row, { flexGrow: 1 }]} key={index} wrap={false}>
                                                <View style={[styles.roaCell, styles.specificCell, { width: "11.75%", fontSize: 10 }]}>
                                                    <Text>{row.customerCode?.substring(0, 8)}</Text>
                                                    <Text>{row.customerCode?.substring(8)}</Text>
                                                </View>
                                                <View style={[styles.roaCell, { width: "10.65%", fontSize: 10, paddingHorizontal: 0 }]}>
                                                    <Text>{row.labCode?.substring(0, 8)}</Text>
                                                    <Text>{row.labCode?.substring(8)}</Text>
                                                </View>
                                                <Text style={[styles.roaCell, { width: "13.9%", textAlign: 'center', fontSize: 10 }]}>
                                                    {row.sampleDescription}
                                                </Text>

                                                {/* Chemical Results: 50/88 = 56.82% */}

                                                <View style={{ width: '64%', flexDirection: 'row' }}>
                                                    <Text style={[styles.roaCell, { width: '14.6%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                        {resultFormat(row.results?.physc1Result)}
                                                    </Text>
                                                    <Text style={[styles.roaCell, { width: '16.6%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                        {resultFormat(row.results?.physc2Result)}
                                                    </Text>
                                                    <Text style={[styles.roaCell, { width: '13%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                        {resultFormat(row.results?.physc3Result || '-')}
                                                    </Text>
                                                    <Text style={[styles.roaCell, { width: '13%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                        {resultFormat(row.results?.physc4Result)}
                                                    </Text>
                                                    <Text style={[styles.roaCell, { width: '15%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                        {resultFormat(row.results?.physc5Result)}
                                                    </Text>
                                                    <Text style={[styles.roaCell, { width: '28%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                        {resultFormat(row.results?.physc6Result)}
                                                    </Text>
                                                </View>


                                            </View>
                                        ))}
                                    </View>

                                    <View style={[styles.roaCell, checkMethod(report.physicalDetails[0]?.testMethod), { fontSize: 7, width: "12.7%", paddingVertical: 2, alignSelf: 'stretch' }]}>
                                        {report.physicalDetails[0]?.testMethod?.split(',').map((method, index) => {
                                            const parts = method.trim().split(' - ');
                                            return (
                                                <Text key={index} hyphenationCallback={word => [word]}>
                                                    <Text style={{ fontWeight: 'bold' }}>{parts[0]}</Text>
                                                    {parts[1] && ` - ${parts[1]}`}
                                                    {index < report.physicalDetails[0]?.testMethod.split(',').length - 1 && '\n'}
                                                </Text>
                                            );
                                        })}
                                    </View>
                                </View>
                            ) : (
                                <View style={[styles.row, { alignItems: 'stretch' }]}>  {/* ✅ Changed from minHeight to alignItems */}
                                    <View style={{ width: "88%" }}>  {/* ✅ Removed flex: 1 from here */}
                                        {report.physicalDetails.map((row, index) => (
                                            <View style={[styles.row, { flexGrow: 1 }]} key={index} wrap={false}>
                                                <View style={[styles.roaCell, styles.specificCell, { width: "13.64%", fontSize: 10, textAlign: 'center' }]}>
                                                    <Text>{row.customerCode?.substring(0, 12)}</Text>
                                                    <Text>{row.customerCode?.substring(12)}</Text>
                                                </View>
                                                <View style={[styles.roaCell, { width: "12.5%", textAlign: 'center', fontSize: 10, paddingHorizontal: 0 }]}>
                                                    <Text>{row.labCode?.substring(0, 12)}</Text>
                                                    <Text>{row.labCode?.substring(12)}</Text>
                                                </View>
                                                <Text style={[styles.roaCell, { width: "17.05%", textAlign: 'center' }]}>
                                                    {row.sampleDescription}
                                                </Text>

                                                {/* Chemical Results: 50/88 = 56.82% */}
                                                {report.physicalDetails[0]?.testMethod === 'TEXTURE - Hydrometer Method' ? (
                                                    <View style={{ width: '56.82%', flexDirection: 'row' }}>
                                                        <Text style={[styles.roaCell, { width: '20.4%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                            {resultFormat(row.results?.physc1Result)}
                                                        </Text>
                                                        <Text style={[styles.roaCell, { width: '20.4%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                            {resultFormat(row.results?.physc2Result)}
                                                        </Text>
                                                        <Text style={[styles.roaCell, { width: '22.4%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                            {resultFormat(row.results?.physc3Result)}
                                                        </Text>
                                                        <Text style={[styles.roaCell, { width: '39%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                            {resultFormat(row.results?.physc4Result)}
                                                        </Text>
                                                    </View>
                                                ) : (
                                                    <View style={{ width: '56.82%', flexDirection: 'row' }}>
                                                        <Text style={[styles.roaCell, { width: '16.67%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                            {resultFormat(row.results?.physc1Result)}
                                                        </Text>
                                                        <Text style={[styles.roaCell, { width: '16.67%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                            {resultFormat(row.results?.physc2Result)}
                                                        </Text>
                                                        <Text style={[styles.roaCell, { width: '16.68%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                            {resultFormat(row.results?.physc3Result)}
                                                        </Text>
                                                        <Text style={[styles.roaCell, { width: '16.70%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                            {resultFormat(row.results?.physc4Result)}
                                                        </Text>
                                                        <Text style={[styles.roaCell, { width: '16.74%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                            {resultFormat(row.results?.physc5Result)}
                                                        </Text>
                                                        <Text style={[styles.roaCell, { width: '16.98%', textAlign: 'center', borderTop: 0, fontSize: 10 }]}>
                                                            {resultFormat(row.results?.physc6Result)}
                                                        </Text>
                                                    </View>
                                                )}

                                            </View>
                                        ))}
                                    </View>

                                    <View style={[styles.roaCell, checkMethod(report.physicalDetails[0]?.testMethod), { fontSize: 7, width: "13%", paddingHorizontal: 1, paddingVertical: 2, alignSelf: 'stretch' }]}>
                                        {report.physicalDetails[0]?.testMethod?.split(',').map((method, index) => {
                                            const parts = method.trim().split(' - ');
                                            return (
                                                <Text key={index} hyphenationCallback={word => [word]}>
                                                    <Text style={{ fontWeight: 'bold' }}>{parts[0]}</Text>
                                                    {parts[1] && ` - ${parts[1]}`}
                                                    {index < report.physicalDetails[0]?.testMethod.split(',').length - 1 && '\n'}
                                                </Text>
                                            );
                                        })}
                                    </View>
                                </View>
                            )
                        }


                    </View>

                    {/*Physical Analysis Result */}



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
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{interPretationColor(report.interpretation.data2)}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{interPretationColor(report.interpretation.data3)}</Text>
                                <Text style={[styles.roaCell, { width: '20%', fontSize: 8 }]}>{interPretationColor(report.interpretation.data4)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.roaCell, { width: '24%', borderLeft: 1, fontSize: 8 }]}>{report.interpretation.data5}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{interPretationColor(report.interpretation.data6)}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{interPretationColor(report.interpretation.data7)}</Text>
                                <Text style={[styles.roaCell, { width: '20%', fontSize: 8 }]}></Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.roaCell, { width: '24%', borderLeft: 1, fontSize: 8 }]}>{report.interpretation.data8}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{interPretationColor(report.interpretation.data9)}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{interPretationColor(report.interpretation.data10)}</Text>
                                <Text style={[styles.roaCell, { width: '20%', fontSize: 8 }]}>{interPretationColor(report.interpretation.data11)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.roaCell, { width: '24%', borderLeft: 1, fontSize: 8 }]}>{report.interpretation.data12}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{interPretationColor(report.interpretation.data13)}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{interPretationColor(report.interpretation.data14)}</Text>
                                <Text style={[styles.roaCell, { width: '20%', fontSize: 8 }]}></Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.roaCell, { width: '24%', borderLeft: 1, fontSize: 8 }]}>{report.interpretation.data15}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{interPretationColor(report.interpretation.data16)}</Text>
                                <Text style={[styles.roaCell, { width: '30%', fontSize: 8 }]}>{interPretationColor(report.interpretation.data17)}</Text>
                                <Text style={[styles.roaCell, { width: '20%', fontSize: 8 }]}>{report.interpretation.data18}</Text>
                            </View>
                        </View>
                    )}

                    <View style={[styles.row, { fontSize: 9, textAlign: 'justify', marginTop: 5, paddingHorizontal: 20 }]} fixed>
                        <Text style={styles.italicFont}>Note: The result is based on the sample received and analyzed by the laboratory. This report shall not be reproduced without full approval of the Department of Agriculture Regional Field Office 5 - Integrated Laboratories Division.</Text>
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
                            <Text>ILD5-RSL-FR-050-0</Text>
                            <Text>Effectivity Date: March 17, 2026</Text>
                        </View>
                    </View>

                    <Text
                        style={[styles.pageNumber, { right: 30 }]}
                        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                        fixed />
                </Page>
            </Document >
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