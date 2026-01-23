import { User } from 'lucide-react';
import { Applicant } from '../types/applicant';

interface ApplicantDetailsPanelProps {
  applicant: Applicant | null;
}

export default function ApplicantDetailsPanel({ applicant }: ApplicantDetailsPanelProps) {
  if (!applicant) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <User className="w-12 h-12 mx-auto mb-4" />
          <p>Select an applicant to view details</p>
        </div>
      </div>
    );
  }

  const formatPercent = (value: number | null): string => {
    if (value === null || isNaN(value)) return 'N/A';
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="h-full overflow-y-auto p-0 bg-white">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-sage-100 text-sage-700">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">{applicant.name}</h2>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Applicant Profile</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <Section title="Applicant Details">
          <InfoRow label="GPA" value={applicant.gpa_z.toFixed(2)} />
          <InfoRow label="Parent Education" value={applicant.parent_ed} />
          <InfoRow label="Household Income" value={applicant.household_income} />
        </Section>

        <Section title="High School Information">
          <InfoRow
            label="High School Poverty"
            value={formatPercent(applicant.meps_poverty_pct || 0)}
          />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-sage-600 mb-3 border-b border-sage-100 pb-1">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-baseline group hover:bg-slate-50 p-1 -mx-1 transition-colors">
      <span className="text-sm text-slate-500 font-normal">{label}</span>
      <span className="font-mono text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}