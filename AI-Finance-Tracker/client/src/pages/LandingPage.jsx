import {
  ArrowRight,
  Bot,
  ChartNoAxesCombined,
  CheckCircle2,
  LockKeyhole,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import ScrollReveal from "../components/ScrollReveal";
import heroArt from "../assets/finance-hero.png";

const features = [
  {
    icon: ReceiptText,
    title: "Unified money timeline",
    copy: "Track income and expenses in a clean flow that makes patterns easier to spot.",
  },
  {
    icon: Bot,
    title: "AI answers that stay practical",
    copy: "Ask plain-language finance questions and get useful next steps from your own context.",
  },
  {
    icon: PiggyBank,
    title: "Savings goals with momentum",
    copy: "See progress, remaining balance, and the monthly pace needed to stay on track.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Visual spending intelligence",
    copy: "Turn transactions into quick summaries, trends, and signals you can act on.",
  },
  {
    icon: ShieldCheck,
    title: "Budget guardrails",
    copy: "Keep spending categories visible so your plan feels easier to follow every week.",
  },
  {
    icon: LockKeyhole,
    title: "Private by design",
    copy: "Your workspace stays focused on your financial decisions and protected account flow.",
  },
];

const metrics = [
  { label: "Cashflow health", value: "+18%", detail: "after recurring bills" },
  { label: "Saved this month", value: "$1,280", detail: "toward active goals" },
  { label: "Spending drift", value: "-9%", detail: "lower than last month" },
];

const insights = [
  "Dining is trending down after your new budget.",
  "Car fund needs $420/month to hit the target.",
  "You have room to move $180 into savings.",
];

const steps = [
  "Connect the daily view of income, expenses, budgets, and goals.",
  "Let the tracker turn raw activity into clear financial signals.",
  "Ask the AI assistant what to do next and act with more confidence.",
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
        <ScrollReveal as="section" className="hero">
          <div className="hero-media" aria-hidden="true">
            <img src={heroArt} alt="" />

            <div className="hero-signal-panel">
              <span>
                <TrendingUp size={15} />
                AI forecast
              </span>
              <strong>Save $2,400 faster</strong>
              <small>Suggested by your cashflow and active goals.</small>
            </div>
          </div>

          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={15} />
              Premium AI finance tracker
            </div>

            <h1>FinSight AI</h1>

            <p>
              A modern AI Finance Tracker that turns everyday income,
              spending, budgets, and savings goals into crisp financial
              guidance.
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
              <span>
                <CheckCircle2 size={17} />
                Private workspace
              </span>

              <span>
                <CheckCircle2 size={17} />
                Goal-aware insights
              </span>

              <span>
                <CheckCircle2 size={17} />
                Fast daily clarity
              </span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="preview card">
          <div className="preview-top">
            <span>
              <WalletCards size={17} />
              Financial command center
            </span>

            <span className="live-dot">Demo preview</span>
          </div>

          <div className="metric-grid">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <small>{metric.label}</small>
                <strong>{metric.value}</strong>
                <span>{metric.detail}</span>
              </div>
            ))}
          </div>

          <div className="command-center-layout">
            <div className="chart-placeholder" aria-label="Demo spending and savings chart">
              <span>Your financial patterns, made simple.</span>

              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="insight-stack">
              {insights.map((insight, index) => (
                <div className="insight-pill" key={insight}>
                  <span>0{index + 1}</span>
                  <p>{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="section">
          <div className="section-intro">
            <div className="eyebrow">Built for real financial life</div>

            <h2>Everything important, organized into one calm workspace.</h2>
          </div>

          <div className="feature-grid">
            {features.map(({ icon: Icon, title, copy }, index) => (
              <ScrollReveal
                as="article"
                className="card feature"
                delay={index * 70}
                key={title}
              >
                <span className="feature-icon">
                  <Icon size={22} />
                </span>

                <h3>{title}</h3>

                <p>{copy}</p>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="how section">
          <div>
            <div className="eyebrow">How it works</div>

            <h2>From scattered transactions to confident next steps.</h2>
          </div>

          <ol>
            {steps.map((step, index) => (
              <ScrollReveal as="li" delay={index * 90} key={step}>
                <b>0{index + 1}</b>
                <span>{step}</span>
              </ScrollReveal>
            ))}
          </ol>
        </ScrollReveal>

        <ScrollReveal as="section" className="assistant-preview section">
          <div className="assistant-emblem">
            <Bot size={44} />
          </div>

          <div>
            <div className="eyebrow">Smart Finance Assistant</div>

            <h2>Ask better money questions and get answers that fit.</h2>

            <p>
              Ask about saving more, planning a car purchase, reading your
              goal progress, or understanding why your monthly surplus feels
              tight.
            </p>
          </div>

          <div className="assistant-lines" aria-hidden="true">
            <span>hi</span>
            <span>How can I save money?</span>
            <span>Am I on track with my savings goal?</span>
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="cta">
          <div className="eyebrow">Start with clarity</div>

          <h2>Take control of your money without making finance feel heavy.</h2>

          <p>
            Start tracking today and build a clearer, more confident financial
            future.
          </p>

          <Link className="button button-light" to="/register">
            Get started <ArrowRight size={17} />
          </Link>
        </ScrollReveal>
      </main>

      <footer>
        <Brand />

        <span>© {new Date().getFullYear()} FinSight AI</span>

        <div className="footer-actions">
          <Link to="/login">Log in</Link>
          <Link to="/register">Register</Link>
        </div>
      </footer>
    </div>
  );
}
