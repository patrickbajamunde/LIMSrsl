import axios from 'axios';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import styles from './Styles';
import image1 from '../../analysts/components/images/DA5.jpg';
import image2 from '../../dco/components/images/unnamed.png'
import terms from './data/Terms';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

const TestPdf = ({ requestId, icon, disabledIcon }) => {

    const [request, setRequest] = useState(null)

    useEffect(() => {
        // Fetch request data using the requestId passed as a prop
        axios.get(`http://192.168.100.177:8002/api/client/getClient/${requestId}`)
            .then((response) => {
                setRequest(response.data);
            })
            .catch((error) => {
                console.error("Error fetching request:", error);
                setRequest(null);
            });
    }, [requestId]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const numericDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const generatePdf = () => {
        if (!request || !request.sampleDetails) return;


        const normalize = (str) => str?.trim().replace(/\s+/g, ' ') ?? '';

        const allForOneParameter = (row, index) => {
            const currentMethod = normalize(row.methodReq);
            if (!currentMethod) return '';

            const firstOccurrenceIndex = request.sampleDetails.findIndex(
                sample => normalize(sample.methodReq) === currentMethod
            );

            return firstOccurrenceIndex === index
                ? currentMethod.replace(/,\s*/g, '\n')
                : '';
        }

        const allForOne = (row, index) => {
            const currentMethod = normalize(row.method);
            if (!currentMethod) return '';

            const firstOccurrenceIndex = request.sampleDetails.findIndex(
                sample => normalize(sample.method) === currentMethod
            );

            return firstOccurrenceIndex === index
                ? currentMethod.replace(/,\s*/g, '\n')
                : '';
        }

        const Border = (index) => {
            const firstMethod = request.sampleDetails[0]?.method?.trim();
            if (!firstMethod) return '';
            if (request.sampleDetails.every(sample => sample.method?.trim() === firstMethod)) {
                return index === 0 ? request.sampleDetails.length > 1 ? { borderBottom: 0 } : { borderBottom: 1 } : {};
            }
            return {};
        }


        const checkHeight = (index) => {
            if (!request.sampleDetails[0]?.methodReq?.trim()) return '';
            if (request.sampleDetails[0]?.methodReq?.trim() === 'pH EC OM NPK') {
                return { paddingBottom: 40 }
            } else if (request.sampleDetails[0]?.methodReq?.trim() === 'pH EC OM NPK TEXTURE') {
                return { paddingBottom: 50 }
            } else if (request.sampleDetails[0]?.methodReq?.trim() === 'pH EC OM NPK TEXTURE WHC MC') {
                return { paddingBottom: 65 }
            }

            return {};
        }

        const checkHeight2 = (index) => {
            const method = request.sampleDetails[index]?.methodReq?.trim();
            if (!method) return { minHeight: 20 };

            const paramCount = method.split(' ').length;

            if (paramCount === 1) return { minHeight: 20 };  // pH, OM, EC, etc.
            if (paramCount === 2) return { minHeight: 30 };  // pH EC, pH OM, etc.
            if (paramCount === 3) return { minHeight: 35 };  // pH EC OM, etc.
            if (paramCount === 4) return { minHeight: 40 };  // pH EC OM NPK
            if (paramCount === 5) return { minHeight: 50 };  // pH EC OM NPK TEXTURE
            return { minHeight: 65 };                        // 6+ params
        };




        return (
            <Document>
                <Page style={[styles.body, { marginTop: 5 }]} size="A4">
                    <View style={[styles.headerContainer3, styles.row, { marginLeft: 14, marginRight: 14 }]} fixed>
                        <View style={[styles.headerCell, { justifyContent: 'center', paddingRight: 5 }]}>
                            <Image style={styles.image} src={image1} />
                        </View>

                        <View style={[styles.headerOffice, styles.headerCell, { paddingRight: 8, paddingLeft: 2 }]}>
                            <View style={{ lineHeight: 0.65 }}>
                                <Text style={[styles.normalFont, { fontSize: 8 }]} >Republic of the Philippines</Text>
                                <Text style={[styles.boldFont, { fontSize: 8 }]} >DEPARTMENT OF AGRICULTURE</Text>
                                <Text style={[styles.boldFont, { fontSize: 8 }]} >REGIONAL FIELD OFFICE 5</Text>
                                <Text style={[styles.boldFont, { fontSize: 8 }]} >INTEGRATED LABORATORIES DIVISION</Text>
                                <Text style={[styles.normalFont, { fontSize: 8 }]} >San Agustin, Pili, Camarines Sur</Text>
                            </View>
                        </View>

                        <View style={[styles.formTitle, styles.headerCell]} >
                            <Text style={[styles.titleBold, { fontSize: 12, paddingHorizontal: 25 }]}>ANALYSIS REQUEST FORM</Text>
                        </View>

                        <View style={[styles.headerCell, { flexDirection: 'column', }]}>
                            <Text style={[styles.boldFont, { fontSize: 10, borderBottom: 1, paddingLeft: 15 }]}>Document Code</Text>
                            <Text style={[styles.normalFont, { fontSize: 10, borderBottom: 1, padding: 5 }]}>ILD5-RSL-FR-001-0</Text>
                            <Text style={[styles.boldFont, { fontSize: 10, borderBottom: 1, paddingLeft: 25 }]}>Record ID</Text>
                            <Text style={[styles.normalFont, { fontSize: 8, paddingRight: 2, paddingLeft: 2 }]}>{request.requestId}</Text>
                        </View>

                        <View style={[styles.headerCell, { flexDirection: 'column', borderRightWidth: 0 }]}>
                            <Text style={[styles.boldFont, { fontSize: 10, borderBottom: 1, paddingLeft: 5 }]}>Effectivity Date</Text>
                            <Text style={[styles.normalFont, { fontSize: 10, borderBottom: 1, padding: 5 }]}>March 17, 2026</Text>
                            <Text style={[styles.boldFont, { fontSize: 10, borderBottom: 1, paddingLeft: 20 }]}>Page No.</Text>
                            <Text
                                style={styles.testPdfpage}
                                render={({ pageNumber, totalPages }) => pageNumber <= 2 ? ` ${pageNumber}   of   2` : ''}
                                fixed />
                        </View>
                    </View>
                    <View style={[styles.table, { marginTop: 0, borderLeft: 0, borderTop: 0, paddingVertical: 1.5 }]}>
                        <Text style={[styles.italicFont, { paddingLeft: 14, fontSize: 8, textAlign: 'right' }]}>
                            *This box is to filled-up upon release of test report
                        </Text>
                    </View>
                    <View style={[styles.table, { marginTop: 0 }]}>
                        <View style={styles.row}>
                            <View style={[{ width: "70%", fontSize: 10 }]}>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <Text style={[styles.cellTwo, styles.boldFont, { width: '21.5%', fontSize: 10, backgroundColor: '#B6D7A8', }]}>Document Type: </Text>
                                    <View style={[styles.cellTwo, styles.row, { width: '78.5%' }]}>
                                        <View style={[styles.row, styles.normalFont, { alignItems: 'center', paddingLeft: 50 }]}>
                                            <Text style={styles.checkbox}></Text>
                                            <Text>Hardcopy</Text>
                                        </View>
                                        <View style={[styles.row, styles.normalFont, { alignItems: 'center', paddingLeft: 80 }]}>
                                            <Text style={styles.checkbox}></Text>
                                            <Text>E-copy</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '21.5%', backgroundColor: '#B6D7A8', }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10, }]}>Request ID:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '78.5%' }]}>
                                        <Text style={[styles.normalFont, { paddingLeft: 20 }]}>{request.requestId}</Text>
                                    </View>
                                </View>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '21.5%', backgroundColor: '#B6D7A8', }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>
                                            Transaction Date:
                                        </Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '78.5%' }]}>
                                        <Text style={[styles.normalFont, { paddingLeft: 20 }]}>
                                            {formatDate(request.transactionDate)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, styles.boldFont, { fontSize: 10, width: '21.5%', backgroundColor: '#B6D7A8', }]}>
                                        <Text>Type of Customer: </Text>
                                    </View>

                                    <View style={[styles.cellTwo, styles.row, { width: '78.5%' }]}>
                                        <View style={[styles.row, styles.normalFont, { alignItems: 'center', paddingLeft: 50 }]}>
                                            <Text style={styles.checkbox}></Text>
                                            <Text>Walk In</Text>
                                        </View>
                                        <View style={[styles.row, styles.normalFont, { alignItems: 'center', paddingLeft: 50 }]}>
                                            <Text style={styles.checkbox}></Text>
                                            <Text>Researcher</Text>
                                        </View>
                                        <View style={[styles.row, styles.normalFont, { alignItems: 'center', paddingLeft: 40 }]}>
                                            <Text style={styles.checkbox}></Text>
                                            <Text>Farmer</Text>
                                        </View>
                                    </View>

                                </View>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '21.5%', backgroundColor: '#B6D7A8', }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>Coordinates:</Text>
                                    </View>

                                    <View style={[styles.row, styles.cellTwo, { width: '78.5%' }]}>
                                        <View style={[styles.row, { paddingLeft: 2 }]}>
                                            <Text style={[{ fontWeight: "normal" }]}>Longitude: </Text>
                                            <Text style={{ fontWeight: 'normal' }}>{request.coordinates.map(s => s.longitude)}</Text>
                                        </View>
                                        <View style={[styles.row, { paddingLeft: 100 }]}>
                                            <Text style={[{ fontWeight: "normal" }]}>Latitude:</Text>
                                            <Text Text style={{ fontWeight: 'normal' }}>{request.coordinates.map(s => s.latitude)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.cellTwo, styles.boldFont, { width: "30%" }]}>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '42%', backgroundColor: '#B6D7A8', }]} >
                                        <Text style={[styles.boldFont, { fontSize: 10, paddingBottom: 1 }]} hyphenationCallback={word => [word]}>Date/Time Released:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '58%', borderRight: 0 }]}>
                                        <Text style={{ fontWeight: 'normal' }}></Text>
                                    </View>
                                </View>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '42%', paddingVertical: 6.4, backgroundColor: '#B6D7A8', }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>Released By:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '58%', borderRight: 0 }]}>
                                        <Text style={{ fontWeight: 'normal' }}></Text>
                                    </View>
                                </View>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '42%', borderBottom: 0, backgroundColor: '#B6D7A8', }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>Claimed By:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '58%', borderRight: 0, borderBottom: 0 }]}>
                                        <Text style={{ fontWeight: 'normal' }}></Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, { width: "40%", borderRightWidth: 0 }]}>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '37.6%', backgroundColor: '#B6D7A8', }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>Customer's Name: </Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '62.4%' }]}>
                                        <Text style={{ fontWeight: 'normal' }}>{request.clientName}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '37.6%', backgroundColor: '#B6D7A8', }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>Address:  </Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '62.4%' }]}>
                                        <Text style={{ fontWeight: 'normal' }} >{request.clientAddress}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%', flexGrow: 1 }]}>
                                    <View style={[styles.cellTwo, { width: '37.6%', borderBottom: 0, backgroundColor: '#B6D7A8', }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>Location of Farm:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '62.4%', borderBottom: 0 }]}>
                                        <Text style={{ fontWeight: 'normal' }}>{request.locOfFarm}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.cellTwo, { width: "30%" }]}>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '37.6%', backgroundColor: '#B6D7A8', }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>Topography:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '62.4%', borderRight: 0 }]}>
                                        <Text style={{ fontWeight: 'normal' }}>{request.topography}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '37.6%', backgroundColor: '#B6D7A8', }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>Crops:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '62.4%', borderRight: 0 }]}>
                                        <Text style={{ fontWeight: 'normal' }}>{request.cropsPlanted}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%', flexGrow: 1 }]}>
                                    <View style={[styles.cellTwo, { width: '37.6%', borderBottom: 0, backgroundColor: '#B6D7A8', }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>Area:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '62.4%', borderBottom: 0, borderRight: 0 }]}>
                                        <Text style={{ fontWeight: 'normal' }}>{request.area}</Text>
                                    </View>
                                </View>

                            </View>
                            <View style={[styles.cellTwo, { width: "30%" }]}>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '42%', backgroundColor: '#B6D7A8', }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>Sex:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '58%', borderRight: 0 }]}>
                                        <Text style={{ fontWeight: 'normal' }}>{request.clientGender}</Text>
                                    </View>
                                </View>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '42%', backgroundColor: '#B6D7A8' }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>Contact No.:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '58%', borderRight: 0 }]}>
                                        <Text style={{ fontWeight: 'normal' }}>{request.clientContact}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '42%', borderBottom: 0, backgroundColor: '#B6D7A8' }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>Email Address:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, { width: '58%', borderBottom: 0, borderRight: 0 }]}>
                                        <Text style={{ fontWeight: 'normal' }} hyphenationCallback={word => word.split(/(@|(?=\.))/)}>
                                            {request.clientEmail}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, styles.boldFont, { width: "100%", backgroundColor: '#B6D7A8' }]}>
                                <Text style={{ fontSize: 10 }}>A. LABORATORY SERVICES</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <Text style={[styles.header, { width: "18%", paddingHorizontal: 5, textAlign: "center" }]}>No. of Samples</Text>
                            <Text style={[styles.header, { width: "25%", paddingHorizontal: 10, textAlign: "center" }]}>Customer Code</Text>
                            <Text style={[styles.header, { width: "25%", paddingTop: 5 }]}>Lab Code</Text>
                            <Text style={[styles.header, { width: "30%", }]}>Sample{'\n'}Description</Text>
                            <Text style={[styles.header, { width: "60%", paddingTop: 5 }]}>Test Requested-Test Method</Text>
                            <Text style={[styles.header, { width: "20%", paddingTop: 5 }]}>Unit Cost</Text>
                            <Text style={[styles.header, { width: "20%", paddingTop: 5 }]}>Total</Text>
                        </View>

                        {request.sampleDetails &&
                            (
                                request.sampleDetails.length === 1 ? (
                                    <View>
                                        {request.sampleDetails.map((row, index) => (
                                            <View style={[styles.row]} key={index}>
                                                <View style={[styles.cell, { width: "18%", textAlign: "center" }]}>
                                                    <Text>{row.noOfSample}</Text>
                                                </View>

                                                <View style={[styles.cell, { width: "25%", textAlign: "center", fontSize: 10 }]}>
                                                    <Text>{row.customerCode?.substring(0, 12)}</Text>
                                                    <Text>{row.customerCode?.substring(12)}</Text>
                                                </View>

                                                <View style={[styles.cell, { width: "25%", textAlign: "center", fontSize: 10 }]}>
                                                    <View key={index} style={{ textAlign: "center" }}>
                                                        <Text>{row.labCode?.substring(0, 12)}</Text>
                                                        <Text>{row.labCode?.substring(12)}</Text>
                                                    </View>
                                                </View>
                                                <View style={[styles.cell, { width: "30%", textAlign: "left", fontSize: 10 }]}>
                                                    <View key={index}>
                                                        <Text>{row.sampleDescription}</Text>
                                                    </View>
                                                </View>
                                                <View style={[styles.cell, { width: "30%", fontSize: 10, borderRight: 0, fontWeight: 'bold', textAlign: 'center', justifyContent: 'center' }]}>
                                                    <View>
                                                        <Text hyphenationCallback={word => [word]}>
                                                            {row.methodReq}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={[styles.cell, { width: "30%", fontSize: 8, fontWeight: 'bold' }]}>
                                                    <View>
                                                        <Text hyphenationCallback={word => [word]}>
                                                            {row.method.replace(/,\s*/g, '\n')}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={[styles.cell, { width: "20%", fontSize: 10 }]}>{row.unitCost?.trim().replace(/,\s*/g, '\n')}</Text>
                                                <Text style={[styles.cell, { width: "20%", fontSize: 10 }]}>{row.totalCost}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ) : request.sampleDetails.length > 1 && request.sampleDetails.every(sample => sample.methodReq?.trim() === request.sampleDetails[0].methodReq?.trim()) ? (
                                    <View style={[styles.row, { alignItems: 'stretch' }]}>

                                        {/* SINGLE MAP - all per-row columns together */}
                                        <View style={{ width: '100%' }}>
                                            {request.sampleDetails.map((row, index) => (
                                                <View style={[styles.row, { flexGrow: 1, alignItems: 'stretch' }]} key={index}>
                                                    <View style={[styles.cell, { width: "18%", textAlign: "center", justifyContent: 'center' }]}>
                                                        <Text>{row.noOfSample}</Text>
                                                    </View>
                                                    <View style={[styles.cell, { width: "25%", textAlign: "center", fontSize: 10, justifyContent: 'center' }]}>
                                                        <Text>{row.customerCode?.substring(0, 12)}</Text>
                                                        <Text>{row.customerCode?.substring(12)}</Text>
                                                    </View>
                                                    <View style={[styles.cell, { width: "25%", textAlign: "center", fontSize: 10, justifyContent: 'center' }]}>
                                                        <Text >{row.labCode?.substring(0, 12)}</Text>
                                                        <Text>{row.labCode?.substring(12)}</Text>
                                                    </View>
                                                    <View style={[styles.cell, { width: "30%", textAlign: "left", fontSize: 10, justifyContent: 'center' }]}>
                                                        <Text style={{ flexWrap: 'wrap' }}>{row.sampleDescription}</Text>
                                                    </View>

                                                    <View style={[checkHeight(index), { width: '30%' }]}></View>
                                                    <View style={[{ width: '30%' }]}></View>

                                                    {/* Unit Cost + Total INSIDE the map - stays in sync */}
                                                    <Text style={[styles.cell, { width: "20%", fontSize: 10, justifyContent: 'center' }]}>
                                                        {row.unitCost?.trim().replace(/,\s*/g, '\n')}
                                                    </Text>
                                                    <Text style={[styles.cell, { width: "20%", fontSize: 10, justifyContent: 'center' }]}>
                                                        {row.totalCost}
                                                    </Text>
                                                </View>
                                            ))}

                                            <View style={{ width: '30.3%', flexDirection: 'row', alignSelf: 'stretch', position: 'absolute', right: '20.2%', top: 0, bottom: 0, }}>
                                                <View style={[styles.cell, { flex: 1, justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: 10, textAlign: 'center', borderRight: 0, backgroundColor: 'white', }]}>
                                                    <Text style={{ fontWeight: 'bold' }}>
                                                        {allForOneParameter(request.sampleDetails[0], 0)}
                                                    </Text>
                                                </View>
                                                <View style={[styles.cell, { flex: 1, justifyContent: 'center', fontSize: 8, backgroundColor: 'white' }]}>
                                                    <Text>{allForOne(request.sampleDetails[0], 0)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                ) : request.sampleDetails.every((sample, index) =>
                                    request.sampleDetails.findIndex(s => normalize(s.methodReq) === normalize(sample.methodReq)) === index
                                ) ? (
                                    <View style={{ width: '100%' }}>
                                        {request.sampleDetails.map((row, index) => (
                                            <View style={[styles.row]} key={index}>
                                                <View style={[styles.cell, { width: "18%", textAlign: "center" }]}>
                                                    <Text>{row.noOfSample}</Text>
                                                </View>
                                                <View style={[styles.cell, { width: "25%", textAlign: "center", fontSize: 10 }]}>
                                                    <Text>{row.customerCode?.substring(0, 12)}</Text>
                                                    <Text>{row.customerCode?.substring(12)}</Text>
                                                </View>
                                                <View style={[styles.cell, { width: "25%", textAlign: "center", fontSize: 10 }]}>
                                                    <Text>{row.labCode?.substring(0, 12)}</Text>
                                                    <Text>{row.labCode?.substring(12)}</Text>
                                                </View>
                                                <View style={[styles.cell, { width: "30%", textAlign: "left", fontSize: 10 }]}>
                                                    <Text style={{ flexWrap: 'wrap' }}>{row.sampleDescription}</Text>
                                                </View>
                                                <View style={[styles.cell, { width: "30%", fontSize: 10, borderRight: 0, fontWeight: 'bold', textAlign: 'center', justifyContent: 'center' }]}>
                                                    <Text hyphenationCallback={word => [word]}>
                                                        {row.methodReq?.replace(/,\s*/g, '\n')}
                                                    </Text>
                                                </View>
                                                <View style={[styles.cell, { width: "30%", fontSize: 8 }]}>
                                                    <Text hyphenationCallback={word => [word]}>
                                                        {row.method?.replace(/,\s*/g, '\n')}
                                                    </Text>
                                                </View>
                                                <Text style={[styles.cell, { width: "20%", fontSize: 10 }]}>
                                                    {row.unitCost?.trim().replace(/,\s*/g, '\n')}
                                                </Text>
                                                <Text style={[styles.cell, { width: "20%", fontSize: 10 }]}>
                                                    {row.totalCost}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>


                                ) : (
                                    <View style={{ width: '100%', position: 'relative' }}>
                                        {/* Main rows - leave method columns as empty placeholders */}
                                        {request.sampleDetails.map((row, index) => (
                                            <View style={[styles.row, { flexGrow: 1, alignItems: 'stretch' }]} key={index}>
                                                <View style={[styles.cell, { width: "18%", textAlign: "center" }]}>
                                                    <Text>{row.noOfSample}</Text>
                                                </View>
                                                <View style={[styles.cell, { width: "25%", textAlign: "center", fontSize: 10 }]}>
                                                    <Text>{row.customerCode?.substring(0, 12)}</Text>
                                                    <Text>{row.customerCode?.substring(12)}</Text>
                                                </View>
                                                <View style={[styles.cell, { width: "25%", textAlign: "center", fontSize: 10 }]}>
                                                    <Text>{row.labCode?.substring(0, 12)}</Text>
                                                    <Text>{row.labCode?.substring(12)}</Text>
                                                </View>
                                                <View style={[styles.cell, { width: "30%", textAlign: "left", fontSize: 10 }]}>
                                                    <Text style={{ flexWrap: 'wrap' }}>{row.sampleDescription}</Text>
                                                </View>

                                                {/* Empty placeholders for method columns */}
                                                <View style={[styles.cell, checkHeight2(index), { width: "30%", borderRight: 0 }]} />
                                                <View style={[styles.cell, { width: "30%" }]} />

                                                <View style={[styles.cell, { width: "20%", fontSize: 10 }]}>
                                                    <Text>{String(row.unitCost ?? '').trim().replace(/,\s*/g, '\n')}</Text>
                                                </View>
                                                <View style={[styles.cell, { width: "20%", fontSize: 10 }]}>
                                                    <Text>{row.totalCost}</Text>
                                                </View>
                                            </View>
                                        ))}

                                        {/* Method overlay — one per unique method group */}
                                        {(() => {
                                            const groups = [];
                                            let i = 0;

                                            // Define row height per methodReq
                                            const getRowHeight = (methodReq) => {
                                                const m = methodReq?.trim();
                                                if (!m) return 20;

                                                const paramCount = m.split(' ').length;

                                                if (paramCount === 1) return 20;
                                                if (paramCount === 2) return 30;
                                                if (paramCount === 3) return 35;
                                                if (paramCount === 4) return 40;
                                                if (paramCount === 5) return 50;
                                                return 65;
                                            };

                                            while (i < request.sampleDetails.length) {
                                                const currentMethod = normalize(request.sampleDetails[i].method);
                                                const currentMethodReq = normalize(request.sampleDetails[i].methodReq);
                                                let j = i + 1;
                                                while (
                                                    j < request.sampleDetails.length &&
                                                    normalize(request.sampleDetails[j].method) === currentMethod &&
                                                    normalize(request.sampleDetails[j].methodReq) === currentMethodReq
                                                ) {
                                                    j++;
                                                }
                                                groups.push({ startIndex: i, count: j - i, method: currentMethod, methodReq: currentMethodReq });
                                                i = j;
                                            }

                                            return groups.map((group, gi) => {
                                                // Calculate top by summing heights of all rows before this group
                                                const top = request.sampleDetails
                                                    .slice(0, group.startIndex)
                                                    .reduce((sum, row) => sum + getRowHeight(row.methodReq), 0);

                                                // Calculate height by summing heights of all rows in this group
                                                const height = request.sampleDetails
                                                    .slice(group.startIndex, group.startIndex + group.count)
                                                    .reduce((sum, row) => sum + getRowHeight(row.methodReq), 0);

                                                return (
                                                    <View
                                                        key={gi}
                                                        style={{
                                                            position: 'absolute',
                                                            top,
                                                            height,
                                                            width: '30.3%',
                                                            left: '49.5%',
                                                            flexDirection: 'row',
                                                            flexGrow: 1
                                                        }}
                                                    >
                                                        <View style={[styles.cell, { flex: 1, justifyContent: 'center', alignItems: 'center', fontSize: 10, fontWeight: 'bold', textAlign: 'center', borderRight: 0, backgroundColor: 'white' }]}>
                                                            <Text style={{ fontWeight: 'bold' }}>
                                                                {group.methodReq.replace(/,\s*/g, '\n')}
                                                            </Text>
                                                        </View>
                                                        <View style={[styles.cell, { flex: 1, justifyContent: 'center', fontSize: 8, backgroundColor: 'white' }]}>
                                                            <Text>{group.method.replace(/,\s*/g, '\n')}</Text>
                                                        </View>
                                                    </View>
                                                );
                                            });
                                        })()}
                                    </View>

                                )
                            )
                        }



                        {/* */}




                        <View style={styles.row}>
                            <View style={[styles.cellTwo, { width: "93%", borderRightWidth: 1 }]}>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '44.1%', backgroundColor: '#D9EAD3', }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>REPORT DUE DATE:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, styles.normalFont, { width: '56%', borderRight: 0 }]}>
                                        <Text> {formatDate(request.reportDue)}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '44.1%', backgroundColor: '#D9EAD3', }]}>
                                        <Text style={[styles.normalFont, { fontSize: 10 }]}>SAMPLE DISPOSED BY:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, styles.normalFont, { width: '56%', borderRight: 0 }]}>
                                        <Text> {request.sampleDisposedBy}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '44.1%', backgroundColor: '#D9EAD3', borderBottom: 0 }]}>
                                        <Text style={[styles.normalFont, { fontSize: 10 }]}>DATE OF DISPOSAL: </Text>
                                    </View>
                                    <View style={[styles.cellTwo, styles.normalFont, { width: '56%', borderRight: 0, borderBottom: 0 }]}>
                                        <Text> {formatDate(request.sampleDisposal)}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.cellTwo, { width: "57%" }]}>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '50%', backgroundColor: '#D9EAD3', }]}>
                                        <Text style={[styles.normalFont, { fontSize: 10 }]}>OR NO.:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, styles.normalFont, { width: '50%', borderRight: 0 }]}>
                                        <Text>{request.orNo}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '50%', backgroundColor: '#D9EAD3', }]}>
                                        <Text style={[styles.normalFont, { fontSize: 10 }]}>AMOUNT PAID:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, styles.normalFont, { width: '50%', borderRight: 0 }]}>
                                        <Text>{request.amountPaid}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '50%', backgroundColor: '#D9EAD3', borderBottom: 0 }]}>
                                        <Text style={[styles.normalFont, { fontSize: 10 }]}>UNPAID BALANCE:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, styles.normalFont, { width: '50%', borderRight: 0, borderBottom: 0 }]}>
                                        <Text>{request.unPaidBalance}</Text>
                                    </View>
                                </View>

                            </View>
                            <View style={[styles.cellTwo, { width: "38%" }]}>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '50.5%', backgroundColor: '#D9EAD3', }]}>
                                        <Text style={[styles.normalFont, { fontSize: 10 }]}>Sub-Total: </Text>
                                    </View>
                                    <View style={[styles.cellTwo, styles.normalFont, { width: '49.5%', borderRight: 0 }]}>
                                        <Text>{request.subTotal}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '50.5%', backgroundColor: '#D9EAD3', }]}>
                                        <Text style={[styles.normalFont, { fontSize: 10 }]}>DISCOUNT:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, styles.normalFont, { width: '49.5%', borderRight: 0 }]}>
                                        <Text>{request.discount}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '50.5%', backgroundColor: '#D9EAD3', borderBottom: 0 }]}>
                                        <Text style={[styles.boldFont, { fontSize: 10 }]}>TOTAL Php:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, styles.normalFont, { width: '49.5%', borderRight: 0, borderBottom: 0 }]}>
                                        <Text>{request.totalPhp}</Text>
                                    </View>
                                </View>

                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, { width: "100%", backgroundColor: '#D9EAD3' }]}>
                                <Text style={[styles.boldFont, { fontSize: 10 }]}>B. SAMPLE REMARKS</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, { width: "98%" }]}>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '44.1%', backgroundColor: '#D9EAD3', }]}>
                                        <Text style={[styles.normalFont, { fontSize: 10 }]}>SAMPLING DATE:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, styles.normalFont, { width: '56%', borderRight: 0 }]}>
                                        <Text>{formatDate(request.samplingDate)}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '44.1%', backgroundColor: '#D9EAD3', borderBottom: 0 }]}>
                                        <Text style={[styles.normalFont, { fontSize: 10 }]}>SAMPLING TIME:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, styles.normalFont, { width: '56%', borderRight: 0, borderBottom: 0 }]}>
                                        <Text>{request.samplingTime}</Text>
                                    </View>
                                </View>


                            </View>
                            <View style={[styles.cellTwo, { width: "100%" }]}>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '35%', backgroundColor: '#D9EAD3' }]}>
                                        <Text style={[styles.normalFont, { fontSize: 10 }]}>SAMPLE CONDITION:</Text>
                                    </View>
                                    <View style={[styles.cellTwo, styles.normalFont, { width: '65%', borderRight: 0 }]}>
                                        <Text>{request.sampleCondition}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%' }]}>
                                    <View style={[styles.cellTwo, { width: '35%', backgroundColor: '#D9EAD3', borderBottom: 0 }]}>
                                        <Text style={[styles.normalFont, { fontSize: 10 }]}>OTHER MATTERS: </Text>
                                    </View>
                                    <View style={[styles.cellTwo, styles.normalFont, { width: '65%', borderRight: 0, borderBottom: 0 }]}>
                                        <Text>{request.otherMatters}</Text>
                                    </View>
                                </View>

                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, { width: "100%" }]}>
                                <View style={[styles.cellTwo, { width: '100%', backgroundColor: '#D9EAD3', borderRight: 0 }]}>
                                    <Text style={[styles.boldFont, { fontSize: 10 }]}>C. DISCUSSED WITH CUSTOMER</Text>
                                </View>

                                <View style={[styles.row, styles.cellTwo, { width: '100%', borderBottom: 0, borderRight: 0 }]}>
                                    <Text style={[styles.boldFont, { fontSize: 10 }]}>CONFORME:</Text>
                                    <Text style={[styles.italicFont, { fontSize: 9 }]}> I have agreed to the details including the Terms and Conditions stated in this Laboratory Request Form</Text>
                                </View>

                            </View>
                        </View>
                        <View style={[styles.row, { height: 25 }]}>
                            <View style={[styles.cellTwo, { width: "93.5%", fontSize: 9 }]}>
                                <Text>Submitted By:</Text>
                                <Text style={[{ fontSize: 10, textAlign: 'center', justifyContent: 'flex-end', }]}>{request.clientName}, {numericDate(request.transactionDate)}</Text>
                            </View>
                            <View style={[styles.cellTwo, { width: "95%", textAlign: 'center', justifyContent: 'flex-end', }]}>
                                <Text>{request.receivedBy}, {numericDate(request.transactionDate)}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, { width: "93.5%", fontSize: 9, textAlign: 'center', paddingHorizontal: 55, backgroundColor: '#D9EAD3' }]}>
                                <Text>Customer's Name & Signature / Authorized Representative & Date:</Text>
                            </View>
                            <View style={[styles.cellTwo, { width: "95%", fontSize: 9, textAlign: 'center', backgroundColor: '#D9EAD3' }]}>
                                <Text>Sample/s Received by & Date</Text>
                            </View>
                        </View>
                    </View>





                    <Text style={[styles.font, { marginLeft: 52, marginVertical: 8 }]}>
                        ------------------------------------------------------------------------------------------------------------------------------------------
                    </Text>
                    <View style={[styles.row]}>
                        <Text style={[styles.italicFont, { paddingLeft: 14, marginTop: 3, fontSize: 9 }]}>Please present this stub upon claiming test report</Text>
                    </View>
                    <View style={[styles.row, styles.headerContainer3, { justifyContent: "center", marginTop: 10, backgroundColor: '#D9EAD3', borderTop: 1, marginHorizontal: 14 }]}>
                        <Text style={[styles.boldFont, { fontSize: 10, }]}> CUSTOMER'S ACKNOWLEDGEMENT RECEIPT</Text>
                    </View>
                    <View style={[styles.row, { paddingTop: 15 }]}>
                        <Text style={[styles.font, { paddingLeft: 14, fontSize: 9 }]}>Date of Transaction: _________________________</Text>
                        <View style={[styles.row, { flex: 1, justifyContent: "flex-end" }]}>
                            <Text style={[styles.font, { paddingRight: 14, fontSize: 9, justifyContent: "flex-end" }]}>Report(s) available on: __________________________</Text>
                        </View>
                    </View>
                    <View style={[styles.font, { fontSize: 9, paddingLeft: 14, paddingRight: 14, marginTop: 18 }]}>
                        {request && request.clientName !== '' ? (
                            <View style={[styles.row, { marginLeft: 72 }]}>
                                <Text>THIS IS TO ACKNOWLEDGE RECEIPT OF THE LABORATORY SERVICES AVAILED BY</Text> <Text style={{ fontSize: 9, borderBottom: 0.5, fontWeight: 'bold', paddingHorizontal: 13 }}>{request.clientName}</Text> <Text>FROM</Text>
                            </View>
                        ) : (
                            <View style={[styles.row, { marginLeft: 72 }]}>
                                <Text>THIS IS TO ACKNOWLEDGE RECEIPT OF THE LABORATORY SERVICES AVAILED BY</Text> <Text style={{ fontSize: 9, borderBottom: 0.5, fontWeight: 'bold', paddingHorizontal: 73 }}></Text> <Text>FROM</Text>
                            </View>
                        )}
                        <View style={styles.row}>
                            <Text>DA ILD RSL V. THIS ALSO SERVES AS AUTHORIZATION FOR ____________________________________________________________, TO CLAIM TEST REPORT OF THE  </Text>
                        </View>
                        <View style={styles.row}>
                            <Text>REQUESTED ANALYSIS ENTERED WITH LAB REQUEST CODE</Text> <Text style={{ fontSize: 9, fontWeight: 'bold', borderBottom: 0.5, paddingHorizontal: 20 }}>{request.requestId}</Text> <Text>INDICATED IN THE ANALYSIS REQUEST FORM</Text>
                        </View>
                    </View>
                    <View style={[styles.row]}>
                        <Text style={[styles.boldFont, { fontSize: 9, marginTop: 10, marginLeft: 28 }]}>CLAIMED BY:</Text>
                    </View>
                    <View style={[styles.row, { marginLeft: 28, gap: 40, marginTop: 18 }]}>
                        <View style={styles.column}>
                            {request && request.clientName !== '' ? (
                                <Text style={[styles.font, { fontSize: 11, alignSelf: 'center', borderBottom: 0.5, paddingHorizontal: 10 }]}>{request.clientName}</Text>
                            ) : (
                                <Text style={[styles.font, { fontSize: 11, alignSelf: 'center', borderBottom: 0.5, paddingHorizontal: 75, marginTop: 10 }]}></Text>
                            )}
                            <Text style={[styles.font, { fontSize: 9 }]}>NAME AND SIGNATURE OF CUSTOMER</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={[styles.font, { fontSize: 9 }]}>___________________________________________________________________________</Text>
                            <Text style={[styles.font, { fontSize: 9 }]}>NAME AND SIGNATURE OF AUTHORIZED PERSON (If applicable)</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={[styles.font, { fontSize: 9 }]}>__________________</Text>
                            <Text style={[styles.font, { fontSize: 9 }]}>DATE CLAIMED</Text>
                        </View>
                    </View>


                </Page>

                <Page style={[{ marginTop: 5 }]}>
                    <View style={[styles.headerContainer3, styles.row, { marginHorizontal: 14 }]} fixed>
                        <View style={[styles.headerCell, { justifyContent: 'center', paddingRight: 5 }]}>
                            <Image style={styles.image} src={image1} />
                        </View>

                        <View style={[styles.headerOffice, styles.headerCell, { paddingRight: 8, paddingLeft: 2 }]}>
                            <View style={{ lineHeight: 0.65 }}>
                                <Text style={[styles.normalFont, { fontSize: 8 }]} >Republic of the Philippines</Text>
                                <Text style={[styles.boldFont, { fontSize: 8 }]} >DEPARTMENT OF AGRICULTURE</Text>
                                <Text style={[styles.boldFont, { fontSize: 8 }]} >REGIONAL FIELD OFFICE 5</Text>
                                <Text style={[styles.boldFont, { fontSize: 8 }]} >INTEGRATED LABORATORIES DIVISION</Text>
                                <Text style={[styles.normalFont, { fontSize: 8 }]} >San Agustin, Pili, Camarines Sur</Text>
                            </View>
                        </View>

                        <View style={[styles.formTitle, styles.headerCell]} >
                            <Text style={[styles.titleBold, { fontSize: 12, paddingHorizontal: 25 }]}>ANALYSIS REQUEST FORM</Text>
                        </View>

                        <View style={[styles.headerCell, { flexDirection: 'column', }]}>
                            <Text style={[styles.boldFont, { fontSize: 10, borderBottom: 1, paddingLeft: 15 }]}>Document Code</Text>
                            <Text style={[styles.normalFont, { fontSize: 10, borderBottom: 1, padding: 5 }]}>ILD5-RSL-FR-001-0</Text>
                            <Text style={[styles.boldFont, { fontSize: 10, borderBottom: 1, paddingLeft: 25 }]}>Record ID</Text>
                            <Text style={[styles.normalFont, { fontSize: 8, paddingRight: 2, paddingLeft: 2 }]}>{request.requestId}</Text>
                        </View>

                        <View style={[styles.headerCell, { flexDirection: 'column', borderRightWidth: 0 }]}>
                            <Text style={[styles.boldFont, { fontSize: 10, borderBottom: 1, paddingLeft: 5 }]}>Effectivity Date</Text>
                            <Text style={[styles.normalFont, { fontSize: 10, borderBottom: 1, padding: 5 }]}>March 17, 2026</Text>
                            <Text style={[styles.boldFont, { fontSize: 10, borderBottom: 1, paddingLeft: 20 }]}>Page No.</Text>
                            <Text
                                style={styles.testPdfpage}
                                render={({ pageNumber, totalPages }) => pageNumber <= 2 ? ` ${pageNumber}   of   2` : ''}
                                fixed />
                        </View>
                    </View>
                    <View style={[styles.headerContainer3, {marginHorizontal: 14, backgroundColor: '#D9EAD3', borderTop: 0}]}>
                        <Text style={[styles.termsBold, {textAlign: 'center', fontSize: 10, padding: 3}]}>Terms & Conditions</Text>
                    </View>

                    {terms.map((term, index) => (
                        <View key={index} style={{ marginHorizontal: 14, marginTop: 5}}>
                            <Text style={[styles.row, { flexWrap: 'wrap'}]}>
                                <Text style={[styles.termsBold, {fontSize: 9} ]}>{`${term.title}`}</Text>
                                <Text style={[styles.termsNormal, {fontSize: 9} ]}>{`${term.content}`}</Text>
                            </Text>
                        </View>
                    ))}


                </Page>
            </Document>

        )
    }

    return (
        <>
            {request ? (
                <PDFDownloadLink document={generatePdf()} fileName={request.requestId} style={{ padding: 0 }}>
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
    );

}

export default TestPdf