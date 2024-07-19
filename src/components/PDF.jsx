import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

export default function PDF() {
  const pageRef = useRef(null);
  const documentRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isPdfUrl, setIsPdfUrl] = useState("");
  const [isLoadingSuccess, setIsLoadingSuccess] = useState(false);

  const [isNumPages, setIsNumPages] = useState(null);

  const handleUploadPDF = (file) => {
    const fileData = file.target.files;

    const addFiles = [...fileData].filter((item) => {
      const isAdd = handleAddFile(item);
      return !isAdd ? item : null;
    });
    setFiles((data) => [...addFiles, ...data]);
    file.target.value = "";
  };
  const handleAddFile = (file) => {
    const isRepeat = files.find((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified);
    return isRepeat;
  };
  // 載入PDF成功
  const onLoadSuccess = ({ numPages }) => {
    console.log(numPages);
    setIsNumPages(numPages);
    setTimeout(() => {
      setIsLoadingSuccess(true);
    }, 100);
  };

  useEffect(() => {
    if (files?.length >= 1) {
      const downloadBlob = new Blob([files[0]], {
        type: "application/pdf;charset=UTF-8",
      });
      console.log(downloadBlob);
      setIsPdfUrl(downloadBlob);
    }
  }, [files]);
  return (
    <div>
      <>
        <label htmlFor="uploadPDF" className="btn-second br-5 btn-pointer" style={{ padding: "6px 15px" }}>
          上傳檔案
        </label>
        <input
          type="file"
          name="uploadPDF"
          id="uploadPDF"
          accept=".pdf"
          multiple="multiple"
          style={{ zIndex: "-1", width: 0 }}
          onChange={handleUploadPDF}
        />
      </>
      <>
        {files?.map((file, index) => {
          return (
            <div className="width100 bg-white flex br-15 pt-20 pb-20 pl-20 pr-20 border-gray-1" key={index}>
              <div className="download-icon fz-22"></div>
              <div className="pl-20 pr-20 width100 flex justifyBetween alignCenter">
                <span className="fz-16 color-main">{file.name}</span>
              </div>
            </div>
          );
        })}
      </>
      <>
        <div className="width100 flex-center flex-column read-PDF">
          <Document
            file={isPdfUrl}
            loading={<div className="pdf-loading">載入中...</div>}
            onLoadSuccess={onLoadSuccess}
            inputRef={documentRef}
            // onScroll={!!setIsReadPDF ? debounceCallBack : null}
          >
            {Array.from(new Array(isNumPages), (_, index) => (
              <Page
                className="bg-1"
                loading={null}
                height={1440}
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={1.5}
                inputRef={pageRef}
              />
            ))}
          </Document>
        </div>
      </>
    </div>
  );
}
