import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PricingPage from "./pages/PricingPage";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import LegalCenter from "./pages/LegalCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";
import AffiliateTerms from "./pages/AffiliateTerms";
import UsagePolicy from "./pages/UsagePolicy";
import DMCATakedown from "./pages/DMCATakedown";
import ComplaintsRemoval from "./pages/ComplaintsRemoval";
import ContentProviderAgreement from "./pages/ContentProviderAgreement";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/legal" element={<LegalCenter />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/affiliate-terms" element={<AffiliateTerms />} />
          <Route path="/usage-policy" element={<UsagePolicy />} />
          <Route path="/dmca-takedown" element={<DMCATakedown />} />
          <Route path="/complaints-removal" element={<ComplaintsRemoval />} />
          <Route path="/content-provider-agreement" element={<ContentProviderAgreement />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
