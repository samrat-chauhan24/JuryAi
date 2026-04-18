import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLegalStore } from '../store/useLegalStore';

// ✅ THEME
import { colors, spacing, radius, typography } from '../theme';

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
  mode?: string; // 👈 ADD THIS
};

const Badge = ({ label, color }: { label: string; color: string }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

export const StructuredResponse = memo(({ data, mode }: Props) => {
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

      {/* Summary */}
      <Text style={styles.summary}>{data.summary}</Text>

      {/* Advanced */}
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
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    marginVertical: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
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
    fontWeight: '500',
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.xs,
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
  bullet: {
    ...typography.body,
    color: colors.subtext,
    marginBottom: 2,
  },
  reference: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 2,
  },
});