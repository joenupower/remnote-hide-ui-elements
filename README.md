# Hide UI Elements

Hide RemNote sidebar entries and buttons you never use, for a tidier workspace. Each element can be switched on or off in the plugin settings.

| Element | Where | Hidden by default |
|---|---|---|
| Documents & Folders | left sidebar | yes |
| Today's Note | left sidebar | yes |
| Tutorials | left sidebar (bottom) | yes |
| Invite Friends | left sidebar (bottom) | yes |
| Share button | document header | yes |

Settings: Settings → Plugins → Hide UI Elements. Changes apply within a few seconds, without a reload.

## How it works

- Pure CSS via the official `app.registerCSS` API. The plugin runs sandboxed and does nothing else.
- Elements are matched by RemNote's stable test attributes (`data-test` / `data-cy`), not by their text, so it works in every interface language. If a RemNote update renames an attribute, that element simply shows up again. Nothing breaks.

## Privacy

No data leaves RemNote. No network requests, no third-party services.

## Adding more elements

Add an entry to `ELEMENTS` in `src/lib/elements.ts` (setting id, German/English label, default, CSS selectors).

## Development

- `npm install`, then `npm run dev` serves the plugin on `http://localhost:8081` (Windows: `plugin-starten.bat`). In RemNote: Settings → Plugins → Build → Develop from localhost → `http://localhost:8081`.
- `npm run build` validates the manifest and creates `PluginZip.zip` for upload.

Tested with RemNote 1.28 (October 2026).

## Deutsch

**Hide UI Elements** blendet Elemente aus, die du nie brauchst: «Dokumente & Ordner», «Heutige Notiz», «Tutorials», «Freunde einladen» und den Knopf «Teilen» in der Kopfzeile eines Dokuments. Jedes Element lässt sich in den Plugin-Einstellungen einzeln ein- und ausschalten. Die Einstellungen erscheinen auf Deutsch, wenn die Systemsprache Deutsch ist. Es werden keine Daten aus RemNote hinausgeschickt.
