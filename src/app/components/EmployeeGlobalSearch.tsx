import { Search, BookOpen, Sparkles, Users, Bot } from "lucide-react";
import { brandIcon } from "../lib/brandIcons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { deepseekRankSearch } from "../lib/deepseekSearchAssistant";
import {
  filterEmployeePortalSearch,
  getFullEmployeeSearchCatalog,
  type PortalSearchHit,
} from "../lib/employeePortalSearch";

function useIsMac(): boolean {
  const [mac, setMac] = useState(true);
  useEffect(() => {
    setMac(/Mac|iPhone|iPod|iPad/i.test(navigator.platform || navigator.userAgent || ""));
  }, []);
  return mac;
}

function Section({
  label,
  icon: Icon,
  items,
  onPick,
}: {
  label: string;
  icon: typeof BookOpen;
  items: PortalSearchHit[];
  onPick: (h: PortalSearchHit) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div style={{ padding: "8px 0" }}>
      <div
        style={{
          fontSize: "10px",
          fontWeight: "500",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#000000",
          padding: "4px 14px 8px",
        }}
      >
        {label}
      </div>
      {items.map((hit) => (
        <button
          key={hit.id}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onPick(hit)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            padding: "10px 14px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "inherit",
            textAlign: "left",
            color: "#000000",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "rgba(227,0,11,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "1px",
            }}
          >
            <Icon size={14} color={brandIcon.stroke} strokeWidth={brandIcon.swSm} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: "500", lineHeight: 1.35 }}>{hit.title}</div>
            <div style={{ fontSize: "11px", color: "#000000", marginTop: "3px", lineHeight: 1.35 }}>
              {hit.subtitle}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export function EmployeeGlobalSearch() {
  const navigate = useNavigate();
  const isMac = useIsMac();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const blurT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiBlock, setAiBlock] = useState<{ hits: PortalSearchHit[]; summary: string } | null>(null);
  const aiAbortRef = useRef<AbortController | null>(null);

  const catalog = useMemo(() => getFullEmployeeSearchCatalog(), []);
  const results = useMemo(() => filterEmployeePortalSearch(query), [query]);
  const showPanel = focused && query.trim().length > 0;

  useEffect(() => {
    if (!showPanel || query.trim().length < 2) {
      aiAbortRef.current?.abort();
      setAiLoading(false);
      setAiBlock(null);
      return;
    }

    aiAbortRef.current?.abort();
    const ac = new AbortController();
    aiAbortRef.current = ac;
    setAiLoading(true);
    setAiBlock(null);

    const timer = window.setTimeout(() => {
      deepseekRankSearch(query, catalog, ac.signal)
        .then((r) => {
          if (ac.signal.aborted) return;
          if (!r) {
            setAiBlock(null);
            return;
          }
          const byId = new Map(catalog.map((c) => [c.id, c]));
          const hits = r.orderedIds.map((id) => byId.get(id)).filter(Boolean) as PortalSearchHit[];
          setAiBlock({ hits, summary: r.summary });
        })
        .catch(() => {
          if (!ac.signal.aborted) setAiBlock(null);
        })
        .finally(() => {
          if (!ac.signal.aborted) setAiLoading(false);
        });
    }, 420);

    return () => {
      clearTimeout(timer);
      ac.abort();
    };
  }, [query, showPanel, catalog]);

  const aiIds = useMemo(() => new Set(aiBlock?.hits.map((h) => h.id) ?? []), [aiBlock]);
  const coursesLocal = useMemo(
    () => results.courses.filter((h) => !aiIds.has(h.id)),
    [results.courses, aiIds]
  );
  const skillsLocal = useMemo(
    () => results.skills.filter((h) => !aiIds.has(h.id)),
    [results.skills, aiIds]
  );
  const colleaguesLocal = useMemo(
    () => results.colleagues.filter((h) => !aiIds.has(h.id)),
    [results.colleagues, aiIds]
  );

  const hasLocal =
    coursesLocal.length + skillsLocal.length + colleaguesLocal.length > 0;
  const hasAiVisible =
    aiLoading ||
    Boolean(aiBlock?.summary) ||
    (aiBlock?.hits.length ?? 0) > 0;
  const hasAny = hasLocal || hasAiVisible;

  const close = useCallback(() => {
    aiAbortRef.current?.abort();
    setQuery("");
    setFocused(false);
    setAiBlock(null);
    setAiLoading(false);
    inputRef.current?.blur();
  }, []);

  const pick = useCallback(
    (hit: PortalSearchHit) => {
      navigate(hit.path);
      close();
    },
    [navigate, close]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
      if (e.key === "Escape" && wrapRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current && !wrapRef.current.contains(t)) {
        if (blurT.current) clearTimeout(blurT.current);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  return (
    <div ref={wrapRef} className="employee-global-search-wrap" style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
      <Search
        size={14}
        color={brandIcon.muted}
        strokeWidth={brandIcon.swSm}
        style={{
          position: "absolute",
          left: "12px",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <input
        ref={inputRef}
        className="search-input search-input--employee"
        placeholder="Поиск курсов, навыков, коллег..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (blurT.current) clearTimeout(blurT.current);
          setFocused(true);
        }}
        onBlur={() => {
          blurT.current = setTimeout(() => setFocused(false), 180);
        }}
        aria-expanded={showPanel}
        aria-controls="employee-search-results"
        aria-autocomplete="list"
        autoComplete="off"
      />
      <div
        style={{
          position: "absolute",
          right: "12px",
          fontSize: "11px",
          color: "#000000",
          background: "rgba(0,0,0,0.04)",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "5px",
          padding: "2px 6px",
          letterSpacing: "0.5px",
          pointerEvents: "none",
        }}
      >
        {isMac ? "⌘K" : "Ctrl+K"}
      </div>

      {showPanel && (
        <div
          id="employee-search-results"
          role="listbox"
          aria-label="Результаты поиска"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            minWidth: "min(100vw - 48px, 360px)",
            maxHeight: "min(70vh, 380px)",
            overflowY: "auto",
            borderRadius: "14px",
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
            zIndex: 520,
            backdropFilter: "blur(20px)",
          }}
          className="custom-scroll"
        >
          {!hasAny ? (
            <div style={{ padding: "20px 16px", fontSize: "13px", color: "#000000", textAlign: "center" }}>
              Ничего не найдено
            </div>
          ) : (
            <>
              {aiLoading && (
                <div
                  style={{
                    padding: "12px 16px",
                    fontSize: "12px",
                    color: "#000000",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  Алиса анализирует запрос…
                </div>
              )}
              {aiBlock?.summary ? (
                <div
                  style={{
                    padding: "10px 16px 4px",
                    fontSize: "11px",
                    color: "#000000",
                    lineHeight: 1.45,
                  }}
                >
                  {aiBlock.summary}
                </div>
              ) : null}
              {aiBlock && aiBlock.hits.length > 0 ? (
                <Section label="Подбор Алисы" icon={Bot} items={aiBlock.hits} onPick={pick} />
              ) : null}
              {hasLocal ? (
                <>
                  {(aiBlock?.hits.length || aiBlock?.summary || aiLoading) && (
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: "500",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#000000",
                        padding: "10px 14px 4px",
                      }}
                    >
                      Совпадения в каталоге
                    </div>
                  )}
                  <Section label="Курсы" icon={BookOpen} items={coursesLocal} onPick={pick} />
                  <Section label="Навыки" icon={Sparkles} items={skillsLocal} onPick={pick} />
                  <Section label="Коллеги" icon={Users} items={colleaguesLocal} onPick={pick} />
                </>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
}
