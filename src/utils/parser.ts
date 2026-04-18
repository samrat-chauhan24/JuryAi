export const parseMessage = (text: string) => {
  const lines = text.split('\n');

  return lines.map((line, index) => {
    const isList = /^\d+\./.test(line.trim());

    const segments = line.split(/(\*\*.*?\*\*)/g);

    return {
      key: index.toString(),
      isList,
      segments: segments.map((seg, i) => ({
        key: `${index}-${i}`,
        isBold: seg.startsWith('**') && seg.endsWith('**'),
        text: seg.replace(/\*\*/g, ''),
      })),
    };
  });
};