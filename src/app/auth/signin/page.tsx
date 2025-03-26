"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  PasswordInput,
  Stack,
  TextInput,
  Title
} from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import classes from "./AuthenticationImage.module.css";

import { signIn } from "next-auth/react";

import { notifications } from "@mantine/notifications";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginSchema } from "@/schemas/login-schema";
import { AccessibleLoadingOverlay } from "@/shared/component/loading-overlay/accessible-loading-overlay";


type FormSchema = z.infer<typeof LoginSchema>;
export default function Login() {
  const { data: session, status } = useSession();
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(LoginSchema), mode: "onBlur" });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setErrorMessage("Invalid email or password");
        notifications.show({
          title: "Error",
          message:
            result?.error === "Configuration"
              ? "Check your email or password"
              : "Error, try again",
          color: "red",
        });
      } else {
        router.replace(`/`);
      }
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.message || "Error try again",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };
  const onError = (errors: any, e: any) => console.log(errors, e);

  if (status === "loading") {
    return (
      <AccessibleLoadingOverlay visible={true}>
        <div aria-hidden="true" className="h-screen w-full" />
      </AccessibleLoadingOverlay>
    );
  }
  // if (status === "unauthenticated") {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card
        radius={"md"}
        p={30}
        className="shadow-2xl h-auto min-w-[400px] w-[500px]"
        bg={"slate.200"}
      >
        <Stack align="center" justify="center" gap={20}>
          <Image
            src="/logos/logo.png"
            alt="PMS Admin"
            width={120}
            height={60}
          />
          <Title
            order={2}
            className={clsx(classes.title, "text-2xl text-slate-600")}
            ta="center"
          >
            Welcome To PMS Admin
          </Title>
        </Stack>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="w-full mt-4"
        >
          <Stack>
            <TextInput
              placeholder="Email"
              label="Email"
              {...register("email")}
              error={errors.email ? errors.email?.message : ""}
              classNames={{
                input: "border-2 rounded-md px-2 py-5",
              }}
            />
            <PasswordInput
              placeholder="Password"
              label="Password"
              {...register("password")}
              error={errors?.password ? errors.password?.message : ""}
              classNames={{
                input: "border-2 rounded-md px-2 py-5",
              }}
            />
            <Button
              variant="filled"
              // className="bg-primary-500"
              bg={"primary.4"}
              type="submit"
              loading={isLoading}
              className="w-full h-12"
            >
              Login
            </Button>
          </Stack>
        </form>
      </Card>
    </div>
  );
  // }
}
