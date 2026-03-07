import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import CreateOrganization from "./pages/CreateOrganization";
import CreateCreator from "./pages/CreateCreator";
import CreatorProfile from "./pages/CreatorProfile";
import CreatorLinks from "./pages/CreatorLinks";
import CreatorAnalytics from "./pages/CreatorAnalytics";
import CreatorCustomers from "./pages/CreatorCustomers";
import CreatorTransactions from "./pages/CreatorTransactions";
import Wallet from "./pages/Wallet";
import CreateLink from "./pages/CreateLink";
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
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Protected Routes */}
            <Route 
              path="/create-organization" 
              element={
                <ProtectedRoute>
                  <CreateOrganization />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-creator" 
              element={
                <ProtectedRoute>
                  <CreateCreator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/:creatorId/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/:creatorId/links" 
              element={
                <ProtectedRoute>
                  <CreatorLinks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/:creatorId/profile" 
              element={
                <ProtectedRoute>
                  <CreatorProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/:creatorId/analytics" 
              element={
                <ProtectedRoute>
                  <CreatorAnalytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/:creatorId/customers" 
              element={
                <ProtectedRoute>
                  <CreatorCustomers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/:creatorId/transactions" 
              element={
                <ProtectedRoute>
                  <CreatorTransactions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wallet" 
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/:creatorId/links/create" 
              element={
                <ProtectedRoute>
                  <CreateLink />
                </ProtectedRoute>
              } 
            />

            {/* Public Pages */}
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
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
