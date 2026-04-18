// export const sendMessageToAI = async (message: string) => {
//   const response = await fetch('http://10.200.32.30:8000/chat', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       message,
//       user_id: "iPr3xaUi9DXQruUtefalaDVkAJH2",
//     }),
//   });

//   if (!response.ok) {
//     throw new Error('Network error');
//   }

//   return response.json();
// };

// final for ronak backend
// export const sendMessageToAI = async ({
//   query,
//   jurisdiction,
//   countries,
//   mode,
// }: any) => {
//   const response = await fetch('http://10.200.32.30:8000/chat', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       query,
//       jurisdiction,
//       countries,
//       mode,
//     }),
//   });

//   if (!response.ok) throw new Error('Network error');

//   return response.json();
// };

// for mock testing
export const sendMessageToAI = async ({
  query,
  jurisdiction,
  countries,
  mode,
}: {
  query: string;
  jurisdiction: string;
  countries: string[];
  mode: string;
}) => {
  console.log('🔥 MOCK API HIT:', {
    query,
    jurisdiction,
    countries,
    mode,
  });

  // simulate delay
  await new Promise<void>((res) => setTimeout(res, 800));

  // 🔹 COMPARISON MODE
  if (jurisdiction === 'comparison') {
    return countries.map((country, index) => {
      const base = {
        country,
        answer: index % 2 === 0 ? 'Allowed' : 'Conditional',
        risk: index % 2 === 0 ? 'Low' : 'Medium',
        summary:
          index % 2 === 0
            ? 'Generally allowed under most conditions.'
            : 'Allowed but depends on local restrictions.',
      };

      // BASIC
      if (mode === 'basic') {
        return {
          ...base,
          analysis: {},
          references: [],
        };
      }

      // ADVANCED
      return {
        ...base,
        analysis: {
          explanation:
            'This is based on local legal frameworks and regulatory policies.',
          conditions: [
            'Must comply with local regulations',
            'Applies only in regulated scenarios',
          ],
          risks: [
            'Possible compliance issues',
            'Legal interpretation may vary',
          ],
        },
        references: [
          `${country} Legal Code Section 101`,
          `${country} Data Protection Act`,
        ],
      };
    });
  }

  // 🔹 SINGLE / UNIVERSAL
  const base = {
    answer: 'Allowed',
    risk: 'Low',
    summary: 'This is generally allowed under most conditions.',
  };

  // BASIC MODE
  if (mode === 'basic') {
    return {
      ...base,
      analysis: {},
      references: [],
    };
  }

  // ADVANCED MODE
  return {
    ...base,
    analysis: {
      explanation:
        'This action is permitted under relevant laws with certain conditions.',
      conditions: [
        'Follow applicable compliance guidelines',
        'Ensure proper documentation',
      ],
      risks: [
        'Regulatory review possible',
        'Interpretation may vary by region',
      ],
    },
    references: [
      'IT Act Section 43A',
      'Data Protection Bill 2023',
    ],
  };
};