import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";

const Show = () => {
  const navigate = useNavigate();
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});

  const fetchData = () => {
    Http.get("/mushok63/" + id).then((res) => {
      console.log(res.data);
      setReceiveData(res.data);
      setInputs({
        vehicle_number: res.data.vehicle_number,
        bin: res.data.bin ? res.data.bin : res.data.nid_number,
      });
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const supplementaryDuty = (sdv_inv, sd_inv, invQty) => {
    let tsd_inv = (parseInt(sdv_inv) * parseInt(sd_inv)) / 100;
    let total_sd_inv = parseInt(tsd_inv) * parseInt(invQty);
    return total_sd_inv ? total_sd_inv : 0;
  };

  const valueAddedTax = (sdv_inv, sd_inv, invQty, vat_inv) => {
    let tsd_inv = (parseInt(sdv_inv) * parseInt(sd_inv)) / 100;
    let total_sd_inv = parseInt(tsd_inv) * parseInt(invQty);

    let total_vat_inv =
      ((parseInt(sdv_inv) + parseInt(total_sd_inv)) * parseInt(vat_inv)) / 100;
    return total_vat_inv ? total_vat_inv : 0;
  };

  const dutiesAndTaxes = (sdv_inv, sd_inv, invQty, vat_inv) => {
    let tsd_inv = (parseInt(sdv_inv) * parseInt(sd_inv)) / 100;
    let total_sd_inv = parseInt(tsd_inv) * parseInt(invQty);

    let total_vat_inv =
      ((parseInt(sdv_inv) + parseInt(total_sd_inv)) * parseInt(vat_inv)) / 100;

    let total_price =
      parseInt(sdv_inv) + parseInt(total_sd_inv) + parseInt(total_vat_inv);

    return total_price ? total_price : 0;
  };

  const dataList = receiveData.list || [];

  // Calculate the totals
  const totalValue = dataList.reduce(
    (acc, item) => acc + parseFloat(item.price || 0),
    0
  );
  const totalSupplementaryDuty = dataList.reduce(
    (acc, item) =>
      acc + supplementaryDuty(item.sdv_inv, item.sd_inv, item.invQty),
    0
  );
  const totalValueAddedTax = dataList.reduce(
    (acc, item) =>
      acc + valueAddedTax(item.sdv_inv, item.sd_inv, item.invQty, item.vat_inv),
    0
  );
  const totalDutiesAndTaxes = dataList.reduce(
    (acc, item) =>
      acc +
      dutiesAndTaxes(item.sdv_inv, item.sd_inv, item.invQty, item.vat_inv),
    0
  );

  useEffect(() => {
    fetchData();
  }, []);

  const print = () => {
    window.print();
  };

  const formSubmit = () => {
    Http.put("/vehicle_number_save/" + id, inputs)
      .then((res) => {
        navigate("/mushok-6-3/" + id, {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <style>{`
            @media print {
              body * {
                  visibility: hidden;
              }
              .no-print{visibility: hidden !important;}
              #printable-content, #printable-content * {
                  visibility: visible;
              }
              #printable-content {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
              }
              .am-pagebody { padding: 0px; }
              .am-mainpanel { margin-top: 0px; }
              .signature_section .table td{ border-bottom: 0;}
            }
            .table{
              background-color: #FFFFFF;
            }
            .mushok_right {
              display: flex;
              flex-direction: column;
              text-align: center;
          }
          .copy_Style {
            text-align: center;
            border: 1px solid #ccc;
            padding: 3px;
            border-bottom: none;
        }
        .mushok6 {
          text-align: center;
          border: 1px solid #ccc;
          padding: 3px;
      }
      .table>thead:first-child>tr:first-child>td {
        border-top: 1px solid #bbb;
    }
    .table_style thead tr td {
      border: 1px solid #bbb;
  }
  .table_style > :not(:last-child) > :last-child > * {
    border-bottom-color: #bbb;
  }
  .mushoktfoot, .mushoktfoot tr {
    border: 1px solid #bbb;
}
.mushoktbody tr td{
  border: 1px solid #bbb;
}
          `}</style>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Payment Receive</h5>
          </div>

          <div className="am-pagebody">
            <div className="card">
              <div className="card-header no-print">
                <div className="row">
                  <div className="col-md-7"></div>
                  <div className="col-md-5 text-right">
                    <button className="btn btn-default" onClick={print}>
                      {" "}
                      <i className="fa fa-print"></i>
                      &nbsp;Print
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body" id="printable-content">
                <div className="row">
                  <div className="col-md-12">
                    <table className="table" width="100%">
                      <tbody>
                        <tr>
                          <td
                            style={{ borderTop: "0px !important" }}
                            width="15%"
                          ></td>
                          <td
                            style={{
                              borderTop: "0px !important",
                              textAlign: "center",
                              fontSize: "12px",
                            }}
                            width="70%"
                          >
                            <span>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</span>
                            <br />
                            <span>
                              <b>জাতীয় রাজস্ব বোর্ড, ঢাকা</b>
                            </span>
                            <br />
                            <span
                              style={{ fontSize: "12px", fontWeight: "bold" }}
                            >
                              কর চালানপত্র
                            </span>
                            <br />
                            <span>
                              [ বিধি ৪০ এর উপ-বিধি (১) এর দফা (গ) ও দফা (চ)
                              দ্রষ্টব্য ]
                            </span>
                            <br />
                            <br />
                            <span>
                              নিবন্ধিত ব্যাক্তির নামঃ Limerick Distribution
                              Limited.
                            </span>
                            <br />
                            <span>
                              নিবন্ধিত ব্যাক্তির বিআইএনঃ 004155245-0402
                            </span>
                            <br />
                            <span>
                              চালানপত্র ইস্যুর ঠিকানাঃ <br />
                              Bhawal, Monohoria,Atibazar,keranigonj,Dhaka
                              <br />
                              Dhaka-1312; Bangladesh
                            </span>
                            <br />
                          </td>
                          <td
                            style={{ borderTop: "0px !important" }}
                            width="20%"
                          >
                            <div className="mushok_right">
                              <div className="copy_Style">
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "48%",
                                    textAlign: "center",
                                    borderRight: "1px solid #ccc",
                                  }}
                                >
                                  কপি ১
                                </span>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "48%",
                                  }}
                                >
                                  কপি ২
                                </span>
                              </div>
                              <div className="mushok6">
                                <span>মূসক-৬.৩</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="row" style={{ marginBottom: "10px" }}>
                  <div className="col-md-12">
                    <table
                      className="table"
                      width="100%"
                      style={{ fontSize: "12px" }}
                    >
                      <tbody>
                        <tr>
                          <td width="50%">
                            <table className="topHead" width="100%">
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                    width="38%"
                                  >
                                    ক্রেতার নাম
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                    width="2%"
                                  >
                                    :
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                    width="60%"
                                  >
                                    {receiveData.distributor
                                      ? receiveData.distributor.name
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                  >
                                    ক্রেতার বিআইএন
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                  >
                                    :
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      name="bin"
                                      style={{ width: "100%", border: "none" }}
                                      value={inputs.bin || ""}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                  >
                                    ক্রেতার ঠিকানা
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                  >
                                    :
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                  >
                                    {receiveData.distributor
                                      ? receiveData.distributor.present_address
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                  >
                                    সরবরাহের গন্তব্যস্থল
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                  >
                                    :
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                  >
                                    {receiveData.distributor
                                      ? receiveData.distributor.godown_address
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      fontSize: "10px",
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                  >
                                    যানবাহনের প্রকৃতি এবং নম্বর
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                  >
                                    :
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                  >
                                    <div className="row">
                                      <div className="col-md-8">
                                        <input
                                          type="text"
                                          name="vehicle_number"
                                          value={inputs.vehicle_number || ""}
                                          style={{
                                            width: "100%",
                                            border: "none",
                                          }}
                                          onChange={handleChange}
                                        />
                                      </div>
                                      <div className="col-md-4 no-print">
                                        <button
                                          className="no-print"
                                          onClick={formSubmit}
                                        >
                                          <i className="fa fa-file"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td width="50%">
                            <table width="100%">
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                    width="40%"
                                  >
                                    চালানপত্র নম্বর
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                    width="2%"
                                  >
                                    :
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                    width="58%"
                                  >
                                    <input
                                      type="text"
                                      name="firstname"
                                      value={receiveData.receipt_no || ""}
                                      style={{ width: "100%", border: "none" }}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                    width="40%"
                                  >
                                    ইস্যুর তারিখ
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                    width="2%"
                                  >
                                    :
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                    width="58%"
                                  >
                                    <input
                                      type="text"
                                      name="firstname"
                                      value={receiveData.date || ""}
                                      style={{ width: "100%", border: "none" }}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                    width="40%"
                                  >
                                    ইস্যুর সময়
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                    width="2%"
                                  >
                                    :
                                  </td>
                                  <td
                                    style={{
                                      borderTop: "0px !important",
                                      padding: "0px",
                                    }}
                                    width="58%"
                                  >
                                    <input
                                      type="text"
                                      name="firstname"
                                      value={receiveData.time || ""}
                                      style={{ width: "100%", border: "none" }}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <table
                      className="table table-sm table_style"
                      width="100%"
                      style={{ fontSize: "12px" }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#f1f1f1" }}>
                          <td style={{ textAlign: "center" }}>ক্রমিক</td>
                          <td style={{ textAlign: "center" }} width="30%">
                            পণ্য বা সেবার বর্ণনা <br />
                            (প্রযোজ্য ক্ষেত্রে ব্র্যান্ড নামসহ)
                          </td>
                          <td style={{ textAlign: "center" }}>
                            সরবরাহের <br />
                            একক
                          </td>
                          <td style={{ textAlign: "center" }}>পরিমাণ</td>
                          <td style={{ textAlign: "center" }}>
                            একক মূল্য
                            <br />
                            (টাকায়)
                          </td>
                          <td style={{ textAlign: "center" }}>
                            মোট মূল্য
                            <br />
                            (টাকায়)
                          </td>
                          <td style={{ textAlign: "center" }}>
                            সম্পুরক
                            <br />
                            শুল্কের
                            <br />
                            হার
                          </td>
                          <td style={{ textAlign: "center" }}>
                            সম্পুরক
                            <br />
                            শুল্কের
                            <br />
                            পরিমান
                            <br />
                            (টাকায়)
                          </td>
                          <td style={{ textAlign: "center" }}>
                            মূল্য সংযোজন করের হার / <br />
                            সুনির্দিষ্ট কর
                          </td>
                          <td style={{ textAlign: "center" }}>
                            মূল্য সংযোজন কর/সুনির্দিষ্ট কর এর পরিমান (টাকায়)
                          </td>
                          <td style={{ textAlign: "center" }}>
                            সকল প্রকার শুল্ক ও কর সহ মূল্য
                          </td>
                        </tr>
                        <tr style={{ fontSize: "12px", textAlign: "center" }}>
                          <td>১</td>
                          <td>২</td>
                          <td>৩</td>
                          <td>৪</td>
                          <td>৫</td>
                          <td>৬</td>
                          <td>৭</td>
                          <td>৮</td>
                          <td>৯</td>
                          <td>১০</td>
                          <td>১১</td>
                        </tr>
                      </thead>
                      <tbody className="mushoktbody">
                        {receiveData.list
                          ? receiveData.list.map((item, index) => (
                              <tr style={{ fontSize: "12px" }}>
                                {/* <!-- 1 ক্রমিক --> */}
                                <td align="center">{index + 1}</td>

                                {/* <!-- 2 পণ্য বা সেবার বর্ণনা (প্রযোজ্য ক্ষেত্রে ব্র্যান্ড নামসহ) --> */}
                                <td>{item.product ? item.product.name : ""}</td>

                                {/* <!-- 3 সরবরাহের একক --> */}
                                <td>
                                  {item.product.unit_supply_id
                                    ? item.product.unit_supply_id.name
                                    : ""}
                                </td>

                                {/* <!-- 4 পরিমাণ --> */}
                                <td style={{ textAlign: "right" }}>
                                  {item.qty}
                                </td>

                                {/* <!-- 5 একক মূল্য(টাকায়)--> */}
                                <td style={{ textAlign: "right" }}>
                                  {item.rate}
                                </td>

                                {/* <!-- 6 মোট মূল্য (টাকায়) --> */}
                                <td align="right">{item.price}</td>

                                {/* <!-- 7 সম্পুরক শুল্কের হার --> */}
                                <td style={{ textAlign: "right" }}>
                                  {item.sd_inv}
                                </td>

                                {/* <!-- 8 সম্পুরক শুল্কের পরিমান (টাকায়) --> */}
                                <td align="right">
                                  {supplementaryDuty(
                                    item.sdv_inv,
                                    item.sd_inv,
                                    item.invQty
                                  )}
                                </td>

                                {/* <!-- 9 মূল্য সংযোজন করের হার/সুনির্দিষ্ট কর --> */}
                                <td style={{ textAlign: "right" }}>
                                  {item.vat_inv}
                                </td>

                                {/* <!-- 10 মূল্য সংযোজন কর /সুনির্দিষ্ট কর এর পরিমান (টাকায়) --> */}
                                <td align="right" width="12%">
                                  {valueAddedTax(
                                    item.sdv_inv,
                                    item.sd_inv,
                                    item.invQty,
                                    item.vat_inv
                                  )}
                                </td>

                                {/* <!-- 11 সকল প্রকার শুল্ক ও কর সহ মূল্য --> */}
                                <td style={{ textAlign: "right" }}>
                                  {dutiesAndTaxes(
                                    item.sdv_inv,
                                    item.sd_inv,
                                    item.invQty,
                                    item.vat_inv
                                  )}
                                </td>
                              </tr>
                            ))
                          : ""}
                      </tbody>
                      <tfoot className="mushoktfoot">
                        <tr style={{ fontSize: "12px" }}>
                          <td></td>
                          <td align="right">সর্বমোট</td>
                          <td align="right"></td>
                          <td align="right"></td>
                          <td align="right"></td>
                          <td align="right">{totalValue.toFixed(2)}</td>
                          <td></td>
                          <td align="right">
                            {totalSupplementaryDuty.toFixed(2)}
                          </td>
                          <td align="right"></td>
                          <td align="right">{totalValueAddedTax.toFixed(2)}</td>
                          <td align="right">
                            {totalDutiesAndTaxes.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <table
                      style={{
                        textAlign: "justify",
                        marginTop: "20px",
                        marginBottom: "20px",
                        width: "100%",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td>
                            প্রতিষ্ঠান কর্তৃপক্ষের দায়িত্বপ্রাপ্ত ব্যাক্তির
                            নামঃ
                          </td>
                        </tr>
                        <tr>
                          <td>পদবীঃ</td>
                        </tr>
                        <tr>
                          <td style={{ width: "70%" }}>স্বাক্ষরঃ</td>
                          <td style={{ width: "30%" }}>সীলঃ</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="invoice_footer" style={{ marginTop: "40px" }}>
                  * উৎসে কর্তন যোগ্য সরবরাহের ক্ষেত্রে ফরমটি সমন্বিত কর
                  চালানপত্র ও উৎসে কর কর্তন সনদপত্র হিসেবে বিবেচিত হইবে এবং উহা
                  উৎসে কর কর্তন যোগ্য সরবরাহের ক্ষেত্রে প্রযোজ্য হবে।
                </div>
                <div
                  className="invoice_footer"
                  style={{ marginTop: "20px", display: "block" }}
                >
                  * সকল কর ব্যতীত মূল্য ১
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;
