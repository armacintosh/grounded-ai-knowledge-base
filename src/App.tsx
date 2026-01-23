import { useState, useEffect } from 'react';
import Map from './components/Map';
import DetailsPanel from './components/DetailsPanel';
import ApplicantDetailsPanel from './components/ApplicantDetailsPanel';
import SearchFilterPanel from './components/SearchFilterPanel';
import TabNavigation from './components/TabNavigation';
import ApplicantList from './components/ApplicantList';
import ApplicantContextPanel from './components/ApplicantContextPanel';
import DataTable from './components/DataTable';
import Chat from './components/Chat';
import Footer from './components/Footer';
import { Institution } from './types/institution';
import { Applicant } from './types/applicant';
import { cleanInstitutionData } from './utils/dataProcessing';
import { Loader2, AlertCircle, Info, Bot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'colleges' | 'applicants' | 'chat'>('colleges');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<Institution[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [hoveredInstitution, setHoveredInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/institutions.json'),
      fetch('/applicants.json')
    ])
      .then(([institutionsRes, applicantsRes]) =>
        Promise.all([institutionsRes.json(), applicantsRes.json()])
      )
      .then(([institutionsData, applicantsData]) => {
        const validData = institutionsData.filter((inst: Institution) =>
          inst.admit_rate !== null &&
          !isNaN(inst.admit_rate) &&
          inst.admit_rate > 0
        );
        const cleanedData = cleanInstitutionData(validData);
        setInstitutions(cleanedData);
        setFilteredInstitutions(cleanedData);
        setApplicants(applicantsData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getApplicantInstitutions = (applicant: Applicant): Institution[] => {
    return institutions.filter(inst =>
      applicant.applied_to.includes(inst.unitid)
    );
  };

  const handleViewDetails = (institution: Institution) => {
    setSelectedInstitution(institution);
    setActiveTab('colleges');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans rounded-none">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        {activeTab === 'colleges' ? (
          <>
            <div className="bg-amber-50 border-b border-amber-100 p-4 rounded-none">
              <div className="flex items-center gap-3 text-amber-800 max-w-screen-2xl mx-auto">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">
                  <span className="font-medium">Demo Site:</span> This is a demonstration interface. Data obtained from the{' '}
                  <a
                    href="https://educationdata.urban.org/documentation/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-900 underline hover:text-amber-700"
                  >
                    URBAN Institute Education Data Portal
                  </a>
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex-1 flex flex-col">
              <SearchFilterPanel
                institutions={institutions}
                onFilterChange={setFilteredInstitutions}
              />
              <div className="flex flex-1 mt-4 gap-6 h-[600px]">
                <div className="w-[70%] relative overflow-hidden shadow-lg border border-slate-200">
                  <Map
                    institutions={filteredInstitutions}
                    onInstitutionSelect={setSelectedInstitution}
                  />
                </div>
                <div className="w-[30%] bg-white shadow-lg overflow-y-auto border border-slate-200">
                  <DetailsPanel institution={selectedInstitution || hoveredInstitution} />
                </div>
              </div>
              <div className="mt-6">
                <DataTable
                  data={filteredInstitutions}
                  onRowHover={setHoveredInstitution}
                />
              </div>
            </div>
          </>
        ) : activeTab === 'applicants' ? (
          <>
            <div className="bg-blue-50 border-b border-blue-100 p-4 rounded-none">
              <div className="flex items-center gap-3 text-blue-800 max-w-screen-2xl mx-auto">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">
                  <span className="font-medium">Note:</span> This interface uses synthetic data for demonstration purposes. All student scores, demographics, and other personal information are simulated.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 pt-4 flex-1 flex flex-col">
              <ApplicantList
                applicants={applicants}
                selectedApplicant={selectedApplicant}
                onApplicantSelect={setSelectedApplicant}
              />
              <div className="px-5 mt-4 flex-1 flex flex-col">
                {selectedApplicant && (
                  <ApplicantContextPanel
                    applicant={selectedApplicant}
                    allApplicants={applicants}
                    institutions={institutions}
                  />
                )}
                <div className="flex flex-1 gap-6 min-h-[500px] mb-6">
                  <div className="w-[70%] relative overflow-hidden shadow-lg border border-slate-200">
                    <Map
                      institutions={selectedApplicant ? getApplicantInstitutions(selectedApplicant) : []}
                      onInstitutionSelect={setSelectedInstitution}
                      onViewDetails={handleViewDetails}
                    />
                  </div>
                  <div className="w-[30%] bg-white shadow-lg overflow-y-auto border border-slate-200">
                    <ApplicantDetailsPanel applicant={selectedApplicant} />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-purple-50 border-b border-purple-100 p-4 rounded-none">
              <div className="flex items-start gap-3 text-purple-800 max-w-screen-2xl mx-auto">
                <Bot className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Demo Site:</span> The chat is powered by <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="text-purple-900 underline hover:text-purple-700">Gemini</a> and a Custom GPT that uses a knowledge graph based on the{' '}
                    <a
                      href="https://educationdata.urban.org/documentation/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-900 underline hover:text-purple-700"
                    >
                      URBAN Institute Education Data Documentation
                    </a>.
                  </p>
                  <p className="text-xs opacity-90">
                    Learn more about <a href="https://www.databricks.com/blog/building-improving-and-deploying-knowledge-graph-rag-systems-databricks" target="_blank" rel="noopener noreferrer" className="text-purple-900 underline hover:text-purple-700">Building, Improving, and Deploying Knowledge Graph RAG Systems</a>.
                  </p>
                </div>
              </div>
            </div>
            <Chat />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}