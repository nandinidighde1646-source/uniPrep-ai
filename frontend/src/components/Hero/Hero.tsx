import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">

        <h1>
          Ace Your University Exams with AI
        </h1>

        <p>
          Access Notes, Previous Year Questions, AI Doubt Solving,
          Quiz Generator, and Personalized Study Plans — all in one place.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">
            Get Started
          </button>

          <button className="secondary-btn">
            Explore Notes
          </button>
        </div>

      </div>
    </section>
  );
}

export default Hero;