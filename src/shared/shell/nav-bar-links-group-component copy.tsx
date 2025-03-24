"use client";
import {
  Box,
  Collapse,
  Group,
  ThemeIcon,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "../utitlity/cn";
import classes from "./nav-bar-links-group.module.css";

export interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  link?: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export function LinksGroup({
  icon: Icon,
  label,
  link,
  initiallyOpened,
  links,
}: LinksGroupProps) {
  const router = useRouter();
  const pathname = usePathname();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  // Check if current path matches this group
  const isCurrentPath = link === pathname;
  const hasActiveChild =
    hasLinks && links.some((link) => link.link === pathname);

  // Keep menu open if it has an active child
  useEffect(() => {
    if (hasActiveChild) {
      setOpened(true);
    }
  }, [hasActiveChild]);

  const items = (hasLinks ? links : []).map((link) => (
    <Link
      className={cn(
        classes.link,
        link.link === pathname &&
          "bg-secondary-100 text-secondary-900 font-bold"
      )}
      href={link.link}
      key={link.label}
    >
      {link.label}
    </Link>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => {
          hasLinks ? setOpened((o) => !o) : link && router.push(link);
        }}
        className={cn(
          classes.control,
          (isCurrentPath || hasActiveChild) &&
            "bg-secondary-100 text-secondary-900 font-bold"
        )}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon
              variant="light"
              size={30}
              color={
                isCurrentPath || hasActiveChild ? "secondary.9" : "tertiary.9"
              }
            >
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? "rotate(-90deg)" : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
