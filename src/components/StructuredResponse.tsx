import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import {
  colors,
  spacing,
  radius,
  typography,
} from "../theme";

type Props = {
  data: {
    answer: string;
    risk: string;
    summary: string;
    analysis?: {
      explanation?: string;
      conditions?: string[];
      risks?: string[];
    };
    references?: string[];
  };
  mode?: string;
};

const Badge = ({
  label,
  color,
}: {
  label: string;
  color: string;
}) => (
  <View
    style={[
      styles.badge,
      { backgroundColor: color },
    ]}
  >
    <Text style={styles.badgeText}>
      {label}
    </Text>
  </View>
);

export const StructuredResponse = memo(
  ({ data, mode }: Props) => {
    const isAdvanced = mode === "advanced";

    if (!data) return null;

    const answerColor =
      data.answer === "Allowed"
        ? "#16a34a"
        : data.answer === "Conditional"
        ? "#f59e0b"
        : data.answer === "Informational"
        ? "#3b82f6"
        : "#dc2626";

    const riskColor =
      data.risk === "Low"
        ? "#16a34a"
        : data.risk === "Medium"
        ? "#f59e0b"
        : "#dc2626";

    const conditions =
      data.analysis?.conditions || [];

    const risks =
      data.analysis?.risks || [];

    const hasReferences =
      (data.references?.length || 0) > 0;

    const normalizedRisk =
      data.risk?.trim().toLowerCase();

    const showRisk =
      normalizedRisk &&
      normalizedRisk !== "none" &&
      normalizedRisk !== "none risk" &&
      normalizedRisk !== "no risk";

    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Answer
        </Text>

        <View style={styles.badgeRow}>
          <Badge
            label={data.answer}
            color={answerColor}
          />

          {showRisk && (
            <Badge
              label={`${data.risk} Risk`}
              color={riskColor}
            />
          )}
        </View>

        <Text style={styles.summary}>
          {data.summary}
        </Text>

        {isAdvanced && (
          <>
            {data.analysis?.explanation && (
              <Text style={styles.explanation}>
                {data.analysis.explanation}
              </Text>
            )}

            {conditions.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Conditions
                </Text>

                {conditions.map((condition, index) => (
                  <Text
                    key={`${condition}-${index}`}
                    style={styles.bullet}
                  >
                    • {condition}
                  </Text>
                ))}
              </View>
            )}

            {risks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Potential Risks
                </Text>

                {risks.map((risk, index) => (
                  <Text
                    key={`${risk}-${index}`}
                    style={styles.bullet}
                  >
                    • {risk}
                  </Text>
                ))}
              </View>
            )}

            {hasReferences && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Legal Sources
                </Text>

                {data.references?.map((reference, index) => (
                  <Text
                    key={`${reference}-${index}`}
                    style={styles.reference}
                  >
                    {reference}
                  </Text>
                ))}
              </View>
            )}
          </>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.md,
  },

  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.md,
    marginRight: spacing.sm,
    marginBottom: 4,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
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