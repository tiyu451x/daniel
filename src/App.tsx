import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

type Note = { id: string; title: string; content: string; updatedAt: number };
type Account = { name: string; email: string; password: string };

const accountKey = "pocket-notes-account";
const notesKey = "pocket-notes-items";

const starterNotes: Note[] = [
  { id: "welcome", title: "Welcome to Pocket Notes", content: "This is your calm little space for ideas, reminders, and everything in between.\n\nYour notes are saved in this browser automatically.", updatedAt: Date.now() },
  { id: "ideas", title: "Things to remember", content: "• Keep it simple\n• Make room for good ideas\n• One note at a time", updatedAt: Date.now() - 3600000 },
];

function getStored<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "") as T; } catch { return fallback; }
}

function formatDate(timestamp: number) {
  const difference = Date.now() - timestamp;
  if (difference < 60000) return "Just now";
  if (difference < 3600000) return `${Math.floor(difference / 60000)} min ago`;
  if (difference < 86400000) return `${Math.floor(difference / 3600000)} hr ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function App() {
  const [account, setAccount] = useState<Account | null>(() => getStored<Account | null>(accountKey, null));
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [notes, setNotes] = useState<Note[]>(() => getStored(notesKey, starterNotes));
  const [selectedId, setSelectedId] = useState(() => getStored(notesKey, starterNotes)[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { localStorage.setItem(notesKey, JSON.stringify(notes)); }, [notes]);
  useEffect(() => { if (account) localStorage.setItem(accountKey, JSON.stringify(account)); }, [account]);

  const selected = notes.find((note) => note.id === selectedId) ?? notes[0];
  const filteredNotes = useMemo(() => notes.filter((note) => `${note.title} ${note.content}`.toLowerCase().includes(query.toLowerCase())), [notes, query]);

  const createNote = () => {
    const note = { id: crypto.randomUUID(), title: "Untitled note", content: "", updatedAt: Date.now() };
    setNotes((current) => [note, ...current]);
    setSelectedId(note.id);
  };

  const updateSelected = (field: "title" | "content", value: string) => {
    if (!selected) return;
    setNotes((current) => current.map((note) => note.id === selected.id ? { ...note, [field]: value, updatedAt: Date.now() } : note));
  };

  const deleteSelected = () => {
    if (!selected || notes.length === 1) return;
    const remaining = notes.filter((note) => note.id !== selected.id);
    setNotes(remaining);
    setSelectedId(remaining[0].id);
  };

  const submitAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? email.split("@")[0]);
    const existing = getStored<Account | null>(accountKey, null);
    if (mode === "login" && existing && (existing.email !== email || existing.password !== password)) {
      alert("That email or password doesn't match. Try signing up instead.");
      return;
    }
    setAccount(mode === "login" && existing ? existing : { name, email, password });
  };

  if (!account) return <AuthScreen mode={mode} setMode={setMode} onSubmit={submitAuth} />;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✦</span><span>Pocket Notes</span></div>
        <button className="new-note" onClick={createNote}><span>＋</span> New note</button>
        <label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes" /></label>
        <div className="note-list">
          <p className="list-label">ALL NOTES <span>{notes.length}</span></p>
          {filteredNotes.map((note) => <button key={note.id} className={`note-card ${note.id === selected?.id ? "active" : ""}`} onClick={() => setSelectedId(note.id)}><strong>{note.title || "Untitled note"}</strong><span>{note.content.replace(/\n/g, " ") || "No additional text"}</span><time>{formatDate(note.updatedAt)}</time></button>)}
          {!filteredNotes.length && <p className="empty-search">No matching notes</p>}
        </div>
        <div className="profile-wrap">
          {menuOpen && <button className="sign-out" onClick={() => { localStorage.removeItem(accountKey); setAccount(null); }}>Sign out</button>}
          <button className="profile" onClick={() => setMenuOpen(!menuOpen)}><span className="avatar">{account.name.slice(0, 1).toUpperCase()}</span><span><strong>{account.name}</strong><small>{account.email}</small></span><b>⌄</b></button>
        </div>
      </aside>
      <section className="editor">
        {selected && <>
          <header className="editor-top"><span>{formatDate(selected.updatedAt)}</span><div><button className="icon-button" aria-label="More options">•••</button><button className="delete-button" onClick={deleteSelected} disabled={notes.length === 1}>Delete</button></div></header>
          <input className="title-input" value={selected.title} onChange={(event) => updateSelected("title", event.target.value)} placeholder="Note title" />
          <textarea value={selected.content} onChange={(event) => updateSelected("content", event.target.value)} placeholder="Start writing..." />
          <footer><span className="save-state"><i /> Saved locally</span><span>{selected.content.length} characters</span></footer>
        </>}
      </section>
    </main>
  );
}

function AuthScreen({ mode, setMode, onSubmit }: { mode: "login" | "signup"; setMode: (mode: "login" | "signup") => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const signup = mode === "signup";
  return <main className="auth-page"><section className="auth-intro"><div className="brand"><span className="brand-mark">✦</span><span>Pocket Notes</span></div><div className="intro-copy"><p className="eyebrow">YOUR SPACE TO THINK</p><h1>Small notes.<br /><em>Clear mind.</em></h1><p>Capture your thoughts in a quiet, beautifully simple place.</p></div><div className="quote">“The palest ink is better than the best memory.”<span>— Chinese proverb</span></div></section><section className="auth-panel"><form onSubmit={onSubmit}><p className="eyebrow">WELCOME {signup ? "IN" : "BACK"}</p><h2>{signup ? "Create your account" : "Good to see you."}</h2><p className="form-subtitle">{signup ? "Start collecting your thoughts today." : "Sign in to pick up where you left off."}</p>{signup && <label>Your name<input name="name" placeholder="Jane Doe" required /></label>}<label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label><label>Password<input name="password" type="password" minLength={4} placeholder="At least 4 characters" required /></label>{!signup && <p className="hint">First time here? Just choose “Create an account” below.</p>}<button className="submit-button" type="submit">{signup ? "Create account" : "Sign in"} <span>→</span></button><p className="switcher">{signup ? "Already have an account?" : "New to Pocket Notes?"} <button type="button" onClick={() => setMode(signup ? "login" : "signup")}>{signup ? "Sign in" : "Create an account"}</button></p></form></section></main>;
}
