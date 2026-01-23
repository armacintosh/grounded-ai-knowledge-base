import { useEffect, useRef } from 'react';
import { Applicant } from '../types/applicant';
import { Brain } from 'lucide-react';

interface ApplicantListProps {
  applicants: Applicant[];
  selectedApplicant: Applicant | null;
  onApplicantSelect: (applicant: Applicant) => void;
}

export default function ApplicantList({
  applicants,
  selectedApplicant,
  onApplicantSelect
}: ApplicantListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedApplicant) return;

      const currentIndex = applicants.findIndex(a => a.applicant_id === selectedApplicant.applicant_id);
      if (currentIndex === -1) return;

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onApplicantSelect(applicants[currentIndex - 1]);
      } else if (e.key === 'ArrowRight' && currentIndex < applicants.length - 1) {
        onApplicantSelect(applicants[currentIndex + 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [applicants, selectedApplicant, onApplicantSelect]);

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto pb-4 px-5 hide-scrollbar"
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="flex gap-4">
        {applicants.map((applicant) => (
          <button
            key={applicant.applicant_id}
            onClick={() => onApplicantSelect(applicant)}
            className={`
              flex-none w-64 p-4 transition-all rounded-none text-left relative group
              ${selectedApplicant?.applicant_id === applicant.applicant_id
                ? 'bg-white border-2 border-sage-600 shadow-md ring-1 ring-sage-600'
                : 'bg-white border border-slate-200 hover:border-sage-400 hover:shadow-sm'
              }
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-slate-900 truncate font-sans text-sm">
                  {applicant.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wide">
                  {applicant.applied_to.length} schools
                </p>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 ${selectedApplicant?.applicant_id === applicant.applicant_id ? 'bg-sage-50 text-sage-700' : 'bg-slate-50 text-slate-600'}`}>
                <Brain className="w-3 h-3" />
                <span className="font-bold text-xs font-mono">
                  {applicant.gpa_z.toFixed(2)}
                </span>
              </div>
            </div>
            {selectedApplicant?.applicant_id === applicant.applicant_id && (
              <div className="absolute top-0 left-0 w-1 h-full bg-sage-600"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}