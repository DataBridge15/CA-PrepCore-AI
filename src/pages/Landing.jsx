import React from 'react'

function Landing({
  onGetStarted = () => {},
  onLogin = () => {},
}) {
  return (
    <div style={styles.page}>
      <style>
        {`
          .landing-header {
            position: sticky;
            top: 0;
            z-index: 50;
          }

          .landing-nav {
            display: flex;
          }

          .landing-header-actions {
            display: flex;
          }

          .landing-hero {
            display: grid;
          }

          .landing-hero-content {
            position: relative;
          }

          .landing-hero-visual {
            display: flex;
          }

          .landing-hero-buttons {
            display: flex;
          }

          .landing-hero-trust {
            display: flex;
          }

          .landing-feature-grid {
            display: grid;
          }

          .landing-steps-grid {
            display: grid;
          }

          .landing-subject-grid {
            display: grid;
          }

          .landing-ai-cta {
            display: flex;
          }

          .landing-footer {
            display: flex;
          }

          .landing-footer-links {
            display: flex;
          }

          @media (max-width: 900px) {
            .landing-header {
              height: 68px !important;
              padding: 0 22px !important;
            }

            .landing-nav {
              display: none !important;
            }

            .landing-header-actions {
              gap: 6px !important;
            }

            .landing-login {
              padding: 9px 10px !important;
              font-size: 12px !important;
            }

            .landing-header-cta {
              padding: 10px 12px !important;
              font-size: 12px !important;
            }

            .landing-hero {
              grid-template-columns: 1fr !important;
              min-height: auto !important;
              padding: 70px 22px 60px !important;
              gap: 30px !important;
            }

            .landing-hero-content {
              max-width: 720px !important;
              margin: 0 auto;
              text-align: center;
            }

            .landing-hero-title {
              font-size: 54px !important;
            }

            .landing-hero-text {
              margin-left: auto !important;
              margin-right: auto !important;
            }

            .landing-hero-buttons {
              justify-content: center !important;
            }

            .landing-hero-trust {
              justify-content: center !important;
            }

            .landing-hero-visual {
              max-width: 850px;
              width: 100%;
              margin: 0 auto;
            }

            .landing-dashboard-mockup {
              max-width: 760px !important;
            }

            .landing-floating-ai {
              right: 0 !important;
            }

            .landing-floating-study {
              left: 0 !important;
            }

            .landing-feature-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            .landing-steps-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            .landing-subject-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            .landing-ai-cta {
              margin-left: 22px !important;
              margin-right: 22px !important;
            }
          }

          @media (max-width: 600px) {
            .landing-header {
              height: 62px !important;
              padding: 0 14px !important;
            }

            .landing-logo-box {
              width: 34px !important;
              height: 34px !important;
              font-size: 11px !important;
            }

            .landing-logo-text {
              font-size: 18px !important;
            }

            .landing-login {
              padding: 8px 8px !important;
              font-size: 11px !important;
            }

            .landing-header-cta {
              padding: 9px 10px !important;
              border-radius: 9px !important;
              font-size: 11px !important;
            }

            .landing-hero {
              padding: 48px 16px 45px !important;
            }

            .landing-hero-title {
              font-size: 42px !important;
              line-height: 1.02 !important;
              letter-spacing: -0.045em !important;
            }

            .landing-hero-text {
              font-size: 14px !important;
              line-height: 1.65 !important;
            }

            .landing-hero-buttons {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 9px !important;
              margin-top: 25px !important;
            }

            .landing-primary-cta,
            .landing-secondary-cta {
              width: 100% !important;
              box-sizing: border-box !important;
              justify-content: center !important;
            }

            .landing-hero-trust {
              justify-content: space-between !important;
              gap: 8px !important;
              margin-top: 28px !important;
            }

            .landing-trust-item strong {
              font-size: 16px !important;
            }

            .landing-trust-item span {
              font-size: 9px !important;
            }

            .landing-trust-divider {
              height: 28px !important;
            }

            .landing-hero-visual {
              display: none !important;
            }

            .landing-section {
              padding: 70px 16px !important;
            }

            .landing-section-header {
              margin-bottom: 34px !important;
            }

            .landing-section-title {
              font-size: 34px !important;
              line-height: 1.08 !important;
            }

            .landing-section-text {
              font-size: 13px !important;
              line-height: 1.65 !important;
            }

            .landing-feature-grid,
            .landing-steps-grid,
            .landing-subject-grid {
              grid-template-columns: 1fr !important;
              gap: 11px !important;
            }

            .landing-feature-card {
              min-height: auto !important;
              padding: 18px !important;
            }

            .landing-feature-title {
              font-size: 16px !important;
            }

            .landing-feature-text {
              font-size: 12px !important;
              line-height: 1.6 !important;
            }

            .landing-feature-arrow {
              margin-top: 14px !important;
              font-size: 11px !important;
            }

            .landing-workflow {
              padding: 70px 16px !important;
            }

            .landing-step {
              padding: 20px 0 !important;
            }

            .landing-step-title {
              font-size: 16px !important;
            }

            .landing-step-text {
              font-size: 12px !important;
            }

            .landing-subject-card {
              padding: 18px !important;
            }

            .landing-subject-title {
              font-size: 16px !important;
            }

            .landing-subject-text {
              font-size: 12px !important;
              line-height: 1.6 !important;
            }

            .landing-ai-cta {
              margin: 10px 16px 70px !important;
              padding: 25px 20px !important;
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 16px !important;
            }

            .landing-ai-title {
              font-size: 29px !important;
            }

            .landing-ai-text {
              font-size: 13px !important;
              line-height: 1.6 !important;
            }

            .landing-ai-button {
              width: 100% !important;
              justify-content: center !important;
            }

            .landing-final {
              padding: 50px 16px 75px !important;
            }

            .landing-final-title {
              font-size: 37px !important;
            }

            .landing-final-text {
              font-size: 13px !important;
            }

            .landing-footer {
              min-height: auto !important;
              padding: 24px 16px !important;
              flex-direction: column !important;
              text-align: center !important;
            }

            .landing-footer-links {
              flex-wrap: wrap !important;
              justify-content: center !important;
              gap: 14px !important;
            }

            .landing-footer-copy {
              font-size: 11px !important;
            }
          }

          @media (max-width: 380px) {
            .landing-hero-title {
              font-size: 37px !important;
            }

            .landing-logo-text {
              font-size: 16px !important;
            }

            .landing-header-cta {
              padding: 8px 9px !important;
            }

            .landing-login {
              padding-left: 6px !important;
              padding-right: 6px !important;
            }

            .landing-trust-item strong {
              font-size: 14px !important;
            }

            .landing-trust-item span {
              font-size: 8px !important;
            }
          }
        `}
      </style>

      {/* HEADER */}
      <header
        className="landing-header"
        style={styles.header}
      >
        <div style={styles.logoWrap}>
          <div
            className="landing-logo-box"
            style={styles.logoBox}
          >
            CA
          </div>

          <div
            className="landing-logo-text"
            style={styles.logoText}
          >
            <strong>PrepCore</strong>
            <span>.AI</span>
          </div>
        </div>

        <nav
          className="landing-nav"
          style={styles.nav}
        >
          <a href="#features" style={styles.navLink}>
            Features
          </a>

          <a href="#how-it-works" style={styles.navLink}>
            How it works
          </a>

          <a href="#subjects" style={styles.navLink}>
            Subjects
          </a>

          <a href="#about" style={styles.navLink}>
            About
          </a>
        </nav>

        <div
          className="landing-header-actions"
          style={styles.headerActions}
        >
          <button
            type="button"
            className="landing-login"
            onClick={onLogin}
            style={styles.loginButton}
          >
            Log in
          </button>

          <button
            type="button"
            className="landing-header-cta"
            onClick={onGetStarted}
            style={styles.headerCta}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section
          className="landing-hero"
          style={styles.hero}
        >
          <div style={styles.heroGlowOne} />
          <div style={styles.heroGlowTwo} />

          <div
            className="landing-hero-content"
            style={styles.heroContent}
          >
            <div style={styles.heroBadge}>
              <span>✦</span>
              Built for CA students
            </div>

            <h1
              className="landing-hero-title"
              style={styles.heroTitle}
            >
              Your smarter way to
              <br />
              <span style={styles.heroHighlight}>
                prepare for CA.
              </span>
            </h1>

            <p
              className="landing-hero-text"
              style={styles.heroText}
            >
              PrepCore.AI brings your subjects, study planning,
              revision, practice and AI doubt solving together
              in one focused learning platform.
            </p>

            <div
              className="landing-hero-buttons"
              style={styles.heroButtons}
            >
              <button
                type="button"
                className="landing-primary-cta"
                onClick={onGetStarted}
                style={styles.primaryCta}
              >
                Start Preparing
                <span>→</span>
              </button>

              <a
                href="#features"
                className="landing-secondary-cta"
                style={styles.secondaryCta}
              >
                Explore Features
              </a>
            </div>

            <div
              className="landing-hero-trust"
              style={styles.heroTrust}
            >
              <div
                className="landing-trust-item"
                style={styles.trustItem}
              >
                <strong>All</strong>
                <span>CA subjects</span>
              </div>

              <div
                className="landing-trust-divider"
                style={styles.trustDivider}
              />

              <div
                className="landing-trust-item"
                style={styles.trustItem}
              >
                <strong>AI</strong>
                <span>Study assistant</span>
              </div>

              <div
                className="landing-trust-divider"
                style={styles.trustDivider}
              />

              <div
                className="landing-trust-item"
                style={styles.trustItem}
              >
                <strong>24/7</strong>
                <span>Study access</span>
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div
            className="landing-hero-visual"
            style={styles.heroVisual}
          >
            <div style={styles.visualGlow} />

            <div
              className="landing-dashboard-mockup"
              style={styles.dashboardMockup}
            >
              <div style={styles.mockTop}>
                <div style={styles.mockLogo}>
                  <div style={styles.mockLogoBox}>
                    CA
                  </div>

                  <strong>PrepCore.AI</strong>
                </div>

                <div style={styles.mockUser}>
                  <span style={styles.mockAvatar}>
                    NJ
                  </span>

                  <span>Niraj</span>
                </div>
              </div>

              <div style={styles.mockBody}>
                <div style={styles.mockSidebar}>
                  <div style={styles.mockSidebarTitle}>
                    PREPCORE
                  </div>

                  {[
                    'Dashboard',
                    'AI Doubt Solver',
                    'My Subjects',
                    'Study Planner',
                    'Revision',
                    'Practice & MCQs',
                  ].map((item, index) => (
                    <div
                      key={item}
                      style={{
                        ...styles.mockSideItem,
                        ...(index === 0
                          ? styles.mockSideActive
                          : {}),
                      }}
                    >
                      <span>
                        {['⌂', '✦', '▣', '◷', '↻', '✓'][
                          index
                        ]}
                      </span>

                      {item}
                    </div>
                  ))}
                </div>

                <div style={styles.mockMain}>
                  <div style={styles.mockWelcome}>
                    <span style={styles.mockSmall}>
                      DASHBOARD
                    </span>

                    <strong>
                      Good afternoon, Niraj 👋
                    </strong>

                    <small>
                      Your CA preparation at a glance.
                    </small>
                  </div>

                  <div style={styles.mockProgressCard}>
                    <div>
                      <span style={styles.mockSmall}>
                        YOUR PREPARATION
                      </span>

                      <strong>
                        Keep your preparation
                        <br />
                        on track.
                      </strong>

                      <small>
                        68% completed this week
                      </small>
                    </div>

                    <div style={styles.mockProgressCircle}>
                      68%
                    </div>
                  </div>

                  <div style={styles.mockStats}>
                    <div style={styles.mockStat}>
                      <span>🔥</span>
                      <strong>12 days</strong>
                      <small>Streak</small>
                    </div>

                    <div style={styles.mockStat}>
                      <span>◷</span>
                      <strong>4h 35m</strong>
                      <small>Study time</small>
                    </div>

                    <div style={styles.mockStat}>
                      <span>✓</span>
                      <strong>18 / 24</strong>
                      <small>Tasks</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="landing-floating-ai"
              style={styles.floatingAi}
            >
              <div style={styles.floatingIcon}>✦</div>

              <div>
                <strong>PrepCore AI</strong>
                <span>Ready to help</span>
              </div>

              <div style={styles.onlineDot} />
            </div>

            <div
              className="landing-floating-study"
              style={styles.floatingStudy}
            >
              <span>✓</span>

              <div>
                <strong>Revision completed</strong>
                <small>Theory of Demand</small>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="landing-section"
          style={styles.section}
        >
          <div
            className="landing-section-header"
            style={styles.sectionHeader}
          >
            <div style={styles.sectionEyebrow}>
              WHY PREPCORE.AI
            </div>

            <h2
              className="landing-section-title"
              style={styles.sectionTitle}
            >
              Everything you need to
              <br />
              <span style={styles.sectionAccent}>
                study smarter.
              </span>
            </h2>

            <p
              className="landing-section-text"
              style={styles.sectionText}
            >
              One connected system for planning, learning,
              revision and exam preparation.
            </p>
          </div>

          <div
            className="landing-feature-grid"
            style={styles.featureGrid}
          >
            <FeatureCard
              icon="✦"
              title="AI Doubt Solver"
              description="Ask CA questions and get clear, step-by-step explanations whenever you need them."
            />

            <FeatureCard
              icon="◷"
              title="Study Planner"
              description="Organise your study sessions and keep your daily preparation on track."
            />

            <FeatureCard
              icon="↻"
              title="Smart Revision"
              description="Know what to revise today, tomorrow and later without losing track."
            />

            <FeatureCard
              icon="✓"
              title="Practice & MCQs"
              description="Test your knowledge with focused practice and understand where you need improvement."
            />

            <FeatureCard
              icon="▣"
              title="Subject Tracking"
              description="Track your syllabus chapter by chapter across all your CA subjects."
            />

            <FeatureCard
              icon="◎"
              title="Exam Readiness"
              description="Get a simple view of your preparation and focus on the areas that matter most."
            />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="landing-workflow"
          style={styles.workflowSection}
        >
          <div
            className="landing-section-header"
            style={styles.sectionHeader}
          >
            <div style={styles.sectionEyebrow}>
              HOW IT WORKS
            </div>

            <h2
              className="landing-section-title"
              style={styles.sectionTitle}
            >
              From confusion to
              <br />
              <span style={styles.sectionAccent}>
                confidence.
              </span>
            </h2>
          </div>

          <div
            className="landing-steps-grid"
            style={styles.stepsGrid}
          >
            <Step
              number="01"
              title="Set your goal"
              text="Choose your CA course and keep your preparation focused on your attempt."
            />

            <Step
              number="02"
              title="Plan your study"
              text="Create a routine with study sessions, revision and practice."
            />

            <Step
              number="03"
              title="Learn & practice"
              text="Study chapters, solve questions and ask PrepCore AI whenever you get stuck."
            />

            <Step
              number="04"
              title="Track your readiness"
              text="See your progress and know what deserves your attention next."
            />
          </div>
        </section>

        {/* SUBJECTS */}
        <section
          id="subjects"
          className="landing-section"
          style={styles.section}
        >
          <div
            className="landing-section-header"
            style={styles.sectionHeader}
          >
            <div style={styles.sectionEyebrow}>
              YOUR CA PREPARATION
            </div>

            <h2
              className="landing-section-title"
              style={styles.sectionTitle}
            >
              All your core subjects.
            </h2>

            <p
              className="landing-section-text"
              style={styles.sectionText}
            >
              Keep every part of your preparation in one
              organised place.
            </p>
          </div>

          <div
            className="landing-subject-grid"
            style={styles.subjectLandingGrid}
          >
            <LandingSubject
              short="ACC"
              title="Accounting"
              text="Build strong fundamentals and improve your numerical accuracy."
            />

            <LandingSubject
              short="LAW"
              title="Business Law"
              text="Understand concepts, provisions and practical case-based questions."
            />

            <LandingSubject
              short="QA"
              title="Quantitative Aptitude"
              text="Develop speed, accuracy and confidence through focused practice."
            />

            <LandingSubject
              short="ECO"
              title="Business Economics"
              text="Master economic concepts with simple explanations and examples."
            />
          </div>
        </section>

        {/* AI CTA */}
        <section
          className="landing-ai-cta"
          style={styles.aiCta}
        >
          <div style={styles.aiCtaGlow} />

          <div style={styles.aiCtaIcon}>✦</div>

          <div
            className="landing-ai-content"
            style={styles.aiCtaContent}
          >
            <span style={styles.aiCtaEyebrow}>
              MEET YOUR STUDY ASSISTANT
            </span>

            <h2
              className="landing-ai-title"
              style={styles.aiCtaTitle}
            >
              Stuck on a concept?
              <br />
              <span>Ask PrepCore AI.</span>
            </h2>

            <p
              className="landing-ai-text"
              style={styles.aiCtaText}
            >
              Get simple explanations, examples and
              step-by-step guidance for your CA preparation.
            </p>
          </div>

          <button
            type="button"
            className="landing-ai-button"
            onClick={onGetStarted}
            style={styles.aiCtaButton}
          >
            Start with AI
            <span>→</span>
          </button>
        </section>

        {/* FINAL CTA */}
        <section
          id="about"
          className="landing-final"
          style={styles.finalSection}
        >
          <div style={styles.finalBadge}>
            <span>✦</span>
            PREPCORE.AI
          </div>

          <h2
            className="landing-final-title"
            style={styles.finalTitle}
          >
            Your CA journey deserves
            <br />
            a better system.
          </h2>

          <p
            className="landing-final-text"
            style={styles.finalText}
          >
            Plan better. Learn better. Revise smarter.
            Prepare with confidence.
          </p>

          <button
            type="button"
            onClick={onGetStarted}
            style={styles.primaryCta}
          >
            Create your account
            <span>→</span>
          </button>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        className="landing-footer"
        style={styles.footer}
      >
        <div style={styles.footerBrand}>
          <div style={styles.logoBox}>CA</div>

          <div>
            <strong>PrepCore</strong>
            <span>.AI</span>
          </div>
        </div>

        <span
          className="landing-footer-copy"
          style={styles.footerCopy}
        >
          © 2026 PrepCore.AI · Built for CA students
        </span>

        <div
          className="landing-footer-links"
          style={styles.footerLinks}
        >
          <a href="#features" style={styles.footerLink}>
            Features
          </a>

          <a
            href="#how-it-works"
            style={styles.footerLink}
          >
            How it works
          </a>

          <a href="#subjects" style={styles.footerLink}>
            Subjects
          </a>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div
      className="landing-feature-card"
      style={styles.featureCard}
    >
      <div style={styles.featureIcon}>{icon}</div>

      <h3
        className="landing-feature-title"
        style={styles.featureTitle}
      >
        {title}
      </h3>

      <p
        className="landing-feature-text"
        style={styles.featureText}
      >
        {description}
      </p>

      <span
        className="landing-feature-arrow"
        style={styles.featureArrow}
      >
        Explore →
      </span>
    </div>
  )
}

function Step({
  number,
  title,
  text,
}) {
  return (
    <div
      className="landing-step"
      style={styles.step}
    >
      <div style={styles.stepNumber}>
        {number}
      </div>

      <h3
        className="landing-step-title"
        style={styles.stepTitle}
      >
        {title}
      </h3>

      <p
        className="landing-step-text"
        style={styles.stepText}
      >
        {text}
      </p>
    </div>
  )
}

function LandingSubject({
  short,
  title,
  text,
}) {
  return (
    <div
      className="landing-subject-card"
      style={styles.subjectLandingCard}
    >
      <div style={styles.subjectLandingTop}>
        <div style={styles.subjectLandingIcon}>
          {short}
        </div>

        <span style={styles.subjectArrow}>
          →
        </span>
      </div>

      <h3
        className="landing-subject-title"
        style={styles.subjectLandingTitle}
      >
        {title}
      </h3>

      <p
        className="landing-subject-text"
        style={styles.subjectLandingText}
      >
        {text}
      </p>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(180deg, #f9fbfe 0%, #f2f6fb 100%)',
    color: '#0b1f3a',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    overflowX: 'hidden',
  },

  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    height: '76px',
    padding: '0 6%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(255,255,255,.92)',
    borderBottom: '1px solid #e5ebf2',
    backdropFilter: 'blur(14px)',
  },

  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
  },

  logoBox: {
    width: '38px',
    height: '38px',
    borderRadius: '11px',
    display: 'grid',
    placeItems: 'center',
    background:
      'linear-gradient(145deg, #e5b552, #b77e25)',
    color: '#0c2748',
    fontWeight: 800,
    fontSize: '13px',
    boxShadow:
      '0 7px 18px rgba(157,112,38,.16)',
  },

  logoText: {
    fontSize: '21px',
    letterSpacing: '-.04em',
    color: '#18365e',
  },

  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },

  navLink: {
    textDecoration: 'none',
    color: '#64758d',
    fontSize: '14px',
    fontWeight: 600,
  },

  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  loginButton: {
    border: 'none',
    background: 'transparent',
    color: '#17375f',
    padding: '11px 16px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  headerCta: {
    border: '1px solid #17375f',
    background: '#17375f',
    color: '#fff',
    padding: '11px 18px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow:
      '0 8px 20px rgba(23,55,95,.15)',
  },

  hero: {
    position: 'relative',
    minHeight: '720px',
    padding: '90px 6% 70px',
    display: 'grid',
    gridTemplateColumns: '1fr 1.08fr',
    alignItems: 'center',
    gap: '70px',
    overflow: 'hidden',
  },

  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '630px',
  },

  heroGlowOne: {
    position: 'absolute',
    width: '520px',
    height: '520px',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(38,89,146,.11), transparent 68%)',
    left: '-180px',
    top: '-140px',
    pointerEvents: 'none',
  },

  heroGlowTwo: {
    position: 'absolute',
    width: '700px',
    height: '700px',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(226,177,77,.08), transparent 70%)',
    right: '-300px',
    top: '-220px',
    pointerEvents: 'none',
  },

  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '999px',
    background: '#edf4fb',
    border: '1px solid #dbe7f3',
    color: '#36587f',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '.08em',
    textTransform: 'uppercase',
  },

  heroTitle: {
    margin: '24px 0 20px',
    fontSize: '67px',
    lineHeight: '1.01',
    letterSpacing: '-.055em',
    fontWeight: 800,
    color: '#0a2240',
  },

  heroHighlight: {
    color: '#174579',
  },

  heroText: {
    maxWidth: '600px',
    margin: 0,
    fontSize: '18px',
    lineHeight: 1.75,
    color: '#697b92',
  },

  heroButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
    marginTop: '32px',
  },

  primaryCta: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    border: 'none',
    borderRadius: '11px',
    background: '#17375f',
    color: '#fff',
    padding: '15px 20px',
    fontSize: '15px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow:
      '0 12px 25px rgba(23,55,95,.18)',
  },

  secondaryCta: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 18px',
    border: '1px solid #d7e0eb',
    borderRadius: '11px',
    background: '#fff',
    color: '#264567',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 700,
  },

  heroTrust: {
    display: 'flex',
    alignItems: 'center',
    gap: '22px',
    marginTop: '42px',
  },

  trustItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },

  trustDivider: {
    width: '1px',
    height: '32px',
    background: '#dce4ed',
  },

  heroVisual: {
    position: 'relative',
    minHeight: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  visualGlow: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(25,65,108,.12), transparent 66%)',
  },

  dashboardMockup: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: '690px',
    borderRadius: '20px',
    overflow: 'hidden',
    background: '#fff',
    border: '1px solid #dce5ef',
    boxShadow:
      '0 30px 70px rgba(18,45,76,.16)',
    transform:
      'perspective(1200px) rotateY(-4deg) rotateX(1deg)',
  },

  mockTop: {
    height: '58px',
    padding: '0 17px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e7edf4',
    background: '#fff',
  },

  mockLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#18375d',
    fontSize: '12px',
  },

  mockLogoBox: {
    width: '28px',
    height: '28px',
    borderRadius: '7px',
    display: 'grid',
    placeItems: 'center',
    background: '#d8a341',
    color: '#16385f',
    fontSize: '9px',
    fontWeight: 800,
  },

  mockUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '11px',
    color: '#5c6f87',
  },

  mockAvatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background:
      'linear-gradient(145deg, #456b9a, #173c6b)',
    display: 'grid',
    placeItems: 'center',
    color: '#fff',
    fontSize: '8px',
    fontWeight: 800,
  },

  mockBody: {
    display: 'grid',
    gridTemplateColumns: '145px 1fr',
    minHeight: '350px',
  },

  mockSidebar: {
    padding: '17px 10px',
    background: '#102b4d',
    color: '#b8c9dd',
  },

  mockSidebarTitle: {
    padding: '0 8px',
    marginBottom: '17px',
    fontSize: '8px',
    letterSpacing: '.16em',
    fontWeight: 800,
    color: '#8096af',
  },

  mockSideItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 8px',
    marginBottom: '4px',
    borderRadius: '7px',
    fontSize: '9px',
    fontWeight: 700,
  },

  mockSideActive: {
    background: 'rgba(255,255,255,.10)',
    color: '#fff',
  },

  mockMain: {
    padding: '22px',
    background: '#f5f8fc',
  },

  mockWelcome: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  mockSmall: {
    fontSize: '7px',
    letterSpacing: '.16em',
    color: '#8a9ab0',
    fontWeight: 800,
  },

  mockProgressCard: {
    marginTop: '20px',
    padding: '20px',
    borderRadius: '13px',
    background:
      'linear-gradient(135deg, #173b67, #1d4d82)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  mockProgressCircle: {
    width: '78px',
    height: '78px',
    borderRadius: '50%',
    border: '7px solid rgba(255,255,255,.2)',
    borderTopColor: '#e2b14d',
    display: 'grid',
    placeItems: 'center',
    fontSize: '13px',
    fontWeight: 800,
  },

  mockStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: '10px',
    marginTop: '12px',
  },

  mockStat: {
    padding: '13px',
    borderRadius: '10px',
    background: '#fff',
    border: '1px solid #e2eaf2',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  floatingAi: {
    position: 'absolute',
    zIndex: 4,
    right: '-18px',
    top: '70px',
    width: '190px',
    padding: '13px',
    borderRadius: '14px',
    background: '#fff',
    border: '1px solid #dfe7ef',
    boxShadow:
      '0 18px 40px rgba(20,50,80,.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  floatingIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '9px',
    background: '#eef3f8',
    display: 'grid',
    placeItems: 'center',
    color: '#173b66',
    fontWeight: 800,
  },

  onlineDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#39a56b',
    marginLeft: 'auto',
  },

  floatingStudy: {
    position: 'absolute',
    zIndex: 4,
    left: '-25px',
    bottom: '55px',
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '12px 14px',
    borderRadius: '12px',
    background: '#fff',
    border: '1px solid #dfe7ef',
    boxShadow:
      '0 18px 35px rgba(20,50,80,.14)',
  },

  section: {
    padding: '110px 6%',
  },

  sectionHeader: {
    maxWidth: '720px',
    margin: '0 auto 52px',
    textAlign: 'center',
  },

  sectionEyebrow: {
    display: 'inline-block',
    marginBottom: '12px',
    color: '#b18235',
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '.16em',
  },

  sectionTitle: {
    margin: 0,
    fontSize: '46px',
    lineHeight: 1.08,
    letterSpacing: '-.04em',
    color: '#0b2442',
  },

  sectionAccent: {
    color: '#1a497e',
  },

  sectionText: {
    margin: '18px auto 0',
    maxWidth: '610px',
    color: '#6d7e95',
    fontSize: '16px',
    lineHeight: 1.7,
  },

  featureGrid: {
    maxWidth: '1160px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns:
      'repeat(3, minmax(0, 1fr))',
    gap: '18px',
  },

  featureCard: {
    padding: '28px',
    borderRadius: '16px',
    background: '#fff',
    border: '1px solid #e0e8f1',
    minHeight: '230px',
    transition: 'transform .2s ease',
  },

  featureIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: '#edf3f9',
    display: 'grid',
    placeItems: 'center',
    color: '#173d69',
    fontWeight: 800,
    fontSize: '17px',
  },

  featureTitle: {
    margin: '21px 0 8px',
    fontSize: '19px',
    color: '#102d4f',
  },

  featureText: {
    margin: 0,
    color: '#718198',
    lineHeight: 1.65,
    fontSize: '14px',
  },

  featureArrow: {
    display: 'inline-block',
    marginTop: '22px',
    color: '#1b4b82',
    fontSize: '13px',
    fontWeight: 800,
  },

  workflowSection: {
    padding: '110px 6%',
    background: '#102d4f',
    color: '#fff',
  },

  stepsGrid: {
    maxWidth: '1160px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns:
      'repeat(4, minmax(0,1fr))',
    gap: '30px',
  },

  step: {
    padding: '26px 0',
    borderTop: '1px solid rgba(255,255,255,.18)',
  },

  stepNumber: {
    color: '#e4b552',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '.12em',
  },

  stepTitle: {
    margin: '18px 0 10px',
    fontSize: '20px',
  },

  stepText: {
    margin: 0,
    color: '#b8c9dc',
    lineHeight: 1.7,
    fontSize: '14px',
  },

  subjectLandingGrid: {
    maxWidth: '1160px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns:
      'repeat(4, minmax(0,1fr))',
    gap: '18px',
  },

  subjectLandingCard: {
    padding: '24px',
    borderRadius: '15px',
    background: '#fff',
    border: '1px solid #e0e8f1',
  },

  subjectLandingTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  subjectLandingIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    display: 'grid',
    placeItems: 'center',
    background: '#eef4fa',
    color: '#1b4a7e',
    fontSize: '12px',
    fontWeight: 800,
  },

  subjectArrow: {
    color: '#9baabc',
    fontSize: '18px',
  },

  subjectLandingTitle: {
    margin: '22px 0 8px',
    fontSize: '18px',
    color: '#102d4f',
  },

  subjectLandingText: {
    margin: 0,
    color: '#718198',
    fontSize: '14px',
    lineHeight: 1.65,
  },

  aiCta: {
    position: 'relative',
    maxWidth: '1160px',
    margin: '30px auto 110px',
    padding: '42px 48px',
    borderRadius: '20px',
    background:
      'linear-gradient(125deg, #102c4e, #1b4b80)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
    overflow: 'hidden',
  },

  aiCtaGlow: {
    position: 'absolute',
    width: '330px',
    height: '330px',
    right: '-130px',
    top: '-160px',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(227,181,83,.22), transparent 66%)',
  },

  aiCtaIcon: {
    position: 'relative',
    zIndex: 1,
    width: '58px',
    height: '58px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,.1)',
    display: 'grid',
    placeItems: 'center',
    fontSize: '22px',
    color: '#e7ba61',
    flexShrink: 0,
  },

  aiCtaContent: {
    position: 'relative',
    zIndex: 1,
    flex: 1,
  },

  aiCtaEyebrow: {
    fontSize: '10px',
    letterSpacing: '.16em',
    color: '#d9c28e',
    fontWeight: 800,
  },

  aiCtaTitle: {
    margin: '8px 0',
    fontSize: '34px',
    lineHeight: 1.15,
    letterSpacing: '-.035em',
  },

  aiCtaText: {
    margin: 0,
    color: '#c4d1e0',
    lineHeight: 1.6,
    fontSize: '14px',
    maxWidth: '640px',
  },

  aiCtaButton: {
    position: 'relative',
    zIndex: 1,
    border: 'none',
    borderRadius: '11px',
    background: '#e1b04f',
    color: '#17385e',
    padding: '15px 19px',
    fontWeight: 800,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    flexShrink: 0,
  },

  finalSection: {
    padding: '70px 6% 120px',
    textAlign: 'center',
  },

  finalBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#7e8da2',
    fontWeight: 800,
    letterSpacing: '.14em',
    fontSize: '10px',
  },

  finalTitle: {
    margin: '18px 0 15px',
    fontSize: '52px',
    lineHeight: 1.08,
    letterSpacing: '-.05em',
    color: '#0c2644',
  },

  finalText: {
    maxWidth: '580px',
    margin: '0 auto',
    color: '#708198',
    fontSize: '16px',
    lineHeight: 1.7,
  },

  footer: {
    minHeight: '74px',
    padding: '0 6%',
    borderTop: '1px solid #e0e7ef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '25px',
    background: '#fff',
  },

  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '16px',
    color: '#17375f',
  },

  footerCopy: {
    fontSize: '12px',
    color: '#8b99aa',
  },

  footerLinks: {
    display: 'flex',
    gap: '20px',
  },

  footerLink: {
    color: '#718198',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: 600,
  },
}

export default Landing