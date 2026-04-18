import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLegalStore } from '../store/useLegalStore';

type Item = {
  country: string;
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

const Badge = ({ label, color }: { label: string; color: string }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

export const ComparisonTable = memo(({ data }: { data: Item[] }) => {
  const mode = useLegalStore((state) => state.mode);
  const isAdvanced = mode === 'advanced';

  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <View style={{ marginVertical: 10 }}>
      {data.map((item) => {
        const conditions = item.analysis?.conditions || [];
        const risks = item.analysis?.risks || [];
        const hasReferences = item.references?.length > 0;

        const answerColor =
          item.answer === 'Allowed' ? '#16a34a' : '#dc2626';

        const riskColor =
          item.risk === 'Low'
            ? '#16a34a'
            : item.risk === 'Medium'
            ? '#f59e0b'
            : '#dc2626';

        return (
          <View key={item.country} style={styles.card}>
            
            <Text style={styles.country}>{item.country}</Text>

            <View style={styles.badgeRow}>
              <Badge label={item.answer} color={answerColor} />
              <Badge label={`${item.risk} Risk`} color={riskColor} />
            </View>

            <Text style={styles.summary}>{item.summary}</Text>

            {/* Advanced Mode */}
            {isAdvanced && (
              <>
                {item.analysis?.explanation && (
                  <Text style={styles.explanation}>
                    {item.analysis.explanation}
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
                    {item.references.map((ref, i) => (
                      <Text key={i} style={styles.reference}>{ref}</Text>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  country: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
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
  },
  summary: {
    color: '#374151',
    marginBottom: 6,
  },
  explanation: {
    color: '#374151',
    marginTop: 6,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  bullet: {
    color: '#374151',
  },
  reference: {
    color: '#6b7280',
    fontSize: 13,
  },
});