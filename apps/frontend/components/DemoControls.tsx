"use client";

import { useLang } from "@/lib/i18n";

interface Step {
  action: string;
  n: number;
  labelKey: string;
  descKey: string;
  tone?: "default" | "danger";
}

interface Section {
  titleKey: string;
  descKey: string;
  steps: Step[];
}

const SECTIONS: Section[] = [
  {
    titleKey: "sectionSetupTitle",
    descKey: "sectionSetupDesc",
    steps: [
      { action: "lp_deposit", n: 1, labelKey: "step1Label", descKey: "step1Desc" },
      { action: "register_agent", n: 2, labelKey: "step2Label", descKey: "step2Desc" },
      { action: "open_channel", n: 3, labelKey: "step3Label", descKey: "step3Desc" },
    ],
  },
  {
    titleKey: "sectionUsageTitle",
    descKey: "sectionUsageDesc",
    steps: [
      { action: "consume", n: 4, labelKey: "step4Label", descKey: "step4Desc" },
      { action: "settle_close", n: 5, labelKey: "step5Label", descKey: "step5Desc" },
      { action: "repay", n: 6, labelKey: "step6Label", descKey: "step6Desc" },
    ],
  },
  {
    titleKey: "sectionRiskTitle",
    descKey: "sectionRiskDesc",
    steps: [
      { action: "bad_agent_consume", n: 7, labelKey: "step7Label", descKey: "step7Desc" },
      { action: "bad_agent_default", n: 8, labelKey: "step8Label", descKey: "step8Desc", tone: "danger" },
      { action: "blocked_attack", n: 9, labelKey: "step9Label", descKey: "step9Desc", tone: "danger" },
    ],
  },
];

const ALL_ACTIONS = SECTIONS.flatMap((s) => s.steps.map((st) => st.action));

interface Props {
  onDispatch: (action: string) => void;
  onReset: () => void;
  completed: Set<string>;
}

export function DemoControls({ onDispatch, onReset, completed }: Props) {
  const { t } = useLang();

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-cloud">{t("panelControls")}</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-cloud/50">
            {completed.size}/{ALL_ACTIONS.length} {t("progress")}
          </span>
          <button
            onClick={onReset}
            className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-cloud/70 hover:bg-white/5"
          >
            {t("reset")}
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.titleKey}>
            <div className="mb-2.5">
              <h3 className="text-base font-semibold text-cloud">{t(section.titleKey)}</h3>
              <p className="text-sm text-cloud/45">{t(section.descKey)}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {section.steps.map((s) => {
                const done = completed.has(s.action);
                const danger = s.tone === "danger";
                return (
                  <button
                    key={s.action}
                    onClick={() => onDispatch(s.action)}
                    className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                      danger
                        ? "border-cherry/40 bg-cherry/10 hover:bg-cherry/20"
                        : done
                          ? "border-emerald-400/30 bg-emerald-400/[0.06] hover:bg-emerald-400/10"
                          : "border-white/10 bg-white/[0.02] hover:bg-white/10"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        done ? "bg-emerald-400 text-obsidian" : "bg-white/10 text-cloud/70"
                      }`}
                    >
                      {done ? "✓" : s.n}
                    </span>
                    <span>
                      <span className="block text-base font-medium text-cloud">{t(s.labelKey)}</span>
                      <span className="block text-sm text-cloud/50">{t(s.descKey)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
