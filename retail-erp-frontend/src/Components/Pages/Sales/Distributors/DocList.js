import he from "he";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import ProductStockDetail from "../../Reports/Distributor/ProductStockDetail";
import ProtectedImage from "../../../Common/ProtectedImage";
import IsLogin from "../../../Common/IsLogin";

const View = (props) => {
  const [data, setData] = useState({});
  const [orderHistory, setOrderHistory] = useState({});
  const [journalHistory, setJournalHistory] = useState({});
  const [productWiseOrderReturnHistory, setProductWiseOrderReturnHistory] =
    useState({});
  const [returnHistory, setReturnHistory] = useState({});
  const [partyLedger, setPartyLedger] = useState({});
  const [productStock, setProductStock] = useState([]);
  const [basketStock, setBasketStock] = useState({});
  const { id } = useParams();
  const [loadingStates, setLoadingStates] = useState({
    data: false,
    orderHistory: false,
    journalHistory: false,
    productWiseOrderReturnHistory: false,
    returnHistory: false,
    partyLedger: false,
    productStock: false,
    basketStock: false,
  });

  const fetchData = async () => {
    try {
      setLoadingStates((prev) => ({
        ...prev,
        data: true,
        orderHistory: true,
        journalHistory: true,
        productWiseOrderReturnHistory: true,
        returnHistory: true,
        partyLedger: true,
        productStock: true,
        basketStock: true,
      }));

      const response = await Http.get(`/distributor-details/${id}`);
      const resData = response.data;

      setData(resData.info);
      setOrderHistory(resData.order);
      setProductWiseOrderReturnHistory(resData.product_wise_total_order);
      setReturnHistory(resData.return_order);
      setJournalHistory(resData.journal);
      setPartyLedger(resData.party_ledger);
      // setProductStock(resData?.product_stock);
      setProductStock(resData?.product_stock.sort((a, b) => a.tStockQty - b.tStockQty));
      setBasketStock(resData.basket);
    } catch (error) {
      console.error("Error fetching distributor details:", error);
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        data: false,
        orderHistory: false,
        journalHistory: false,
        productWiseOrderReturnHistory: false,
        returnHistory: false,
        partyLedger: false,
        productStock: false,
        basketStock: false,
      }));
    }
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);


  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Documents</h5>
        </div>
        <div className="am-pagebody p-4">

          {/* Header Card */}
          <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
            <div className="d-flex flex-column flex-md-row align-items-center">

              {/* Profile Image */}
              <div className="me-md-4 mb-3 mb-md-0 text-center">
                {data?.distributor_documents?.profile_img_url ? (
                  // <ProtectedImage
                  //   src={data?.distributor_documents?.profile_img_url}
                  //   alt="Profile"
                  //   className="rounded-circle border shadow-sm"
                  //   style={{
                  //     width: "120px",
                  //     height: "120px",
                  //     objectFit: "cover",
                  //   }}
                  // />
                  <ProtectedImage
                    src={data?.distributor_documents?.profile_img_url}
                    alt="Profile"
                    className="rounded-circle border shadow-sm"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                    style={{
                      width: "120px",
                      height: "120px",
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-grow-1">
                <h2 className="fw-bold mb-1">
                  {data?.name || "N/A"}
                </h2>

                <div className="text-muted mb-2">
                  Distributor Code: {data?.code || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0 fw-bold">Documents</h4>
            </div>

            <div className="row g-4">

              {[
                {
                  label: "Base Taken",
                  frontUrl: data?.distributor_documents?.base_taken_from_url,
                  backUrl: data?.distributor_documents?.base_taken_from_back_url,
                },
                {
                  label: "No Transaction",
                  frontUrl: data?.distributor_documents?.no_transaction_from_url,
                  backUrl: data?.distributor_documents?.no_transaction_from_back_url,
                },
                {
                  label: "Opening Form",
                  frontUrl: data?.distributor_documents?.openingform_img_url,
                  backUrl: data?.distributor_documents?.openingform_back_img_url,
                },
                {
                  label: "Agreement",
                  frontUrl: data?.distributor_documents?.agreement_img_url,
                  backUrl: data?.distributor_documents?.agreement_back_img_url,
                },
                {
                  label: "License",
                  frontUrl: data?.distributor_documents?.license_img_url,
                  backUrl: data?.distributor_documents?.license_back_img_url,
                },
                {
                  label: "VAT Registration",
                  frontUrl: data?.distributor_documents?.vat_reg_img_url,
                  backUrl: data?.distributor_documents?.vat_reg_back_img_url,
                },
                {
                  label: "TIN",
                  frontUrl: data?.distributor_documents?.tin_img_url,
                  backUrl: data?.distributor_documents?.tin_back_img_url,
                },
                {
                  label: "NID",
                  frontUrl: data?.distributor_documents?.nid_img_url,
                  backUrl: data?.distributor_documents?.nid_back_img_url,
                },
              ]
                .filter((doc) => doc.frontUrl || doc.backUrl)
                .map((doc, index) => (
                  <div className="col-md-4 col-sm-6" key={index}>
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="fw-semibold mb-3">{doc.label}</h6>
                        <div className="d-flex gap-2">
                          <div className="flex-fill">
                            <div className="text-muted small mb-2">Front</div>
                            {doc.frontUrl ? (
                              <ProtectedImage
                                src={doc.frontUrl}
                                alt={`${doc.label} Front`}
                                className="img-fluid rounded border"
                                style={{
                                  width: "100%",
                                  height: "160px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <div
                                className="d-flex align-items-center justify-content-center rounded border bg-light"
                                style={{ height: "160px" }}
                              >
                                No Front Image
                              </div>
                            )}
                          </div>
                          <div className="flex-fill">
                            <div className="text-muted small mb-2">Back</div>
                            {doc.backUrl ? (
                              <ProtectedImage
                                src={doc.backUrl}
                                alt={`${doc.label} Back`}
                                className="img-fluid rounded border"
                                style={{
                                  width: "100%",
                                  height: "160px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <div
                                className="d-flex align-items-center justify-content-center rounded border bg-light"
                                style={{ height: "160px" }}
                              >
                                No Back Image
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default View;
