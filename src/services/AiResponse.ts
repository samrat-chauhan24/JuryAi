export type AIResponse = {
  answer: string;
  risk: string;
  summary: string;
  analysis: {
    explanation?: string;
    conditions?: string[];
    risks?: string[];
  };
  references: string[];
};