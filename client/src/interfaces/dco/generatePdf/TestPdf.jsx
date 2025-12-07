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
        axios.get(`http://localhost:8002/api/client/getClient/${requestId}`)
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

    const generatePdf = () => {
        if (!request || !request.sampleDetails) return;
        return (
            <Document>
                <Page style={[styles.body, { marginTop: 5 }]} size="A4">
                    <View style={styles.headerContainer}>
                        <Image style={styles.image} src={image1} />
                        <View style={{ alignItems: 'center', marginTop: 1 }} >
                            <Text style={styles.normalFont} >Department of Agriculture</Text>
                            <Text style={styles.normalFont} >Regional Field Office 5</Text>
                            <Text style={styles.boldFont} >INTEGRATED LABORATORIES DIVISION</Text>
                            <Text style={styles.boldFont} >Regional Soils Laboratory</Text>
                        </View>
                    </View>
                    <View style={[styles.title, { marginRight: 14 }]} >
                        <Text style={styles.titleBold}>ANALYSIS REQUEST FORM</Text>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, styles.boldFont, { width: "70%" }]}>
                                <View style={[styles.row, { gap: 40 }]}>
                                    <Text>Document Type: </Text>
                                    <View style={[styles.row, styles.normalFont,]}>
                                        <Text style={styles.checkbox}></Text>
                                        <Text>Hardcopy</Text>
                                    </View>
                                    <View style={[styles.row, styles.normalFont,]}>
                                        <Text style={styles.checkbox}></Text>
                                        <Text>E-copy</Text>
                                    </View>
                                </View>
                                <Text>Request ID: <Text style={{fontWeight:'normal'}}>{request.requestId}</Text></Text>
                                <Text>Transaction Date: <Text style={{fontWeight:'normal'}}>{formatDate(request.transactionDate)}</Text></Text>
                                <View style={[styles.row, { gap: 40 }]}>
                                    <Text>Type of Customer: </Text>
                                    <View style={[styles.row, styles.normalFont,]}>
                                        <Text style={styles.checkbox}></Text>
                                        <Text>Walk In</Text>
                                    </View>
                                    <View style={[styles.row, styles.normalFont,]}>
                                        <Text style={styles.checkbox}></Text>
                                        <Text>Researcher</Text>
                                    </View>
                                    <View style={[styles.row, styles.normalFont,]}>
                                        <Text style={styles.checkbox}></Text>
                                        <Text>Farmer</Text>
                                    </View>
                                </View>
                                <View style={[styles.row, { gap: 20 }]}>
                                    <Text>Coordinates:</Text>
                                    <Text style={[{ fontWeight: "normal" }]}>Longitude: <Text style={{fontWeight:'normal'}}>{request.coordinates.map(s => s.longitude)}</Text></Text>
                                    <Text style={[{ fontWeight: "normal", marginLeft: 100 }]}>Latitude: <Text style={{fontWeight:'normal'}}>{request.coordinates.map(s => s.latitude)}</Text></Text>
                                </View>
                            </View>
                            <View style={[styles.cellTwo, styles.boldFont, { width: "30%" }]}>
                                <Text>Report ID:</Text>
                                <Text>Date/Time Released:</Text>
                                <Text>Released By:</Text>
                                <Text>Claimed By:</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, styles.boldFont, { width: "40%", borderRightWidth: 0 }]}>
                                <Text>Customer's Name: <Text style={{fontWeight:'normal'}}>{request.clientName}</Text></Text>
                                <Text>Address: <Text style={{fontWeight:'normal'}}>{request.clientAddress}</Text></Text>
                                <Text>Location of Farm: <Text style={{fontWeight:'normal'}}>{request.locOfFarm}</Text></Text>
                            </View>
                            <View style={[styles.cellTwo, styles.boldFont, { width: "30%" }]}>
                                <Text>Topography: <Text style={{fontWeight:'normal'}}>{request.topography}</Text></Text>
                                <Text>Crops Planted: <Text style={{fontWeight:'normal'}}>{request.cropsPlanted}</Text></Text>
                                <Text>Area: <Text style={{fontWeight:'normal'}}>{request.area}</Text></Text>
                            </View>
                            <View style={[styles.cellTwo, styles.boldFont, { width: "30%" }]}>
                                <Text>Sex: <Text style={{fontWeight:'normal'}}>{request.clientGender}</Text></Text>
                                <Text>Contact No.: {request.clientContact}</Text>
                                <Text>Email Address: <Text style={{fontWeight:'normal'}}>{request.clientEmail}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, styles.boldFont, { width: "100%" }]}>
                                <Text>A. LABORATORY SERVICES</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <Text style={[styles.header, { width: "18%", paddingHorizontal: 5, textAlign: "center" }]}>No. of Samples</Text>
                            <Text style={[styles.header, { width: "25%", paddingHorizontal: 10, textAlign: "center" }]}>Customer Code</Text>
                            <Text style={[styles.header, { width: "25%", paddingTop: 5 }]}>Lab Code</Text>
                            <Text style={[styles.header, { width: "35%", paddingTop: 5 }]}>Sample Description</Text>
                            <Text style={[styles.header, { width: "55%", paddingTop: 5 }]}>Test Requested-Test Method</Text>
                            <Text style={[styles.header, { width: "20%", paddingTop: 5 }]}>Unit Cost</Text>
                            <Text style={[styles.header, { width: "20%", paddingTop: 5 }]}>Total</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={[styles.cell, { width: "18%", paddingHorizontal: 5, textAlign: "center", paddingTop: 5  }]}>{request.sampleDetails.map(s => s.noOfSample).join(", ")}</Text>
                            <Text style={[styles.cell, { width: "25%", paddingHorizontal: 10, textAlign: "center", paddingTop: 5  }]}>{request.sampleDetails.map(s => s.customerCode).join(", ")}</Text>
                            <Text style={[styles.cell, { width: "25%", paddingTop: 5 }]}>{request.sampleDetails.map(s => s.labCode).join(", ")}</Text>
                            <Text style={[styles.cell, { width: "35%", paddingTop: 5 }]}>{request.sampleDetails.map(s => s.sampleDescription).join(", ")}</Text>
                            <Text style={[styles.cell, { width: "55%", paddingTop: 5 }]}>{request.sampleDetails.map(s => s.methodReq).join(", ")}</Text>
                            <Text style={[styles.cell, { width: "20%", paddingTop: 5 }]}>{request.sampleDetails.map(s => s.unitCost).join(", ")}</Text>
                            <Text style={[styles.cell, { width: "20%", paddingTop: 5 }]}>{request.sampleDetails.map(s => s.totalCost).join(", ")}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, { width: "103%", borderRightWidth: 1 }]}>
                                <Text>REPORT DUE DATE: {formatDate(request.reportDue)}</Text>
                                <Text>SAMPLE DISPOSED BY: {request.sampleDisposedBy}</Text>
                                <Text>DATE OF DISPOSAL: {formatDate(request.sampleDisposal)}</Text>
                            </View>
                            <View style={[styles.cellTwo, { width: "55%" }]}>
                                <Text>OR NO.: {request.orNo}</Text>
                                <Text>AMOUNT PAID: {request.amountPaid}</Text>
                                <Text>UNPAID BALANCE: {request.unPaidBalance}</Text>
                            </View>
                            <View style={[styles.cellTwo, { width: "40%" }]}>
                                <Text>Sub-Total: {request.subTotal}</Text>
                                <Text>DISCOUNT: {request.discount}</Text>
                                <Text>TOTAL Php:{request.totalPhp}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, styles.boldFont, { width: "100%" }]}>
                                <Text>B. SAMPLE REMARKS</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, { width: "103%" }]}>
                                <Text>SAMPLING DATE: {formatDate(request.samplingDate)}</Text>
                                <Text>SAMPLING TIME:{request.samplingTime}</Text>
                            </View>
                            <View style={[styles.cellTwo, { width: "95%" }]}>
                                <Text>SAMPLE CONDITION: {request.sampleCondition}</Text>
                                <Text>OTHER MATTERS: {request.otherMatters}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, styles.boldFont, { width: "100%" }]}>
                                <Text>C. DISCUSSED WITH CUSTOMER</Text>
                                <Text>CONFORME: I have agreed to the details including the Terms and Conditions stated in this Laboratory Request Form</Text>
                            </View>
                        </View>
                        <View style={[styles.row, { height: 25 }]}>
                            <View style={[styles.cellTwo, { width: "103%", fontSize: 9 }]}>
                                <Text>Submitted By:</Text>
                                <Text style={[{fontSize: 10, textAlign:'center', justifyContent:'flex-end', }]}>{request.clientName}</Text>
                            </View>
                            <View style={[styles.cellTwo, { width: "95%", textAlign:'center', justifyContent:'flex-end', }]}>
                                <Text>{request.receivedBy}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.cellTwo, { width: "103%", fontSize: 9, textAlign: 'center', paddingHorizontal: 65 }]}>
                                <Text>Customer's Name & Signature / Authorized Representative & Date:</Text>
                            </View>
                            <View style={[styles.cellTwo, { width: "95%", fontSize: 9, textAlign: 'center' }]}>
                                <Text>Sample/s Received by & Date</Text>
                            </View>
                        </View>
                    </View>




                    <View style={[styles.row]}>
                        <Text style={[styles.font, { paddingLeft: 14, marginTop: 16, fontSize: 10 }]}>ILD-RFCAL-001-1{'\n'}Effectivity Date: September 22, 2025</Text>
                        <Image style={[styles.ukasTwo, { marginLeft: 310, alignSelf: "center" }]} src={image2} />
                    </View>
                    <Text style={[styles.font, { marginLeft: 72 }]}>
                        -----------------------------------------------------------------------------------------------------------------------------------
                    </Text>
                    <View style={[styles.row]}>
                        <Text style={[styles.italicFont, { paddingLeft: 14, marginTop: 3, fontSize: 9 }]}>Please present this stub upon claiming test report</Text>
                    </View>
                    <View style={[styles.row, { justifyContent: "center", marginTop: 10 }]}>
                        <Text style={[styles.boldFont, { fontSize: 10, }]}> CUSTOMER'S ACKNOWLEDGEMENT RECEIPT</Text>
                    </View>
                    <View style={[styles.row, { paddingTop: 15 }]}>
                        <Text style={[styles.font, { paddingLeft: 14, fontSize: 9 }]}>Date of Transaction: _________________________</Text>
                        <View style={[styles.row, { flex: 1, justifyContent: "flex-end" }]}>
                            <Text style={[styles.font, { paddingRight: 14, fontSize: 9, justifyContent: "flex-end" }]}>Report(s) available on: __________________________</Text>
                        </View>
                    </View>
                    <View style={[styles.font, { fontSize: 9, paddingLeft: 14, paddingRight: 14, marginTop: 18 }]}>
                        <View style={[styles.row, { marginLeft: 72 }]}>
                            <Text>THIS IS TO ACKNOWLEDGE RECEIPT OF THE LABORATORY SERVICES AVAILED BY ___________________________________________ FROM</Text>
                        </View>
                        <View style={styles.row}>
                            <Text>DA ILD RSL V. THIS ALSO SERVES AS AUTHORIZATION FOR ____________________________________________________________, TO CLAIM TEST REPORT OF THE  </Text>
                        </View>
                        <View style={styles.row}>
                            <Text>REQUESTED ANALYSIS ENTERED WITH LAB REQUEST CODE ___________________________________________ INDICATED IN THE ANALYSIS REQUEST FORM</Text>
                        </View>
                    </View>
                    <View style={[styles.row]}>
                        <Text style={[styles.boldFont, { fontSize: 9, marginTop: 10, marginLeft: 28 }]}>CLAIMED BY:</Text>
                    </View>
                    <View style={[styles.row, { marginLeft: 28, gap: 40, marginTop: 18 }]}>
                        <View style={styles.column}>
                            <Text style={[styles.font, { fontSize: 9 }]}>______________________________________________</Text>
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


                    <View style={[styles.pageNumber, { right: 25 }]} fixed>
                        <Image style={[styles.ukas]} src={image2}/>
                    </View>
                    <Text
                        style={[styles.pageNumber, { left: 25 }]}
                        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                        fixed />


                    <Text style={[styles.termsBold, { marginLeft: 72, marginRight: 72, marginTop: 87 }]}>Terms & Conditions</Text>
                    {terms.map((term, index) => (
                        <View key={index} style={{ marginLeft: 72, marginRight: 72 }}>
                            <Text style={[styles.row, { flexWrap: 'wrap' }]}>
                                <Text style={styles.termsBold}>{`${term.title}`}</Text>
                                <Text style={styles.termsNormal}>{`${term.content}`}</Text>
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