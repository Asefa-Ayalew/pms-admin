"use client";
import {
  Box,
  Collapse,
  Group,
  rem,
  ScrollArea,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utility/cn";
import classes from "./nav-bar-links-group.module.css";

export interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  link?: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

const isPathMatch = (currentPath: string, linkPath: string) => {
  // If paths are exactly the same, they match
  if (currentPath === linkPath) return true;

  if (currentPath.startsWith(linkPath)) {
    // Check if the next character after the linkPath is a "/" or nothing
    const nextChar = currentPath.charAt(linkPath.length);
    return nextChar === "" || nextChar === "/";
  }

  return false;
};

const NavLink = memo(
  ({
    href,
    label,
    isActive,
    className,
  }: {
    href: string;
    label: string;
    isActive: boolean;
    className: string;
  }) => (
    <Link href={href} className={className} prefetch={false}>
      {label}
    </Link>
  )
);

NavLink.displayName = "NavLink";

const LinksGroupBase = ({
  icon: Icon,
  label,
  link,
  initiallyOpened,
  links,
}: LinksGroupProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const isFirstMount = useRef(true);

  // Check if current path matches this group or any of its children
  const isCurrentPath = link === pathname;
  const hasActiveChild =
    hasLinks && links.some((link) => isPathMatch(pathname, link.link));

  // Set initial state and handle route changes
  useEffect(() => {
    if (isFirstMount.current) {
      setOpened(initiallyOpened || hasActiveChild);
      isFirstMount.current = false;
    } else if (hasActiveChild) {
      setOpened(true);
    }
  }, []);

  // Handle group toggle
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (hasLinks) {
        setOpened((o) => !o);
      } else if (link && link !== pathname) {
        router.push(link);
      }
    },
    [hasLinks, link, pathname, router]
  );

  const items = (hasLinks ? links : []).map((link) => (
    <NavLink
      key={link.label}
      href={link.link}
      label={link.label}
      isActive={isPathMatch(pathname, link.link)}
      className={cn(
        classes.link,
        isPathMatch(pathname, link.link) && classes.linkActive
      )}
    />
  ));

  return (
    <div className={classes.root}>
      <UnstyledButton
        onClick={handleClick}
        className={cn(
          classes.control,
          (isCurrentPath || hasActiveChild) && classes.controlActive
        )}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon
              variant="light"
              size={30}
              color={isCurrentPath || hasActiveChild ? "blue" : "gray"}
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
                transform: opened ? `rotate(-90deg)` : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks && (
        <Collapse in={opened}>
          <div className={classes.links}>{items}</div>
        </Collapse>
      )}
    </div>
  );
};

export const LinksGroup = memo(LinksGroupBase);

export const NavigationContainer = memo(
  ({ links }: { links: LinksGroupProps[] }) => {
    return (
      <nav className={classes.navbar}>
        <ScrollArea type="hover" scrollbarSize={6} offsetScrollbars>
          <div className={classes.linksInner}>
            {links.map((item) => (
              <LinksGroup key={item.label} {...item} />
            ))}
          </div>
        </ScrollArea>
      </nav>
    );
  }
);

NavigationContainer.displayName = "NavigationContainer";
