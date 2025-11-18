
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ConsultationBot } from './components/ConsultationBot';
import { SeoAnalyzer } from './components/SeoAnalyzer';
import { BusinessTools } from './components/BusinessTools';
import { Settings } from './components/Settings';
import { StartupEligibility } from './components/StartupEligibility';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/consultant" element={<ConsultationBot />} />
          <Route path="/startup-tools" element={<StartupEligibility />} />
          <Route path="/seo" element={<SeoAnalyzer />} />
          <Route path="/tools" element={<BusinessTools />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
