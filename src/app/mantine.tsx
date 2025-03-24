"use client";

import { theme } from "@/shared/theme/mantine";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";

export default function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseTheme: Partial<MantineThemeOverride> = theme;

  return <MantineProvider theme={baseTheme}>{children}</MantineProvider>;
}
