import { FAQItem } from '../types/faq';

export const FAQ_DATASET: FAQItem[] = [
  // ==========================================
  // Technology (12 items)
  // ==========================================
  {
    id: 'tech-001',
    category: 'Technology',
    question: 'How can I reset my password?',
    answer: 'You can reset your password using the Forgot Password option on the login screen. Enter your registered email address, and a secure password reset link will be sent to your inbox immediately.',
    variations: [
      'How do I reset my password?',
      'I forgot my password.',
      'I can’t remember my password.',
      'I cannot remember my password.',
      'What should I do if I lose my password?',
      'I lost my login password',
      'How to change my forgotten password',
      'Need to reset password',
      'Password recovery'
    ],
    keywords: ['password', 'reset', 'forgot', 'recover', 'login', 'credentials', 'account access']
  },
  {
    id: 'tech-002',
    category: 'Technology',
    question: 'How do I enable two-factor authentication (2FA)?',
    answer: 'Navigate to Account Settings > Security > Two-Factor Authentication. Toggle 2FA on, scan the provided QR code with an authenticator app such as Google Authenticator, and enter the 6-digit confirmation code.',
    variations: [
      'How to turn on two factor authentication?',
      'Set up 2FA',
      'Enable two-step verification',
      'How do I add two factor security to my account?',
      'Authenticator app setup',
      'Two factor auth setup'
    ],
    keywords: ['2fa', 'two-factor', 'authentication', 'security', 'authenticator', 'qr code', 'verification']
  },
  {
    id: 'tech-003',
    category: 'Technology',
    question: 'How do I clear my browser cache and cookies?',
    answer: 'In Chrome, Edge, or Firefox, press Ctrl + Shift + Delete (or Cmd + Shift + Delete on macOS). Choose "All time" for the time range, check "Cookies and other site data" and "Cached images and files", then click Clear Data.',
    variations: [
      'How can I clear cache and cookies?',
      'Delete browser cache',
      'Clear internet history and cookies',
      'How to wipe cached data',
      'Browser is loading old version of page'
    ],
    keywords: ['browser', 'cache', 'cookies', 'clear', 'history', 'chrome', 'edge', 'refresh']
  },
  {
    id: 'tech-004',
    category: 'Technology',
    question: 'Why am I locked out of my account?',
    answer: 'Accounts are temporarily locked after 5 consecutive incorrect login attempts for security protection. Please wait 15 minutes before retrying, or click "Forgot Password" to immediately unlock and reset your credentials.',
    variations: [
      'My account is locked',
      'Why is my account disabled?',
      'Account lockout error',
      'Too many failed login attempts',
      'Cannot sign in because account is blocked'
    ],
    keywords: ['locked', 'account', 'blocked', 'failed attempts', 'login lockout', 'disabled']
  },
  {
    id: 'tech-005',
    category: 'Technology',
    question: 'How do I connect to the secure VPN?',
    answer: 'Download the official VPN client from the software portal. Launch the client, enter vpn.askora.edu as the gateway address, and sign in using your institutional or company single sign-on (SSO) credentials.',
    variations: [
      'How do I use the VPN?',
      'Setup virtual private network',
      'Connect to remote VPN',
      'How to access network from home',
      'VPN client configuration'
    ],
    keywords: ['vpn', 'virtual private network', 'remote access', 'connect', 'gateway', 'sso']
  },
  {
    id: 'tech-006',
    category: 'Technology',
    question: 'What are the minimum system requirements?',
    answer: 'Our web platform requires a modern browser (Chrome 100+, Firefox 100+, Safari 15+, or Edge) on Windows 10/11, macOS 11+, or Linux. At least 4GB of RAM and a stable 5 Mbps internet connection are recommended.',
    variations: [
      'What are the requirements?',
      'What system specs do I need?',
      'Does my computer support this platform?',
      'Hardware and OS compatibility',
      'System requirements for software'
    ],
    keywords: ['requirements', 'system', 'specs', 'os', 'hardware', 'compatibility', 'browser']
  },
  {
    id: 'tech-007',
    category: 'Technology',
    question: 'How can I connect to the campus Wi-Fi network?',
    answer: 'Select the "ASKORA-Secure" wireless network on your device. When prompted, choose PEAP authentication with MSCHAPv2 and sign in using your full student or staff email and password. Accept the security certificate to finish.',
    variations: [
      'How to connect to WiFi?',
      'Campus wireless internet setup',
      'Wi-Fi password and connection',
      'Cannot connect to campus internet',
      'Wireless network login'
    ],
    keywords: ['wifi', 'wireless', 'internet', 'network', 'connect', 'campus wifi']
  },
  {
    id: 'tech-008',
    category: 'Technology',
    question: 'Where can I download required software and licenses?',
    answer: 'Visit the IT Software Distribution Portal at portal.askora.edu/software. Log in with your active student or staff account to access free educational licenses for Office 365, MATLAB, Adobe Creative Cloud, and developer tools.',
    variations: [
      'Where do I get software licenses?',
      'Download student software',
      'Free software for students',
      'How to get Office 365 and MATLAB',
      'Software download center'
    ],
    keywords: ['software', 'download', 'license', 'tools', 'office 365', 'matlab', 'portal']
  },
  {
    id: 'tech-009',
    category: 'Technology',
    question: 'How do I backup my cloud files and data?',
    answer: 'All student and staff accounts include 100GB of automated cloud storage. Sync files by installing the desktop cloud sync agent or uploading files directly via OneDrive or Google Drive linked to your institution credentials.',
    variations: [
      'How to backup my files?',
      'Cloud storage and data backup',
      'Where can I save my documents safely?',
      'How to sync files to cloud drive'
    ],
    keywords: ['backup', 'cloud', 'files', 'storage', 'onedrive', 'drive', 'data']
  },
  {
    id: 'tech-010',
    category: 'Technology',
    question: 'How do I report a software bug or technical glitch?',
    answer: 'Submit an incident ticket through the IT Helpdesk Portal or email helpdesk@askora.edu with a screenshot, the URL or application version, and the exact steps to reproduce the issue.',
    variations: [
      'Found a bug where do I report it?',
      'Technical glitch report',
      'Report system error or crash',
      'How to report an IT problem'
    ],
    keywords: ['bug', 'glitch', 'error', 'report', 'issue', 'ticket', 'helpdesk']
  },
  {
    id: 'tech-011',
    category: 'Technology',
    question: 'How do I configure my email client on mobile?',
    answer: 'Open your mobile mail client (Outlook, iOS Mail, or Gmail), select "Add Account", choose "Exchange" or "Microsoft 365", enter your institutional email, and approve the two-factor authentication prompt.',
    variations: [
      'Setup email on phone',
      'How to get student email on iPhone or Android',
      'Mobile email configuration',
      'Sync campus email to mobile app'
    ],
    keywords: ['email', 'mobile', 'phone', 'outlook', 'setup', 'exchange', 'iphone', 'android']
  },
  {
    id: 'tech-012',
    category: 'Technology',
    question: 'Is my personal data encrypted and secure?',
    answer: 'Yes. All data is encrypted in transit using TLS 1.3 encryption and at rest using AES-256 standards. We adhere to SOC 2 Type II and GDPR privacy regulations with regular third-party security audits.',
    variations: [
      'Is my data safe and encrypted?',
      'Security and privacy standards',
      'How do you protect my personal information?',
      'Encryption details'
    ],
    keywords: ['security', 'privacy', 'encrypted', 'data protection', 'aes-256', 'tls', 'gdpr']
  },

  // ==========================================
  // College & Education (12 items)
  // ==========================================
  {
    id: 'edu-001',
    category: 'College & Education',
    question: 'How do I register?',
    answer: 'Open the registration section, enter the required information and submit the form. You will receive an immediate confirmation email with your enrollment ID and student portal credentials.',
    variations: [
      'How can I register for classes?',
      'How do I register?',
      'Student registration process',
      'How to enroll as a new student',
      'Registration steps and procedure',
      'Sign up for course registration'
    ],
    keywords: ['register', 'registration', 'enroll', 'enrollment', 'admission', 'student portal', 'form']
  },
  {
    id: 'edu-002',
    category: 'College & Education',
    question: 'What are the admission requirements for new applicants?',
    answer: 'The standard requirements include completing the application form, submitting valid identification, providing official secondary school or university transcripts, and meeting minimum GPA and language proficiency benchmarks.',
    variations: [
      'What are the requirements?',
      'What do I need to get admitted?',
      'Eligibility criteria for admission',
      'Documents required for admission',
      'What qualifications do I need?'
    ],
    keywords: ['admission', 'requirements', 'eligibility', 'documents', 'transcripts', 'criteria', 'qualifications']
  },
  {
    id: 'edu-003',
    category: 'College & Education',
    question: 'How can I pay my tuition fees?',
    answer: 'Tuition fees can be paid online through the Student Financial Portal using credit card, debit card, ACH bank transfer, or recognized international wire services. Installment payment plans are also available each semester.',
    variations: [
      'How do I pay college fees?',
      'Tuition payment methods',
      'Pay semester fees online',
      'Can I pay tuition in installments?',
      'Where to pay academic fee'
    ],
    keywords: ['tuition', 'fees', 'pay', 'payment', 'installment', 'financial', 'bursar', 'bank transfer']
  },
  {
    id: 'edu-004',
    category: 'College & Education',
    question: 'How do I apply for scholarships and financial aid?',
    answer: 'Complete the Financial Aid Application form under Student Services > Scholarships before the semester priority deadline (August 1 for Fall, December 1 for Spring). Both merit-based and need-based scholarships are evaluated.',
    variations: [
      'How to get a scholarship?',
      'Financial aid application',
      'Are there scholarships for students?',
      'Scholarship eligibility and deadlines',
      'Need financial assistance for college'
    ],
    keywords: ['scholarship', 'financial aid', 'grant', 'funding', 'merit', 'assistance', 'deadline']
  },
  {
    id: 'edu-005',
    category: 'College & Education',
    question: 'What is the deadline to add or drop a course?',
    answer: 'Courses may be added or dropped without academic penalty during the first two weeks of the semester (14 calendar days from the official start date). Check the Academic Calendar for exact semester cutoff dates.',
    variations: [
      'When can I drop a class?',
      'Add drop course deadline',
      'Last date to withdraw from a subject',
      'Can I change my courses after classes start?',
      'Course adjustment deadline'
    ],
    keywords: ['add drop', 'deadline', 'course change', 'withdraw', 'academic calendar', 'schedule']
  },
  {
    id: 'edu-006',
    category: 'College & Education',
    question: 'How do I request an official academic transcript?',
    answer: 'Request official digital or physical transcripts via the Registrar Office page under Student Portal > Records > Transcripts. Electronic transcripts are processed within 24 hours, while stamped paper copies require 3 to 5 business days.',
    variations: [
      'How to get my transcripts?',
      'Request official transcript',
      'Order academic records',
      'Where can I get certified grade sheet?',
      'Transcripts delivery'
    ],
    keywords: ['transcript', 'records', 'grades', 'registrar', 'official marksheet', 'academic record']
  },
  {
    id: 'edu-007',
    category: 'College & Education',
    question: 'How can I schedule an appointment with an academic advisor?',
    answer: 'Visit the Academic Advising portal at advise.askora.edu, select your department or assigned faculty advisor, and pick an available 30-minute in-person or virtual Zoom timeslot from their calendar.',
    variations: [
      'How to meet my academic advisor?',
      'Book appointment with advisor',
      'Counseling and course advice meeting',
      'Find my college advisor',
      'Schedule advising session'
    ],
    keywords: ['advisor', 'advising', 'appointment', 'counselor', 'schedule', 'faculty', 'meeting']
  },
  {
    id: 'edu-008',
    category: 'College & Education',
    question: 'How do I replace a lost student ID card?',
    answer: 'Report the lost card immediately via the Campus Safety desk or Student Card Services portal. A replacement card can be printed at the Student Center Information Desk for a nominal fee of $15 upon showing photo ID.',
    variations: [
      'Lost student ID what to do?',
      'Replace lost campus badge',
      'How to get a new student card',
      'Student identity card replacement'
    ],
    keywords: ['id card', 'student id', 'badge', 'lost card', 'replacement', 'student center']
  },
  {
    id: 'edu-009',
    category: 'College & Education',
    question: 'What is the college attendance policy?',
    answer: 'Students are required to maintain a minimum of 75% attendance in all scheduled lectures, labs, and tutorials to be eligible to sit for final semester examinations. Documented medical excuses must be submitted within 7 days.',
    variations: [
      'What is the attendance requirement?',
      'Minimum attendance needed to pass',
      'Attendance rules and policies',
      'How many classes can I miss?'
    ],
    keywords: ['attendance', 'policy', 'absence', 'minimum attendance', 'exam eligibility', '75 percent']
  },
  {
    id: 'edu-010',
    category: 'College & Education',
    question: 'How is the Grade Point Average (GPA) calculated?',
    answer: 'GPA is calculated on a 4.0 scale by multiplying the grade points earned in each course by its credit units, summing these values across all courses, and dividing by total credit hours attempted.',
    variations: [
      'How to calculate GPA?',
      'Grading scale and GPA system',
      'What is a 4.0 GPA scale?',
      'Cumulative GPA calculation formula'
    ],
    keywords: ['gpa', 'grades', 'calculation', 'grading scale', 'cgpa', 'credits', 'marks']
  },
  {
    id: 'edu-011',
    category: 'College & Education',
    question: 'How do I apply for on-campus student housing and dorms?',
    answer: 'Submit an on-campus housing application through the Residential Life portal. Room selection opens in March for the upcoming academic year. Rooms are allocated based on year of study and application submission timestamp.',
    variations: [
      'How to apply for hostel?',
      'Campus housing and dormitory application',
      'Student accommodation registration',
      'Where do I apply for a dorm room?'
    ],
    keywords: ['housing', 'dorm', 'hostel', 'accommodation', 'residence', 'room selection']
  },
  {
    id: 'edu-012',
    category: 'College & Education',
    question: 'Where can I find the semester examination schedule?',
    answer: 'The final examination timetable is published 4 weeks prior to finals week under Student Portal > Examinations > Exam Schedule. It specifies course code, room assignment, date, and exam session time.',
    variations: [
      'When are final exams?',
      'Semester exam date sheet',
      'Where to check exam timetable?',
      'Final examination schedule'
    ],
    keywords: ['exams', 'examination', 'schedule', 'timetable', 'finals', 'date sheet']
  },

  // ==========================================
  // Products & Services (12 items)
  // ==========================================
  {
    id: 'prod-001',
    category: 'Products & Services',
    question: 'Where can I contact support?',
    answer: 'You can contact the support team through the official support contact section. We provide 24/7 assistance via live chat on our website, email at support@askora.ai, or phone at 1-800-ASKORA-0.',
    variations: [
      'Where can I contact support?',
      'How can I contact the team?',
      'Customer service contact info',
      'Reach support desk',
      'Talk to an agent',
      'How to reach human assistance',
      'Customer support phone number and email'
    ],
    keywords: ['support', 'contact', 'customer service', 'helpdesk', 'team', 'email', 'phone', 'assistance']
  },
  {
    id: 'prod-002',
    category: 'Products & Services',
    question: 'What is your refund policy?',
    answer: 'We offer a full 30-day money-back guarantee on all subscription plans and eligible products. If you are unsatisfied for any reason, request a refund via Billing Settings or email billing@askora.ai within 30 days of purchase.',
    variations: [
      'Can I get a refund?',
      'What is the refund policy?',
      'Money back guarantee',
      'How to request my money back',
      'Return and refund conditions'
    ],
    keywords: ['refund', 'money back', 'guarantee', 'return', 'billing', 'cancellation refund', '30 days']
  },
  {
    id: 'prod-003',
    category: 'Products & Services',
    question: 'How do I cancel my subscription?',
    answer: 'Go to Account Settings > Billing & Subscriptions, click "Manage Plan", and select "Cancel Subscription". You will retain active access until the end of your current billing period with zero recurring charges.',
    variations: [
      'How can I cancel subscription?',
      'Stop recurring payment',
      'Unsubscribe from service',
      'How to close subscription plan',
      'Cancel membership'
    ],
    keywords: ['cancel', 'subscription', 'unsubscribe', 'billing', 'recurring', 'membership', 'stop plan']
  },
  {
    id: 'prod-004',
    category: 'Products & Services',
    question: 'How do I update my payment and billing information?',
    answer: 'Visit Account Settings > Billing > Payment Methods. Click "Add New Card" or "Edit" to update your credit card, billing address, or preferred backup payment mechanism.',
    variations: [
      'How to update credit card info?',
      'Change billing details',
      'Update payment method',
      'New card on file',
      'Edit debit card for payment'
    ],
    keywords: ['billing', 'payment', 'credit card', 'update card', 'payment method', 'invoice address']
  },
  {
    id: 'prod-005',
    category: 'Products & Services',
    question: 'How can I track my shipment or physical order?',
    answer: 'Once your order ships, an email containing a tracking number and courier link (FedEx, UPS, or DHL) is sent. You can also view live delivery status under Orders > Track Order on your profile page.',
    variations: [
      'Where is my order?',
      'Track my package',
      'Shipping tracking status',
      'When will my order arrive?',
      'Courier tracking number'
    ],
    keywords: ['track', 'order', 'shipment', 'shipping', 'delivery', 'courier', 'package']
  },
  {
    id: 'prod-006',
    category: 'Products & Services',
    question: 'How do I download my monthly invoices and receipts?',
    answer: 'All previous invoices can be downloaded as PDF files anytime from Account Settings > Invoices & Billing History. Click the PDF download icon next to the relevant statement.',
    variations: [
      'Where can I get invoices?',
      'Download payment receipt',
      'Tax invoice PDF',
      'Billing statements and history',
      'Proof of purchase download'
    ],
    keywords: ['invoice', 'receipt', 'tax invoice', 'pdf', 'billing history', 'statement']
  },
  {
    id: 'prod-007',
    category: 'Products & Services',
    question: 'Can I extend my free trial period?',
    answer: 'Standard free trials run for 14 days without credit card obligation. If you need additional evaluation time for team approval, contact our sales support team via live chat to request a 7-day trial extension.',
    variations: [
      'How to extend trial?',
      'Can I get more trial days?',
      'Trial extension request',
      'Free trial period elongation'
    ],
    keywords: ['trial', 'free trial', 'extend', 'extension', 'evaluation period']
  },
  {
    id: 'prod-008',
    category: 'Products & Services',
    question: 'How do I upgrade or downgrade my plan?',
    answer: 'Navigate to Billing > Plans. Choose your desired plan tier (Starter, Professional, or Enterprise) and click "Switch Plan". Prorated credits or charges will be calculated and applied automatically.',
    variations: [
      'How to change my plan?',
      'Upgrade subscription tier',
      'Downgrade plan to basic',
      'Change membership level'
    ],
    keywords: ['upgrade', 'downgrade', 'plan', 'tier', 'switch plan', 'prorated']
  },
  {
    id: 'prod-009',
    category: 'Products & Services',
    question: 'What warranty is included with hardware products?',
    answer: 'All official hardware devices include a 1-year limited manufacturer warranty covering defects in materials and craftsmanship. Extended 2-year and 3-year Askora Care accidental damage protection plans are optional.',
    variations: [
      'Does this have warranty?',
      'Warranty coverage and duration',
      'How long is warranty period?',
      'Hardware repair guarantee'
    ],
    keywords: ['warranty', 'guarantee', 'hardware', 'repair', 'coverage', 'askora care']
  },
  {
    id: 'prod-010',
    category: 'Products & Services',
    question: 'How do I invite team members to my organization workspace?',
    answer: 'Go to Workspace Settings > Members & Permissions, click "Invite Member", enter their business email addresses, and assign roles such as Admin, Member, or Viewer.',
    variations: [
      'How to add team members?',
      'Invite colleagues to account',
      'User management and invitations',
      'Share workspace access with teammates'
    ],
    keywords: ['invite', 'team', 'members', 'workspace', 'organization', 'roles', 'permissions']
  },
  {
    id: 'prod-011',
    category: 'Products & Services',
    question: 'Do you offer student and non-profit discounts?',
    answer: 'Yes! We offer a 50% educational discount for active students and educators, as well as a 40% discount for registered non-profit 501(c)(3) organizations. Submit proof of verification via education@askora.ai.',
    variations: [
      'Is there a student discount?',
      'Non-profit pricing discount',
      'Educational pricing rate',
      'Do you give discount for colleges or NGOs?'
    ],
    keywords: ['discount', 'student discount', 'non-profit', 'education discount', 'special pricing']
  },
  {
    id: 'prod-012',
    category: 'Products & Services',
    question: 'How do I delete my account and personal data?',
    answer: 'To permanently delete your account and associated records, visit Account Settings > Privacy > Delete Account. Confirm with your password. All data will be purged in compliance with privacy regulations within 30 days.',
    variations: [
      'How do I delete my account?',
      'Close account permanently',
      'Remove all my data',
      'Erase profile and cancel account'
    ],
    keywords: ['delete account', 'close account', 'remove data', 'privacy', 'erase profile']
  }
];

export const CATEGORIES: Array<FAQItem['category']> = [
  'College & Education',
  'Technology',
  'Products & Services'
];

export const STARTER_SUGGESTIONS = [
  'I forgot my password. What should I do?',
  'How do I register?',
  'What are the requirements?',
  'Where can I get support?',
  'How can I contact the team?'
];
