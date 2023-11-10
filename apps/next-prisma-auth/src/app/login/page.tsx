import Header from "@/components/Header";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <>
      <Header />
      <section className="bg-blue-800 min-h-screen grid place-items-center">
        <div className="w-full">
          <h1 className="text-4xl lg:text-6xl text-center font-[600] text-ct-yellow-600 mb-4">
            Login Demo
          </h1>
          <h2 className="text-lg text-center mb-4 text-ct-dark-200">Login</h2>
          <LoginForm />
        </div>
      </section>
    </>
  );
};

export default LoginPage;
