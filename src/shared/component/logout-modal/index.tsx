"use client";
import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Stack,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import handleLogout from "@/shared/utility/log-out";

export default function LogoutModal() {
  const [isSignout, setIsSignout] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleConfirmLogout = async () => {
    setIsSignout(true);
    try {
      await handleLogout(session?.accessToken);
      modals.closeAll();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsSignout(false);
    }
  };

  return (
    <Container>
      <Stack gap={"sm"}>
        <Flex mt={"md"}>
          <Text variant="h3" fw={600}>
            Logout?
          </Text>
          <ActionIcon
            variant="light"
            color="red"
            size={"sm"}
            onClick={() => modals.closeAll()}
            ml={"auto"}
          >
            <IconX />
          </ActionIcon>
        </Flex>
        <Flex>
          <Text>Are you sure you want to logout?</Text>
        </Flex>

        <Flex gap={5} justify="end" align={"end"} mt={30}>
          <Button
            variant="outline"
            color="gray"
            className="mr-2 border border-slate-300"
            onClick={() => modals.closeAll()}
            disabled={isSignout}
          >
            Cancel
          </Button>
          <Button
            color="red"
            variant="filled"
            loading={isSignout}
            onClick={handleConfirmLogout}
          >
            Logout
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
}