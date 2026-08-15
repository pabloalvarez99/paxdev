"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { rankTargets, type JumpTarget } from "@/content/jump-rank";

/** `g` then one of these. Two keys, the way a reader turns to a part of a book. */
const GOTO: Record<string, string> = { c: "/clases", h: "/", i: "/interview", s: "/studio" };

/** How long `g` waits for its second key before it goes back to meaning nothing. */
const CHORD_MS = 1200;

/**
 * WCAG 2.1.4.1 Character Key Shortcuts: a single-character shortcut must be possible to turn
 * off, remap, or scope to a focused component. Guarding form fields satisfies none of the
 * three -- dictation still fires stray characters at a page that has no field focused. This is
 * the "turn it off" branch, persisted so the choice survives a reload.
 */
const KEYS_STORAGE_KEY = "paxdev:keys";
/** Same-tab notice: the `storage` event only reaches *other* tabs/windows. */
const KEYS_CHANGE_EVENT = "paxdev:keys-change";

function readKeysEnabled(): boolean {
  try {
    return window.localStorage.getItem(KEYS_STORAGE_KEY) !== "off";
  } catch {
    // Private browsing or a disabled store can throw on read. Fail open, the same default
    // a first-time visitor gets.
    return true;
  }
}

/** The server never sees localStorage, so it always renders the same default the reader gets
 * before ever touching the setting -- no client/server text mismatch to reconcile. */
function getKeysEnabledServerSnapshot(): boolean {
  return true;
}

function subscribeKeysEnabled(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(KEYS_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(KEYS_CHANGE_EVENT, onStoreChange);
  };
}

function writeKeysEnabled(next: boolean): void {
  try {
    if (next) {
      window.localStorage.removeItem(KEYS_STORAGE_KEY);
    } else {
      window.localStorage.setItem(KEYS_STORAGE_KEY, "off");
    }
  } catch {
    // The toggle still applies for this tab via the dispatch below; it just will not
    // survive a reload if storage itself refused the write.
  }
  window.dispatchEvent(new Event(KEYS_CHANGE_EVENT));
}

type Panel = "legend" | "jump" | null;

function inEditableField(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  if (!element) {
    return false;
  }
  if (element.isContentEditable) {
    return true;
  }
  return ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName);
}

export function KeyboardNav({ targets }: { targets: JumpTarget[] }) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  // Reads localStorage through React's own external-store hook rather than a `useEffect` that
  // calls `setState`: the server has no localStorage, so `useSyncExternalStore` renders the
  // server snapshot first and swaps in the real value right after hydration, with no mismatch.
  const keysEnabled = useSyncExternalStore(
    subscribeKeysEnabled,
    readKeysEnabled,
    getKeysEnabledServerSnapshot,
  );

  const legendRef = useRef<HTMLDialogElement>(null);
  const jumpRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chordArmed = useRef(false);

  const chapters = useMemo(() => targets.filter((target) => target.chapter !== null), [targets]);
  const results = useMemo(() => rankTargets(query, targets), [query, targets]);
  /** Clamped at read time, so a shorter result list can never point past its own end. */
  const active = results.length > 0 ? Math.min(cursor, results.length - 1) : 0;

  const go = useCallback(
    (href: string) => {
      setPanel(null);
      setQuery("");
      router.push(href);
    },
    [router],
  );

  // Native <dialog> carries the focus trap, the backdrop and Esc; React only says which one is up.
  useEffect(() => {
    for (const [name, ref] of [
      ["legend", legendRef],
      ["jump", jumpRef],
    ] as const) {
      const element = ref.current;
      if (!element) continue;
      if (panel === name && !element.open) element.showModal();
      if (panel !== name && element.open) element.close();
    }
    if (panel === "jump") {
      inputRef.current?.focus();
    }
  }, [panel]);

  const openJump = useCallback(() => {
    setCursor(0);
    setPanel((current) => (current === "jump" ? null : "jump"));
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return;
      }

      const key = event.key;
      const command = event.metaKey || event.ctrlKey;

      // Inside a panel, the panel's own handlers and the dialog's Esc are in charge. This runs
      // before Ctrl/Cmd+K on purpose: on macOS Ctrl+K is the system binding for "delete to end
      // of line", so taking it inside a field would eat an edit the reader meant to make -- and
      // the legend promises the keys sleep while a field has focus.
      if (panel !== null || inEditableField(event.target) || event.altKey) {
        return;
      }

      if (command && key.toLowerCase() === "k") {
        event.preventDefault();
        openJump();
        return;
      }

      if (command) {
        return;
      }

      // WCAG 2.1.4.1: every binding past this point is a bare character key, so it must
      // honour the off switch. Ctrl/Cmd+K is a modifier chord, not a character key, and is
      // handled above -- it keeps working either way.
      if (!keysEnabled) {
        chordArmed.current = false;
        return;
      }

      if (chordArmed.current && GOTO[key.toLowerCase()]) {
        event.preventDefault();
        chordArmed.current = false;
        go(GOTO[key.toLowerCase()]);
        return;
      }

      if (key === "g") {
        chordArmed.current = true;
        if (chordTimer.current) clearTimeout(chordTimer.current);
        chordTimer.current = setTimeout(() => {
          chordArmed.current = false;
        }, CHORD_MS);
        return;
      }

      chordArmed.current = false;

      if (key === "?") {
        event.preventDefault();
        setPanel("legend");
        return;
      }

      if (key === "/") {
        event.preventDefault();
        openJump();
        return;
      }

      const chapter = chapters.find((target) => target.chapter === key);
      if (chapter) {
        event.preventDefault();
        go(chapter.href);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [chapters, go, openJump, panel, keysEnabled]);

  // Turning the keys off must not strand a reader outside the legend that turns them back on.
  // `app/page.tsx` is a server component and renders the hero's `?` as a plain button carrying
  // `data-legend-open`; this is the one client-side listener that gives it a job. Delegated on
  // `document`, so it keeps working regardless of what else renders that attribute later.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-legend-open]")) {
        setPanel("legend");
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // A flag on the document so a test — or a reader with a console open — can tell when the
  // keys are actually live, rather than guessing at hydration.
  useEffect(() => {
    document.documentElement.dataset.keys = "ready";
    return () => {
      delete document.documentElement.dataset.keys;
    };
  }, []);

  useEffect(
    () => () => {
      if (chordTimer.current) clearTimeout(chordTimer.current);
    },
    [],
  );

  function onQueryKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setCursor((active + step + results.length) % results.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const target = results[active];
      if (target) go(target.href);
    }
  }

  return (
    <>
      <dialog
        aria-labelledby="legend-title"
        className="sheet-dialog legend"
        onClick={(event) => {
          if (event.target === event.currentTarget) setPanel(null);
        }}
        onClose={() => setPanel(null)}
        ref={legendRef}
      >
        <div className="sheet-dialog-page">
          <p className="section-kicker">Teclas</p>
          <h2 id="legend-title">Cómo pasar las páginas</h2>

          <div className="legend-toggle">
            <label htmlFor="keys-toggle">
              <input
                checked={keysEnabled}
                id="keys-toggle"
                onChange={(event) => writeKeysEnabled(event.target.checked)}
                type="checkbox"
              />
              Atajos de una sola tecla
            </label>
            <span className="legend-toggle-state">{keysEnabled ? "Activados" : "Desactivados"}</span>
          </div>

          <dl className="legend-keys">
            <div>
              <dt>
                <kbd>1</kbd>–<kbd>5</kbd>
              </dt>
              <dd>Abrir un capítulo</dd>
            </div>
            <div>
              <dt>
                <kbd>g</kbd> <kbd>h</kbd>
              </dt>
              <dd>Ir a inicio</dd>
            </div>
            <div>
              <dt>
                <kbd>g</kbd> <kbd>c</kbd>
              </dt>
              <dd>Ir a las clases</dd>
            </div>
            <div>
              <dt>
                <kbd>g</kbd> <kbd>i</kbd>
              </dt>
              <dd>Ir a la entrevista</dd>
            </div>
            <div>
              <dt>
                <kbd>g</kbd> <kbd>s</kbd>
              </dt>
              <dd>Ir al estudio</dd>
            </div>
            <div>
              <dt>
                <kbd>/</kbd> o <kbd>Ctrl</kbd>
                <kbd>K</kbd>
              </dt>
              <dd>Saltar: una palabra, no un comando</dd>
            </div>
            <div>
              <dt>
                <kbd>?</kbd>
              </dt>
              <dd>Esta ayuda</dd>
            </div>
            <div>
              <dt>
                <kbd>Esc</kbd>
              </dt>
              <dd>Cerrar</dd>
            </div>
          </dl>

          <p className="section-kicker legend-contents">Capítulos</p>
          <ol className="legend-chapters">
            {chapters.map((chapter) => (
              <li key={chapter.href}>
                <kbd>{chapter.chapter}</kbd>
                <div>
                  <span>{chapter.label}</span>
                  <small>{chapter.hint}</small>
                </div>
              </li>
            ))}
          </ol>

          <p className="legend-note">
            {keysEnabled ? (
              <>
                Las teclas se desactivan mientras hay un campo de texto enfocado: escribir una{" "}
                <kbd>g</kbd> en el buscador escribe una g.
              </>
            ) : (
              <>
                Los atajos de una sola tecla están desactivados. <kbd>Ctrl</kbd>
                <kbd>K</kbd> igual abre Saltar -- es una combinación con tecla modificadora, no
                una tecla de carácter.
              </>
            )}
          </p>
        </div>
      </dialog>

      <dialog
        aria-labelledby="jump-title"
        className="sheet-dialog jump"
        onClick={(event) => {
          if (event.target === event.currentTarget) setPanel(null);
        }}
        onClose={() => setPanel(null)}
        ref={jumpRef}
      >
        <div className="sheet-dialog-page">
          <label className="section-kicker" htmlFor="jump-input" id="jump-title">
            Saltar
          </label>
          <input
            aria-activedescendant={results[active] ? `jump-option-${active}` : undefined}
            aria-autocomplete="list"
            aria-controls="jump-list"
            aria-expanded="true"
            autoComplete="off"
            className="jump-input"
            id="jump-input"
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
            }}
            onKeyDown={onQueryKeyDown}
            placeholder="rechazar · presupuesto · clases · RRF"
            ref={inputRef}
            role="combobox"
            spellCheck={false}
            type="text"
            value={query}
          />

          <ul className="jump-list" id="jump-list" role="listbox">
            {results.map((target, index) => (
              <li
                aria-selected={index === active}
                className={index === active ? "is-current" : undefined}
                id={`jump-option-${index}`}
                key={target.href}
                onClick={() => go(target.href)}
                role="option"
              >
                {target.chapter ? (
                  <kbd>{target.chapter}</kbd>
                ) : (
                  <span className="jump-dot">·</span>
                )}
                <span>
                  <span className="jump-label">{target.label}</span>
                  <small>{target.hint}</small>
                </span>
              </li>
            ))}
            {results.length === 0 ? (
              <li className="jump-empty">
                Nada en este sitio se llama así. <kbd>Esc</kbd> para volver.
              </li>
            ) : null}
          </ul>
        </div>
      </dialog>
    </>
  );
}
