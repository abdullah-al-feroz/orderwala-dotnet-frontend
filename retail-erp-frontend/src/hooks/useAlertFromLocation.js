import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useAlertFromLocation = () => {
  const location = useLocation();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (location.state && location.state.message && location.state.type) {
      setAlert({
        message: location.state.message,
        type: location.state.type,
      });
      const timer = setTimeout(() => {
        setAlert(null); // Clear the alert after 4 seconds
      }, 4000);

      // Clean up the timeout when the component unmounts or location changes
      return () => clearTimeout(timer);
    }
  }, [location]);

  return alert;
};

export default useAlertFromLocation;