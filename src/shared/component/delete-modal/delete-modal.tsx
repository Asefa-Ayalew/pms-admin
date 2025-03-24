import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
type Props = {
  title: string;
  desc: string;
  confirm: Function;
  confirmLabel: string;
  route?: string;
  navigate?: AppRouterInstance;
};

export default function DeleteModal({
  title,
  desc,
  confirm,
  confirmLabel,
  route,
  navigate,
}: Props): any {
  return modals.openConfirmModal({
    title: title,
    centered: true,
    children: <Text size="sm">{desc}</Text>,
    labels: { confirm: confirmLabel, cancel: "Cancel" },
    confirmProps: { color: "red" },
    onCancel: () => console.log("Cancel"),
    onConfirm: async () => {
      await confirm();
      route && navigate && navigate.replace(route);
    },
  });
}
