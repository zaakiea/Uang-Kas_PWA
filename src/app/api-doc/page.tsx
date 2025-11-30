"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Dynamic import agar Swagger UI hanya diload di client-side (mencegah error SSR)
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocPage() {
  return (
    <div className="min-h-screen bg-white">
      <SwaggerUI url="/swagger.yaml" />
    </div>
  );
}
