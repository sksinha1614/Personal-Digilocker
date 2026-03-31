import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const features = ["Secure Storage", "AI Assistant", "Instant Retrieval"];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-night p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.3),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.25),transparent_35%)]" />
      <div className="relative mx-auto max-w-5xl">
        <h1 className="font-syne text-5xl">Your Documents. Your Control.</h1>
        <p className="mt-3 max-w-2xl text-white/80">Store, extract and query your personal documents with a local AI-ready vault.</p>
        <Link to="/dashboard">
          <Button className="mt-6">Go to Dashboard</Button>
        </Link>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div key={f} className="glass rounded-2xl p-4" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
              {f}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
