"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { rankTargets, type JumpTarget } from "@/content/jump-rank";

/** `g` then one of these. Two keys, the way a reader turns to a part of a book. */
const GOTO: Record<string, string> = { h: "/", i: "/interview", s: "/studio" };

/** How long `g` waits for its second key before it goes back to meaning nothing. */
const CHORD_MS = 1200;

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
  }, [chapters, go, openJump, panel]);

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
          <p className="section-kicker">Keys</p>
          <h2 id="legend-title">How to turn the pages</h2>

          <dl className="legend-keys">
            <div>
              <dt>
                <kbd>1</kbd>–<kbd>5</kbd>
              </dt>
              <dd>Open a chapter</dd>
            </div>
            <div>
              <dt>
                <kbd>g</kbd> <kbd>h</kbd>
              </dt>
              <dd>Home</dd>
            </div>
            <div>
              <dt>
                <kbd>g</kbd> <kbd>i</kbd>
              </dt>
              <dd>Interview kit</dd>
            </div>
            <div>
              <dt>
                <kbd>g</kbd> <kbd>s</kbd>
              </dt>
              <dd>Studio</dd>
            </div>
            <div>
              <dt>
                <kbd>/</kbd> or <kbd>Ctrl</kbd>
                <kbd>K</kbd>
              </dt>
              <dd>Jump: type a word, not a command</dd>
            </div>
            <div>
              <dt>
                <kbd>?</kbd>
              </dt>
              <dd>This page</dd>
            </div>
            <div>
              <dt>
                <kbd>Esc</kbd>
              </dt>
              <dd>Close it again</dd>
            </div>
          </dl>

          <p className="section-kicker legend-contents">Chapters</p>
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
            Keys sleep while a field has focus, so typing a <kbd>g</kbd> into the jump box types a
            g.
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
            Jump
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
            placeholder="refuse · budget · path:line · RRF"
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
                role="option"
              >
                <button onClick={() => go(target.href)} type="button">
                  {target.chapter ? (
                    <kbd>{target.chapter}</kbd>
                  ) : (
                    <span className="jump-dot">·</span>
                  )}
                  <span>
                    <span className="jump-label">{target.label}</span>
                    <small>{target.hint}</small>
                  </span>
                </button>
              </li>
            ))}
            {results.length === 0 ? (
              <li className="jump-empty">
                Nothing on this site is called that. <kbd>Esc</kbd> to go back.
              </li>
            ) : null}
          </ul>
        </div>
      </dialog>
    </>
  );
}
