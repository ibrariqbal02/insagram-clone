import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLogin } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/getErrorMessage";

type LoginFormData = {
  login: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="font-logo text-5xl text-center mb-2 pb-1">
          Instagram
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Login to your account
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >



          <div>

            <input
              type="text"
              placeholder="Email or Username"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("login", {
                required: "Email or Username is required",
              })}
            />

            {errors.login && (
              <p className="text-red-500 text-sm mt-1">
                {errors.login.message}
              </p>
            )}

          </div>



          <div>

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}

          </div>



          {loginMutation.isError && (

            <div className="text-red-500 text-center">

              {getErrorMessage(loginMutation.error, "Login failed")}

            </div>

          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-lg py-3"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="mt-6 text-center">

          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>

        </div>

        <div className="mt-8 text-center">

          <p>

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;