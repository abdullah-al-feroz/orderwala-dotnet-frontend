import React from "react";
import ReactDOM from "react-dom/client";
import "./flags.css";
import "./index.css";

//New Data table Code Start
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
//New Data table Code End

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Layouts/Header";
import Sidebar from "./Components/Layouts/Sidebar";
import reportWebVitals from "./reportWebVitals";

import Dashboard from "./Components/Pages/Dashboard";
import DataAnalysis from "./Components/Pages/DataAnalysis";
import OrderwalaAnalysis from "./Components/Pages/OrderwalaAnalysis";
import Forms from "./Components/Pages/Forms"; // For Test Purpose. Should be deleted later on
import Login from "./Components/Pages/Login";
import Notification from "./Components/Pages/Notification/List";
import Testtable from "./Components/Pages/Testtable"; // For Test Purpose. Should be deleted later on

import CreateDesignation from "./Components/Pages/Basic-Setup/Designation/Create";
import EditDesignation from "./Components/Pages/Basic-Setup/Designation/Edit";
import Designation from "./Components/Pages/Basic-Setup/Designation/List";

import CreateGrade from "./Components/Pages/Basic-Setup/Grade/Create";
import EditGrade from "./Components/Pages/Basic-Setup/Grade/Edit";
import Grade from "./Components/Pages/Basic-Setup/Grade/List";

import CreateDepartment from "./Components/Pages/Basic-Setup/Department/Create";
import EditDepartment from "./Components/Pages/Basic-Setup/Department/Edit";
import Department from "./Components/Pages/Basic-Setup/Department/List";

import CreateCompanyLocation from "./Components/Pages/Basic-Setup/Location/Create";
import EditCompanyLocation from "./Components/Pages/Basic-Setup/Location/Edit";
import CompanyLocation from "./Components/Pages/Basic-Setup/Location/List";

import CreateFactory from "./Components/Pages/Basic-Setup/Factory/Create";
import EditFactory from "./Components/Pages/Basic-Setup/Factory/Edit";
import Factory from "./Components/Pages/Basic-Setup/Factory/List";

import CreateLeaveRules from "./Components/Pages/Basic-Setup/leave-rules/CreateLeaveRules";
import EditLeaveRules from "./Components/Pages/Basic-Setup/leave-rules/EditLeaveRules";
import LeaveRules from "./Components/Pages/Basic-Setup/leave-rules/LeaveRules";

import CreateZone from "./Components/Pages/Basic-Setup/Workplace/Zone/Create";
import EditZone from "./Components/Pages/Basic-Setup/Workplace/Zone/Edit";
import Zone from "./Components/Pages/Basic-Setup/Workplace/Zone/List";

import CreateRegion from "./Components/Pages/Basic-Setup/Workplace/Region/Create";
import EditRegion from "./Components/Pages/Basic-Setup/Workplace/Region/Edit";
import Region from "./Components/Pages/Basic-Setup/Workplace/Region/List";

import CreateArea from "./Components/Pages/Basic-Setup/Workplace/Area/Create";
import EditArea from "./Components/Pages/Basic-Setup/Workplace/Area/Edit";
import Area from "./Components/Pages/Basic-Setup/Workplace/Area/List";

import CreateBase from "./Components/Pages/Basic-Setup/Workplace/Base/Create";
import CreateRoutePlanOnBase from "./Components/Pages/Basic-Setup/Workplace/Base/CreateRoutePlanOnBase";
import EditBase from "./Components/Pages/Basic-Setup/Workplace/Base/Edit";
import Base from "./Components/Pages/Basic-Setup/Workplace/Base/List";

import CreateRoute from "./Components/Pages/Basic-Setup/Workplace/Route/Create";
import EditRoute from "./Components/Pages/Basic-Setup/Workplace/Route/Edit";
import WorkplaceRoute from "./Components/Pages/Basic-Setup/Workplace/Route/List";

import Appointment from "./Components/Pages/HrManagement/Staff/Appointment";
import CreateRoutePlan from "./Components/Pages/HrManagement/Staff/CreateRoutePlan";
import CreateStaff from "./Components/Pages/HrManagement/Staff/CreateStaff";
import EditStaff from "./Components/Pages/HrManagement/Staff/EditStaff";
import EditStaffPass from "./Components/Pages/HrManagement/Staff/EditStaffPass";
import IdCard from "./Components/Pages/HrManagement/Staff/IdCard";
import ProfileEdit from "./Components/Pages/HrManagement/Staff/Profile/Edit";
import ProfileStaff from "./Components/Pages/HrManagement/Staff/Profile/Profile";
import Staff from "./Components/Pages/HrManagement/Staff/Staff";

// Payroll
import CreateBillSubmission from "./Components/Pages/HrManagement/Bill-Submission/Create";
import EditBillSubmission from "./Components/Pages/HrManagement/Bill-Submission/Edit";
import BillSubmission from "./Components/Pages/HrManagement/Bill-Submission/List";
import BillSubmissionView from "./Components/Pages/HrManagement/Bill-Submission/View";

import CreateMovementSlip from "./Components/Pages/HrManagement/Movement-Slip/Create";
import EditMovementSlip from "./Components/Pages/HrManagement/Movement-Slip/Edit";
import MovementSlip from "./Components/Pages/HrManagement/Movement-Slip/List";
import MovementSlipView from "./Components/Pages/HrManagement/Movement-Slip/View";

import CreateAttendance from "./Components/Pages/HrManagement/Attendance/Create";
import EditAttendance from "./Components/Pages/HrManagement/Attendance/Edit";
import ImportAttendance from "./Components/Pages/HrManagement/Attendance/Import";
import Attendance from "./Components/Pages/HrManagement/Attendance/List";

import CreateArrear from "./Components/Pages/HrManagement/Arrear/Create";
import EditArrear from "./Components/Pages/HrManagement/Arrear/Edit";
import Arrear from "./Components/Pages/HrManagement/Arrear/List";

import CreateIncentive from "./Components/Pages/HrManagement/Incentive/Create";
import EditIncentive from "./Components/Pages/HrManagement/Incentive/Edit";
import Incentive from "./Components/Pages/HrManagement/Incentive/List";

import CreateOvertime from "./Components/Pages/HrManagement/Overtime/Create";
import EditOvertime from "./Components/Pages/HrManagement/Overtime/Edit";
import Overtime from "./Components/Pages/HrManagement/Overtime/List";

import CreateHoliday from "./Components/Pages/HrManagement/Holiday/Create";
import EditHoliday from "./Components/Pages/HrManagement/Holiday/Edit";
import Holiday from "./Components/Pages/HrManagement/Holiday/List";

import CreateHolidayList from "./Components/Pages/HrManagement/HolidayList/Create";
import EditHolidayList from "./Components/Pages/HrManagement/HolidayList/Edit";
import HolidayList from "./Components/Pages/HrManagement/HolidayList/List";

import CreateRoasterHolidayList from "./Components/Pages/HrManagement/RoasterHolidayList/Create";
import EditRoasterHolidayList from "./Components/Pages/HrManagement/RoasterHolidayList/Edit";
import RoasterHolidayList from "./Components/Pages/HrManagement/RoasterHolidayList/List";

import Settings from "./Components/Pages/Basic-Setup/settings/Edit";

import CreateWeeklyOffDay from "./Components/Pages/Basic-Setup/WeeklyOffDay/Create";
import EditWeeklyOffDay from "./Components/Pages/Basic-Setup/WeeklyOffDay/Edit";
import WeeklyOffDay from "./Components/Pages/Basic-Setup/WeeklyOffDay/List";

import CreateNightHold from "./Components/Pages/HrManagement/NightHold/Create";
import EditNightHold from "./Components/Pages/HrManagement/NightHold/Edit";
import NightHold from "./Components/Pages/HrManagement/NightHold/List";

import CreateTada from "./Components/Pages/HrManagement/Tada/Create";
import EditTada from "./Components/Pages/HrManagement/Tada/Edit";
import Tada from "./Components/Pages/HrManagement/Tada/List";

import CreateSpecialLateFacility from "./Components/Pages/Basic-Setup/SpecialLateFacility/Create";
import EditSpecialLateFacility from "./Components/Pages/Basic-Setup/SpecialLateFacility/Edit";
import SpecialLateFacility from "./Components/Pages/Basic-Setup/SpecialLateFacility/List";

import CreateSalaryAdvance from "./Components/Pages/HrManagement/SalaryAdvance/Create";
import EditSalaryAdvance from "./Components/Pages/HrManagement/SalaryAdvance/Edit";
import SalaryAdvance from "./Components/Pages/HrManagement/SalaryAdvance/List";

import CreateCanteen from "./Components/Pages/HrManagement/Canteen/Create";
import EditCanteen from "./Components/Pages/HrManagement/Canteen/Edit";
import Canteen from "./Components/Pages/HrManagement/Canteen/List";

import CreatePhoneBill from "./Components/Pages/HrManagement/PhoneBill/Create";
import EditPhoneBill from "./Components/Pages/HrManagement/PhoneBill/Edit";
import PhoneBill from "./Components/Pages/HrManagement/PhoneBill/List";

import CreateIncomeTax from "./Components/Pages/HrManagement/IncomeTax/Create";
import EditIncomeTax from "./Components/Pages/HrManagement/IncomeTax/Edit";
import IncomeTax from "./Components/Pages/HrManagement/IncomeTax/List";

import CreateDeduction from "./Components/Pages/HrManagement/Deduction/Create";
import EditDeduction from "./Components/Pages/HrManagement/Deduction/Edit";
import Deduction from "./Components/Pages/HrManagement/Deduction/List";

import CreateBonous from "./Components/Pages/HrManagement/Bonous/Create";
import EditBonous from "./Components/Pages/HrManagement/Bonous/Edit";
import Bonous from "./Components/Pages/HrManagement/Bonous/List";

import CreateLeaveDeduction from "./Components/Pages/HrManagement/LeaveDeduction/Create";
import EditLeaveDeduction from "./Components/Pages/HrManagement/LeaveDeduction/Edit";
import LeaveDeduction from "./Components/Pages/HrManagement/LeaveDeduction/List";

import CreateLeaveApplication from "./Components/Pages/HrManagement/LeaveApplication/Create";
import EditLeaveApplication from "./Components/Pages/HrManagement/LeaveApplication/Edit";
import LeaveApplication from "./Components/Pages/HrManagement/LeaveApplication/List";
import LeaveApplicationView from "./Components/Pages/HrManagement/LeaveApplication/View";

import CreateRequisition from "./Components/Pages/HrManagement/Requisition/Create";
import EditRequisition from "./Components/Pages/HrManagement/Requisition/Edit";
import Requisition from "./Components/Pages/HrManagement/Requisition/List";

import CreateCandidate from "./Components/Pages/HrManagement/Candidate/Create";
import EditCandidate from "./Components/Pages/HrManagement/Candidate/Edit";
import Candidate from "./Components/Pages/HrManagement/Candidate/List";

import CreateSalary from "./Components/Pages/HrManagement/Salary/Create";
import Salary from "./Components/Pages/HrManagement/Salary/List";
import PaySlip from "./Components/Pages/HrManagement/Salary/PaySlip";

import CreateApa from "./Components/Pages/HrManagement/Apa/Create";
import EditApa from "./Components/Pages/HrManagement/Apa/Edit";
import Apa from "./Components/Pages/HrManagement/Apa/List";

// Supply Chain
import CreateDivision from "./Components/Pages/SupplyChain/Setting/Division/Create";
import EditDivision from "./Components/Pages/SupplyChain/Setting/Division/Edit";
import Division from "./Components/Pages/SupplyChain/Setting/Division/List";

import CreateDistrict from "./Components/Pages/SupplyChain/Setting/District/Create";
import EditDistrict from "./Components/Pages/SupplyChain/Setting/District/Edit";
import District from "./Components/Pages/SupplyChain/Setting/District/List";

import CreateThana from "./Components/Pages/SupplyChain/Setting/Thana/Create";
import EditThana from "./Components/Pages/SupplyChain/Setting/Thana/Edit";
import Thana from "./Components/Pages/SupplyChain/Setting/Thana/List";

import CreatePlace from "./Components/Pages/SupplyChain/Setting/Place/Create";
import EditPlace from "./Components/Pages/SupplyChain/Setting/Place/Edit";
import Place from "./Components/Pages/SupplyChain/Setting/Place/List";
import Treeview from "./Components/Pages/SupplyChain/Setting/Place/treeview";

import CreateBrand from "./Components/Pages/SupplyChain/Setting/Brand/Create";
import EditBrand from "./Components/Pages/SupplyChain/Setting/Brand/Edit";
import Brand from "./Components/Pages/SupplyChain/Setting/Brand/List";

import CreateTag from "./Components/Pages/SupplyChain/Setting/Tag/Create";
import EditTag from "./Components/Pages/SupplyChain/Setting/Tag/Edit";
import Tag from "./Components/Pages/SupplyChain/Setting/Tag/List";

import CreateUnit from "./Components/Pages/SupplyChain/Unit/Create";
import EditUnit from "./Components/Pages/SupplyChain/Unit/Edit";
import Unit from "./Components/Pages/SupplyChain/Unit/List";

import Shop from "./Components/Pages/SupplyChain/Shop/List";
import ShopCustomerPasswordModify from "./Components/Pages/SupplyChain/Shop/ShopCustomerPasswordModify";
import CreateShop from "./Components/Pages/SupplyChain/Shop/Create";
import EditShop from "./Components/Pages/SupplyChain/Shop/Edit";
import ViewShop from "./Components/Pages/SupplyChain/Shop/View";
import ShopListBasedOnRouteIdWise from "./Components/Pages/SupplyChain/Shop/ShopListBasedOnRouteIdWise";

import CreateVendor from "./Components/Pages/SupplyChain/Vendor/Create";
import EditVendor from "./Components/Pages/SupplyChain/Vendor/Edit";
import Vendors from "./Components/Pages/SupplyChain/Vendor/List";
import ViewVendor from "./Components/Pages/SupplyChain/Vendor/View";

import CreateProductCategory from "./Components/Pages/SupplyChain/Product-Category/Create";
import EditProductCategory from "./Components/Pages/SupplyChain/Product-Category/Edit";
import ProductCategory from "./Components/Pages/SupplyChain/Product-Category/List";

import CreateProduct from "./Components/Pages/SupplyChain/Product/Create";
import EditProduct from "./Components/Pages/SupplyChain/Product/Edit";
import Product from "./Components/Pages/SupplyChain/Product/List";

import CreateRetailerOffer from "./Components/Pages/SupplyChain/Retailer-Offer/Create";
import RetailerOffer from "./Components/Pages/SupplyChain/Retailer-Offer/List";
import ShowRetailerOffer from "./Components/Pages/SupplyChain/Retailer-Offer/Show";

import CreateTradeOffer from "./Components/Pages/SupplyChain/Trade-Offer/Create";
import EditTradeOffer from "./Components/Pages/SupplyChain/Trade-Offer/Edit";
import TradeOffer from "./Components/Pages/SupplyChain/Trade-Offer/List";
import CouponOffer from "./Components/Pages/SupplyChain/Coupon-Offer/List";
import CreateCouponOffer from "./Components/Pages/SupplyChain/Coupon-Offer/Create";
import EditCouponOffer from "./Components/Pages/SupplyChain/Coupon-Offer/Edit";

import BasketOffer from "./Components/Pages/SupplyChain/Basket-Offer/List";
import CreateBasketOffer from "./Components/Pages/SupplyChain/Basket-Offer/Create";
import EditBasketOffer from "./Components/Pages/SupplyChain/Basket-Offer/Edit";

import CreateDirectPurchase from "./Components/Pages/SupplyChain/Direct-Purchase/Create";
import EditDirectPurchase from "./Components/Pages/SupplyChain/Direct-Purchase/Edit";
import DirectPurchase from "./Components/Pages/SupplyChain/Direct-Purchase/List";
import ShowDirectPurchase from "./Components/Pages/SupplyChain/Direct-Purchase/Show";

import CreateCircularRfq from "./Components/Pages/SupplyChain/CircularRfq/Create";
import EditCircularRfq from "./Components/Pages/SupplyChain/CircularRfq/Edit";
import CircularRfq from "./Components/Pages/SupplyChain/CircularRfq/List";
import ShowCircularRfq from "./Components/Pages/SupplyChain/CircularRfq/Show";
import VendorQuotationSent from "./Components/Pages/SupplyChain/CircularRfq/Vendor/Quotation";

import CircularCompare from "./Components/Pages/SupplyChain/CircularRfq/Vendor/Compare";
import VendorQuotationList from "./Components/Pages/SupplyChain/CircularRfq/Vendor/QuotationList";
import ShowVendorQuotation from "./Components/Pages/SupplyChain/CircularRfq/Vendor/Show";

import FinalQuotation from "./Components/Pages/SupplyChain/Final-Quotation/List";
import FinalQuotationView from "./Components/Pages/SupplyChain/Final-Quotation/Show";

import CreateGrn from "./Components/Pages/SupplyChain/Grn/Create";
import PurchaseOrder from "./Components/Pages/SupplyChain/Purchase-Order/List";
import PurchaseOrderView from "./Components/Pages/SupplyChain/Purchase-Order/Show";

import GrnEdit from "./Components/Pages/SupplyChain/Grn/Edit";
import Grn from "./Components/Pages/SupplyChain/Grn/List";
import GrnView from "./Components/Pages/SupplyChain/Grn/Show";

import PurchaseOrderReturnCreate from "./Components/Pages/SupplyChain/Grn-Return/Create";
import PurchaseOrderReturnEdit from "./Components/Pages/SupplyChain/Grn-Return/Edit";
import PurchaseOrderReturn from "./Components/Pages/SupplyChain/Grn-Return/List";
import PurchaseOrderReturnView from "./Components/Pages/SupplyChain/Grn-Return/Show";

import CreateothersReceive from "./Components/Pages/SupplyChain/Others-Receive/Create";
import EditothersReceive from "./Components/Pages/SupplyChain/Others-Receive/Edit";
import OthersReceive from "./Components/Pages/SupplyChain/Others-Receive/List";
import OthersReceiveView from "./Components/Pages/SupplyChain/Others-Receive/Show";

// Production
import CreateMachineries from "./Components/Pages/Production/Machineries/Create";
import EditMachineries from "./Components/Pages/Production/Machineries/Edit";
import Machineries from "./Components/Pages/Production/Machineries/List";

import CreateFactoryMachineries from "./Components/Pages/Production/Factory-Machineries/Create";
import EditFactoryMachineries from "./Components/Pages/Production/Factory-Machineries/Edit";
import FactoryMachineries from "./Components/Pages/Production/Factory-Machineries/List";

import CreateReceipe from "./Components/Pages/Production/Receipe/Create";
import EditReceipe from "./Components/Pages/Production/Receipe/Edit";
import Receipe from "./Components/Pages/Production/Receipe/List";

import CreateReceipeFactory from "./Components/Pages/Production/ReceipeFactory/Create";
import EditReceipeFactory from "./Components/Pages/Production/ReceipeFactory/Edit";
import ReceipeFactory from "./Components/Pages/Production/ReceipeFactory/List";

import CreateRequisitionProduction from "./Components/Pages/Production/RequisitionProduction/Create";
import EditRequisitionProduction from "./Components/Pages/Production/RequisitionProduction/Edit";
import RequisitionProduction from "./Components/Pages/Production/RequisitionProduction/List";
import ViewRequisitionProduction from "./Components/Pages/Production/RequisitionProduction/Show";

import CreateIssue from "./Components/Pages/Production/Issue/Create";
import EditIssue from "./Components/Pages/Production/Issue/Edit";
import Issue from "./Components/Pages/Production/Issue/List";
import ProductionReceive from "./Components/Pages/Production/Issue/Receive/Production";
import ProductionGenerate from "./Components/Pages/Production/Issue/Receive/ProductionGenerate";
import RmPmReceive from "./Components/Pages/Production/Issue/Receive/Rmpm";
import ViewIssue from "./Components/Pages/Production/Issue/Show";

import Production from "./Components/Pages/Production/Production/List";

import DepoTransfer from "./Components/Pages/Production/Depo-Transfer/List";

import CreateFactoryTransfer from "./Components/Pages/Production/Factory-Transfer/Create";
import EditFactoryTransfer from "./Components/Pages/Production/Factory-Transfer/Edit";
import FactoryTransfer from "./Components/Pages/Production/Factory-Transfer/List";
import FactoryTransferShow from "./Components/Pages/Production/Factory-Transfer/Show";

import CreateDamageReturn from "./Components/Pages/Production/Damage-Return/Create";
import EditDamageReturn from "./Components/Pages/Production/Damage-Return/Edit";
import DamageReturn from "./Components/Pages/Production/Damage-Return/List";

// import ReturnFromDistributor from "./Components/Pages/Production/Return-From-Distributor/List";
// import CreateReturnFromDistributor from "./Components/Pages/Production/Return-From-Distributor/Create";
// import EditReturnFromDistributor from "./Components/Pages/Production/Return-From-Distributor/Edit";

// Sales
import CreatePrimarySales from "./Components/Pages/Sales/Primary-Sales/Create";
import CreatePrimarySalesDev from "./Components/Pages/Sales/Primary-Sales/Create-dev";
import DeliveryOrder from "./Components/Pages/Sales/Primary-Sales/DeliveryOrder";
import EditPrimarySales from "./Components/Pages/Sales/Primary-Sales/Edit";
import ImportSalesAcpl from "./Components/Pages/Sales/Primary-Sales/ImportAcpl";
import ImportSales from "./Components/Pages/Sales/Primary-Sales/Import";
import PrimarySales from "./Components/Pages/Sales/Primary-Sales/List";
import OrderDetail from "./Components/Pages/Sales/Primary-Sales/OrderDetail";
import PaymentReceive from "./Components/Pages/Sales/Primary-Sales/PaymentReceive";
import PaymentReceiveCoa from "./Components/Pages/Sales/Primary-Sales/PaymentReceiveCoa";

import CreatePaymentReceiveFromDistributor from "./Components/Pages/Sales/Payment-Receive-From-Distributor/Create";
import EditPaymentReceiveFromDistributor from "./Components/Pages/Sales/Payment-Receive-From-Distributor/Edit";
import PaymentReceiveFromDistributor from "./Components/Pages/Sales/Payment-Receive-From-Distributor/List";

import Chalan from "./Components/Pages/Sales/Primary-Sales/Chalan";
import Mushok63 from "./Components/Pages/Sales/Primary-Sales/Mushok63";

import CreateDistributors from "./Components/Pages/Sales/Distributors/Create";
import EditDistributors from "./Components/Pages/Sales/Distributors/Edit";
import Distributors from "./Components/Pages/Sales/Distributors/List";
import DistributorsStock from "./Components/Pages/Sales/Distributors/DistStock";
import DistributorsView from "./Components/Pages/Sales/Distributors/View";
import DistributorsDocView from "./Components/Pages/Sales/Distributors/DocList";

// Secondary Sales
import CreateMonthlyTarget from "./Components/Pages/Sales/Secondary-Sales/Monthly-Target/CreateTarget";
import MonthlyTargetDailyReport from "./Components/Pages/Sales/Secondary-Sales/Monthly-Target/DailyReport";
import EditMonthlyTarget from "./Components/Pages/Sales/Secondary-Sales/Monthly-Target/EditTarget";
import MonthlyTarget from "./Components/Pages/Sales/Secondary-Sales/Monthly-Target/List";
import SummaryReport from "./Components/Pages/Sales/Secondary-Sales/Monthly-Target/SummaryReport";
import MonthlyTargetView from "./Components/Pages/Sales/Secondary-Sales/Monthly-Target/View";
import MonthlyTargetViewBaseWiseDaily from "./Components/Pages/Sales/Secondary-Sales/Monthly-Target/ViewBaseWiseDaily";
import MonthlyTargetViewRegionWise from "./Components/Pages/Sales/Secondary-Sales/Monthly-Target/ViewRegionWise";

import CreateOpeningStock from "./Components/Pages/Sales/Secondary-Sales/Opening-Stock/Create";
import EditOpeningStock from "./Components/Pages/Sales/Secondary-Sales/Opening-Stock/Edit";
import OpeningStock from "./Components/Pages/Sales/Secondary-Sales/Opening-Stock/List";
import OpeningStockView from "./Components/Pages/Sales/Secondary-Sales/Opening-Stock/View";

//Distributor
import DistributorOrder from "./Components/Pages/Distributors/Order/List";
import DistributorOrderView from "./Components/Pages/Distributors/Order/Show";

import DistributorRetailerOrder from "./Components/Pages/Distributors/Retailer-Order/List";
import DistributorRetailerOrderView from "./Components/Pages/Distributors/Retailer-Order/Show";

import DistributorRetailerBasketOrder from "./Components/Pages/Distributors/Retailer-Basket-Order/List";
import DistributorRetailerOrderBsketView from "./Components/Pages/Distributors/Retailer-Basket-Order/Show";

import DistributorRetailerOrderReturn from "./Components/Pages/Distributors/Retailer-Order-Return/List";
import DistributorRetailerOrderReturnView from "./Components/Pages/Distributors/Retailer-Order-Return/Show";
import DistributorRetailerOrderItemWiseReturn from "./Components/Pages/Distributors/Retailer-Order-Return-item-wise/List.js";

import DistributorOrderReturnCreate from "./Components/Pages/Distributors/Order-Return/Create";
import DistributorOrderReturn from "./Components/Pages/Distributors/Order-Return/List";
import DistributorOrderReturnView from "./Components/Pages/Distributors/Order-Return/Show";

import CreateReceiveAmount from "./Components/Pages/Distributors/ReceiveAmount/Create";
import EditReceiveAmount from "./Components/Pages/Distributors/ReceiveAmount/Edit";
import ReceiveAmount from "./Components/Pages/Distributors/ReceiveAmount/List";

import CreateDistributorSales from "./Components/Pages/Distributors/DistributorSales/Create";
import EditDistributorSales from "./Components/Pages/Distributors/DistributorSales/Edit";
import DistributorSales from "./Components/Pages/Distributors/DistributorSales/List";

// Reports
import Customer from "./Components/Pages/Reports/Customer";
import DepoWiseProductStock from "./Components/Pages/Reports/Depot/DepoWiseProductStock";
import Distributor from "./Components/Pages/Reports/Depot/Distributor";
import PackingMaterialStock from "./Components/Pages/Reports/Depot/PackingMaterialStock";
import ProductStock from "./Components/Pages/Reports/Depot/ProductStock";
import RawMaterialStock from "./Components/Pages/Reports/Depot/RawMaterialStock";
import DsrReceiveAmount from "./Components/Pages/Reports/Distributor/DsrReceiveAmount";
import NewProductStockDistributor from "./Components/Pages/Reports/Distributor/NewProductStock";
import ProductStockDistributor from "./Components/Pages/Reports/Distributor/ProductStock";
import DsrDeliveryReport from "./Components/Pages/Reports/Dsr/DsrDeliveryReport";
import ApaReport from "./Components/Pages/Reports/HrManagement/ApaReport";
import AttendanceReport from "./Components/Pages/Reports/HrManagement/AttendanceReport";
import HrLeaveReport from "./Components/Pages/Reports/HrManagement/LeaveReport";
import MonthlySalaryReport from "./Components/Pages/Reports/HrManagement/MonthlySalaryReport";
import SalaryPaymentReport from "./Components/Pages/Reports/HrManagement/SalaryPaymentReport";
import HrSalaryStructure from "./Components/Pages/Reports/HrManagement/SalaryStructure";
import Reports from "./Components/Pages/Reports/List";
import FieldReports from "./Components/Pages/Reports/FieldReports";
import DateWiseStock from "./Components/Pages/Reports/DateWiseStock";

import OfferReport from "./Components/Pages/Reports/OfferReports/OfferReport";
import TradeOfferReport from "./Components/Pages/Reports/OfferReports/TradeOfferReport";
import StockWiseTradeOfferWithDiscountOfferReport from "./Components/Pages/Reports/OfferReports/StockWiseTradeOfferWithDiscountOfferReport";
import OnePercentOfferReport from "./Components/Pages/Reports/OfferReports/OnePercentOfferReport";
import RetailerOfferReport from "./Components/Pages/Reports/OfferReports/RetailerOfferReport";

//SO Track
import AttendanceList from "./Components/Pages/SO-Track/Attendance/List";
import Overview from "./Components/Pages/SO-Track/Overview/List";
import MDOSales from "./Components/Pages/SO-Track/Sales/List";
import MDOSalesView from "./Components/Pages/SO-Track/Sales/View";
import StoreCheckIn from "./Components/Pages/SO-Track/Store-CheckIn/List";

// Reason Factors
import ReasonCreate from "./Components/Pages/Reason-Factors/Create";
import ReasonEdit from "./Components/Pages/Reason-Factors/Edit";
import ReasonList from "./Components/Pages/Reason-Factors/List";
import ReasonTypeList from "./Components/Pages/Reason-Factors/Reason-Types/List";

// Priority Retailers
import PriorityRetailers from "./Components/Pages/Reports/PriorityRetailers/PriorityRetailers";
import PriorityRetailersView from "./Components/Pages/Reports/PriorityRetailers/PriorityRetailersView";

// Tracking Reports
import TrackingReportsHMOAttendance from "./Components/Pages/Reports/TrackingReports/AttendanceReports/HMOList";
import TrackingReportsCDMAttendance from "./Components/Pages/Reports/TrackingReports/AttendanceReports/CDMList";
import TrackingReportsRSMAttendance from "./Components/Pages/Reports/TrackingReports/AttendanceReports/RSMList";
import TrackingReportsAMAttendance from "./Components/Pages/Reports/TrackingReports/AttendanceReports/AMList";
import TrackingReportsMDOAttendance from "./Components/Pages/Reports/TrackingReports/AttendanceReports/MDOList";
import TrackingReportsMDODetails from "./Components/Pages/Reports/TrackingReports/AttendanceReports/MDODetails";

// Tracking Reports
import TrackingReportsCDMAttendance2 from "./Components/Pages/Reports/TrackingReports/AttendanceReportNew/CDMList";
import TrackingReportsRSMAttendance2 from "./Components/Pages/Reports/TrackingReports/AttendanceReportNew/RSMList";
import TrackingReportsAMAttendance2 from "./Components/Pages/Reports/TrackingReports/AttendanceReportNew/AMList";
import TrackingReportsMDOAttendance2 from "./Components/Pages/Reports/TrackingReports/AttendanceReportNew/MDOList";
import TrackingReportsMDODetails2 from "./Components/Pages/Reports/TrackingReports/AttendanceReportNew/MDODetails";
import DeveloperModeAttendance from "./Components/Pages/Reports/TrackingReports/AttendanceReportNew/DeveloperModeAttendance";
import DeveloperModeAttendanceDetails from "./Components/Pages/Reports/TrackingReports/AttendanceReportNew/DeveloperModeAttendanceDetails";

import TrackingReportsRSMCreatedStores from "./Components/Pages/Reports//TrackingReports/MDOCreatedStoreReports/RSMList";
import TrackingReportsAMCreatedStores from "./Components/Pages/Reports/TrackingReports/MDOCreatedStoreReports/AMList";
import TrackingReportsMDOCreatedStores from "./Components/Pages/Reports/TrackingReports/MDOCreatedStoreReports/MDOList";

import CouponGenerateReport from "./Components/Pages/Reports/CouponGenerateReport";
import TrackingReportsRSMSales from "./Components/Pages/Reports/TrackingReports/MDOSalesReports/RSMList";
import CategoryWiseMemoReport from "./Components/Pages/Reports/TrackingReports/Reports/CategoryWiseMemoReport.js";
import BasketOrderItemWise from "./Components/Pages/Reports/TrackingReports/Reports/BasketOrderItemWise";
import TrackingReportsAMSales from "./Components/Pages/Reports/TrackingReports/MDOSalesReports/AMList";
import TrackingReportsMDOSales from "./Components/Pages/Reports/TrackingReports/MDOSalesReports/MDOList";

import TrackingReportsRSMVisitedArea from "./Components/Pages/Reports/TrackingReports/MDOVisitedAreaReports/RSMList";
import TrackingReportsAMVisitedArea from "./Components/Pages/Reports/TrackingReports/MDOVisitedAreaReports/AMList";
import TrackingReportsMDOVisitedArea from "./Components/Pages/Reports/TrackingReports/MDOVisitedAreaReports/MDOList";

import TrackingReportsRSMDeliveryDSR from "./Components/Pages/Reports/TrackingReports/DSRDeliveryReports/RSMList";
import TrackingReportsAMDeliveryDSR from "./Components/Pages/Reports/TrackingReports/DSRDeliveryReports/AMList";
import TrackingReportsMDODeliveryDSR from "./Components/Pages/Reports/TrackingReports/DSRDeliveryReports/MDOList";

import TrackingReportsRSMOrdersOW from "./Components/Pages/Reports/TrackingReports/OWOrdersReports/RSMList";
import TrackingReportsAMOrdersOW from "./Components/Pages/Reports/TrackingReports/OWOrdersReports/AMList";
import TrackingReportsMDOOrdersOW from "./Components/Pages/Reports/TrackingReports/OWOrdersReports/MDOList";

import TrackingReportsRSMTotalVerifiedStoresOW from "./Components/Pages/Reports/TrackingReports/OWTotalVerifiedStoresReports/RSMList";
import TrackingReportsAMTotalVerifiedStoresOW from "./Components/Pages/Reports/TrackingReports/OWTotalVerifiedStoresReports/AMList";
import TrackingReportsMDOTotalVerifiedStoresOW from "./Components/Pages/Reports/TrackingReports/OWTotalVerifiedStoresReports/MDOList";

import TrackingReportsRSMUndeliverOW from "./Components/Pages/Reports/TrackingReports/OWUndeliver/RSMList";
import TrackingReportsAMUndeliverOW from "./Components/Pages/Reports/TrackingReports/OWUndeliver/AMList";
import TrackingReportsMDOUndeliverOW from "./Components/Pages/Reports/TrackingReports/OWUndeliver/MDOList";

import TrackingReportsRSMUndeliverMDO from "./Components/Pages/Reports/TrackingReports/MDOUndeliver/RSMList";
import TrackingReportsAMUndeliverMDO from "./Components/Pages/Reports/TrackingReports/MDOUndeliver/AMList";
import TrackingReportsMDOUndeliverMDO from "./Components/Pages/Reports/TrackingReports/MDOUndeliver/MDOList";

import TrackingReportsTargetVSAchievementPie from "./Components/Pages/Reports/TrackingReports/TargetVSAchievement/PieChart";

//Call Center
import CallCenterRetailers from "./Components/Pages/CallCenter/Retailers/List";
import CallCenterRetailerInfoEdit from "./Components/Pages/CallCenter/Retailers/RetailerInfoEdit";
import CallCenterRetailersNoOrder from "./Components/Pages/CallCenter/Retailers/NoOrderList";
import CallCenterRetailersWithOneOrder from "./Components/Pages/CallCenter/Retailers/OneOrderList";
import CallCenterRetailersOrder from "./Components/Pages/CallCenter/Retailers/OrderList";
import CallCenterRetailersOrderDetails from "./Components/Pages/CallCenter/Retailers/OrderDetails";

import SkuWiseItemSummary from "./Components/Pages/Moo/ItemSummary/SkuWiseItemSummary";
import TrackingReport from "./Components/Pages/Moo/ItemSummary/TrackingReport";
import StaffTargetAchievement from "./Components/Pages/Moo/TargetAchievement/StaffTargetAchievement";
import HrIncentiveReport from "./Components/Pages/Moo/TargetAchievement/HrIncentive";

//Company Routes
import CompanyRoutes from "./Routes/CompanyRoutes";
import RouteWiseCustomer from "./Components/Pages/Moo/RouteWiseCustomer/RouteWiseCustomer";
import DuplicateOrderCheck from "./Components/Pages/DuplicateOrderCheck/DuplicateOrderCheck";
import DuplicateUsers from "./Components/Pages/Reports/DuplicateUsers";
import DiscountOffer from "./Components/Pages/Reports/DiscountOffer";
import SpecificDiscountOffer from "./Components/Pages/Reports/SpecificOfferDetails";
import SpecificOfferDetails from "./Components/Pages/Reports/SpecificOfferDetails";
import ChangeCustomerRoute from "./Components/Pages/Moo/changeCustomerRoute/changeCustomerRoute";
import SalesVsStockQuantityAnalysisReport from "./Components/Pages/Reports/SalesVsStockQuantityAnalysisReport";
import ReturnProduct from "./Components/Pages/Reports/ReturnProduct";
import RSMList from "./Components/Pages/Reports/PreviousDayOrder/RSMList";
import AMList from "./Components/Pages/Reports/PreviousDayOrder/AMList";
import MDOList from "./Components/Pages/Reports/PreviousDayOrder/MDOList";
import AssignMdo from "./Components/Pages/HrManagement/Staff/AssignMdo";
import MDOSalesReport from "./Components/Pages/Reports/MDOSalesReport";
import MDOSalesReport499 from "./Components/Pages/Reports/MDOSalesReport499";
import BaseWiseOrderDeliveryRangeReport from "./Components/Pages/Reports/BaseWiseOrderDeliveryRangeReport";
import ProductWiseSalesDeliveryReport from "./Components/Pages/Reports/ProductWiseSalesDeliveryReport";
import CampaignOffer from "./Components/Pages/Reports/CampaignOffer";
import CampaignOfferProductWise from "./Components/Pages/Reports/CampaignOfferProductWise";
import AllDistributorStockReport from "./Components/Pages/Reports/AllDistributorStockReport";

import SurveyReport from "./Components/Pages/Moo/Survey/SurveyReport";
import SurveyReportPagination from "./Components/Pages/Moo/Survey/SurveyReportPagination";
import FakeCustomers from "./Components/Pages/Moo/FakeCustomers/FakeCustomers";
import PercentageOfferCategoryWise from "./Components/Pages/Reports/CategoryWisePercentage";
import CategoryWisePercentage from "./Components/Pages/Reports/CategoryWisePercentage";
import CategoryWiseOrderReport from "./Components/Pages/Reports/CategoryWiseOrderReport";
import BpTrackingReport from "./Components/Pages/Reports/BpTrackingReport";
import BPList from "./Components/Pages/Reports/TrackingReports/AttendanceReports/BPList";
import BPDetail from "./Components/Pages/Reports/TrackingReports/AttendanceReports/BPDetail/BPDetails";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <PrimeReactProvider>
    <BrowserRouter>
      <Header />
      <Sidebar />

      <div id="erp-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/data-analysis" element={<DataAnalysis />} />
          <Route path="/orderwala-analysis" element={<OrderwalaAnalysis />} />
          <Route path="/form" element={<Forms />} />
          <Route path="/testtable" element={<Testtable />} />
          <Route path="/notification" element={<Notification />} />
          {/* Designation */}
          <Route path="/designation" element={<Designation />} />
          <Route path="/createdesignation" element={<CreateDesignation />} />
          <Route path="/editdesignation/:id" element={<EditDesignation />} />
          {/* Grade */}
          <Route path="/grade" element={<Grade />} />
          <Route path="/creategrade" element={<CreateGrade />} />
          <Route path="/editgrade/:id" element={<EditGrade />} />
          {/* Department */}
          <Route path="/department" element={<Department />} />
          <Route path="/createdepartment" element={<CreateDepartment />} />
          <Route path="/editdepartment/:id" element={<EditDepartment />} />
          {/* Company Location */}
          <Route path="/companylocation" element={<CompanyLocation />} />
          <Route
            path="/createCompanyLocation"
            element={<CreateCompanyLocation />}
          />
          <Route
            path="/editCompanyLocation/:id"
            element={<EditCompanyLocation />}
          />

          <Route path="/factory" element={<Factory />} />
          <Route path="/factory/create" element={<CreateFactory />} />
          <Route path="/factory/edit/:id" element={<EditFactory />} />
          {/* Company Location */}
          {/* Zone */}
          <Route path="/zone" element={<Zone />} />
          <Route path="/createzone" element={<CreateZone />} />
          <Route path="/editzone/:id" element={<EditZone />} />
          {/* Region */}
          <Route path="/region" element={<Region />} />
          <Route path="/createregion" element={<CreateRegion />} />
          <Route path="/editregion/:id" element={<EditRegion />} />
          {/* Area */}
          <Route path="/area" element={<Area />} />
          <Route path="/createarea" element={<CreateArea />} />
          <Route path="/editarea/:id" element={<EditArea />} />
          {/* Base */}
          <Route path="/base" element={<Base />} />
          <Route path="/createbase" element={<CreateBase />} />
          <Route path="/editbase/:id" element={<EditBase />} />
          {/* Route */}
          <Route path="/route" element={<WorkplaceRoute />} />
          <Route path="/createroute" element={<CreateRoute />} />
          <Route path="/editroute/:id" element={<EditRoute />} />
          {/* Leave Rules */}
          <Route path="/leave-rules" element={<LeaveRules />} />
          <Route path="/create-leave-rules" element={<CreateLeaveRules />} />
          <Route path="/edit-leave-rules/:id" element={<EditLeaveRules />} />
          {/* Staff */}
          <Route path="/staff" element={<Staff />} />
          <Route path="/create-staff" element={<CreateStaff />} />
          <Route path="/create-staff/:id" element={<CreateStaff />} />
          <Route path="/edit-staff/:id" element={<EditStaff />} />
          <Route path="/edit-staff-pass/:id" element={<EditStaffPass />} />
          <Route path="/appointment-letter/:id" element={<Appointment />} />
          <Route path="/idcard/:id" element={<IdCard />} />
          <Route path="/profile/:id" element={<ProfileStaff />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
          <Route path="/create-route-plan/:id" element={<CreateRoutePlan />} />

          <Route
            path="/create-route-plan-on-base/:id/:type"
            element={<CreateRoutePlanOnBase />}
          />
          {/* Payroll */}
          {/* Bill Submission */}
          <Route path="/billsubmission" element={<BillSubmission />} />
          <Route
            path="/create-bill-submission"
            element={<CreateBillSubmission />}
          />
          <Route
            path="/edit-bill-submission/:id"
            element={<EditBillSubmission />}
          />
          <Route
            path="/bill-submission-view/:id"
            element={<BillSubmissionView />}
          />
          {/* Movement Slip */}
          <Route path="/movement-slip" element={<MovementSlip />} />
          <Route
            path="/create-movement-slip"
            element={<CreateMovementSlip />}
          />
          <Route
            path="/edit-movement-slip/:id"
            element={<EditMovementSlip />}
          />
          <Route
            path="/movement-slip-view/:id"
            element={<MovementSlipView />}
          />
          {/* Attendance */}
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/create-attendance" element={<CreateAttendance />} />
          <Route path="/edit-attendance/:id" element={<EditAttendance />} />
          <Route path="/import-attendance" element={<ImportAttendance />} />
          {/* Arrear */}
          <Route path="/arrear" element={<Arrear />} />
          <Route path="/create-arrear" element={<CreateArrear />} />
          <Route path="/edit-arrear/:id" element={<EditArrear />} />
          {/* Incentive */}
          <Route path="/incentive" element={<Incentive />} />
          <Route path="/create-incentive" element={<CreateIncentive />} />
          <Route path="/edit-incentive/:id" element={<EditIncentive />} />
          {/* Overtime */}
          <Route path="/overtime" element={<Overtime />} />
          <Route path="/create-overtime" element={<CreateOvertime />} />
          <Route path="/edit-overtime/:id" element={<EditOvertime />} />
          {/* Holiday */}
          <Route path="/holiday" element={<Holiday />} />
          <Route path="/create-holiday" element={<CreateHoliday />} />
          <Route path="/edit-holiday/:id" element={<EditHoliday />} />
          {/* HolidayList */}
          <Route path="/holiday-list" element={<HolidayList />} />
          <Route path="/create-holiday-list" element={<CreateHolidayList />} />
          <Route path="/edit-holiday-list/:id" element={<EditHolidayList />} />
          {/* Roaster HolidayList */}
          <Route
            path="/roaster-holiday-list"
            element={<RoasterHolidayList />}
          />
          <Route
            path="/create-roaster-holiday-list"
            element={<CreateRoasterHolidayList />}
          />
          <Route
            path="/edit-roaster-holiday-list/:id"
            element={<EditRoasterHolidayList />}
          />
          {/* WeeklyOffDay */}
          <Route path="/weekly-off-day" element={<WeeklyOffDay />} />
          <Route
            path="/create-weekly-off-day"
            element={<CreateWeeklyOffDay />}
          />
          <Route
            path="/edit-weekly-off-day/:id"
            element={<EditWeeklyOffDay />}
          />
          <Route path="/setting" element={<Settings />} />
          <Route
            path="/special-late-facility"
            element={<SpecialLateFacility />}
          />
          <Route
            path="/create-special-late-facility"
            element={<CreateSpecialLateFacility />}
          />
          <Route
            path="/edit-special-late-facility/:id"
            element={<EditSpecialLateFacility />}
          />
          {/* NightHold */}
          <Route path="/night-hold" element={<NightHold />} />
          <Route path="/create-night-hold" element={<CreateNightHold />} />
          <Route path="/edit-night-hold/:id" element={<EditNightHold />} />
          {/* tada */}
          <Route path="/tada" element={<Tada />} />
          <Route path="/create-tada" element={<CreateTada />} />
          <Route path="/edit-tada/:id" element={<EditTada />} />
          {/* SalaryAdvance */}
          <Route path="/salary-advance" element={<SalaryAdvance />} />
          <Route
            path="/create-salary-advance"
            element={<CreateSalaryAdvance />}
          />
          <Route
            path="/edit-salary-advance/:id"
            element={<EditSalaryAdvance />}
          />
          {/* Canteen */}
          <Route path="/canteen" element={<Canteen />} />
          <Route path="/create-canteen" element={<CreateCanteen />} />
          <Route path="/edit-canteen/:id" element={<EditCanteen />} />
          {/* PhoneBill */}
          <Route path="/phonebill" element={<PhoneBill />} />
          <Route path="/create-phonebill" element={<CreatePhoneBill />} />
          <Route path="/edit-phonebill/:id" element={<EditPhoneBill />} />
          {/* IncomeTax */}
          <Route path="/incometax" element={<IncomeTax />} />
          <Route path="/create-incometax" element={<CreateIncomeTax />} />
          <Route path="/edit-incometax/:id" element={<EditIncomeTax />} />
          {/* Deduction */}
          <Route path="/deduction" element={<Deduction />} />
          <Route path="/create-deduction" element={<CreateDeduction />} />
          <Route path="/edit-deduction/:id" element={<EditDeduction />} />
          {/* Bonous */}
          <Route path="/bonous" element={<Bonous />} />
          <Route path="/create-bonous" element={<CreateBonous />} />
          <Route path="/edit-bonous/:id" element={<EditBonous />} />
          {/* Apa */}
          <Route path="/Apa" element={<Apa />} />
          <Route path="/create-Apa" element={<CreateApa />} />
          <Route path="/edit-Apa/:id" element={<EditApa />} />
          {/* LeaveApplication */}
          <Route path="/leave-application" element={<LeaveApplication />} />
          <Route
            path="/create-leave-application"
            element={<CreateLeaveApplication />}
          />
          <Route
            path="/edit-leave-application/:id"
            element={<EditLeaveApplication />}
          />

          <Route
            path="/leave-application-view/:id"
            element={<LeaveApplicationView />}
          />
          {/* LeaveDeduction */}
          <Route path="/leave-deduction" element={<LeaveDeduction />} />
          <Route
            path="/create-leave-deduction"
            element={<CreateLeaveDeduction />}
          />
          <Route
            path="/edit-leave-deduction/:id"
            element={<EditLeaveDeduction />}
          />
          {/* Requisition */}
          <Route path="/requisition" element={<Requisition />} />
          <Route path="/create-requisition" element={<CreateRequisition />} />
          <Route path="/edit-requisition/:id" element={<EditRequisition />} />
          {/* Candidate */}
          <Route path="/candidate" element={<Candidate />} />
          <Route path="/create-candidate" element={<CreateCandidate />} />
          <Route path="/edit-candidate/:id" element={<EditCandidate />} />
          {/* Salary */}
          <Route path="/salary" element={<Salary />} />
          <Route path="/create-salary" element={<CreateSalary />} />
          <Route path="/pay-slip/:id" element={<PaySlip />} />

          {/* Supply Chain */}
          <Route path="/shop" element={<Shop />} />
          <Route
            path="/shop-customer-password-modify"
            element={<ShopCustomerPasswordModify />}
          />
          <Route path="/create-shop" element={<CreateShop />} />
          <Route path="/edit-shop/:id" element={<EditShop />} />
          <Route path="/shop-details/:id" element={<ViewShop />} />
          <Route
            path="/shop-list-based-on-route-id/:id"
            element={<ShopListBasedOnRouteIdWise />}
          />

          <Route path="/vendors" element={<Vendors />} />
          <Route path="/create-vendor" element={<CreateVendor />} />
          <Route path="/edit-vendor/:id" element={<EditVendor />} />
          <Route path="/vendor-details/:id" element={<ViewVendor />} />

          <Route path="/division" element={<Division />} />
          <Route path="/create-division" element={<CreateDivision />} />
          <Route path="/edit-division/:id" element={<EditDivision />} />

          <Route path="/district" element={<District />} />
          <Route path="/create-district" element={<CreateDistrict />} />
          <Route path="/edit-district/:id" element={<EditDistrict />} />

          <Route path="/thana" element={<Thana />} />
          <Route path="/create-thana" element={<CreateThana />} />
          <Route path="/edit-thana/:id" element={<EditThana />} />

          <Route path="/treeview" element={<Treeview />} />
          <Route path="/place" element={<Place />} />
          <Route path="/create-place" element={<CreatePlace />} />
          <Route path="/edit-place/:id" element={<EditPlace />} />

          <Route path="/brand" element={<Brand />} />
          <Route path="/create-brand" element={<CreateBrand />} />
          <Route path="/edit-brand/:id" element={<EditBrand />} />

          <Route path="/tag" element={<Tag />} />
          <Route path="/create-tag" element={<CreateTag />} />
          <Route path="/edit-tag/:id" element={<EditTag />} />

          <Route path="/unit" element={<Unit />} />
          <Route path="/create-unit" element={<CreateUnit />} />
          <Route path="/edit-unit/:id" element={<EditUnit />} />

          <Route path="/product-category" element={<ProductCategory />} />
          <Route
            path="/create-product-category"
            element={<CreateProductCategory />}
          />
          <Route
            path="/edit-product-category/:id"
            element={<EditProductCategory />}
          />

          <Route path="/product" element={<Product />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />

          {/* Offer */}

          <Route path="/retailer-offer" element={<RetailerOffer />} />
          <Route
            path="/create-retailer-offer"
            element={<CreateRetailerOffer />}
          />
          <Route
            path="/show-retailer-offer/:id"
            element={<ShowRetailerOffer />}
          />

          <Route path="/trade-offer" element={<TradeOffer />} />
          <Route path="/create-trade-offer" element={<CreateTradeOffer />} />
          <Route path="/edit-trade-offer/:id" element={<EditTradeOffer />} />
          <Route path="/coupon-offer" element={<CouponOffer />} />
          <Route path="/create-coupon-offer" element={<CreateCouponOffer />} />
          <Route path="/edit-coupon-offer/:id" element={<EditCouponOffer />} />

          <Route path='/basket-offer' element={<BasketOffer />} />
          <Route path='/create-basket-offer' element={<CreateBasketOffer />} />
          <Route path='/edit-basket-offer/:id' element={<EditBasketOffer />} />

          <Route path="/direct-purchase" element={<DirectPurchase />} />
          <Route
            path="/create-direct-purchase"
            element={<CreateDirectPurchase />}
          />
          <Route
            path="/edit-direct-purchase/:id"
            element={<EditDirectPurchase />}
          />
          <Route
            path="/show-direct-purchase/:id"
            element={<ShowDirectPurchase />}
          />

          <Route path="/circular-rfq" element={<CircularRfq />} />
          <Route path="/create-circular-rfq" element={<CreateCircularRfq />} />
          <Route path="/edit-circular-rfq/:id" element={<EditCircularRfq />} />
          <Route path="/show-circular-rfq/:id" element={<ShowCircularRfq />} />

          <Route
            path="/vendor-quotation-list/:id"
            element={<VendorQuotationList />}
          />

          <Route
            path="/show-vendor-quotation/:id"
            element={<ShowVendorQuotation />}
          />

          <Route path="/circular-compare/:id" element={<CircularCompare />} />

          <Route
            path="/vendor-quotation-sent/:id"
            element={<VendorQuotationSent />}
          />
          <Route path="/final-quotation" element={<FinalQuotation />} />
          <Route
            path="/final-quotation-view/:id"
            element={<FinalQuotationView />}
          />

          <Route path="/purchase-order" element={<PurchaseOrder />} />
          <Route
            path="/purchase-order-view/:id"
            element={<PurchaseOrderView />}
          />

          {/* Others Receive */}
          <Route path="/others-receive" element={<OthersReceive />} />
          <Route
            path="/create-others-receive"
            element={<CreateothersReceive />}
          />
          <Route
            path="/edit-others-receive/:id"
            element={<EditothersReceive />}
          />
          <Route path="/others-receive/:id" element={<OthersReceiveView />} />

          {/* Grn */}
          <Route path="/create-grn/:id/:type" element={<CreateGrn />} />
          <Route path="/grn" element={<Grn />} />
          <Route path="/grn/:id" element={<GrnView />} />
          <Route path="/edit/grn/:id" element={<GrnEdit />} />

          {/* Purchase order Return */}
          <Route
            path="/purchase-order-return"
            element={<PurchaseOrderReturn />}
          />
          <Route
            path="/create-purchase-order-return"
            element={<PurchaseOrderReturnCreate />}
          />
          <Route
            path="/edit/purchase-order-return/:id"
            element={<PurchaseOrderReturnEdit />}
          />
          <Route
            path="/purchase-order-return-view/:id"
            element={<PurchaseOrderReturnView />}
          />

          {/* Production */}
          <Route path="/receipe" element={<Receipe />} />
          <Route path="/create-receipe" element={<CreateReceipe />} />
          <Route path="/edit-receipe/:id" element={<EditReceipe />} />

          <Route path="/receipe-factory" element={<ReceipeFactory />} />
          <Route
            path="/create-receipe-factory"
            element={<CreateReceipeFactory />}
          />
          <Route
            path="/edit-receipe-factory/:id"
            element={<EditReceipeFactory />}
          />

          <Route path="/machineries" element={<Machineries />} />
          <Route path="/create-machineries" element={<CreateMachineries />} />
          <Route path="/edit-machineries/:id" element={<EditMachineries />} />

          <Route path="/factory-machineries" element={<FactoryMachineries />} />
          <Route
            path="/create-factory-machineries"
            element={<CreateFactoryMachineries />}
          />
          <Route
            path="/edit-factory-machineries/:id"
            element={<EditFactoryMachineries />}
          />

          <Route
            path="/requisition-production"
            element={<RequisitionProduction />}
          />
          <Route
            path="/create-requisition-production"
            element={<CreateRequisitionProduction />}
          />
          <Route
            path="/edit-requisition-production/:id"
            element={<EditRequisitionProduction />}
          />
          <Route
            path="/requisition-production-view/:id"
            element={<ViewRequisitionProduction />}
          />

          <Route path="/issue" element={<Issue />} />
          <Route path="/issue-view/:id" element={<ViewIssue />} />

          <Route path="/create-issue/:id" element={<CreateIssue />} />
          <Route
            path="/edit-issue/:requisition_production_id/:id"
            element={<EditIssue />}
          />
          <Route path="/rmpm-receive/:id" element={<RmPmReceive />} />
          <Route
            path="/production-generate/:id"
            element={<ProductionGenerate />}
          />
          <Route
            path="/production-receive/:id"
            element={<ProductionReceive />}
          />

          <Route path="/production" element={<Production />} />

          <Route path="/depo-transfer" element={<DepoTransfer />} />

          <Route path="/show-transfer/:id" element={<FactoryTransferShow />} />
          <Route path="/factory-transfer" element={<FactoryTransfer />} />
          <Route
            path="/create-factory-transfer"
            element={<CreateFactoryTransfer />}
          />
          <Route
            path="/edit-factory-transfer/:id"
            element={<EditFactoryTransfer />}
          />

          <Route path="/damage-return" element={<DamageReturn />} />
          <Route
            path="/create-damage-return"
            element={<CreateDamageReturn />}
          />
          <Route
            path="/edit-damage-return/:id"
            element={<EditDamageReturn />}
          />

          <Route
            path="/return-from-distributor"
            element={<DistributorOrderReturn />}
          />
          {/* <Route
          path="/create-return-from-distributor"
          element={<CreateReturnFromDistributor />}
        />
        <Route
          path="/edit-return-from-distributor/:id"
          element={<EditReturnFromDistributor />}
        /> */}

          {/* Sales */}
          <Route
            path="/import-primary-sales-acpl"
            element={<ImportSalesAcpl />}
          />
          <Route path="/import-primary-sales" element={<ImportSales />} />
          <Route path="/primary-sales" element={<PrimarySales />} />
          <Route
            path="/create-primary-sales-dev"
            element={<CreatePrimarySalesDev />}
          />
          <Route
            path="/create-primary-sales"
            element={<CreatePrimarySales />}
          />
          <Route
            path="/edit-primary-sales/:id"
            element={<EditPrimarySales />}
          />
          <Route path="/payment-receive/:id" element={<PaymentReceive />} />
          <Route
            path="/payment-receive-coa/:id"
            element={<PaymentReceiveCoa />}
          />
          <Route path="/primary-sales-detail/:id" element={<OrderDetail />} />
          <Route path="/delivery-order/:id" element={<DeliveryOrder />} />

          <Route path="/mushok-6-3/:id" element={<Mushok63 />} />
          <Route path="/chalan/:id" element={<Chalan />} />

          <Route path="/distributors" element={<Distributors />} />
          <Route path="/distributors-stock" element={<DistributorsStock />} />
          <Route path="/create-distributors" element={<CreateDistributors />} />
          <Route path="/edit-distributors/:id" element={<EditDistributors />} />
          <Route
            path="/distributor-details/:id"
            element={<DistributorsView />}
          />
          <Route
            path="/distributor-doc-details/:id"
            element={<DistributorsDocView />}
          />

          <Route
            path="/payment-receive-from-distributor"
            element={<PaymentReceiveFromDistributor />}
          />
          <Route
            path="/create-payment-receive-from-distributor"
            element={<CreatePaymentReceiveFromDistributor />}
          />
          <Route
            path="/edit-payment-receive-from-distributor/:id"
            element={<EditPaymentReceiveFromDistributor />}
          />

          {/* Secondary Sales */}
          <Route path="/monthly-target" element={<MonthlyTarget />} />
          <Route path="/monthly-target-view" element={<MonthlyTargetView />} />
          <Route path="/daily-report" element={<MonthlyTargetDailyReport />} />
          <Route path="/summary-report" element={<SummaryReport />} />
          <Route
            path="/monthly-target-view-region-wise/:targetId/:id"
            element={<MonthlyTargetViewRegionWise />}
          />
          <Route
            path="/monthly-target-view-base-wise-daily/:targetId/:regionId/:baseId"
            element={<MonthlyTargetViewBaseWiseDaily />}
          />
          <Route path="/create-target" element={<CreateMonthlyTarget />} />
          <Route path="/edit-target" element={<EditMonthlyTarget />} />
          <Route
            path="/edit-monthly-target/:id"
            element={<EditMonthlyTarget />}
          />

          <Route path="/opening-stock" element={<OpeningStock />} />
          <Route path="/opening-stock-view" element={<OpeningStockView />} />
          <Route
            path="/create-opening-stock"
            element={<CreateOpeningStock />}
          />
          <Route path="/edit-opening-stock" element={<EditOpeningStock />} />
          <Route
            path="/edit-opening-stock/:id"
            element={<EditOpeningStock />}
          />

          {/* Distributor*/}
          <Route path="/distributor/order" element={<DistributorOrder />} />
          <Route
            path="/distributor/order/:id"
            element={<DistributorOrderView />}
          />
          <Route
            path="/distributor/retailer-order"
            element={<DistributorRetailerOrder />}
          />
          <Route
            path="/distributor/Retailer-Basket-Order"
            element={<DistributorRetailerBasketOrder />}
          />
          <Route
            path="/distributor/retailer-basket-order/:id"
            element={<DistributorRetailerOrderBsketView />} />
          <Route
            path="/distributor/retailer-order/:id"
            element={<DistributorRetailerOrderView />}
          />

          <Route
            path="/distributor/retailer-order-return"
            element={<DistributorRetailerOrderReturn />}
          />
          <Route
            path="/distributor/retailer-order-return-item-wise"
            element={<DistributorRetailerOrderItemWiseReturn />}
          />
          <Route
            path="/distributor/retailer-order-return/:id"
            element={<DistributorRetailerOrderReturnView />}
          />

          <Route
            path="/distributor/order-return"
            element={<DistributorOrderReturn />}
          />
          <Route
            path="/distributor/order-return/:id"
            element={<DistributorOrderReturnView />}
          />
          <Route
            path="/distributor/order-return-create"
            element={<DistributorOrderReturnCreate />}
          />

          <Route
            path="/distributor/receive-amount"
            element={<ReceiveAmount />}
          />
          <Route
            path="/distributor/edit-receive-amount/:id"
            element={<EditReceiveAmount />}
          />
          <Route
            path="/distributor/receive-amount-create"
            element={<CreateReceiveAmount />}
          />
          <Route
            path="/distributor/sales/:distributorId"
            element={<DistributorSales />}
          />
          <Route
            path="/distributor/edit-sales/:id"
            element={<EditDistributorSales />}
          />
          <Route
            path="/distributor/sales-create/:distributorId"
            element={<CreateDistributorSales />}
          />

          {/* Reports */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/report/date-wise-stock" element={<DateWiseStock />} />
          <Route
            path="/report/duplicate-customers"
            element={<DuplicateUsers />}
          />
          <Route path="/reports/field" element={<FieldReports />} />
          <Route path="/hr-salary-structure" element={<HrSalaryStructure />} />
          <Route path="/hr-leave-report" element={<HrLeaveReport />} />
          <Route
            path="/monthly-salary-report"
            element={<MonthlySalaryReport />}
          />
          <Route path="/attendance-report" element={<AttendanceReport />} />
          <Route
            path="/salary-payment-report"
            element={<SalaryPaymentReport />}
          />
          <Route path="/apa-report" element={<ApaReport />} />

          {/* Depot Report */}
          <Route
            path="/report/depo-wise-product-stock"
            element={<DepoWiseProductStock />}
          />
          <Route
            path="/report/dsr-delivery-report"
            element={<DsrDeliveryReport />}
          />
          <Route
            path="/report/depo-wise-raw-material-stock"
            element={<RawMaterialStock />}
          />
          <Route
            path="/report/depo-wise-packing-material-stock"
            element={<PackingMaterialStock />}
          />
          <Route path="/report/product-stock" element={<ProductStock />} />

          <Route path="/report/distributor" element={<Distributor />} />
          <Route path="/report/customer" element={<Customer />} />
          <Route
            path="/report/distributor-product-stock"
            element={<ProductStockDistributor />}
          />
          <Route
            path="/report/distributor-new-product-stock"
            element={<NewProductStockDistributor />}
          />
          <Route
            path="/report/distributor-product-stock/:id"
            element={<ProductStockDistributor />}
          />
          <Route
            path="/report/dsr-receive-amount"
            element={<DsrReceiveAmount />}
          />

          <Route
            path="/report/retailer-offer-report"
            element={<RetailerOfferReport />}
          />
          <Route
            path="/report/one-percent-offer-report"
            element={<OnePercentOfferReport />}
          />
          <Route path="/report/offer-report" element={<OfferReport />} />
          <Route
            path="/report/trade-offer-report"
            element={<TradeOfferReport />}
          />
          <Route
            path="/report/stock-wise-trade-offer-with-discount-offer-report"
            element={<StockWiseTradeOfferWithDiscountOfferReport />}
          />

          <Route
            path="/so-track/attendance-list"
            element={<AttendanceList />}
          />

          <Route path="/so-track/overview" element={<Overview />} />

          <Route path="/so-track/mdo-sales" element={<MDOSales />} />

          <Route path="/so-track/mdo-sales-view" element={<MDOSalesView />} />

          <Route path="/so-track/store-check-in" element={<StoreCheckIn />} />

          {/* Reason Factors */}
          <Route
            path="/reason-factors/reason-type-list"
            element={<ReasonTypeList />}
          />
          <Route path="/reason-factors/reason-list" element={<ReasonList />} />
          <Route
            path="/reason-factors/reason-create"
            element={<ReasonCreate />}
          />
          <Route
            path="/reason-factors/reason-edit/:id"
            element={<ReasonEdit />}
          />

          {/* Priority Retailers */}
          <Route
            path="/priority-retailers"
            element={<PriorityRetailers />}
          />
          <Route
            path="/priority-retailers/:id"
            element={<PriorityRetailersView />}
          />

          {/* Tracking reports  */}
          <Route
            path="/tracking-reports/attendance-reports/hmo"
            element={<TrackingReportsHMOAttendance />}
          />
          <Route
            path="/tracking-reports/attendance-reports/cdm"
            element={<TrackingReportsCDMAttendance />}
          />
          <Route
            path="/tracking-reports/attendance-reports/cdm/:id"
            element={<TrackingReportsCDMAttendance />}
          />
          <Route
            path="/tracking-reports/attendance-reports/rsm/:id"
            element={<TrackingReportsRSMAttendance />}
          />
          <Route
            path="/tracking-reports/attendance-reports/am/:id"
            element={<TrackingReportsAMAttendance />}
          />
          <Route
            path="/tracking-reports/attendance-reports/mdm"
            element={<TrackingReportsRSMAttendance2 />}
          />
          <Route
            path="/tracking-reports/attendance-reports/mdc"
            element={<TrackingReportsAMAttendance2 />}
          />
          <Route
            path="/tracking-reports/attendance-reports/mdo"
            element={<TrackingReportsMDOAttendance2 />}
          />
          <Route
            path="/tracking-reports/attendance-reports/mdo/:id"
            element={<TrackingReportsMDOAttendance />}
          />
          <Route
            path="/tracking-reports/attendance-report-details/mdo/:id/:baseId"
            element={<TrackingReportsMDODetails />}
          />
          <Route
            path="/tracking-reports/attendance-reports/developer-mode"
            element={<DeveloperModeAttendance />}
          />
          <Route
            path="/tracking-reports/attendance-reports/developer-mode/:userId"
            element={<DeveloperModeAttendanceDetails />}
          />

          <Route
            path="/tracking-reports/mdo-created-stores-reports/rsm"
            element={<TrackingReportsRSMCreatedStores />}
          />
          <Route
            path="/tracking-reports/mdo-created-stores-reports/am/:id"
            element={<TrackingReportsAMCreatedStores />}
          />
          <Route
            path="/tracking-reports/mdo-created-stores-reports/mdo/:id"
            element={<TrackingReportsMDOCreatedStores />}
          />

          <Route
            path="/tracking-reports/mdo-sales-reports/rsm"
            element={<TrackingReportsRSMSales />}
          />
          <Route
            path="/tracking-reports/basket-order-item-wise"
            element={<BasketOrderItemWise />}
          />
          <Route
            path="/tracking-reports/category-wise-memo-report"
            element={<CategoryWiseMemoReport />}
          />
          <Route
            path="/tracking-reports/mdo-sales-reports/am/:id"
            element={<TrackingReportsAMSales />}
          />
          <Route
            path="/tracking-reports/mdo-sales-reports/mdo/:id"
            element={<TrackingReportsMDOSales />}
          />

          <Route
            path="/tracking-reports/mdo-visited-area-reports/rsm"
            element={<TrackingReportsRSMVisitedArea />}
          />
          <Route
            path="/tracking-reports/mdo-visited-area-reports/am/:id"
            element={<TrackingReportsAMVisitedArea />}
          />
          <Route
            path="/tracking-reports/mdo-visited-area-reports/mdo/:id"
            element={<TrackingReportsMDOVisitedArea />}
          />

          <Route
            path="/tracking-reports/dsr-delivery-reports/rsm"
            element={<TrackingReportsRSMDeliveryDSR />}
          />
          <Route
            path="/tracking-reports/dsr-delivery-reports/am/:id"
            element={<TrackingReportsAMDeliveryDSR />}
          />
          <Route
            path="/tracking-reports/dsr-delivery-reports/mdo/:id"
            element={<TrackingReportsMDODeliveryDSR />}
          />

          <Route
            path="/tracking-reports/ow-orders-reports/rsm"
            element={<TrackingReportsRSMOrdersOW />}
          />
          <Route
            path="/tracking-reports/ow-orders-reports/am/:id"
            element={<TrackingReportsAMOrdersOW />}
          />
          <Route
            path="/tracking-reports/ow-orders-reports/mdo/:id"
            element={<TrackingReportsMDOOrdersOW />}
          />

          <Route
            path="/tracking-reports/ow-total-verified-stores-reports/rsm"
            element={<TrackingReportsRSMTotalVerifiedStoresOW />}
          />
          <Route
            path="/tracking-reports/ow-total-verified-stores-reports/am/:id"
            element={<TrackingReportsAMTotalVerifiedStoresOW />}
          />
          <Route
            path="/tracking-reports/ow-total-verified-stores-reports/mdo/:id"
            element={<TrackingReportsMDOTotalVerifiedStoresOW />}
          />

          <Route
            path="/tracking-reports/ow-undeliver-reports/rsm"
            element={<TrackingReportsRSMUndeliverOW />}
          />
          <Route
            path="/tracking-reports/ow-undeliver-reports/am/:id"
            element={<TrackingReportsAMUndeliverOW />}
          />
          <Route
            path="/tracking-reports/ow-undeliver-reports/mdo/:id"
            element={<TrackingReportsMDOUndeliverOW />}
          />

          <Route
            path="/tracking-reports/mdo-undeliver-reports/rsm"
            element={<TrackingReportsRSMUndeliverMDO />}
          />
          <Route
            path="/tracking-reports/mdo-undeliver-reports/am/:id"
            element={<TrackingReportsAMUndeliverMDO />}
          />
          <Route
            path="/tracking-reports/mdo-undeliver-reports/mdo/:id"
            element={<TrackingReportsMDOUndeliverMDO />}
          />

          <Route
            path="/tracking-reports/target-vs-achievement"
            element={<TrackingReportsTargetVSAchievementPie />}
          />

          {/* Call Center */}
          <Route
            path="/call-center/retailers"
            element={<CallCenterRetailers />}
          />
          <Route
            path="/call-center/retailer-info-edit/:id"
            element={<CallCenterRetailerInfoEdit />}
          />
          <Route
            path="/call-center/retailers-no-order"
            element={<CallCenterRetailersNoOrder />}
          />
          <Route
            path="/call-center/retailers-with-one-order"
            element={<CallCenterRetailersWithOneOrder />}
          />
          <Route
            path="/call-center/retailer-order"
            element={<CallCenterRetailersOrder />}
          />
          <Route
            path="/call-center/retailer-order-details/:id"
            element={<CallCenterRetailersOrderDetails />}
          />

          <Route
            path="/sku-wise-item-summary"
            element={<SkuWiseItemSummary />}
          />
          <Route
            path="/duplicate-order-check"
            element={<DuplicateOrderCheck />}
          />
          <Route path="/tracking-report" element={<TrackingReport />} />
          <Route
            path="/route-wise-customer-acquisition"
            element={<RouteWiseCustomer />}
          />

          <Route
            path="/report/hr-incentive-report"
            element={<HrIncentiveReport />}
          />
          <Route
            path="/staff-target-achievement"
            element={<StaffTargetAchievement />}
          />

          <Route path="/discount-offer-details" element={<DiscountOffer />} />
          <Route
            path="/specific-offer-details"
            element={<SpecificOfferDetails />}
          />
          <Route
            path="/change-customer-route"
            element={<ChangeCustomerRoute />}
          />

          <Route
            path="/sales-vs-stock-quantity-analysis-report"
            element={<SalesVsStockQuantityAnalysisReport />}
          />
          <Route path="/return-product" element={<ReturnProduct />} />
          <Route
            path="/reports/previous-day-order-report/rsm"
            element={<RSMList />}
          />

          <Route
            path="/reports/previous-day-order-report/am/:id"
            element={<AMList />}
          />
          <Route
            path="/reports/previous-day-order-report/mdo/:id"
            element={<MDOList />}
          />
          <Route path="/mdo/assign/:id" element={<AssignMdo />} />

          <Route path="/survey-report" element={<SurveyReport />} />
          <Route
            path="/survey-report-pagination"
            element={<SurveyReportPagination />}
          />
          <Route path="/fake-customer-report" element={<FakeCustomers />} />

          {/* Company Module Routes */}
          <Route
            path="/coupon-generate-lists"
            element={<CouponGenerateReport />}
          />
          <Route path="/base-wise-sales-report" element={<MDOSalesReport />} />
          <Route
            path="/base-wise-order-delivery-range-report"
            element={<BaseWiseOrderDeliveryRangeReport />}
          />
          <Route
            path="/product-wise-sales-delivery-report"
            element={<ProductWiseSalesDeliveryReport />}
          />
          <Route path="/campaign-offer" element={<CampaignOffer />} />
          <Route
            path="/campaign-offer-product-wise"
            element={<CampaignOfferProductWise />}
          />
          <Route
            path="/base-wise-sales-report-499"
            element={<MDOSalesReport499 />}
          />
          <Route
            path="/report/all-distributor-stock-report"
            element={<AllDistributorStockReport />}
          />
          <Route
            path="/category-wise-percentage-offer-report"
            element={<CategoryWisePercentage />}
          />
          <Route
            path="/category-wise-order-report"
            element={<CategoryWiseOrderReport />}
          />
          <Route path="/bp-tracking-report" element={<BpTrackingReport />} />
          <Route path="/bp-detail-report/:id" element={<BPDetail />} />
          <Route
            path="/tracking-reports/attendance-reports/bp"
            element={<BPList />}
          />

          {CompanyRoutes()}
        </Routes>
      </div>
    </BrowserRouter>
  </PrimeReactProvider>,
  // </React.StrictMode>
);
reportWebVitals();
