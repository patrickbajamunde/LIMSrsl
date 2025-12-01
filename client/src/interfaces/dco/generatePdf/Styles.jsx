import {StyleSheet, Font} from '@react-pdf/renderer';

import Cambria from '../../../fonts/cambria.ttf';
import CambriaItalic from '../../../fonts/cambria-italic.ttf';
import CambriaBold from '../../../fonts/cambria-bold.ttf';


Font.register({
    family: 'Cambria',
    fonts:[
        {src: Cambria},
        {src: CambriaItalic, fontStyle: 'italic'},
        {src: CambriaBold, fontWeight: 'bold'}
    ],
});

const styles = StyleSheet.create({

    font:{
        fontFamily:'Cambria',
        fontSize:11
    },
    headerContainer: {
        flexDirection: 'row', // horizontal layout
        alignItems: 'center', // vertical alignment       
        paddingRight: 50,
        gap: 117,
    },

    boldFont:{
        fontFamily: 'Cambria',
        fontWeight: 'bold',
        fontSize: 10
    },
    italicFont:{
        fontFamily:'Cambria',
        fontStyle:'italic',
    },
    normalFont:{
        fontFamily: 'Cambria',
        fontSize: 10
    },
    titleBold:{
        fontFamily:'Cambria',
        fontWeight: 'bold',
        fontSize:11,
        backgroundColor: '#d8d8d8',
    },
    contentNormal:{
        fontFamily:'Cambria',
        fontSize:11,
        textAlign:'justify',
    },
    title: {
        textAlign: 'center',
        marginTop: 10,
        marginLeft: 14,
        
    },
    text: {
        margin:12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman',
        padding: 72,
    },
    image:{
        marginLeft:28,
        width: 64,
        height: 54,
    },
    header:{
        fontFamily:'Cambria',
        fontSize:11,
        width: '20%', // You can adjust widths here
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#F2F2F2',
        textAlign:'center',
        paddingBottom:0
    },
    cell:{
        fontFamily:'Cambria',
        fontSize:11,
        width: '20%', // You can adjust widths here
        height:154,
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth:1,
        textAlign:'center',
    },
    cellTwo:{
        fontFamily:'Cambria',
        fontSize:10,
        width: '20%', // You can adjust widths here
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth:1,
    },

    table:{
        display: 'table',
        marginTop: 15,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginLeft:14,
        marginRight:14,
    },

    row:{
        flexDirection:'row'
    },
    column: {
        flexDirection: 'column',
    },
    footer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,

    },
    checkbox: {
        width: 13,
        height: 10,
        borderWidth: 1.5,
        borderColor: '#000',
        marginRight: 5,
    },
    ukas:{
        width:85,
        height:45,
        backgroundColor: 'white',
    },
    ukasTwo:{
        width:85,
        height:45,
        backgroundColor: 'white',
    },

    pageNumber: {
        fontFamily:'Cambria',
        position: 'absolute',
        fontSize: 11,
        bottom: 30,
    },

    termsBold:{
        fontFamily:'Cambria',
        fontSize:'8',
        fontWeight:'bold',
        textAlign:'justify'
    },
    termsNormal:{
        fontFamily:'Cambria',
        fontSize:'8',
        textAlign:'justify'
    },

    roaTable:{
        display: 'table',
        width: '95%',
        marginLeft:15,
    },
    roaHeader:{
        fontFamily:'Cambria',
        fontSize:11,
        width: '20%', // You can adjust widths here
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#D9EAD3',
        textAlign:'center',
        paddingBottom:0
    },
    roaHeaderCont: {
        flexDirection: 'row', // horizontal layout
        alignItems: 'center', // vertical alignment       
        paddingRight: 160,
        gap: 25,
    },
    roaUkas:{
        height:53,
        width: 88,
        backgroundColor: 'white'
    },  
    roaTitle:{
        display:'table',
        backgroundColor: '#B6D7A8',
        marginLeft:15,
        width: '95%',
        borderBottomWidth: 1,
        borderBottomColor: '#000', // or any color you prefer
        borderStyle: 'solid',
    },
    roaCell:{
        fontFamily:'Cambria',
        fontSize:11,
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth:1,
        padding:2
    },
    roaImage:{
        marginLeft:20,
        height:90,
        width:93
    },

    specificCell:{
        borderLeftWidth: 1
    }

});

export default styles;