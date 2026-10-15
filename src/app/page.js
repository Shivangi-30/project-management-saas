
import Link from "next/link";

const features = [
  {
    number: "01",
    icon: "◫",
    title: "Project Management",
    description:
      "Organize your projects, set priorities, and keep every initiative moving forward.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    number: "02",
    icon: "✓",
    title: "Task Tracking",
    description:
      "Create tasks, manage deadlines, and track progress from one simple workspace.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    number: "03",
    icon: "↗",
    title: "Progress Insights",
    description:
      "Understand what is completed, what is pending, and what needs your attention.",
    color: "bg-emerald-100 text-emerald-700",
  },
];

const tasks = [
  {
    title: "Design landing page",
    project: "Website Redesign",
    status: "Completed",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Build authentication",
    project: "SaaS Application",
    status: "In Progress",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Review project tasks",
    project: "Mobile App",
    status: "Pending",
    color: "bg-amber-100 text-amber-700",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-xl font-bold text-white shadow-lg shadow-violet-200">
              P
            </span>
            <span className="text-lg font-bold tracking-tight sm:text-xl">
              ProjectFlow
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-violet-600"
            >
              Features
            </a>
            <a
              href="#workflow"
              className="text-sm font-medium text-slate-600 transition hover:text-violet-600"
            >
              How it works
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-violet-700 sm:px-4"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-violet-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 sm:px-5"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-white to-blue-50" />
        <div className="absolute -right-32 top-10 -z-10 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl sm:h-96 sm:w-96" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3.5 py-2 text-xs font-semibold text-violet-700 shadow-sm sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              YOUR WORK, ALL IN ONE PLACE
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Plan better.
              <br />
              Work smarter.
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                Achieve more.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Bring your projects, tasks, and progress together in one
              organized workspace. Spend less time managing work and more time
              getting it done.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                Get Started Free <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Simple workflow
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Clear task tracking
              </span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br from-violet-200/70 to-blue-200/70 blur-xl" />

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/50">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    WORKSPACE OVERVIEW
                  </p>
                  <h2 className="mt-1 text-lg font-bold">Your Dashboard</h2>
                </div>
                <span className="rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
                  This month
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 sm:gap-3 sm:p-5">
                <div className="rounded-xl bg-violet-50 p-3 sm:p-4">
                  <p className="text-xs text-slate-600">Projects</p>
                  <p className="mt-2 text-2xl font-bold text-violet-700">12</p>
                  <p className="mt-1 text-xs text-slate-500">Active</p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 sm:p-4">
                  <p className="text-xs text-slate-600">Tasks</p>
                  <p className="mt-2 text-2xl font-bold text-blue-700">48</p>
                  <p className="mt-1 text-xs text-slate-500">Total</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 sm:p-4">
                  <p className="text-xs text-slate-600">Completed</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-700">76%</p>
                  <p className="mt-1 text-xs text-slate-500">Progress</p>
                </div>
              </div>

              <div className="px-4 pb-5 sm:px-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold">Recent Tasks</h3>
                  <span className="text-xs font-medium text-slate-500">
                    Preview
                  </span>
                </div>

                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.title}
                      className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          ✓
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {task.title}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {task.project}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold sm:text-xs ${task.color}`}
                      >
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="font-medium text-slate-600">
                      Overall progress
                    </span>
                    <span className="font-bold text-violet-700">76%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-violet-600 to-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-2 hidden rounded-xl border border-slate-100 bg-white p-4 shadow-xl sm:block md:-left-8">
              <p className="text-xs text-slate-500">Weekly productivity</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                On track <span className="text-emerald-600">↗</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
              Everything in one place
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              A simpler way to manage your work
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              The essential tools you need to keep projects organized and
              everyone focused on what matters.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/60 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold ${feature.color}`}
                  >
                    {feature.icon}
                  </span>
                  <span className="text-sm font-semibold text-slate-300">
                    {feature.number}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="scroll-mt-24 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
              A workflow that works
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              From a new idea to a completed project.
            </h2>
            <p className="mt-5 leading-7 text-slate-600">
              Keep your work structured from day one. Create a project, break
              it into manageable tasks, and follow progress as work moves
              forward.
            </p>
            <Link
              href="/auth/register"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-violet-700 transition hover:text-violet-900"
            >
              Start organizing your work <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Create your project",
                text: "Give your work a clear name and objective.",
              },
              {
                step: "02",
                title: "Add and organize tasks",
                text: "Turn your goals into actionable steps.",
              },
              {
                step: "03",
                title: "Track your progress",
                text: "Review task status and keep moving forward.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:gap-5 sm:p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 font-bold text-violet-700">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-blue-600 px-6 py-12 text-center text-white shadow-xl shadow-violet-200 sm:px-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-200">
            Make work feel simpler
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to bring your projects together?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-violet-100">
            Start building a more organized workflow with one place for your
            projects and tasks.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-50"
          >
            Get Started Free <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm text-white">
              P
            </span>
            ProjectFlow
          </Link>

          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} ProjectFlow. Built to make work simpler.
          </p>

          <div className="flex items-center gap-5 text-sm font-medium text-slate-600">
            <Link
              href="/auth/login"
              className="transition hover:text-violet-700"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="transition hover:text-violet-700"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
