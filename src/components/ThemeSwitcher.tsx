// #04 2-Mode Theme Pill Switcher — Chakra UI
import React from 'react';
import { useStore, Theme } from '../store/useStore';
import { toast } from 'sonner';

const themes: { id: Theme; label: string; dot: string }[] = [
  { id: 'midnight', label: 'Midnight', dot: '#0B0F19' },
  { id: 'sepia', label: 'Sepia', dot: '#F4ECD8' },
];

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, inspectorMode } = useStore();

  const handleSwitch = (t: Theme) => {
    setTheme(t);
    toast.success(`Switched to ${t === 'midnight' ? '🌙 Midnight' : '📜 Sepia'} theme`);
  };

  return (
    <section
      data-component-id="#04"
      data-ui-library="Chakra UI"
      className={`py-3 px-4 ${inspectorMode ? 'inspector-active' : ''}`}
      style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Theme
          </span>
          {/* Segmented pill */}
          <div
            className="flex items-center rounded-full p-1 gap-1"
            style={{ background: 'var(--border)' }}
          >
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSwitch(t.id)}
                className="flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold transition-all"
                style={
                  theme === t.id
                    ? {
                        background: 'var(--accent)',
                        color: '#0B0F19',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                      }
                    : {
                        background: 'transparent',
                        color: 'var(--text-muted)',
                      }
                }
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/30 inline-block"
                  style={{ background: t.dot }}
                />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
          {theme === 'midnight' ? '🌙 Deep ink & slate mode' : '📜 Archival warm parchment mode'}
        </div>
      </div>
    </section>
  );
};
