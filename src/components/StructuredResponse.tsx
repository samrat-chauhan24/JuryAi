import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLegalStore } from '../store/useLegalStore';

type Props = {
  data: {
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
};

const Badge = ({ label, color }: { label: string; color: string }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

export const StructuredResponse = memo(({ data }: Props) => {
  const mode = useLegalStore((state) => state.mode);
  const isAdvanced = mode === 'advanced';

  if (!data) return null;

  const answerColor =
    data.answer === 'Allowed' ? '#16a34a' : '#dc2626';

  const riskColor =
    data.risk === 'Low'
      ? '#16a34a'
      : data.risk === 'Medium'
      ? '#f59e0b'
      : '#dc2626';

  const conditions = data.analysis?.conditions || [];
  const risks = data.analysis?.risks || [];
  const hasReferences = data.references?.length > 0;

  return (
    <View style={styles.card}>
      
      {/* Status */}
      <Text style={styles.sectionTitle}>Answer</Text>

      <View style={styles.badgeRow}>
        <Badge label={data.answer} color={answerColor} />
        <Badge label={`${data.risk} Risk`} color={riskColor} />
      </View>

      {/* Summary (always visible) */}
      <Text style={styles.summary}>{data.summary}</Text>

      {/* Advanced Content */}
      {isAdvanced && (
        <>
          {data.analysis?.explanation && (
            <Text style={styles.explanation}>
              {data.analysis.explanation}
            </Text>
          )}

          {conditions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Conditions</Text>
              {conditions.map((c, i) => (
                <Text key={i} style={styles.bullet}>• {c}</Text>
              ))}
            </View>
          )}

          {risks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Potential Risks</Text>
              {risks.map((r, i) => (
                <Text key={i} style={styles.bullet}>• {r}</Text>
              ))}
            </View>
          )}

          {hasReferences && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Legal Sources</Text>
              {data.references.map((ref, i) => (
                <Text key={i} style={styles.reference}>{ref}</Text>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  summary: {
    color: '#374151',
    marginBottom: 6,
  },
  explanation: {
    color: '#374151',
    marginTop: 6,
  },
  bullet: {
    color: '#374151',
    marginBottom: 2,
  },
  reference: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 2,
  },
});