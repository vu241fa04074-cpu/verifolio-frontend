import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const result = await login(formData);
      toast.success("Welcome back!");
      if (result.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] relative z-10">
        <section className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <ShieldCheck size={16} />
            VERIFOLIO
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-tight text-slate-950">
            Your verified professional portfolio awaits.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
            Manage projects, certifications, verification requests, endorsements, and analytics from one beautiful dashboard.
          </p>
          <div className="mt-12 space-y-4">
            {["Update portfolios", "Request verifications", "Track analytics", "Manage endorsements"].map((feature) => (
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
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-slate-950 hover:text-blue-600 transition">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
              <ShieldCheck size={25} />
            </span>
            VERIFOLIO
          </Link>
          <p className="text-slate-600 mt-2">Sign in to your professional portfolio</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="app-card p-8"
        >
          <h1 className="text-2xl font-bold text-slate-950 mb-6">Welcome Back</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="app-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="app-input"
              />
            </div>

            <div>
              <label className="app-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  required
                  className="app-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="app-button-primary mt-2 w-full py-3.5"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
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
            Sign in with Google
          </button>

          <p className="text-center mt-6 text-slate-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition">
              Create Account
            </Link>
          </p>
        </motion.div>
        </div>
      </div>
    </div>
  );
}

