import {
  ArrowRight,
  Bot,
  ChartNoAxesCombined,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import heroArt from "../assets/finance-hero.png";

const features = [
  {
    icon: ChartNoAxesCombined,
    title: "See your money clearly",
    copy: "Understand your income, spending, and savings in one simple financial dashboard.",
  },
  {
    icon: Bot,
    title: "Smart financial insights",
    copy: "Get clear answers about your spending patterns and discover practical ways to improve.",
  },
  {
    icon: ShieldCheck,
    title: "Your finances, your privacy",
    copy: "Keep your personal financial information organized in a private and focused workspace.",
  },
];

export default function LandingPage() {
  return (
    <div className="landing">
      <header className="marketing-nav">
        <Brand />

        <div>
          <Link className="text-link" to="/login">
            Log in
          </Link>

          <Link className="button button-primary" to="/register">
            Get started <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={15} />
              Smarter money management
            </div>

            <h1>
              Make your <em>money</em> work smarter.
            </h1>

            <p>
              Take control of your finances with clear insights into your
              income, expenses, spending habits, and savings.
            </p>

            <div className="hero-actions">
              <Link className="button button-primary" to="/register">
                Start managing your money
                <ArrowRight size={17} />
              </Link>

              <Link className="button button-secondary" to="/login">
                Log in
              </Link>
            </div>

            <div className="trust">
              <CheckCircle2 size={17} />
              Private by design. Built for smarter financial decisions.
            </div>
          </div>

          <div className="hero-art">
            <img src={heroArt} alt="Abstract finance tracker illustration" />

            <div className="art-note">
              <span>Designed for your</span>
              <b>financial goals</b>
            </div>
          </div>
        </section>

        <section className="preview card">
          <div className="preview-top">
            <span>Financial overview</span>

            <span className="live-dot">Your finances at a glance</span>
          </div>

          <div className="metric-grid">
            <div>
              <small>Income</small>
              <strong>—</strong>
            </div>

            <div>
              <small>Spending</small>
              <strong>—</strong>
            </div>

            <div>
              <small>Saved</small>
              <strong>—</strong>
            </div>
          </div>

          <div className="chart-placeholder">
            <span>Your financial patterns, made simple.</span>

            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </section>

        <section className="section">
          <div className="section-intro">
            <div className="eyebrow">Built for everyday finances</div>

            <h2>A smarter way to manage your money.</h2>
          </div>

          <div className="feature-grid">
            {features.map(({ icon: Icon, title, copy }) => (
              <article className="card feature" key={title}>
                <span className="feature-icon">
                  <Icon size={22} />
                </span>

                <h3>{title}</h3>

                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="how section">
          <div>
            <div className="eyebrow">How it works</div>

            <h2>A simple path to financial clarity.</h2>
          </div>

          <ol>
            <li>
              <b>01</b>
              <span>Track your income and expenses in one place.</span>
            </li>

            <li>
              <b>02</b>
              <span>Understand your spending with clear visual insights.</span>
            </li>

            <li>
              <b>03</b>
              <span>
                Make better decisions and work toward your financial goals.
              </span>
            </li>
          </ol>
        </section>

        <section className="assistant-preview section">
          <div className="assistant-orb">
            <Bot size={44} />
          </div>

          <div>
            <div className="eyebrow">Smart Finance Assistant</div>

            <h2>Clear answers for better financial decisions.</h2>

            <p>
              Ask about your spending, understand where your money goes, and
              discover practical ways to manage it better.
            </p>
          </div>
        </section>

        <section className="cta">
          <h2>Take control of your money.</h2>

          <p>
            Start tracking today and build a clearer, more confident financial
            future.
          </p>

          <Link className="button button-light" to="/register">
            Get started <ArrowRight size={17} />
          </Link>
        </section>
      </main>

      <footer>
        <Brand />

        <span>© {new Date().getFullYear()} Smart Finance Tracker</span>

        <span>Built for smarter financial decisions.</span>
      </footer>
    </div>
  );
}
