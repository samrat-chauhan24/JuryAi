import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// ❌ removed useLegalStore

// ✅ THEME
import { colors, spacing, radius, typography } from '../theme';

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

// ✅ added mode prop
export const ComparisonTable = memo(({ data, mode }: { data: Item[]; mode?: string }) => {
  const isAdvanced = (mode ?? 'basic') === 'advanced';

  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <View style={{ marginVertical: spacing.md }}>
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
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  country: {
    ...typography.subtitle,
    marginBottom: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.md,
    marginRight: spacing.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  summary: {
    ...typography.body,
    color: colors.subtext,
    marginBottom: spacing.xs,
  },
  explanation: {
    ...typography.body,
    color: colors.subtext,
    marginTop: spacing.xs,
  },
  section: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.xs,
  },
  bullet: {
    ...typography.body,
    color: colors.subtext,
  },
  reference: {
    color: colors.muted,
    fontSize: 13,
  },
});