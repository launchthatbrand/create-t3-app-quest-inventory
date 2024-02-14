import DemoComponent from "../_components/DemoComponent";
import React from "react";

function DemoPage() {
  return (
    <div>
      <p>DemoPage</p>
      <DemoComponent demoProp="demoProp" />
    </div>
  );
}

export default DemoPage;
