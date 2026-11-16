import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader } from "./Loader";

const LoaderComponent = (props) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const formattedTitle = (str) => {
    // Remove all slashes and capitalize each word
    return str.replace(/\//g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
const pageTitle = props.title ?? formattedTitle(location.pathname.substring(1));

  useEffect(() => {
    const loaderData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating a 2-second delay
      setIsLoading(false);
    };

    loaderData();
  }, []);

  return (
    <div>
      <title>{pageTitle}</title>
      <Loader isOpen={isLoading} />
    </div>
  );
};

export default LoaderComponent;
export { LoaderComponent };
