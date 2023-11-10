"use client";

import { LoginData, LoginSchema } from "@/lib/validation/user";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { login, handleApiError } from "@/lib/apiHelpers";
import FormInput from "@/components/form/Input";
import Link from "next/link";
import LoadingButton from "@/components/LoadingButton";
import useStore from "@/store";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const store = useStore();
  const router = useRouter();

  const methods = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  useEffect(() => {
    store.reset();
  }, []);

  async function handleLogin(data: LoginData) {
    store.setLoading(true);
    try {
      await login(JSON.stringify(data));

      toast.success("Logged in successfully");
      return router.push("/profile");
    } catch (error: any) {
      handleApiError(error);
    } finally {
      store.setLoading(false);
    }
  }

  const onSubmitHandler: SubmitHandler<LoginData> = (values) => {
    handleLogin(values);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-white-200 rounded-2xl p-8 space-y-5"
      >
        <FormInput label="Email" name="email" type="email" />
        <FormInput label="Password" name="password" type="password" />
        <div className="text-right">
          <Link href="#" className="">
            Forgot Password?
          </Link>
        </div>
        <LoadingButton loading={store.loading} textColor="text-ct-blue-600">
          Login
        </LoadingButton>
        <span className="block">
          Need an account?{" "}
          <Link href="/register" className="text-ct-blue-600">
            Sign Up Here
          </Link>
        </span>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
