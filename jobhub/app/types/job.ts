export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  employees: string;
  experience: string;
  posted: string;
  applicants: number;
  description: string;
  isUrgent?: boolean;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  companyInfo: {
    about: string;
    website: string;
    employees: string;
    founded: string;
    industry: string;
  };
}

export interface JobsMap {
  [key: string]: Job;
} 