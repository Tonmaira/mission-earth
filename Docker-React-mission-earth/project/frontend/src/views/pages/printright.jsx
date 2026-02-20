import React, { useEffect, useRef, useState } from "react";
import "../../style/printstyle.css";
import {
  CalculateAge,
  formatShortDate,
  formatShortDateTime,
  formatShortDateTimeMeridiem,
} from "../../components/Function";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { APIFuncionUniversal } from "../../api/FunctionAPI";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import PrintDisabledIcon from "@mui/icons-material/PrintDisabled";
import axios from "axios";

const PreviewFilePDF = async (file) => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  try {
    const response = await axios.get(
      `${apiUrl}/ftpserver/download/${file.Date}/${file.FileName}`,
      { responseType: "blob" } // important!
    );

    const filepreview = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(filepreview);

    // Open PDF in new tab
    window.open(fileURL);
  } catch (error) {
    console.error("Failed to fetch PDF:", error);
  }
};

function PrintRightPage({
  Mode,
  data,
  FetchData,
  ConvertData,
  ConvertInsurance,
  ConvertContract,
}) {
  // doctor, clinic, SingleIns, GroupIns, Contract
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [ErrorMsg, setErrorMsg] = useState("");

  const handleEditSubmitButton = async (file) => {
    const TempData = {
      ...file,
      PrintStatus: true,
      CreatedBy: userData.UserId,
    };

    await APIFuncionUniversal(
      "put",
      TempData,
      `rightverify/printstatus`,
      setErrorMsg
    );

    await PreviewFilePDF(file);
    await FetchData();
  };

  return (
    <div className="print-area">
      {/* <div className="page-break"></div> */}

      <div className="pageborderA4">
        <p className="rightprint_title">แจ้งตรวจสอบสิทธิการรักษาเบื้องต้น</p>
        <div className="rightinfo">
          <table className="PrintRightTable">
            <tbody>
              <tr>
                <td>ชื่อ-สกุล</td>
                <td>{data.FullName}</td>
                <td>HN</td>
                <td>{data.HN}</td>
                <td>VN</td>
                <td>{data.VN}</td>
              </tr>
              <tr>
                <td>วดป เกิด</td>
                <td>{formatShortDate(data?.FormData?.InfoData?.birthday)}</td>
                <td>อายุ</td>
                <td>{CalculateAge(data?.FormData?.InfoData?.birthday)}</td>
                <td>เพศ</td>
                <td>
                  {data?.FormData?.InfoData?.gender === "F" && "หญิง"}
                  {data?.FormData?.InfoData?.gender === "M" && "ชาย"}
                </td>
              </tr>
              <tr>
                <td>แพทย์เจ้าของไข้</td>
                <td>{ConvertData?.doctor?.LocalName}</td>
                <td>คลินิก</td>
                <td>{ConvertData?.clinic?.ClinicNameThai}</td>
              </tr>
              <tr>
                <td>ประเภทผู้ป่วย</td>
                <td>
                  {data?.FormData?.InfoData?.patientType === "new" &&
                    "ผู้ป่วยใหม่"}
                  {data?.FormData?.InfoData?.patientType === "old" &&
                    "ผู้ป่วยเก่า"}
                </td>
                <td>ประเภทการมา</td>
                <td>{data?.FormData?.InfoData?.visitcodename}</td>
              </tr>
            </tbody>
          </table>
          <hr className="solid"></hr>
          <table className="PrintRightTable">
            <tbody>
              <tr>
                <td>ประเภทการเคลม</td>
                <td>
                  {data?.FormData?.InsData?.claimtype === "1" &&
                    "ตรวจรักษาทั่วไป"}
                  {data?.FormData?.InsData?.claimtype === "2" && "อุบัติเหตุ"}
                </td>
                <td>{data?.FormData?.InsData?.claimDescription}</td>
                <td>
                  {/* {data?.FormData?.InsData?.claimdate &&
                    formatShortDateTime(data?.FormData?.InsData?.claimdate)}
                    &nbsp;|&nbsp; */}
                  {data?.FormData?.InsData?.claimdate &&
                    formatShortDateTimeMeridiem(data?.FormData?.InsData?.claimdate)}
                </td>
              </tr>
              <tr>
                <td>ประเภทประกัน</td>
              </tr>
              {data?.FormData?.InsData?.insurancesingle &&
                data?.FormData?.InsData?.insuranceCompanySingle?.map(
                  (id, index) => (
                    <tr key={`${index}_${id}`}>
                      <td>{index === 0 && "ประกันเดี่ยว"}</td>
                      <td>{ConvertInsurance(id, 1)}</td>
                    </tr>
                  )
                )}
              {data?.FormData?.InsData?.insurancegroup &&
                data?.FormData?.InsData?.insuranceCompanyGroup?.map(
                  (id, index) => (
                    <tr key={`${index}_${id}`}>
                      <td>{index === 0 && "ประกันกลุ่ม"}</td>
                      <td>{ConvertInsurance(id, 2)}</td>
                    </tr>
                  )
                )}
              {data?.FormData?.InsData?.contractparty && data?.FormData?.InsData?.contract &&
                data?.FormData?.InsData?.contract?.map((id, index) => (
                  <tr key={`${index}_${id}`}>
                    <td>
                      {index === 0 &&
                        `คู่สัญญา(${
                          data?.FormData?.InsData?.righttype === 1
                            ? "พนักงาน"
                            : "ครอบครัว"
                        })`}
                    </td>

                    <td>
                      {ConvertContract(id, data?.FormData?.InsData?.righttype)}
                    </td>
                  </tr>
                ))}
              <tr>
                <td>ใบส่งตัว</td>
                <td>
                  {data?.FormData?.InsData?.referral === "yes" ? "มี" : "ไม่มี"}
                </td>
                <td>บัตรพนักงาน</td>
                <td>
                  {data?.FormData?.InsData?.idcard === "yes" ? "มี" : "ไม่มี"}
                </td>
              </tr>
            </tbody>
          </table>
          <hr className="solid"></hr>
          <table className="PrintRightTable">
            <tbody>
              <tr>
                <td className="wd240">มาด้วยอาการ</td>
                <td colSpan={3}>{data?.FormData?.InsEtc?.remark}</td>
              </tr>
              {/* <tr>
                <td>วัน/เวลาที่เกิดเหตุ</td>
                <td>
                  {data?.FormData?.InsEtc?.incidentdate &&
                    formatShortDate(data?.FormData?.InsEtc?.incidentdate)}
                </td>
                <td></td>
                <td></td>
              </tr> */}
            </tbody>
          </table>
        </div>
        <p className="rightprint_title">Vital Sign</p>
        <table className="PrintRightTable-vital">
          <tbody>
            <tr>
              <td>BMI</td>
              <td>H (cm)</td>
              <td>W (Kg)</td>
              <td>T c</td>
              <td>P/(m/n)</td>
              <td>R/(m/n)</td>
              <td>BP mm.Hg.(s/d)</td>
              <td>02sat%</td>
              <td>P S</td>
            </tr>
            <tr>
              <td>{data?.FormData?.VitalSign?.bmi}</td>
              <td>{data?.FormData?.VitalSign?.HC}</td>
              <td>{data?.FormData?.VitalSign?.Ht}</td>
              <td>{data?.FormData?.VitalSign?.tc}</td>
              <td>{data?.FormData?.VitalSign?.p}</td>
              <td>{data?.FormData?.VitalSign?.r}</td>
              <td>
                {data?.FormData?.VitalSign?.bps}/
                {data?.FormData?.VitalSign?.bpd}
              </td>
              <td>{data?.FormData?.VitalSign?.o2sat}</td>
              <td>{data?.FormData?.VitalSign?.ps}</td>
            </tr>
          </tbody>
        </table>

        {/* <p className="rightprint_title">Vital Sign</p> */}
        <hr className="solid"></hr>
        <table className="PrintRightTable-vital">
          <tbody>
            <tr>
              <td>ใบรับรองแพทย์</td>
              <td>ไม่ใช้ใบรับรองแพทย์</td>
              <td>LAB</td>
              <td>EKG/EG G</td>
              <td>เวชภัณฑ์</td>
              <td>ใบส่งตัว</td>
              <td>ใบเคลมประกัน</td>
              <td>xray</td>
              <td>Injection</td>
            </tr>
            <tr>
              <td>
                {data?.FormData?.CheckLists?.medicalcertificate ? "✔" : "-"}
              </td>
              <td>
                {data?.FormData?.CheckLists?.NoMedicalCertificate ? "✔" : "-"}
              </td>
              <td>{data?.FormData?.CheckLists?.lab ? "✔" : "-"}</td>
              <td>{data?.FormData?.CheckLists?.ekgegg ? "✔" : "-"}</td>
              <td>{data?.FormData?.CheckLists?.medicalsupplies ? "✔" : "-"}</td>
              <td>{data?.FormData?.CheckLists?.refernote ? "✔" : "-"}</td>
              <td>{data?.FormData?.CheckLists?.insurancenote ? "✔" : "-"}</td>
              <td>{data?.FormData?.CheckLists?.xray ? "✔" : "-"}</td>
              <td>{data?.FormData?.CheckLists?.injection ? "✔" : "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="page-break"></div>

      <div className="pageborderA4">
        <p className="rightprint_title">ลำดับประกัน</p>
        <div className="RightOrderBorder">
          {/* <hr className="solid"></hr> */}
          <div className="PrintRightOrderMainBorder">
            {data?.RightList?.map((item) => (
              <div
                className="PrintRightOrderItemBorder"
                key={item?.id}
                style={{ marginBottom: "10px" }}
              >
                <div className="PrintRightOrderItemRow P_flexEnd">
                  <div>ประกันลำดับที่&nbsp;{item?.orderNo}</div>
                </div>
                <div className="PrintRightOrderItemRow">
                  <strong>ประเภทประกัน</strong>
                </div>
                <div className="PrintRightOrderItemRow">
                  {item?.InsTypeSingle && (
                    <div className="RigtRow">
                      <div className="RigtRow_title">ประกันเดี่ยว</div>
                      <div className="RigtRow_info">
                        {item?.InsComSingle?.map((id) => (
                          <div key={`singleins_index_${id}`}>
                            - {ConvertInsurance(id, 1)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="PrintRightOrderItemRow">
                  {item?.InsTypeGroup && (
                    <div className="RigtRow">
                      <div className="RigtRow_title">ประกันกลุ่ม</div>
                      <div className="RigtRow_info">
                        {item?.InsComGroup?.map((id) => (
                          <div key={`groupins_index_${id}`}>
                            - {ConvertInsurance(id, 2)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="PrintRightOrderItemRow">
                  {/* PA */}
                  <div className="PrintCheckBox">{item?.PA && "✔"}</div>
                  <div className="lableText">PA</div>&nbsp;:&nbsp;
                  <div className="lableText">{item?.PAPrice}</div>
                </div>

                <div className="PrintRightOrderItemRow">
                  {/* F/U PA */}
                  <div>F/U&nbsp;</div>
                  <div className="lableText">{item?.FUPAText}</div>
                  <div className="lableText">วัน</div>
                  {/* Allow Credit */}
                  <div className="PrintCheckBox">
                    {item?.allowCreditPA && "✔"}
                  </div>
                  <div className="lableText">บันทึกยอดก่อนปล่อยเครดิต</div>
                </div>

                <div className="PrintRightOrderItemRow">
                  {/* Right Not Available */}
                  <div className="PrintCheckBox">
                    {item?.RightNotAvaliable && "✔"}
                  </div>
                  <div className="lableText">ตรวจสอบสิทธิไม่พบ</div>
                </div>

                <hr className="solid" />
                {/* ER 24 / 72 */}
                <div className="PrintRightOrderItemRow">
                  <div className="lableText">ER</div>
                  <div className="PrintCheckBox">
                    {item?.ERhours === 1 && "✔"}
                  </div>
                  <div className="lableText">24 ชม.</div>
                  <div className="PrintCheckBox">
                    {item?.ERhours === 2 && "✔"}
                  </div>
                  <div className="lableText">72 ชม.</div>
                </div>

                <div className="PrintRightOrderItemRow">
                  {/* F/U ER */}
                  <div>F/U&nbsp;</div>
                  <div className="lableText">{item?.FUERText}</div>
                  <div className="lableText">วัน</div>
                  {/* Allow Credit */}
                  <div className="PrintCheckBox">
                    {item?.allowCreditER && "✔"}
                  </div>
                  <div className="lableText">บันทึกยอดก่อนปล่อยเครดิต</div>
                </div>

                <hr className="solid" />

                <div className="PrintRightOrderItemRow">
                  {/* OPD */}
                  <div className="PrintCheckBox">{item?.OPD === 1 && "✔"}</div>
                  <div className="lableText">OPD</div>&nbsp;:&nbsp;
                  <div className="lableText">{item?.OPDText}</div>
                </div>

                <div className="PrintRightOrderItemRow">
                  {/* ETC */}
                  <div className="PrintCheckBox">
                    {item?.selfpaid === 1 && "✔"}
                  </div>
                  <div className="lableText">ชำระเงินเอง</div>
                  <div className="PrintCheckBox">
                    {item?.rightafter === 1 && "✔"}
                  </div>
                  <div className="lableText">ตามประสานสิทธิหลังพบแพทย์</div>
                </div>

                <hr className="solid" />

                <div className="PrintRightOrderItemRow">
                  <div className="lableText">หมายเหตุ</div>
                  <div className="lableText">{item?.remark}</div>
                </div>

                <hr className="solid" />

                <div className="pdfListBox">
                  <div className="lableText">ไฟล์แนบ</div>
                  {item?.attachedFiles.map((file, index) => (
                    <div
                      className="PDTItemList MakeButton"
                      key={`pdfitem_${index}_${file.FileName}`}
                    >
                      <div
                        className="PDTItemListText"
                        onClick={() => handleEditSubmitButton(file)}
                      >
                        {file.FileName}
                      </div>
                      {file.PrintStatus ? (
                        <LocalPrintshopIcon color="primary" />
                      ) : (
                        <PrintDisabledIcon htmlColor="#b5b5b0" />
                      )}
                    </div>
                  ))}
                </div>
                {/* } */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrintRight({ Mode }) {
  // fetchdata
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { rightid } = useParams();
  const [loading, setLoading] = useState(true);
  const [ErrorMsg, setErrorMsg] = useState("");
  const [formdata, setFormData] = useState({});
  const [doctorData, setDoctorData] = useState([]);
  const [clinicData, setClinicData] = useState([]);
  const [insuranceCompany, setInsuranceCompany] = useState([]);
  const [contractParty, setcontractParty] = useState([]);
  const navigate = useNavigate();
  const fetchData = async () => {
    const [doctor, clinic, patinfo, inscompany, conparty] = await Promise.all([
      APIFuncionUniversal("get", null, "doctor", setErrorMsg),
      APIFuncionUniversal("get", null, "clinic", setErrorMsg),
      APIFuncionUniversal("get", null, `rightverify/${rightid}`, setErrorMsg),
      APIFuncionUniversal("get", null, "inscompany", setErrorMsg),
      APIFuncionUniversal("get", null, "conparty", setErrorMsg),
    ]);

    setFormData(patinfo);
    setDoctorData(doctor);
    setClinicData(clinic);
    setInsuranceCompany(inscompany);
    setcontractParty(conparty);

    setLoading(false);
  };

  useEffect(() => {
    if (loading) {
      fetchData();
    }
  }, [loading]);

  // printfunction
  const componentRef = useRef(null);
  const handlePrint = () => {
    const printContent = componentRef.current;
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
              @page { 
                size: A4;
                margin: 0;
              }
              body {
                // width: 210mm;   /* exact A4 width */
                // height: 297mm;  /* exact A4 height */
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                color: black !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                display: grid !important;
              }
              .print-area {
                color: black !important;
                display: flex;
                flex-direction: column;
                margin-top: 0;
                padding: 0 auto;
                margin: 0 auto;
                // gap: 5px;
                justify-content: center;
                align-items: center;
              }

              .page-break {
                page-break-before: always;
                break-before: page;
              }

              .pageborderA4{
                background: white !important;
              }

              .rightprint_title{
                padding-top: 18px;
                padding-bottom: 12px;
                padding-left: 18px;
                width: 100%;
                display: flex;
              }

              .rightinfo{
                border-top: 1px solid #ccc;
                border-bottom: 1px solid #ccc;
                padding: 8px;
                display: flex;
                flex-direction: column;
              }

              .PrintRightTable {
                border-collapse: collapse;
                width: 100%;
              }

              .PrintRightTable th, .PrintRightTable td {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;
              }

              .PrintRightTable thead {
                background-color: #1976d2;
                color: white;
              }

              .PrintRightTable tbody td:nth-child(odd) {
                background-color: #f2f2f2;
              }

              .PrintRightTable tbody {
                color: rgb(0, 0, 0);
              }

              .PrintRightTable-vital {
                border-collapse: collapse;
                width: 100%;
              }

              .PrintRightTable-vital th, .PrintRightTable-vital td {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: center;
              }

              .PrintRightTable-vital thead {
                background-color: #1976d2;
                color: white;
              }

              .PrintRightTable-vital tbody tr:nth-child(odd) {
                background-color: #f2f2f2;
              }

              .PrintRightTable-vital tbody {
                color: rgb(0, 0, 0);
              }

              .RightOrderBorder{
                border-top: 1px solid #ccc;
                border-bottom: 1px solid #ccc;
                padding: 8px;
                display: flex;
                flex-direction: column;
              }
              .RigtRow{
                display:flex;
              }
              .RigtRow_title{
                width: 130px;
              }
              .RigtRow_info{
                display:flex;
                flex-direction: column;
                align-items: flex-start;
              }
              .PrintRightOrderItemRow{
                padding: 5px;
                display: flex;
                flex-direction: row;
                align-items: center;
                font-size: 16px;
                gap: 5px;
              }
              .PrintRightOrderItemRow_title{
                width:135px;
              }
              .P_flexEnd{
                justify-content: flex-end;
              }
              .PrintRightOrderItemBorder {
                width: 480px;
                border: 1px solid rgb(165, 165, 165);
                border-radius: 4px;
                background: #ffffff;
                display: flex;
                flex-direction: column;
              }
              .PrintRightOrderMainBorder{
                border-radius: 7px;
                padding: 5px;
                display: grid;
                grid-template-columns: repeat(2, 1fr); /* 2 columns */
                gap: 10px;
              }
              .PrintCheckBox{
                border: 1px solid rgb(97, 97, 97);
                height: 20px;
                width: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
              }

              .pdfListBox{
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
  const tempdoctor =
    doctorData.find((d) => d.Doctor === formdata?.FormData?.InfoData?.doctor) ||
    null;
  const tempclinic =
    clinicData.find(
      (c) => c.ClinicCode === formdata?.FormData?.InfoData?.clinic
    ) || null;

  function ConvertInsurance(Idd, type) {
    return (
      insuranceCompany.find((si) => si.Id === Idd && si.type === type)?.Name ||
      null
    );
  }

  function ConvertContract(Idd, type) {
    return (
      contractParty.find((si) => si.Id === Idd && si.type === type)?.Name ||
      null
    );
  }

  const handleSubmitReConsiderButton = async (rvid, status) => {
    const payload = {
      RightVerifyId: rvid,
      Status: status,
      CreatedBy: userData.UserId,
    };

    const response = await APIFuncionUniversal(
      "put",
      payload,
      `rightverify/status/${rvid}`,
      setErrorMsg
    );

    if (response) {
      navigate(`/dashboard`);
    } else {
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div>
      <button className="sticky-button" onClick={handlePrint}>
        <LocalPrintshopIcon fontSize="large" />
      </button>
      {!loading && (
        <div ref={componentRef}>
          <PrintRightPage
            Mode={Mode}
            data={formdata}
            FetchData={fetchData}
            ConvertData={{
              clinic: tempclinic,
              doctor: tempdoctor,
            }}
            ConvertInsurance={ConvertInsurance}
            ConvertContract={ConvertContract}
          />
          {userData.UserType !== 3 && userData.UserType !== 4 && (
            <button
              className="ButtonSubmit"
              onClick={() => handleSubmitReConsiderButton(rightid, 6)}
            >
              ส่งการเงิน
            </button>
          )}
          {userData.UserType === 3 && (
            <button
              className="ButtonSubmit pdfListBox"
              onClick={() => handleSubmitReConsiderButton(rightid, 7)}
            >
              ปิดเคส
            </button>
          )}
        </div>
      )}
    </div>
  );
}