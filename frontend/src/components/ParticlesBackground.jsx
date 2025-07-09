import { motion } from "framer-motion";

const ParticlesBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-purple-500/20"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          width: Math.random() * 10 + 5,
          height: Math.random() * 10 + 5,
          opacity: Math.random() * 0.5 + 0.1,
        }}
        animate={{
          y: [null, Math.random() * 100 - 50],
          x: [null, Math.random() * 100 - 50],
          transition: {
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
      />
    ))}
  </div>
);

export default ParticlesBackground;
