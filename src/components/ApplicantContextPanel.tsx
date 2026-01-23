import React from 'react';
import { TrendingUp, DollarSign, School, Users } from 'lucide-react';
import { Applicant } from '../types/applicant';
import { Institution } from '../types/institution';

interface ApplicantContextPanelProps {
  applicant: Applicant | null;
  allApplicants: Applicant[];
  institutions: Institution[];
}

interface Metric {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
  status: 'positive' | 'negative' | 'neutral' | 'warning';
  details?: React.ReactNode;
}

export default function ApplicantContextPanel({
  applicant,
  allApplicants,
  institutions
}: ApplicantContextPanelProps) {
  if (!applicant) return null;

  const getGpaPercentileByParentEd = (score: number, parentEd: string): number => {
    const sameEdLevel = allApplicants.filter(a => a.parent_ed === parentEd);
    const belowCount = sameEdLevel.filter(a => a.gpa_z < score).length;
    return (belowCount / sameEdLevel.length) * 100;
  };

  const getGpaPercentileByIncome = (score: number, income: string): number => {
    const sameIncome = allApplicants.filter(a => a.household_income === income);
    const belowCount = sameIncome.filter(a => a.gpa_z < score).length;
    return (belowCount / sameIncome.length) * 100;
  };

  const getAverageGpaByParentEd = (parentEd: string): number => {
    const sameEdLevel = allApplicants.filter(a => a.parent_ed === parentEd);
    const sum = sameEdLevel.reduce((acc, curr) => acc + curr.gpa_z, 0);
    return sum / sameEdLevel.length;
  };

  const getAverageGpaByIncome = (income: string): number => {
    const sameIncome = allApplicants.filter(a => a.household_income === income);
    const sum = sameIncome.reduce((acc, curr) => acc + curr.gpa_z, 0);
    return sum / sameIncome.length;
  };

  const getFinancialAidDetails = () => {
    if (!applicant.applied_to.length) return { value: 'low', schools: [] };

    const appliedSchools = institutions.filter(inst =>
      applicant.applied_to.includes(inst.unitid)
    );

    // Calculate median aid amount across all institutions
    const allAidAmounts = institutions
      .map(inst => inst.sum_average_amount || 0)
      .sort((a, b) => a - b);
    const medianAid = allAidAmounts[Math.floor(allAidAmounts.length / 2)];

    // Get aid details for each school
    const schools = appliedSchools.map(school => ({
      name: school.inst_name,
      aid: school.sum_average_amount || 0,
      isHigh: (school.sum_average_amount || 0) > medianAid
    }));

    // Sort schools by aid amount (highest first)
    schools.sort((a, b) => b.aid - a.aid);

    const averageAid = schools.reduce((sum, school) => sum + school.aid, 0) / schools.length;
    return {
      value: averageAid > medianAid ? 'high' : 'low',
      schools
    };
  };

  const formatIncome = (income: string): number => {
    if (income === '< 50000') return 49999;
    return parseInt(income.replace(/[^0-9]/g, ''));
  };

  const getSocioeconomicContext = (): { value: string; subtext: string } => {
    const income = formatIncome(applicant.household_income);
    const isEconomicallyDisadvantaged = applicant.household_income === '< 50000' || income < 50000;
    const povertyRate = applicant.meps_poverty_pct || 0;

    return {
      value: isEconomicallyDisadvantaged ? 'Part of High School Poverty Group' : 'Above High School Poverty Threshold',
      subtext: `High school poverty rate: ${povertyRate.toFixed(1)}%\n${applicant.name} ${isEconomicallyDisadvantaged ? 'was' : 'was NOT'} among the ${povertyRate.toFixed(1)}% from their high school in poverty`
    };
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const parentEdPercentile = getGpaPercentileByParentEd(applicant.gpa_z, applicant.parent_ed);
  const incomePercentile = getGpaPercentileByIncome(applicant.gpa_z, applicant.household_income);
  const isAboveAverageParentEd = applicant.gpa_z > getAverageGpaByParentEd(applicant.parent_ed);
  const isAboveAverageIncome = applicant.gpa_z > getAverageGpaByIncome(applicant.household_income);
  const socioeconomicContext = getSocioeconomicContext();
  const financialAid = getFinancialAidDetails();

  const metrics: Metric[] = [
    {
      label: 'GPA Z-Score vs Parent Education Group',
      value: isAboveAverageParentEd ? 'Above Average' : 'Below Average',
      subtext: `${parentEdPercentile.toFixed(1)}% within ${applicant.parent_ed} education group`,
      icon: <TrendingUp className="w-5 h-5" />,
      status: isAboveAverageParentEd ? 'positive' : 'negative'
    },
    {
      label: 'GPA Z-Score vs Income Group',
      value: isAboveAverageIncome ? 'Above Average' : 'Below Average',
      subtext: `${incomePercentile.toFixed(1)}% within ${applicant.household_income} income group`,
      icon: <Users className="w-5 h-5" />,
      status: isAboveAverageIncome ? 'positive' : 'negative'
    },
    {
      label: 'Socioeconomic Context',
      value: socioeconomicContext.value,
      subtext: socioeconomicContext.subtext,
      icon: <DollarSign className="w-5 h-5" />,
      status: applicant.household_income === '< 50000' || formatIncome(applicant.household_income) < 50000 ? 'warning' : 'neutral'
    },
    {
      label: 'Financial Aid Opportunity',
      value: financialAid.value === 'high' ? 'Above Median Aid' : 'Below Median Aid',
      icon: <School className="w-5 h-5" />,
      status: 'neutral',
      details: (
        <div className="mt-4 space-y-1">
          {financialAid.schools.map((school, index) => (
            <div
              key={index}
              className={`flex justify-between text-xs font-mono px-3 py-2 border-l-2 rounded-none transition-colors ${school.isHigh
                ? 'bg-white border-sage-400 text-slate-800'
                : 'bg-slate-50 border-slate-300 text-slate-500'
                }`}
            >
              <span className="truncate flex-1 mr-2">{school.name}</span>
              <span className="font-bold">{formatCurrency(school.aid)}</span>
            </div>
          ))}
        </div>
      )
    }
  ];

  const getStatusStyles = (status: Metric['status']) => {
    switch (status) {
      case 'positive':
        return 'bg-sage-50 border-sage-200 text-sage-800';
      case 'negative':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 p-6 mb-6 rounded-none">
      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
        <Users className="w-4 h-4" />
        {applicant.name} in Context
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-4 rounded-none border ${getStatusStyles(metric.status)} transition-colors`}
          >
            <div className="flex items-center gap-2 mb-3 opacity-80">
              {metric.icon}
              <span className="font-medium text-xs uppercase tracking-wider">{metric.label}</span>
            </div>
            <p className="text-xl font-bold font-mono">
              {metric.value}
            </p>
            {metric.subtext && (
              <p className="text-xs mt-2 opacity-80 whitespace-pre-line font-mono leading-relaxed">
                {metric.subtext}
              </p>
            )}
            {metric.details}
          </div>
        ))}
      </div>
    </div>
  );
}