import { AppEvents, declareIndexPlugin, type ReactRNPlugin } from '@remnote/plugin-sdk';
import { ELEMENTS, buildCss, detectLang } from '../lib/elements';

/*
 * Hide UI Elements
 * ----------------
 * Blendet Einträge der Seitenleiste und Knöpfe aus, die man nie braucht. Jedes Element hat
 * eine eigene Einstellung. Reines CSS über die offizielle Schnittstelle registerCSS.
 */

const CSS_ID = 'hide-ui-elements';
const RECHECK_MS = 3000; // Einstellungen regelmässig prüfen, falls ein Ereignis ausbleibt

const LANG = detectLang();

let currentCss: string | null = null;
let timer: number | undefined;

async function readHidden(plugin: ReactRNPlugin): Promise<Record<string, boolean>> {
  const hidden: Record<string, boolean> = {};
  for (const el of ELEMENTS) {
    let v: boolean | undefined;
    try {
      v = await plugin.settings.getSetting<boolean>(el.id);
    } catch {
      v = undefined;
    }
    hidden[el.id] = v === undefined || v === null ? el.defaultHidden : !!v;
  }
  return hidden;
}

async function applyCss(plugin: ReactRNPlugin) {
  const css = buildCss(await readHidden(plugin));
  if (css === currentCss) return;
  try {
    await plugin.app.registerCSS(CSS_ID, css);
    currentCss = css;
  } catch (e) {
    console.warn('[Hide UI Elements] could not register CSS', e);
  }
}

const onSettingChanged = () => {
  if (activePlugin) void applyCss(activePlugin);
};

let activePlugin: ReactRNPlugin | null = null;

async function onActivate(plugin: ReactRNPlugin) {
  activePlugin = plugin;
  for (const el of ELEMENTS) {
    await plugin.settings.registerBooleanSetting({
      id: el.id,
      title: el.label[LANG],
      defaultValue: el.defaultHidden,
    });
  }

  await applyCss(plugin);
  plugin.event.addListener(AppEvents.SettingChanged, undefined, onSettingChanged);
  timer = window.setInterval(() => void applyCss(plugin), RECHECK_MS);
}

async function onDeactivate(plugin: ReactRNPlugin) {
  plugin.event.removeListener(AppEvents.SettingChanged, undefined, onSettingChanged);
  window.clearInterval(timer);
  activePlugin = null;
  currentCss = null;
  try {
    await plugin.app.registerCSS(CSS_ID, '');
  } catch {
    // egal
  }
}

declareIndexPlugin(onActivate, onDeactivate);
