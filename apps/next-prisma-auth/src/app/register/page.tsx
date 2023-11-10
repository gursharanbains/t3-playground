import Header from "@/components/Header";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  return (
    <>
      <Header />
      <section className="py-8 bg-blue-600 min-h-screen grid place-items-center">
        <div className="w-full">
          <h1 className="text-4xl xl:text-6xl text-center font-[600] text-ct-yellow-600 mb-4">
            Demo Auth App
          </h1>
          <h2 className="text-lg text-center mb-4 text-ct-dark-200">Sign Up</h2>
          <RegisterForm />
        </div>
      </section>
    </>
  );
}
