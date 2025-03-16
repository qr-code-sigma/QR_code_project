import React, { useState, useEffect } from "react";
import { PDFDownloadLink, Document, Page, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { justifyContent: "center", alignItems: "center", padding: 20 },
    image: { width: 250, height: 250 },
});

const MyDocument = ({ imgData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Image src={imgData} style={styles.image} />
        </Page>
    </Document>
);

const CanvasToPDF = ({ canvasRef }) => {
    const [imgData, setImgData] = useState(null);

    useEffect(() => {
        if (canvasRef?.current) {
            const data = canvasRef.current.toDataURL("image/png");
            setImgData(data);
        }
    }, [canvasRef, canvasRef?.current]);

    if (!imgData) {
        return null;
    }

    return (
        <PDFDownloadLink document={<MyDocument imgData={imgData} />} fileName="qrcode.pdf">
            {({ loading }) => (
                <button className="btn-download">
                    {loading ? "Generating PDF..." : "Download PDF"}
                </button>
            )}
        </PDFDownloadLink>
    );
};

export default CanvasToPDF;