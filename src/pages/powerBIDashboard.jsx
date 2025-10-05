import React from "react";

const PowerBIDashboard = () => {
  return (
    <div style={{ height: "90vh", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
      <iframe
        title="RS Electricals Power BI Dashboard"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/groups/me/reports/96700e0c-9982-4633-bf88-ac2f255b674f/52dbfeee23810cc175e6?experience=power-bi"
        frameBorder="0"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
};

export default PowerBIDashboard;
