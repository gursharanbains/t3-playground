"use client";

import { RegisterData, RegisterSchema } from "@/lib/validation/user";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { register, handleApiError } from "@/lib/apiHelpers";
import FormInput from "@/components/form/Input";
import Link from "next/link";
import LoadingButton from "@/components/LoadingButton";
import useStore from "@/store";
import {} from "@/lib/errors";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const store = useStore();
  const router = useRouter();

  const methods = useForm<RegisterData>({
    resolver: zodResolver(RegisterSchema),
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

  async function handleRegister(data: RegisterData) {
    store.setLoading(true);
    try {
      const user = await register(JSON.stringify(data));
      store.setAuthData(user);
      return router.push("/login");
    } catch (error: any) {
      handleApiError(error);
    } finally {
      store.setLoading(false);
    }
  }

  const onSubmitHandler: SubmitHandler<RegisterData> = (values) => {
    handleRegister(values);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
      >
        <FormInput label="Full Name" name="name" />
        <FormInput label="Email" name="email" type="email" />
        <FormInput label="Password" name="password" type="password" />
        <FormInput
          label="Confirm Password"
          name="passwordConfirm"
          type="password"
        />
        <span className="block">
          Already have an account?{" "}
          <Link href="/login" className="text-ct-blue-600">
            Login Here
          </Link>
        </span>
        <LoadingButton loading={store.loading} textColor="text-ct-blue-600">
          Register
        </LoadingButton>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
