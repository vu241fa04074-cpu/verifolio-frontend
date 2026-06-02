import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await registerUser({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleAuth = () => {
    const googleAuthUrl = import.meta.env.VITE_GOOGLE_AUTH_URL || "https://accounts.google.com/o/oauth2/v2/auth";
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id";
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = "profile email";

    const url = `${googleAuthUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
    window.location.href = url;
  };

  const fieldClass = (fieldName, extra = "") =>
    `app-input ${extra} ${errors[fieldName] ? "border-red-500 focus:border-red-500" : ""}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] relative z-10">
        <section className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <ShieldCheck size={16} />
            Build Your Portfolio
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-tight text-slate-950">
            Create your <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">verified professional</span> identity.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
            Showcase projects, certifications, achievements, coding profiles, endorsements, and verified credentials in one polished place.
          </p>
          <div className="mt-12 space-y-4">
            {["Upload projects & work", "Request verifications", "Get endorsements", "Share your profile"].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <span>✓</span>
                </div>
                <span className="text-slate-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="w-full max-w-md justify-self-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-slate-950 hover:text-blue-600 transition">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
                <ShieldCheck size={25} />
              </span>
              VERIFOLIO
            </Link>
            <p className="mt-2 text-slate-600">Create your professional portfolio account</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="app-card p-8"
          >
            <h1 className="mb-6 text-2xl font-bold text-slate-950">Create Account</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="app-label">Full Name</label>
                <input {...register("name")} type="text" placeholder="John Doe" className={fieldClass("name")} />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="app-label">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">@</span>
                  <input {...register("username")} type="text" placeholder="johndoe" className={fieldClass("username", "pl-8")} />
                </div>
                {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
              </div>

              <div>
                <label className="app-label">Email Address</label>
                <input {...register("email")} type="email" placeholder="john@example.com" className={fieldClass("email")} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="app-label">Password</label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    className={fieldClass("password", "pr-12")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div>
                <label className="app-label">Confirm Password</label>
                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat password"
                    className={fieldClass("confirmPassword", "pr-12")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-blue-600"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="app-button-primary mt-2 w-full py-3.5">
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or sign up with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-blue-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 transition hover:text-blue-700">
                Sign In
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
