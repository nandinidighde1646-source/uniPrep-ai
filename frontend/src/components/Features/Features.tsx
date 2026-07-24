import FeatureCard from "./FeatureCard";
import "./Features.css";

const features = [
  {
    title: "Smart Notes",
    description: "Access organized notes for every subject and unit.",
    icon: "📚",
  },
  {
    title: "Previous Year Papers",
    description: "Practice with PYQs from past university exams.",
    icon: "📝",
  },
  {
    title: "AI Chat Assistant",
    description: "Ask doubts and get instant AI-powered explanations.",
    icon: "🤖",
  },
  {
    title: "Mock Tests",
    description: "Test your preparation with timed quizzes.",
    icon: "🎯",
  },
  {
    title: "Progress Tracking",
    description: "Monitor your learning journey and performance.",
    icon: "📊",
  },
  {
    title: "Personalized Learning",
    description: "Receive study recommendations based on your progress.",
    icon: "✨",
  },
];

function Features() {
  return (
    <section className="features">
      <div className="features-container">
        <h2>Why Choose UniPrep AI?</h2>

        <p className="features-subtitle">
          Everything you need to prepare smarter, faster, and with confidence.
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;