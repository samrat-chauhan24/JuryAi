import { colors } from "./colors";

export const typography = {
  title: {
    fontSize: 22,
    fontWeight: "600" as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: colors.text,
  },
  body: {
    fontSize: 15,
    fontWeight: "400" as const,
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    color: colors.subtext,
  },
};