import React, { memo } from 'react';
import { ChatBubble } from './ChatBubble';
import { StructuredResponse } from './StructuredResponse';
import { ComparisonTable } from './ComparisonTable';

type Props = {
  item: any;
};

export const MessageRenderer = memo(({ item }: Props) => {
  // USER MESSAGE
  if (item.sender === 'user') {
    return <ChatBubble text={item.text} isUser={true} />;
  }

  // COMPARISON RESPONSE
  if (Array.isArray(item.data)) {
    return <ComparisonTable data={item.data} />;
  }

  // STRUCTURED RESPONSE
  if (item.data && typeof item.data === 'object') {
    return <StructuredResponse data={item.data} />;
  }

  // FALLBACK
  return <ChatBubble text={item.text || ''} isUser={false} />;
});