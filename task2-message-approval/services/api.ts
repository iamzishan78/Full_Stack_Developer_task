import { Message } from '../types';

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'John Smith',
    subject: 'Q1 Budget Review Meeting',
    aiSummary: 'Request to schedule a budget review meeting for Q1 financials. Proposes next Tuesday at 2 PM. Requires attendance from finance team leads.',
    timestamp: '2024-03-14T09:30:00Z',
  },
  {
    id: '2',
    sender: 'Sarah Johnson',
    subject: 'Project Alpha - Status Update',
    aiSummary: 'Project Alpha is 80% complete. Minor delays in testing phase due to resource constraints. Requests approval for 2-day extension.',
    timestamp: '2024-03-14T10:15:00Z',
  },
  {
    id: '3',
    sender: 'Mike Chen',
    subject: 'New Client Onboarding Request',
    aiSummary: 'New enterprise client (TechCorp Inc.) requesting onboarding. High-value contract worth $500K annually. Needs approval to proceed with setup.',
    timestamp: '2024-03-14T11:00:00Z',
  },
  {
    id: '4',
    sender: 'Emily Davis',
    subject: 'Remote Work Policy Update',
    aiSummary: 'HR proposing updated remote work policy allowing 3 days WFH per week. Requires management approval before company-wide announcement.',
    timestamp: '2024-03-14T11:45:00Z',
  },
  {
    id: '5',
    sender: 'David Wilson',
    subject: 'Security Audit Results',
    aiSummary: 'Quarterly security audit complete. 2 medium-priority vulnerabilities found. Remediation plan attached. Requesting approval to allocate dev resources.',
    timestamp: '2024-03-14T14:20:00Z',
  },
];

export const fetchMessages = (): Promise<Message[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockMessages);
    }, 800);
  });
};
