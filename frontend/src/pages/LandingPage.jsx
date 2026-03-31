import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ArrowRight, FileText, Lock, Sparkles } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Secure Storage",
    desc: "Your documents are stored locally with full privacy",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    desc: "Chat with your documents using AI-powered extraction",
  },
  {
    icon: FileText,
    title: "Instant Retrieval",
    desc: "Search and access any document field in seconds",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-cream-200">
      {/* Subtle gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-vault-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-vault-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
        {/* Nav */}
        <div className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vault-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl text-vault-800">
              DigiLocker
            </span>
          </div>
          <Link
            to="/dashboard"
            className="vault-btn-primary"
          >
            Open Vault <ArrowRight size={16} />
          </Link>
        </div>

        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-5xl md:text-6xl text-vault-800 leading-tight mb-6"
            >
              Your Documents.
              <br />
              Your Control.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-cream-600 text-lg leading-relaxed mb-8 max-w-md"
            >
              Store, extract and query your personal documents with a local
              AI-ready vault. Secure, private, intelligent.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/dashboard" className="vault-btn-primary text-base px-6 py-3">
                Go to Dashboard
              </Link>
              <Link to="/upload" className="vault-btn-outline text-base px-6 py-3">
                Upload Document
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="hidden md:block"
          >
            <img
              src="/images/vault-hero.png"
              alt="Secure digital vault illustration"
              className="w-full max-w-md mx-auto rounded-3xl"
              loading="lazy"
            />
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="vault-card p-6"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div className="w-11 h-11 rounded-xl bg-vault-800 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-vault-800 mb-1">{f.title}</h3>
              <p className="text-sm text-cream-500 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
