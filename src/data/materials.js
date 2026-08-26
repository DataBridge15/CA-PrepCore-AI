const pdf = (title, pdfPath, pages = null) => ({
  title,
  pdfPath,
  pages,
  downloadName: `${title}.pdf`,
})

const unit = (id, title, pdfPath, pages = null) => ({
  id,
  title,
  ...pdf(title, pdfPath, pages),
})

const chapter = ({
  id,
  title,
  pdfPath,
  pages,
  units = [],
  annexure = null,
  overview = [],
  learningOutcomes = [],
  sections = [],
  quickRevision = [],
  practiceQuestions = [],
  theoryQuestions = [],
}) => ({
  id,
  title,
  ...(pdfPath ? pdf(title, pdfPath, pages) : {}),
  units,
  annexure,
  overview,
  learningOutcomes,
  sections,
  quickRevision,
  practiceQuestions,
  theoryQuestions,
})


// ============================================================
// CA INTERMEDIATE â€” ADVANCED ACCOUNTING
// ============================================================

const chapter1Material = chapter({
  id: 'chapter-1',
  title: 'Introduction to Accounting Standards',
  pdfPath:
    '/materials/advanced-accounting/module-1/chapter-1/introduction-to-accounting-standards.pdf',
  pages: 36,
  overview: [
    'Introduction, objectives and benefits of Accounting Standards',
    'Accounting Standards setting process',
    'List and status of Accounting Standards in India',
    'Need for convergence towards global standards',
    'International Financial Reporting Standards (IFRS)',
    'Convergence to IFRS in India',
    'Concept of Indian Accounting Standards (Ind AS)',
    'Carve-outs and Carve-ins',
    'Roadmap for implementation of Ind AS',
  ],
  learningOutcomes: [
    'Understand the concept of Accounting Standards.',
    'Understand the objectives and benefits of Accounting Standards.',
    'Understand the Accounting Standards setting process.',
    'Understand the status of Accounting Standards in India.',
    'Recognise the international accounting standard authorities.',
    'Understand the emergence of IFRS as global standards.',
    'Differentiate between adoption and convergence.',
    'Understand the process of convergence of IFRS in India.',
    'Understand the concept of Ind AS.',
    'Understand the concept and objectives of carve-outs and carve-ins.',
  ],
  quickRevision: [
    'Accounting Standards deal with recognition, measurement, presentation and disclosure.',
    'Major benefits include standardisation, additional disclosures and comparability.',
    'The standard-setting process described by the material has eight steps.',
    'Accounting Standards cannot override applicable statute.',
    'IASC was replaced by IASB in 2001.',
    'IAS generally refer to standards issued by IASC up to 31 March 2001.',
    'IFRS are issued by IASB from 1 April 2001 onward.',
    'Adoption means directly using IFRS as issued by IASB.',
    'Convergence means aligning national standards with IFRS with necessary modifications.',
    'India follows convergence with IFRS rather than direct adoption.',
    'Carve-outs are deviations made for the Indian context.',
    'Carve-ins are additional requirements or guidance included over and above IFRS.',
    'Ind AS is substantially converged with IFRS.',
    'Ind AS numbering generally corresponds to IFRS number plus 100.',
  ],
})

const chapter2Material = chapter({
  id: 'chapter-2',
  title: 'Framework for Preparation and Presentation of Financial Statements',
  pdfPath:
    '/materials/advanced-accounting/module-1/chapter-2/framework-for-preparation-and-presentation-of-financial-statements.pdf',
  pages: 42,
  overview: [
    'Meaning and significance of the Framework for Preparation and Presentation of Financial Statements',
    'Objectives and users of Financial Statements',
    'Qualitative characteristics of Financial Statements',
    'Recognition and measurement of elements of Financial Statements',
    'Concepts of capital, capital maintenance and determination of profit',
  ],
  learningOutcomes: [
    'Understand the meaning and significance of Framework for the Preparation and Presentation of Financial Statements.',
    'Learn the objectives of Financial Statements.',
    'Understand qualitative characteristics of Financial Statements.',
    'Comprehend recognition and measurement of elements of Financial Statements.',
    'Know concepts of capital, capital maintenance and determination of profit.',
  ],
  quickRevision: [
    'The Framework was issued by ICAI ASB in July 2000.',
    'The Framework is not itself an Accounting Standard.',
    'If the Framework conflicts with an Accounting Standard, the Accounting Standard prevails.',
    'A complete set of financial statements normally includes Balance Sheet, Statement of Profit and Loss, Cash Flow Statement and notes.',
    'The objective of financial statements is to provide information useful for economic decisions.',
    'The three fundamental accounting assumptions are Going Concern, Accrual and Consistency.',
    'The four qualitative characteristics are Understandability, Relevance, Reliability and Comparability.',
    'The five elements are Asset, Liability, Equity, Income and Expenses.',
    'The four measurement bases are Historical Cost, Current Cost, Realisable Value and Present Value.',
    'Capital refers to the net assets of a business.',
  ],
})


// ============================================================
// MATERIALS
// ============================================================

const materials = {
  // ==========================================================
  // CA INTERMEDIATE
  // ==========================================================

  'CA Intermediate': {
    'advanced-accounting': {
      'Introduction to Accounting Standards': chapter1Material,

      'Framework for Preparation and Presentation of Financial Statements':
        chapter2Material,

      'Applicability of Accounting Standards': chapter({
        id: 'chapter-3',
        title: 'Applicability of Accounting Standards',
        pdfPath:
          '/materials/advanced-accounting/module-1/chapter-3/applicability-of-accounting-standards.pdf',
        pages: 24,
      }),

      'Presentation & Disclosures Based Accounting Standards': chapter({
        id: 'chapter-4',
        title: 'Presentation & Disclosures Based Accounting Standards',
        units: [
          unit(
            'unit-1',
            'AS 1 â€“ Disclosure of Accounting Policies',
            '/materials/advanced-accounting/module-1/chapter-4/unit-1/as-1-disclosure-of-accounting-policies.pdf'
          ),
          unit(
            'unit-2',
            'AS 3 â€“ Cash Flow Statement',
            '/materials/advanced-accounting/module-1/chapter-4/unit-2/as-3-cash-flow-statement.pdf'
          ),
          unit(
            'unit-3',
            'AS 17 â€“ Segment Reporting',
            '/materials/advanced-accounting/module-1/chapter-4/unit-3/as-17-segment-reporting.pdf'
          ),
          unit(
            'unit-4',
            'AS 18 â€“ Related Party Disclosures',
            '/materials/advanced-accounting/module-1/chapter-4/unit-4/as-18-related-party-disclosures.pdf'
          ),
          unit(
            'unit-5',
            'AS 20 â€“ Earnings Per Share',
            '/materials/advanced-accounting/module-1/chapter-4/unit-5/as-20-earnings-per-share.pdf'
          ),
          unit(
            'unit-6',
            'AS 24 â€“ Discontinuing Operations',
            '/materials/advanced-accounting/module-1/chapter-4/unit-6/as-24-discontinuing-operations.pdf'
          ),
          unit(
            'unit-7',
            'AS 25 â€“ Interim Financial Reporting',
            '/materials/advanced-accounting/module-1/chapter-4/unit-7/as-25-interim-financial-reporting.pdf'
          ),
        ],
      }),

      'Assets Based Accounting Standards': chapter({
        id: 'chapter-5',
        title: 'Assets Based Accounting Standards',
        units: [
          unit(
            'unit-1',
            'AS 2 â€“ Valuation of Inventory',
            '/materials/advanced-accounting/module-2/chapter-5/unit-1/as-2-valuation-of-inventory.pdf'
          ),
          unit(
            'unit-2',
            'AS 10 â€“ Property, Plant and Equipment',
            '/materials/advanced-accounting/module-2/chapter-5/unit-2/as-10-property-plant-and-equipment.pdf'
          ),
          unit(
            'unit-3',
            'AS 13 â€“ Accounting for Investments',
            '/materials/advanced-accounting/module-2/chapter-5/unit-3/as-13-accounting-for-investments.pdf'
          ),
          unit(
            'unit-4',
            'AS 16 â€“ Borrowing Costs',
            '/materials/advanced-accounting/module-2/chapter-5/unit-4/as-16-borrowing-costs.pdf'
          ),
          unit(
            'unit-5',
            'AS 19 â€“ Leases',
            '/materials/advanced-accounting/module-2/chapter-5/unit-5/as-19-leases.pdf'
          ),
          unit(
            'unit-6',
            'AS 26 â€“ Intangible Assets',
            '/materials/advanced-accounting/module-2/chapter-5/unit-6/as-26-intangible-assets.pdf'
          ),
          unit(
            'unit-7',
            'AS 28 â€“ Impairment of Assets',
            '/materials/advanced-accounting/module-2/chapter-5/unit-7/as-28-impairment-of-assets.pdf'
          ),
        ],
      }),

      'Liabilities Based Accounting Standards': chapter({
        id: 'chapter-6',
        title: 'Liabilities Based Accounting Standards',
        units: [
          unit(
            'unit-1',
            'AS 15 â€“ Employee Benefits',
            '/materials/advanced-accounting/module-2/chapter-6/unit-1/as-15-employee-benefits.pdf'
          ),
          unit(
            'unit-2',
            'AS 29 (Revised) â€“ Provisions, Contingent Liabilities and Contingent Assets',
            '/materials/advanced-accounting/module-2/chapter-6/unit-2/as-29-revised-provisions-contingent-liabilities-and-contingent-assets.pdf'
          ),
        ],
      }),

      'Accounting Standards Based on Items Impacting Financial Statement':
        chapter({
          id: 'chapter-7',
          title:
            'Accounting Standards Based on Items Impacting Financial Statement',
          units: [
            unit(
              'unit-1',
              'AS 4 â€“ Contingencies and Events Occurring after the Balance Sheet Date',
              '/materials/advanced-accounting/module-2/chapter-7/unit-1/as-4-contingencies-and-events-occurring-after-the-balance-sheet-date.pdf'
            ),
            unit(
              'unit-2',
              'AS 5 â€“ Net Profit or Loss for the Period, Prior Period Items and Changes in Accounting Policies',
              '/materials/advanced-accounting/module-2/chapter-7/unit-2/as-5-net-profit-or-loss-for-the-period-prior-period-items-and-changes-in-accounting-policies.pdf'
            ),
            unit(
              'unit-3',
              'AS 11 â€“ The Effects of Changes in Foreign Exchange Rates',
              '/materials/advanced-accounting/module-2/chapter-7/unit-3/as-11-the-effects-of-changes-in-foreign-exchange-rates.pdf'
            ),
            unit(
              'unit-4',
              'AS 22 â€“ Accounting for Taxes on Income',
              '/materials/advanced-accounting/module-2/chapter-7/unit-4/as-22-accounting-for-taxes-on-income.pdf'
            ),
          ],
        }),

      'Revenue Based Accounting Standards': chapter({
        id: 'chapter-8',
        title: 'Revenue Based Accounting Standards',
        units: [
          unit(
            'unit-1',
            'AS 7 â€“ Construction Contracts',
            '/materials/advanced-accounting/module-2/chapter-8/unit-1/as-7-construction-contracts.pdf'
          ),
          unit(
            'unit-2',
            'AS 9 â€“ Revenue Recognition',
            '/materials/advanced-accounting/module-2/chapter-8/unit-2/as-9-revenue-recognition.pdf'
          ),
        ],
      }),

      'Other Accounting Standards': chapter({
        id: 'chapter-9',
        title: 'Other Accounting Standards',
        units: [
          unit(
            'unit-1',
            'AS 12 â€“ Accounting for Government Grants',
            '/materials/advanced-accounting/module-2/chapter-9/unit-1/as-12-accounting-for-government-grants.pdf'
          ),
          unit(
            'unit-2',
            'AS 14 â€“ Accounting for Amalgamations',
            '/materials/advanced-accounting/module-2/chapter-9/unit-2/as-14-accounting-for-amalgamations.pdf'
          ),
        ],
      }),

      'Accounting Standards for Consolidated Financial Statement': chapter({
        id: 'chapter-10',
        title: 'Accounting Standards for Consolidated Financial Statement',
        units: [
          unit(
            'unit-1',
            'AS 21 â€“ Consolidated Financial Statements',
            '/materials/advanced-accounting/module-2/chapter-10/unit-1/as-21-consolidated-financial-statements.pdf'
          ),
          unit(
            'unit-2',
            'AS 23 â€“ Accounting for Investments in Associates in Consolidated Financial Statements',
            '/materials/advanced-accounting/module-2/chapter-10/unit-2/as-23-accounting-for-investments-in-associates-in-consolidated-financial-statements.pdf'
          ),
          unit(
            'unit-3',
            'AS 27 â€“ Financial Reporting of Interests in Joint Ventures',
            '/materials/advanced-accounting/module-2/chapter-10/unit-3/as-27-financial-reporting-of-interests-in-joint-ventures.pdf'
          ),
        ],
      }),

      'Financial Statements of Companies': chapter({
        id: 'chapter-11',
        title: 'Financial Statements of Companies',
        units: [
          unit(
            'unit-1',
            'Preparation of Financial Statements',
            '/materials/advanced-accounting/module-3/chapter-11/unit-1/preparation-of-financial-statements.pdf'
          ),
          unit(
            'unit-2',
            'Cash Flow Statement',
            '/materials/advanced-accounting/module-3/chapter-11/unit-2/cash-flow-statement.pdf'
          ),
        ],
        annexure: pdf(
          'Annexure',
          '/materials/advanced-accounting/module-3/chapter-11/annexure/annexure.pdf'
        ),
      }),

      'Buyback of Securities': chapter({
        id: 'chapter-12',
        title: 'Buyback of Securities',
        pdfPath:
          '/materials/advanced-accounting/module-3/chapter-12/buyback-of-securities.pdf',
      }),

      'Amalgamation of Companies': chapter({
        id: 'chapter-13',
        title: 'Amalgamation of Companies',
        pdfPath:
          '/materials/advanced-accounting/module-3/chapter-13/amalgamation-of-companies.pdf',
      }),

      'Internal Reconstruction': chapter({
        id: 'chapter-14',
        title: 'Internal Reconstruction',
        pdfPath:
          '/materials/advanced-accounting/module-3/chapter-14/internal-reconstruction.pdf',
      }),

      'Accounting for Branches including Foreign Branches': chapter({
        id: 'chapter-15',
        title: 'Accounting for Branches including Foreign Branches',
        pdfPath:
          '/materials/advanced-accounting/module-3/chapter-15/accounting-for-branches-including-foreign-branches.pdf',
      }),
    },
  },


  // ==========================================================
  // CA FOUNDATION â€” ACCOUNTING
  // ==========================================================

  'CA Foundation': {
    'foundation-accounting': {

      'Theoretical Framework': chapter({
        id: 'chapter-1',
        title: 'Theoretical Framework',
        units: [
          unit(
            'unit-1',
            'Meaning and Scope of Accounting',
            '/materials/CA Foundation/accounting/module-1/chapter-1/unit-1/meaning-and-scope-of-accounting.pdf'
          ),
          unit(
            'unit-2',
            'Accounting Concepts, Principles and Conventions',
            '/materials/CA Foundation/accounting/module-1/chapter-1/unit-2/accounting-concepts-principles-and-conventions.pdf'
          ),
          unit(
            'unit-3',
            'Capital and Revenue Expenditures and Receipts',
            '/materials/CA Foundation/accounting/module-1/chapter-1/unit-3/capital-and-revenue-expenditures-and-receipts.pdf'
          ),
          unit(
            'unit-4',
            'Contingent Assets and Contingent Liabilities',
            '/materials/CA Foundation/accounting/module-1/chapter-1/unit-4/contingent-assets-and-contingent-liabilities.pdf'
          ),
          unit(
            'unit-5',
            'Accounting Policies',
            '/materials/CA Foundation/accounting/module-1/chapter-1/unit-5/accounting-policies.pdf'
          ),
          unit(
            'unit-6',
            'Accounting as a Measurement Discipline â€“ Valuation Principles, Accounting Estimates',
            '/materials/CA Foundation/accounting/module-1/chapter-1/unit-6/accounting-as-a-measurement-discipline-valuation-principles-accounting-estimates.pdf'
          ),
          unit(
            'unit-7',
            'Accounting Standards',
            '/materials/CA Foundation/accounting/module-1/chapter-1/unit-7/accounting-standards.pdf'
          ),
        ],
      }),

      'Accounting Process': chapter({
        id: 'chapter-2',
        title: 'Accounting Process',
        units: [
          unit(
            'unit-1',
            'Basic Accounting Procedures â€“ Journal Entries',
            '/materials/CA Foundation/accounting/module-1/chapter-2/unit-1/basic-accounting-procedures-journal-entries.pdf'
          ),
          unit(
            'unit-2',
            'Ledgers',
            '/materials/CA Foundation/accounting/module-1/chapter-2/unit-2/ledgers.pdf'
          ),
          unit(
            'unit-3',
            'Trial Balance',
            '/materials/CA Foundation/accounting/module-1/chapter-2/unit-3/trial-balance.pdf'
          ),
          unit(
            'unit-4',
            'Subsidiary Books',
            '/materials/CA Foundation/accounting/module-1/chapter-2/unit-4/subsidiary-books.pdf'
          ),
          unit(
            'unit-5',
            'Cash Book',
            '/materials/CA Foundation/accounting/module-1/chapter-2/unit-5/cash-book.pdf'
          ),
          unit(
            'unit-6',
            'Rectification of Errors',
            '/materials/CA Foundation/accounting/module-1/chapter-2/unit-6/rectification-of-errors.pdf'
          ),
        ],
      }),

      'Bank Reconciliation Statement': chapter({
        id: 'chapter-3',
        title: 'Bank Reconciliation Statement',
        pdfPath:
          '/materials/CA Foundation/accounting/module-1/chapter-3/bank-reconciliation-statement.pdf',
      }),

      'Inventories': chapter({
        id: 'chapter-4',
        title: 'Inventories',
        pdfPath:
          '/materials/CA Foundation/accounting/module-1/chapter-4/inventories.pdf',
      }),

      'Depreciation and Amortisation': chapter({
        id: 'chapter-5',
        title: 'Depreciation and Amortisation',
        pdfPath:
          '/materials/CA Foundation/accounting/module-1/chapter-5/depreciation-and-amortisation.pdf',
      }),

      'Bills of Exchange and Promissory Notes': chapter({
        id: 'chapter-6',
        title: 'Bills of Exchange and Promissory Notes',
        pdfPath:
          '/materials/CA Foundation/accounting/module-1/chapter-6/bills-of-exchange-and-promissory-notes.pdf',
      }),

      'Preparation of Final Accounts of Sole Proprietors': chapter({
        id: 'chapter-7',
        title: 'Preparation of Final Accounts of Sole Proprietors',
        units: [
          unit(
            'unit-1',
            'Final Accounts of Non-Manufacturing Entities',
            '/materials/CA Foundation/accounting/module-1/chapter-7/unit-1/final-accounts-of-non-manufacturing-entities.pdf'
          ),
          unit(
            'unit-2',
            'Final Accounts of Manufacturing Entities',
            '/materials/CA Foundation/accounting/module-1/chapter-7/unit-2/final-accounts-of-manufacturing-entities.pdf'
          ),
        ],
        annexure: pdf(
          'Annexure-I',
          '/materials/CA Foundation/accounting/module-1/chapter-7/annexure-1/annexure-1.pdf'
        ),
      }),

      'Financial Statements of Not-for-Profit Organisations': chapter({
        id: 'chapter-8',
        title: 'Financial Statements of Not-for-Profit Organisations',
        pdfPath:
          '/materials/CA Foundation/accounting/module-2/chapter-8/financial-statements-of-not-for-profit-organisations.pdf',
      }),

      'Accounts from Incomplete Records': chapter({
        id: 'chapter-9',
        title: 'Accounts from Incomplete Records',
        pdfPath:
          '/materials/CA Foundation/accounting/module-2/chapter-9/accounts-from-incomplete-records.pdf',
      }),

      'Partnership and LLP Accounts': chapter({
        id: 'chapter-10',
        title: 'Partnership and LLP Accounts',
        units: [
          unit(
            'unit-1',
            'Introduction to Partnership Accounts',
            '/materials/CA Foundation/accounting/module-2/chapter-10/unit-1/introduction-to-partnership-accounts.pdf'
          ),
          unit(
            'unit-2',
            'Treatment of Goodwill in Partnership Accounts',
            '/materials/CA Foundation/accounting/module-2/chapter-10/unit-2/treatment-of-goodwill-in-partnership-accounts.pdf'
          ),
          unit(
            'unit-3',
            'Admission of a New Partner',
            '/materials/CA Foundation/accounting/module-2/chapter-10/unit-3/admission-of-a-new-partner.pdf'
          ),
          unit(
            'unit-4',
            'Retirement of a Partner',
            '/materials/CA Foundation/accounting/module-2/chapter-10/unit-4/retirement-of-a-partner.pdf'
          ),
          unit(
            'unit-5',
            'Death of a Partner',
            '/materials/CA Foundation/accounting/module-2/chapter-10/unit-5/death-of-a-partner.pdf'
          ),
          unit(
            'unit-6',
            'Dissolution of Partnership Firms and LLPs',
            '/materials/CA Foundation/accounting/module-2/chapter-10/unit-6/dissolution-of-partnership-firms-and-llps.pdf'
          ),
        ],
        annexure: pdf(
          'Annexure-II',
          '/materials/CA Foundation/accounting/module-2/chapter-10/annexure-2/annexure-2.pdf'
        ),
      }),

      'Company Accounts': chapter({
        id: 'chapter-11',
        title: 'Company Accounts',
        units: [
          unit(
            'unit-1',
            'Introduction to Company Accounts',
            '/materials/CA Foundation/accounting/module-2/chapter-11/unit-1/introduction-to-company-accounts.pdf'
          ),
          unit(
            'unit-2',
            'Issue, Forfeiture and Re-Issue of Shares',
            '/materials/CA Foundation/accounting/module-2/chapter-11/unit-2/issue-forfeiture-and-re-issue-of-shares.pdf'
          ),
          unit(
            'unit-3',
            'Issue of Debentures',
            '/materials/CA Foundation/accounting/module-2/chapter-11/unit-3/issue-of-debentures.pdf'
          ),
          unit(
            'unit-4',
            'Accounting for Bonus Issue and Right Issue',
            '/materials/CA Foundation/accounting/module-2/chapter-11/unit-4/accounting-for-bonus-issue-and-right-issue.pdf'
          ),
          unit(
            'unit-5',
            'Redemption of Preference Shares',
            '/materials/CA Foundation/accounting/module-2/chapter-11/unit-5/redemption-of-preference-shares.pdf'
          ),
          unit(
            'unit-6',
            'Redemption of Debentures',
            '/materials/CA Foundation/accounting/module-2/chapter-11/unit-6/redemption-of-debentures.pdf'
          ),
        ],
      }),
    },

    'foundation-qa': {
      'Ratio and Proportion, Indices, Logarithms': chapter({
        id: 'chapter-1',
        title: 'Ratio and Proportion, Indices, Logarithms',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-1/ratio-and-proportion-indices-logarithms.pdf',
      }),

      'Equations': chapter({
        id: 'chapter-2',
        title: 'Equations',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-2/equations.pdf',
      }),

      'Linear Inequalities': chapter({
        id: 'chapter-3',
        title: 'Linear Inequalities',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-3/linear-inequalities.pdf',
      }),

      'Mathematics of Finance': chapter({
        id: 'chapter-4',
        title: 'Mathematics of Finance',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-4/mathematics-of-finance.pdf',
      }),

      'Basic Concepts of Permutations and Combinations': chapter({
        id: 'chapter-5',
        title: 'Basic Concepts of Permutations and Combinations',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-5/basic-concepts-of-permutations-and-combinations.pdf',
      }),

      'Sequence and Series â€“ Arithmetic and Geometric Progressions': chapter({
        id: 'chapter-6',
        title: 'Sequence and Series â€“ Arithmetic and Geometric Progressions',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-6/sequence-and-series-arithmetic-and-geometric-progressions.pdf',
      }),

      'Sets, Relations and Functions, Basics of Limits and Continuity functions': chapter({
        id: 'chapter-7',
        title: 'Sets, Relations and Functions, Basics of Limits and Continuity functions',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-7/sets-relations-and-functions-basics-of-limits-and-continuity-functions.pdf',
      }),

      'Basic Applications of Differential and Integral Calculus in Business and Economics': chapter({
        id: 'chapter-8',
        title: 'Basic Applications of Differential and Integral Calculus in Business and Economics',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-8/basic-applications-of-differential-and-integral-calculus-in-business-and-economics.pdf',
      }),

      'Number Series, Coding and Decoding and Odd Man Out': chapter({
        id: 'chapter-9',
        title: 'Number Series, Coding and Decoding and Odd Man Out',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-9/number-series-coding-and-decoding-and-odd-man-out.pdf',
      }),

      'Direction Sense Test': chapter({
        id: 'chapter-10',
        title: 'Direction Sense Test',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-10/direction-sense-test.pdf',
      }),

      'Seating Arrangements': chapter({
        id: 'chapter-11',
        title: 'Seating Arrangements',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-11/seating-arrangements.pdf',
      }),

      'Blood Relations': chapter({
        id: 'chapter-12',
        title: 'Blood Relations',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-12/blood-relations.pdf',
      }),

      'Chapter 13': chapter({
        id: 'chapter-13',
        title: 'Chapter 13',
        units: [
          unit(
            'unit-1',
            'Statistical Description of Data',
            '/materials/CA Foundation/quantitative-aptitude/chapter-13/unit-1/statistical-description-of-data.pdf'
          ),
          unit(
            'unit-2',
            'Sampling',
            '/materials/CA Foundation/quantitative-aptitude/chapter-13/unit-2/sampling.pdf'
          ),
        ],
      }),

      'Chapter 14: Measures of Central Tendency and Dispersion': chapter({
        id: 'chapter-14',
        title: 'Chapter 14: Measures of Central Tendency and Dispersion',
        units: [
          unit(
            'unit-1',
            'Measures of Central Tendency',
            '/materials/CA Foundation/quantitative-aptitude/chapter-14/unit-1/measures-of-central-tendency.pdf'
          ),
          unit(
            'unit-2',
            'Dispersion',
            '/materials/CA Foundation/quantitative-aptitude/chapter-14/unit-2/dispersion.pdf'
          ),
        ],
      }),

      'Chapter 15: Probability': chapter({
        id: 'chapter-15',
        title: 'Chapter 15: Probability',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-15/probability.pdf',
      }),

      'Chapter 16: Theoretical Distributions': chapter({
        id: 'chapter-16',
        title: 'Chapter 16: Theoretical Distributions',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-16/theoretical-distributions.pdf',
      }),

      'Chapter 17: Correlation and Regression': chapter({
        id: 'chapter-17',
        title: 'Chapter 17: Correlation and Regression',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-17/correlation-and-regression.pdf',
      }),

      'Chapter 18: Index Numbers': chapter({
        id: 'chapter-18',
        title: 'Chapter 18: Index Numbers',
        pdfPath:
          '/materials/CA Foundation/quantitative-aptitude/chapter-18/index-numbers.pdf',
      }),
    },

    'foundation-economics': {
      'Introduction to Business Economics': chapter({
        id: 'chapter-1',
        title: 'Introduction to Business Economics',
        units: [
          unit('unit-1', 'Introduction', '/materials/CA Foundation/business-economics/chapter-1/unit-1/introduction.pdf'),
          unit('unit-2', 'Basic Problems of an Economy & Role of Price Mechanism', '/materials/CA Foundation/business-economics/chapter-1/unit-2/basic-problems-of-an-economy-and-role-of-price-mechanism.pdf'),
        ],
      }),

      'Theory of Demand and Supply': chapter({
        id: 'chapter-2',
        title: 'Theory of Demand and Supply',
        units: [
          unit('unit-1', 'Law of Demand and Elasticity of Demand', '/materials/CA Foundation/business-economics/chapter-2/unit-1/law-of-demand-and-elasticity-of-demand.pdf'),
          unit('unit-2', 'Theory of Consumer Behaviour', '/materials/CA Foundation/business-economics/chapter-2/unit-2/theory-of-consumer-behaviour.pdf'),
          unit('unit-3', 'Supply', '/materials/CA Foundation/business-economics/chapter-2/unit-3/supply.pdf'),
        ],
      }),

      'Theory of Production and Cost': chapter({
        id: 'chapter-3',
        title: 'Theory of Production and Cost',
        units: [
          unit('unit-1', 'Theory of Production', '/materials/CA Foundation/business-economics/chapter-3/unit-1/theory-of-production.pdf'),
          unit('unit-2', 'Theory of Cost', '/materials/CA Foundation/business-economics/chapter-3/unit-2/theory-of-cost.pdf'),
        ],
      }),

      'Price Determination in Different Markets': chapter({
        id: 'chapter-4',
        title: 'Price Determination in Different Markets',
        units: [
          unit('unit-1', 'Meaning and Types of Markets', '/materials/CA Foundation/business-economics/chapter-4/unit-1/meaning-and-types-of-markets.pdf'),
          unit('unit-2', 'Determination of Prices', '/materials/CA Foundation/business-economics/chapter-4/unit-2/determination-of-prices.pdf'),
          unit('unit-3', 'Price Output Determination under Different Market Forms', '/materials/CA Foundation/business-economics/chapter-4/unit-3/price-output-determination-under-different-market-forms.pdf'),
        ],
      }),

      'Business Cycles': chapter({
        id: 'chapter-5',
        title: 'Business Cycles',
        pdfPath: '/materials/CA Foundation/business-economics/chapter-5/business-cycles.pdf',
      }),

      'Determination of National Income': chapter({
        id: 'chapter-6',
        title: 'Determination of National Income',
        units: [
          unit('unit-1', 'National Income Accounting', '/materials/CA Foundation/business-economics/chapter-6/unit-1/national-income-accounting.pdf'),
          unit('unit-2', 'The Keynesian Theory of Determination of National Income', '/materials/CA Foundation/business-economics/chapter-6/unit-2/the-keynesian-theory-of-determination-of-national-income.pdf'),
        ],
      }),

      'Public Finance': chapter({
        id: 'chapter-7',
        title: 'Public Finance',
        units: [
          unit('unit-1', 'Fiscal Functions: An Overview, Centre and State Finance', '/materials/CA Foundation/business-economics/chapter-7/unit-1/fiscal-functions-an-overview-centre-and-state-finance.pdf'),
          unit('unit-2', 'Market Failure/Government intervention to correct Market Failure', '/materials/CA Foundation/business-economics/chapter-7/unit-2/market-failure-government-intervention-to-correct-market-failure.pdf'),
          unit('unit-3', 'The Process of Budget Making: Sources of Revenue, Expenditure Management and Management of Public Debt', '/materials/CA Foundation/business-economics/chapter-7/unit-3/the-process-of-budget-making-sources-of-revenue-expenditure-management-and-management-of-public-debt.pdf'),
          unit('unit-4', 'Fiscal Policy', '/materials/CA Foundation/business-economics/chapter-7/unit-4/fiscal-policy.pdf'),
        ],
      }),

      'Money Market': chapter({
        id: 'chapter-8',
        title: 'Money Market',
        units: [
          unit('unit-1', 'The Concept of Money Demand: Important Theories', '/materials/CA Foundation/business-economics/chapter-8/unit-1/the-concept-of-money-demand-important-theories.pdf'),
          unit('unit-2', 'The Concept of Money Supply', '/materials/CA Foundation/business-economics/chapter-8/unit-2/the-concept-of-money-supply.pdf'),
          unit('unit-3', 'Monetary Policy', '/materials/CA Foundation/business-economics/chapter-8/unit-3/monetary-policy.pdf'),
        ],
      }),

      'International Trade': chapter({
        id: 'chapter-9',
        title: 'International Trade',
        units: [
          unit('unit-1', 'Theories of International Trade', '/materials/CA Foundation/business-economics/chapter-9/unit-1/theories-of-international-trade.pdf'),
          unit('unit-2', 'The Instruments of Trade Policy', '/materials/CA Foundation/business-economics/chapter-9/unit-2/the-instruments-of-trade-policy.pdf'),
          unit('unit-3', 'Trade Negotiations', '/materials/CA Foundation/business-economics/chapter-9/unit-3/trade-negotiations.pdf'),
          unit('unit-4', 'Exchange Rate and Its Economic Effects', '/materials/CA Foundation/business-economics/chapter-9/unit-4/exchange-rate-and-its-economic-effects.pdf'),
          unit('unit-5', 'International Capital Movements', '/materials/CA Foundation/business-economics/chapter-9/unit-5/international-capital-movements.pdf'),
        ],
      }),

      'Indian Economy': chapter({
        id: 'chapter-10',
        title: 'Indian Economy',
        pdfPath: '/materials/CA Foundation/business-economics/chapter-10/indian-economy.pdf',
      }),
    },
    'foundation-business-law': {
      'Indian Regulatory Framework': chapter({
        id: 'chapter-1',
        title: 'Indian Regulatory Framework',
        pdfPath:
          '/materials/CA Foundation/business-law/chapter-1/indian-regulatory-framework.pdf',
      }),

      'The Indian Contract Act, 1872': chapter({
        id: 'chapter-2',
        title: 'The Indian Contract Act, 1872',
        units: [
          unit('unit-1', 'Nature of Contracts', '/materials/CA Foundation/business-law/chapter-2/unit-1/nature-of-contracts.pdf'),
          unit('unit-2', 'Consideration', '/materials/CA Foundation/business-law/chapter-2/unit-2/consideration.pdf'),
          unit('unit-3', 'Other Essential Elements of a Contract', '/materials/CA Foundation/business-law/chapter-2/unit-3/other-essential-elements-of-a-contract.pdf'),
          unit('unit-4', 'Performance of Contract', '/materials/CA Foundation/business-law/chapter-2/unit-4/performance-of-contract.pdf'),
          unit('unit-5', 'Breach of Contract and its Remedies', '/materials/CA Foundation/business-law/chapter-2/unit-5/breach-of-contract-and-its-remedies.pdf'),
          unit('unit-6', 'Contingent and Quasi Contracts', '/materials/CA Foundation/business-law/chapter-2/unit-6/contingent-and-quasi-contracts.pdf'),
          unit('unit-7', 'Contract of Indemnity and Guarantee', '/materials/CA Foundation/business-law/chapter-2/unit-7/contract-of-indemnity-and-guarantee.pdf'),
          unit('unit-8', 'Bailment and Pledge', '/materials/CA Foundation/business-law/chapter-2/unit-8/bailment-and-pledge.pdf'),
          unit('unit-9', 'Agency', '/materials/CA Foundation/business-law/chapter-2/unit-9/agency.pdf'),
        ],
      }),

      'The Sale of Goods Act, 1930': chapter({
        id: 'chapter-3',
        title: 'The Sale of Goods Act, 1930',
        units: [
          unit('unit-1', 'Formation of the Contract of Sale', '/materials/CA Foundation/business-law/chapter-3/unit-1/formation-of-the-contract-of-sale.pdf'),
          unit('unit-2', 'Conditions and Warranties', '/materials/CA Foundation/business-law/chapter-3/unit-2/conditions-and-warranties.pdf'),
          unit('unit-3', 'Transfer of Ownership and Delivery of Goods', '/materials/CA Foundation/business-law/chapter-3/unit-3/transfer-of-ownership-and-delivery-of-goods.pdf'),
          unit('unit-4', 'Unpaid Seller', '/materials/CA Foundation/business-law/chapter-3/unit-4/unpaid-seller.pdf'),
        ],
      }),

      'The Indian Partnership Act, 1932': chapter({
        id: 'chapter-4',
        title: 'The Indian Partnership Act, 1932',
        units: [
          unit('unit-1', 'General Nature of Partnership', '/materials/CA Foundation/business-law/chapter-4/unit-1/general-nature-of-partnership.pdf'),
          unit('unit-2', 'Relations of Partners', '/materials/CA Foundation/business-law/chapter-4/unit-2/relations-of-partners.pdf'),
          unit('unit-3', 'Registration and Dissolution of a Firm', '/materials/CA Foundation/business-law/chapter-4/unit-3/registration-and-dissolution-of-a-firm.pdf'),
        ],
      }),

      'The Limited Liability Partnership Act, 2008': chapter({
        id: 'chapter-5',
        title: 'The Limited Liability Partnership Act, 2008',
        pdfPath:
          '/materials/CA Foundation/business-law/chapter-5/the-limited-liability-partnership-act-2008.pdf',
      }),

      'The Companies Act, 2013': chapter({
        id: 'chapter-6',
        title: 'The Companies Act, 2013',
        pdfPath:
          '/materials/CA Foundation/business-law/chapter-6/the-companies-act-2013.pdf',
      }),

      'The Negotiable Instruments Act, 1881': chapter({
        id: 'chapter-7',
        title: 'The Negotiable Instruments Act, 1881',
        pdfPath:
          '/materials/CA Foundation/business-law/chapter-7/the-negotiable-instruments-act-1881.pdf',
      }),
    },
  },
}


// ============================================================
// HELPERS
// ============================================================

function normaliseKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/chapter\s*\d+\s*[:.\-]?/g, '')
    .replace(/unit\s*\d+\s*[:.\-]?/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '')
}

function extractChapterNumber(value) {
  const match = String(value || '').match(/chapter\s*(\d+)/i)
  return match ? Number(match[1]) : null
}

function findByNormalisedKey(object, key) {
  if (!object || typeof object !== 'object') {
    return null
  }

  const raw = String(key || '')

  if (Object.prototype.hasOwnProperty.call(object, raw)) {
    return object[raw]
  }

  const target = normaliseKey(raw)

  const foundKey = Object.keys(object).find(
    (item) => normaliseKey(item) === target
  )

  return foundKey ? object[foundKey] : null
}

function findChapterData(subjectData, chapterName) {
  const direct = findByNormalisedKey(subjectData, chapterName)

  if (direct) {
    return direct
  }

  const chapterNumber = extractChapterNumber(chapterName)

  if (chapterNumber) {
    const byId = subjectData[`chapter-${chapterNumber}`]

    if (byId) {
      return byId
    }

    const byKey = Object.keys(subjectData).find((key) => {
      const keyNumber = extractChapterNumber(key)
      const valueNumber = extractChapterNumber(subjectData[key]?.id)

      return keyNumber === chapterNumber || valueNumber === chapterNumber
    })

    if (byKey) {
      return subjectData[byKey]
    }
  }

  const target = normaliseKey(chapterName)

  if (!target) {
    return null
  }

  const similar = Object.entries(subjectData).find(([key, value]) => {
    const keyNorm = normaliseKey(key)
    const titleNorm = normaliseKey(value?.title)

    return (
      (keyNorm && (keyNorm.includes(target) || target.includes(keyNorm))) ||
      (titleNorm &&
        (titleNorm.includes(target) || target.includes(titleNorm)))
    )
  })

  return similar ? similar[1] : null
}

function findUnitData(chapterData, unitName) {
  if (!chapterData || !unitName) {
    return null
  }

  const target = normaliseKey(unitName)

  const units = Array.isArray(chapterData.units)
    ? chapterData.units
    : []

  const direct = units.find((item) =>
    [item.id, item.title].some(
      (candidate) => normaliseKey(candidate) === target
    )
  )

  if (direct) {
    return direct
  }

  const requestedMatch = String(unitName).match(/unit\s*(\d+)/i)

  const requestedNumber = requestedMatch
    ? Number(requestedMatch[1])
    : null

  if (requestedNumber) {
    const byNumber = units.find((item, index) => {
      const itemMatch = String(item.id || '').match(/unit-(\d+)/i)
      const itemNumber = itemMatch ? Number(itemMatch[1]) : index + 1

      return itemNumber === requestedNumber
    })

    if (byNumber) {
      return byNumber
    }
  }

  const similar = units.find((item) => {
    const itemNorm = normaliseKey(item.title)

    return (
      itemNorm.includes(target) ||
      target.includes(itemNorm)
    )
  })

  if (similar) {
    return similar
  }

  if (
    chapterData.annexure &&
    target.startsWith('annexure')
  ) {
    return chapterData.annexure
  }

  return null
}


// ============================================================
// PUBLIC API
// ============================================================

export function getChapterMaterial(
  level,
  subjectId,
  chapterName,
  unitName = null,
) {
  const levelData = findByNormalisedKey(materials, level)

  if (!levelData) {
    return null
  }

  const subjectData = findByNormalisedKey(levelData, subjectId)

  if (!subjectData) {
    return null
  }

  const chapterData = findChapterData(subjectData, chapterName)

  if (!chapterData) {
    return null
  }

  if (!unitName) {
    return chapterData
  }

  return findUnitData(chapterData, unitName)
}

export function getChapterNode(
  level,
  subjectId,
  chapterName
) {
  return getChapterMaterial(
    level,
    subjectId,
    chapterName
  )
}

export function getChapterUnits(
  level,
  subjectId,
  chapterName
) {
  const node = getChapterMaterial(
    level,
    subjectId,
    chapterName
  )

  return node?.units || []
}

export function getChapterAnnexure(
  level,
  subjectId,
  chapterName
) {
  const node = getChapterMaterial(
    level,
    subjectId,
    chapterName
  )

  return node?.annexure || null
}

export default materials
