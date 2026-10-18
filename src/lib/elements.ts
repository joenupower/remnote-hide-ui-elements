/**
 * Elemente, die sich ausblenden lassen.
 *
 * Alle Selektoren stützen sich auf RemNotes feste Test-Kennungen (data-test / data-cy).
 * Diese hängen nicht von der Sprache der Oberfläche ab (geprüft mit RemNote 1.28, Okt. 2026).
 * Neue Elemente: einfach einen Eintrag ergänzen.
 */

export type Lang = 'de' | 'en';

export interface HideableElement {
  /** Kennung der Einstellung (darf sich nach der Veröffentlichung nicht mehr ändern) */
  id: string;
  label: Record<Lang, string>;
  /** Standardmässig ausblenden? */
  defaultHidden: boolean;
  /** CSS-Selektoren für das Element (bzw. seine ganze Zeile) */
  selectors: string[];
}

/** Ganze Zeile eines Eintrags unten in der Seitenleiste (Tutorials, Einstellungen, …). */
function sidebarBottomRow(dataTest: string): string[] {
  const inner = `[data-test="${dataTest}"]`;
  return [
    // Zeilen-Container, der nur diesen Eintrag enthält
    `.rn-document-sidebar div:has(> .rn-document-sidebar__top-link > ${inner})`,
    // Rückfallebene: der Eintrag selbst
    `.rn-document-sidebar__top-link:has(> ${inner})`,
    inner,
  ];
}

export const ELEMENTS: HideableElement[] = [
  {
    id: 'hide-documents-folders',
    label: {
      de: 'Seitenleiste: «Dokumente & Ordner» ausblenden',
      en: 'Sidebar: hide "Documents & Folders"',
    },
    defaultHidden: true,
    selectors: ['[data-test="All Notes Sidebar Link"]'],
  },
  {
    id: 'hide-todays-note',
    label: {
      de: 'Seitenleiste: «Heutige Notiz» ausblenden',
      en: 'Sidebar: hide "Today\'s Note"',
    },
    defaultHidden: true,
    selectors: ['[data-test="Todays Doc Sidebar Link"]'],
  },
  {
    id: 'hide-tutorials',
    label: {
      de: 'Seitenleiste: «Tutorials» ausblenden',
      en: 'Sidebar: hide "Tutorials"',
    },
    defaultHidden: true,
    selectors: sidebarBottomRow('Document Sidebar Bottom Tutorials Link'),
  },
  {
    id: 'hide-invite-friends',
    label: {
      de: 'Seitenleiste: «Freunde einladen» ausblenden',
      en: 'Sidebar: hide "Invite Friends"',
    },
    defaultHidden: true,
    selectors: sidebarBottomRow('Document Sidebar Bottom Invite Friends Link'),
  },
  {
    id: 'hide-share-button',
    label: {
      de: 'Dokument-Kopfzeile: Knopf «Teilen» ausblenden',
      en: 'Document header: hide the "Share" button',
    },
    defaultHidden: true,
    selectors: [
      '[data-test="Publish Popover Trigger Button"]',
      'button[data-cy="share-popover-trigger"]',
    ],
  },
];

/** Baut das CSS für alle ausgeblendeten Elemente. */
export function buildCss(hidden: Record<string, boolean>): string {
  const selectors = ELEMENTS.filter((e) => hidden[e.id]).flatMap((e) => e.selectors);
  if (selectors.length === 0) return '';
  return `/* Hide UI Elements */\n${selectors.join(',\n')} {\n  display: none !important;\n}\n`;
}

export function detectLang(language?: string): Lang {
  const l = (language ?? (typeof navigator !== 'undefined' ? navigator.language : '') ?? '').toLowerCase();
  return l.startsWith('de') ? 'de' : 'en';
}
