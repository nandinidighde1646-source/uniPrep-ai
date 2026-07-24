import StepCard from "./StepCard";
import "./HowItWorks.css";

const steps = [
  {
    number: 1,
    title: "Create Your Account",
    description:
      "Sign up and securely log in to access all UniPrep AI features.",
  },
  {
    number: 2,
    title: "Choose Your Semester",
    description:
      "Select your university, branch, semester, and subjects.",
  },
  {
    number: 3,
    title: "Learn Smarter",
    description:
      "Study using notes, PYQs, mock tests, and the AI assistant.",
  },
  {
    number: 4,
    title: "Ace Your Exams",
    description:
      "Track your progress and confidently prepare for university exams.",
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="how-container">
        <h2>How UniPrep AI Works</h2>

        <p className="how-subtitle">
          Get exam-ready in just four simple steps.
        </p>

        <div className="steps-grid">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;