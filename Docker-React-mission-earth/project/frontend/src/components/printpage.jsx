export const PrintPageComponent = async (ref) => {
    const printContent = ref.current;
    const printWindow = window.open("", "_blank");

    // Copy styles from the current document
    const styles = Array.from(
      document.querySelectorAll("link[rel=stylesheet], style")
    )
      .map((node) => node.outerHTML)
      .join("\n");

    printWindow.document.open();
    printWindow.document.write(`
        <html>
          <head>
            ${styles}
            <style>
            @media print {
                @page { 
                    size: A4;
                    margin: 0 !important;
                    padding: 30px !important;
                }
                body {
                    width: 210mm;   /* exact A4 width */
                    height: 297mm;  /* exact A4 height */
                    top :0;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: white !important;
                    // color: black !important;
                    // -webkit-print-color-adjust: exact;
                    // print-color-adjust: exact;
                    display: grid !important;
                }
                .print-area {
                    color: black !important;
                    display: flex;
                    flex-direction: column;
                    margin-top: 0;
                    padding: 0;
                    gap: 5px;
                }

                .page-break {
                    page-break-before: always;
                    break-before: page;
                    padding: 10px !important;
                }

                .pageborderA4{
                    background: white !important;
                }

                .MainFormHoc {
                    margin: 0;
                    width: 100%;
                    padding: 0;
                }

                .HocTableBorder {
                    /* border: 1px solid red; */
                }
                .HocTableBodyBorder {
                    /* border: 1px solid rgb(4, 0, 255); */
                }
                .HocMainDataTable {
                    /* border: 1px solid red; */
                    padding: 5px;
                }
                .HOCTableHeader {
                display: flex;
                align-items: center;
                justify-content: space-between;
                }
                .HOCTable {
                    border-collapse: collapse;
                    width: 100%;
                }
                .HOCradioList{
                    display: flex;
    
                }
                .HOCradioOption{
                    display: flex;
                }
                .HOCTable th, .HOCTable td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    line-height: 1.5;
                    text-align: left;
                    font-size: 16px;
                }
                
                .HOCTable thead {
                    background-color: #e6e6e6;
                    color: rgb(0, 0, 0);
                }
                
                .HOCTable tbody tr:nth-child(odd) {
                    background-color: #f2f2f2;
                    }
                    
                    .HOCTable tbody tr:nth-child(even) {
                    background-color: #ffffff;
                }
                
                .HOCTable tbody {
                    /* background-color: #1976d2; */
                    color: rgb(0, 0, 0);
                }
    
                .PrntBTN {
                    border: 1px solid rgb(192, 192, 192);
                    background-color: #ffffff;
                    padding: 5px 15px 5px 15px;
                    border-radius: 8px;
                    box-shadow: 3px 3px 8px 0px rgba(0, 44, 61, 0.3);
                    cursor: pointer;
                    transition: 0.2s;
                }
    
                .PrntBTN:hover{
                    border: 1px solid rgb(135, 207, 255);
                    background-color: #e3f9ff;
                }
                
                /* in print mode */
                /* .AddButtonRow {
                    display: none; 
                } */
    
                .AddMedBtn {
                    border: 1px solid rgb(192, 192, 192);
                    background-color: #f1fafd;
                    height: 30px;
                    padding: 5px;
                    border-radius: 8px;
                    box-shadow: 3px 3px 8px 0px rgba(0, 44, 61, 0.3);
                    cursor: pointer;
                    transition: 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
    
                .AddMedBtn:hover{
                    border: 1px solid rgb(135, 207, 255);
                    background-color: #e3f9ff;
                }
    
                .OptionSelectBox_HOC{
                    width: -webkit-fill-available;
                    font-family: 'Kanit';
                    height: 40px;
                    padding: 8px;
                    background: #fdfdfd;
                    color: #000000;
                    border: 1px solid #919191;
                    border-radius: 3px;
                }
                .OptionSelectBox_HOC:disabled{
                    background: none;
                    color: #e0e0e0;
                }
                .HocData {
                color: #6d6d6d;
                /* width: 80%; */
                }
                .TESTTEXT {
                color: red;
                }
    
                .HiddenDivPreview{
                display:none;
                }
                .HocInputBox {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 5px;
                /* width: 500px; */
                /* margin: 5px; */
                }
                .Inputhoc {
                width:90%;
                padding: 5px;
                height: 25px;
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 3px;
                color: #383838;
                }
                .ListInput{
                display: flex;
                align-items: center;
                gap: 2.5px;
                /* justify-content: center; */
                }
                .Inputhoc-list {
                width:80px;
                padding: 5px;
                height: 25px;
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 3px;
                color: #383838;
                }
                .selectedItemListName{
                color: #919191;
                }
                .SignBox{
                display:flex;
                flex-direction: column;
                gap: 5px;
                align-items: center;
                }
                .InfoBox{
                display:flex;
                flex-direction: row;
                gap: 5px;
                align-items: center;
                }
                .LeftDivSignBox{
                display: flex;
                gap: 5px;
                }
                .RightDivSignBox{
                display: flex;
                flex-direction: column;
                gap: 5px;
                }
                .SignTitle{
                height: 20px;
                }
                .SignSpace{
                border-bottom: 1px #000000 solid;
                min-width: 200px;
                height: 30px;
                }
                .SignerName{
                /* border-bottom: 1px #000000 solid; */
                display: flex;
                justify-content: center;
                min-width: 200px;
                height: 20px;
                }
                .signTable td {
                width: 50%;
                }
                
                .avoidbreak{
                    page-break-inside: avoid;
                }
            }
            .HiddenDiv{
            display:none;
            }
            </style>
          </head>
          <body>
            ${printContent.outerHTML}
          </body>
        </html>
      `);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };