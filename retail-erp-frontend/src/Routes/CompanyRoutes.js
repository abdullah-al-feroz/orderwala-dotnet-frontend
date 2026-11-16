import React from "react";
import { Route } from "react-router-dom";

import CreatePlacePlan from "../Components/Pages/Companies/CreatePlacePlan";

const CompanyRoutes = () => {
  return (
    <>
      <Route path="/create-place-plan/:id" element={<CreatePlacePlan />} />
    </>
  );
};

export default CompanyRoutes;
