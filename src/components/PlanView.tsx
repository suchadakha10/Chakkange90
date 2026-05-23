import type { ChallengePlan } from "../domain/types";

export function PlanView({ plan }: { plan: ChallengePlan }) {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">13-week arc</p>
          <h2>90-Day Plan</h2>
          <p>Weekly themes keep the challenge focused while daily tasks keep proof moving.</p>
        </div>
      </header>
      <div className="week-grid">
        {plan.weeks.map((week) => (
          <section className="panel" key={week.week}>
            <h3>
              W{week.week}: {week.theme}
            </h3>
            <p>{week.outcome}</p>
            <ol>
              {week.days.map((day) => (
                <li key={day.day}>
                  Day {day.day}: {day.title} {day.requiresMotion ? "(motion)" : ""}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
