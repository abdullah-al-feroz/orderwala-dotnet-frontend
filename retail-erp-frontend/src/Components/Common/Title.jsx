import React from 'react';
import { useLocation } from "react-router-dom";

const Title = (props) => {
    const location = useLocation();
    console.log(props.title);
    
    const pageTitle = props.title ?? (location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2));

    return (
        <div>
            <title>{pageTitle}</title>
        </div>
    );
};

export default Title;
