
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import TokenTabs from "@/components/tokens/TokenTabs";
import { TokenProvider } from "@/contexts/TokenContext";

const TokenManagement = () => {
  return (
    <PageLayout title="Token Management">
      <TokenProvider>
        <TokenTabs />
      </TokenProvider>
    </PageLayout>
  );
};

export default TokenManagement;
