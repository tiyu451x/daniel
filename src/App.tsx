import { useMemo, useState } from "react";

type Tab = "overview" | "inventory" | "quests" | "skills" | "map" | "settings";

type Item = {
  name: string;
  type: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  qty: number;
  description: string;
};

type Quest = {
  title: string;
  progress: number;
  reward: string;
  done: boolean;
};

type Skill = {
  name: string;
  level: number;
  max: number;
};

const rarityStyle: Record<Item["rarity"], string> = {
  Common: "border-slate-700 bg-slate-900/60 text-slate-200",
  Rare: "border-sky-500/40 bg-sky-950/40 text-sky-200",
  Epic: "border-violet-500/40 bg-violet-950/40 text-violet-200",
  Legendary: "border-amber-500/40 bg-amber-950/40 text-amber-200",
};

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "inventory", label: "Inventory" },
  { key: "quests", label: "Quests" },
  { key: "skills", label: "Skills" },
  { key: "map", label: "Map" },
  { key: "settings", label: "Settings" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("overview");
  const [gold, setGold] = useState(1240);
  const [xp, setXp] = useState(68);
  const [level, setLevel] = useState(12);
  const [stamina, setStamina] = useState(82);
  const [notifications, setNotifications] = useState<string[]>([
    "New region discovered: Ember Coast",
    "Daily reward available",
  ]);

  const [items, setItems] = useState<Item[]>([
    {
      name: "Iron Sword",
      type: "Weapon",
      rarity: "Rare",
      qty: 1,
      description: "Reliable blade with balanced damage.",
    },
    {
      name: "Healing Potion",
      type: "Consumable",
      rarity: "Common",
      qty: 5,
      description: "Restores a moderate amount of HP.",
    },
    {
      name: "Wind Charm",
      type: "Accessory",
      rarity: "Epic",
      qty: 1,
      description: "Improves movement speed and dodge rate.",
    },
    {
      name: "Ancient Key",
      type: "Quest",
      rarity: "Legendary",
      qty: 1,
      description: "Opens a sealed gate somewhere in the world.",
    },
  ]);

  const [quests, setQuests] = useState<Quest[]>([
    { title: "Speak to the village elder", progress: 100, reward: "120 Gold", done: true },
    { title: "Collect 8 crystal shards", progress: 62, reward: "Rare Chest", done: false },
    { title: "Defeat the cave guardian", progress: 18, reward: "700 XP", done: false },
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { name: "Attack", level: 4, max: 10 },
    { name: "Defense", level: 3, max: 10 },
    { name: "Magic", level: 6, max: 10 },
    { name: "Crafting", level: 2, max: 10 },
    { name: "Luck", level: 5, max: 10 },
  ]);

  const worldPoints = useMemo(
    () => [
      { name: "Forest Gate", x: "18%", y: "35%", status: "clear" },
      { name: "Crystal Mine", x: "42%", y: "58%", status: "danger" },
      { name: "Old Harbor", x: "66%", y: "24%", status: "quest" },
      { name: "Sky Tower", x: "78%", y: "70%", status: "locked" },
    ],
    []
  );

  const addNotification = (msg: string) => {
    setNotifications((prev) => [msg, ...prev].slice(0, 4));
  };

  const gainXP = (amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      if (next >= 100) {
        setLevel((lv) => lv + 1);
        addNotification(`Level up! You reached level ${level + 1}`);
        return next - 100;
      }
      return next;
    });
  };

  const collectGold = (amount: number) => {
    setGold((prev) => prev + amount);
    addNotification(`You found ${amount} gold`);
  };

  const usePotion = () => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.name === "Healing Potion" && i.qty > 0);
      if (idx === -1) {
        addNotification("No healing potions left");
        return prev;
      }

      const next = [...prev];
      next[idx] = { ...next[idx], qty: next[idx].qty - 1 };
      addNotification("Used 1 Healing Potion");
      setStamina((s) => Math.min(100, s + 12));
      return next;
    });
  };

  const completeQuest = (title: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.title === title ? { ...q, progress: 100, done: true } : q))
    );
    gainXP(25);
    collectGold(80);
    addNotification(`Quest completed: ${title}`);
  };

  const trainSkill = (name: string) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.name === name ? { ...s, level: Math.min(s.max, s.level + 1) } : s
      )
    );
    gainXP(8);
    addNotification(`${name} increased`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">
                Prototype UI
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Arcane Kingdom Command Center
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                A complete React game interface shell. Replace the mock data with your actual game state later.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Level" value={level} />
              <StatCard label="Gold" value={gold} />
              <StatCard label="XP" value={`${xp}/100`} />
              <StatCard label="Stamina" value={`${stamina}%`} />
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <BarStat label="Experience" value={xp} max={100} />
            <BarStat label="Stamina" value={stamina} max={100} />
            <BarStat label="Quest Completion" value={quests.filter((q) => q.done).length} max={quests.length} />
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                tab === t.key
                  ? "border-cyan-400 bg-cyan-400/15 text-cyan-300"
                  : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
            {tab === "overview" && (
              <div className="grid gap-5 md:grid-cols-2">
                <Panel title="Actions">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ActionButton onClick={() => gainXP(12)} label="+12 XP" />
                    <ActionButton onClick={() => collectGold(50)} label="+50 Gold" />
                    <ActionButton onClick={usePotion} label="Use Potion" />
                    <ActionButton
                      onClick={() => addNotification("Camera panned to current objective")}
                      label="Ping Objective"
                    />
                  </div>
                </Panel>

                <Panel title="Current Status">
                  <div className="space-y-3 text-sm text-slate-300">
                    <StatusLine label="Current Zone" value="Aether Plains" />
                    <StatusLine label="Main Objective" value="Reach the Sky Tower" />
                    <StatusLine label="Party" value="1 / 4 members" />
                    <StatusLine label="Difficulty" value="Normal" />
                  </div>
                </Panel>

                <Panel title="Recent Notifications" className="md:col-span-2">
                  <div className="space-y-2">
                    {notifications.map((n, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-300"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            )}

            {tab === "inventory" && (
              <Panel title="Inventory">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <div
                      key={item.name}
                      className={`rounded-2xl border p-4 ${rarityStyle[item.rarity]}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold">{item.name}</h3>
                          <p className="text-xs uppercase tracking-widest text-slate-400">
                            {item.type}
                          </p>
                        </div>
                        <span className="rounded-full border border-white/10 px-2 py-1 text-xs">
                          x{item.qty}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed opacity-90">
                        {item.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-[0.2em]">
                          {item.rarity}
                        </span>
                        <button
                          onClick={() => addNotification(`Inspected ${item.name}`)}
                          className="rounded-xl border border-white/10 bg-black/20 px-3 py-1.5 text-xs hover:bg-black/30"
                        >
                          Inspect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {tab === "quests" && (
              <Panel title="Quest Log">
                <div className="space-y-4">
                  {quests.map((q) => (
                    <div key={q.title} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-semibold">{q.title}</h3>
                          <p className="text-sm text-slate-400">Reward: {q.reward}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              q.done
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-amber-500/15 text-amber-300"
                            }`}
                          >
                            {q.done ? "Complete" : "In Progress"}
                          </span>
                          {!q.done && (
                            <button
                              onClick={() => completeQuest(q.title)}
                              className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-400/15"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          style={{ width: `${q.progress}%` }}
                        />
                      </div>
                      <div className="mt-2 text-right text-xs text-slate-500">{q.progress}%</div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {tab === "skills" && (
              <Panel title="Skill Tree">
                <div className="grid gap-4 md:grid-cols-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{skill.name}</h3>
                        <span className="text-sm text-slate-400">
                          Lv. {skill.level}/{skill.max}
                        </span>
                      </div>

                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500"
                          style={{ width: `${(skill.level / skill.max) * 100}%` }}
                        />
                      </div>

                      <button
                        onClick={() => trainSkill(skill.name)}
                        className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                      >
                        Train Skill
                      </button>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {tab === "map" && (
              <Panel title="World Map">
                <div className="relative h-[420px] overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_55%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
                  </div>

                  {worldPoints.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => addNotification(`Selected ${p.name}`)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-xs font-medium shadow-lg transition hover:scale-105 ${
                        p.status === "danger"
                          ? "border-red-400/40 bg-red-500/15 text-red-200"
                          : p.status === "quest"
                          ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-200"
                          : p.status === "locked"
                          ? "border-slate-500/40 bg-slate-500/15 text-slate-300"
                          : "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                      }`}
                      style={{ left: p.x, top: p.y }}
                    >
                      {p.name}
                    </button>
                  ))}

                  <div className="absolute bottom-4 left-4 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                    Click a location to create a notification.
                  </div>
                </div>
              </Panel>
            )}

            {tab === "settings" && (
              <Panel title="Settings">
                <div className="grid gap-4 md:grid-cols-2">
                  <SettingRow label="Fullscreen" value="On" />
                  <SettingRow label="Music Volume" value="78%" />
                  <SettingRow label="SFX Volume" value="90%" />
                  <SettingRow label="Graphics" value="High" />
                  <SettingRow label="Language" value="English" />
                  <SettingRow label="UI Scale" value="100%" />
                </div>
              </Panel>
            )}
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
              <h2 className="text-lg font-semibold">Party Panel</h2>
              <div className="mt-4 space-y-3">
                {[
                  ["You", "Sword / Magic", "HP 100%"],
                  ["Astra", "Archer", "HP 84%"],
                  ["Milo", "Tank", "HP 97%"],
                ].map(([name, role, hp]) => (
                  <div key={name} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-xs text-slate-400">{role}</p>
                      </div>
                      <span className="text-sm text-slate-300">{hp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
              <h2 className="text-lg font-semibold">Quick Controls</h2>
              <div className="mt-4 grid gap-3">
                <ActionButton onClick={() => gainXP(20)} label="Practice Battle" />
                <ActionButton onClick={() => collectGold(120)} label="Loot Chest" />
                <ActionButton onClick={usePotion} label="Consume Potion" />
                <ActionButton onClick={() => setStamina(100)} label="Rest at Camp" />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
              <h2 className="text-lg font-semibold">System Log</h2>
              <div className="mt-4 space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-sm text-slate-400">No notifications.</p>
                ) : (
                  notifications.map((note, i) => (
                    <div key={i} className="rounded-2xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-300">
                      {note}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function BarStat({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">
          {value}/{max}
        </span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-slate-800 bg-slate-950/40 p-5 ${className}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-200"
    >
      {label}
    </button>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-100">{value}</span>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-slate-300">{label}</span>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-100">
          {value}
        </span>
      </div>
    </div>
  );
}