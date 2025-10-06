import axios from 'axios';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import styles from './Styles';
import image1 from '../../analysts/components/images/DA5.jpg';
import image2 from '../../dco/components/images/unnamed.png'
import terms from './data/Terms';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

const TestPdf = () => {
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
                            <Text>Document type:</Text>
                            <Text>Request ID:</Text>
                            <Text>Transaction Date:</Text>
                            <Text>Type of Customer</Text>
                            <Text>Coordinates</Text>
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
                            <Text>Customer's Name:</Text>
                            <Text>Address:</Text>
                            <Text>Transaction Date:</Text>
                        </View>
                        <View style={[styles.cellTwo, styles.boldFont, { width: "30%" }]}>
                            <Text>Topography:</Text>
                            <Text>Crops Planted:</Text>
                            <Text>Area:</Text>
                        </View>
                        <View style={[styles.cellTwo, styles.boldFont, { width: "30%" }]}>
                            <Text>Sex:</Text>
                            <Text>Contact No.:</Text>
                            <Text>Email Address:</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.cellTwo, styles.boldFont, { width: "100%"}]}>
                            <Text>A. LABORATORY SERVICES</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.header, { width: "18%", paddingHorizontal:5, textAlign: "center" }]}>No. of Samples</Text>
                        <Text style={[styles.header, { width: "25%", paddingHorizontal: 10, textAlign: "center"}]}>Customer Code</Text>
                        <Text style={[styles.header, { width: "25%", paddingTop: 5 }]}>Lab Code</Text>
                        <Text style={[styles.header, { width: "35%", paddingTop: 5 }]}>Sample Description</Text>
                        <Text style={[styles.header, { width: "55%", paddingTop: 5 }]}>Test Requested-Test Method</Text>
                        <Text style={[styles.header, { width: "20%", paddingTop: 5 }]}>Unit Cost</Text>
                        <Text style={[styles.header, { width: "20%", paddingTop: 5 }]}>Total</Text>
                    </View>
                    <View style={styles.row}>
                       <Text style={[styles.cell, { width: "18%", paddingHorizontal:5, textAlign: "center" }]}></Text>
                        <Text style={[styles.cell, { width: "25%", paddingHorizontal: 10, textAlign: "center"}]}></Text>
                        <Text style={[styles.cell, { width: "25%", paddingTop: 5 }]}></Text>
                        <Text style={[styles.cell, { width: "35%", paddingTop: 5 }]}></Text>
                        <Text style={[styles.cell, { width: "55%", paddingTop: 5 }]}></Text>
                        <Text style={[styles.cell, { width: "20%", paddingTop: 5 }]}></Text>
                        <Text style={[styles.cell, { width: "20%", paddingTop: 5 }]}></Text>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.cellTwo, {width: "103%", borderRightWidth:1}]}>
                            <Text>REPORT DUE DATE:</Text>
                            <Text>SAMPLE DISPOSED BY:</Text>
                            <Text>DATE OF DISPOSAL:</Text>
                        </View>
                        <View style={[styles.cellTwo, {width: "55%"}]}>
                            <Text>OR NO.:</Text>
                            <Text>AMOUNT PAID:</Text>
                            <Text>UNPAID BALANCE:</Text>
                        </View>
                        <View style={[styles.cellTwo, {width: "40%"}]}>
                            <Text>Sub-Total:</Text>
                            <Text>DISCOUNT:</Text>
                            <Text>TOTAL Php:</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.cellTwo, styles.boldFont, { width: "100%"}]}>
                            <Text>B. SAMPLE REMARKS</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.cellTwo, {width:"103%"}]}>
                            <Text>SAMPLING DATE:</Text>
                            <Text>SAMPLING TIME:</Text>
                        </View>
                        <View style={[styles.cellTwo, {width:"95%"}]}>
                            <Text>SAMPLE CONDITION</Text>
                            <Text>OTHER MATTERS</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.cellTwo, styles.boldFont, { width: "100%"}]}>
                            <Text>C. DISCUSSED WITH CUSTOMER</Text>
                            <Text>CONFORME: I have agreed to the details including the Terms and Conditions stated in this Laboratory Request Form</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.cellTwo, {width:"103%", fontSize:9}]}>
                            <Text>Submitted By:</Text>
                        </View>
                        <View style={[styles.cellTwo, {width:"95%"}]}>
                            <Text></Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.cellTwo, {width:"103%", fontSize:9, textAlign:'center', paddingHorizontal:65}]}>
                            <Text>Customer's Name & Signature / Authorized Representative & Date:</Text>
                        </View>
                        <View style={[styles.cellTwo, {width:"95%", fontSize:9, textAlign:'center'}]}>
                            <Text>Sample/s Received by & Date</Text>
                        </View>
                    </View>
                </View>
                

                

                <View style={[styles.row]}>
                    <Text style={[styles.font, { paddingLeft: 14, marginTop: 16, fontSize:10 }]}>ILD-RFCAL-001-1{'\n'}Effectivity Date: September 22, 2025</Text>
                    <Image style={[styles.ukasTwo, { marginLeft:310 ,alignSelf:"center"}]} src={image2} />
                </View>
                <Text style={[styles.font, { marginLeft: 72 }]}>
                    -----------------------------------------------------------------------------------------------------------------------------------
                </Text>
                <View style={[styles.row]}>
                    <Text style={[styles.italicFont, { paddingLeft: 14, marginTop: 3, fontSize:9 }]}>Please present this stub upon claiming test report</Text>
                </View>
                <View style={[styles.row, {justifyContent:"center", marginTop:10}]}>
                    <Text style={[styles.boldFont, {fontSize: 10,}]}> CUSTOMER'S ACKNOWLEDGEMENT RECEIPT</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.font, {paddingLeft:14, fontSize: 9}]}>Date of Transaction</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.font, { marginLeft: 72 }]}>Report due date:________________________</Text>
                    <Text style={[styles.boldFont, { marginLeft: 25 }]}>AUTHORIZATION/CLAIM STUB {'\n'} (DA-RFCAL 5)</Text>
                </View>
                <Text style={[styles.font, { marginLeft: 110, marginRight: 72, textAlign: 'justify' }]}>I hereby authorize _______________________________________________________, to claim the Report of</Text>
                <Text style={[styles.font, { marginLeft: 72 }]}>Analysis in my behalf.</Text>
                <View style={{ textAlign: 'right', marginRight: 72, marginTop: -2 }}>
                    <Text style={styles.font}>_______________________________________</Text>
                    <Text style={[styles.font, { marginRight: 13 }]}>Signature of the Customer</Text>
                </View>
                <View style={styles.footer}>
                    <View style={[styles.font, { flex: 1, marginLeft: 72, marginTop: 40, justifyContent: 'flex-end' }]}>
                        <Text>ILD-RFCAL-001-1</Text>
                        <Text>Effectivity Date: April 14,2025</Text>
                    </View>

                    <Image style={[styles.ukas, { alignSelf: 'flex-end', marginRight: 30 }]} src={image2} />
                </View>
                <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                    fixed />
                <Text style={[styles.termsBold, { marginLeft: 72, marginRight: 72, marginTop: 72 }]}>Terms & Conditions</Text>
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
    );
};

export default TestPdf; 