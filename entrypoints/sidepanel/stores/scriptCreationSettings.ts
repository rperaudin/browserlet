import { signal } from '@preact/signals';
import { storage } from '../../../utils/storage/browserCompat';

const STORAGE_KEY = 'browserlet_script_creation_settings';
const CONFIG_URL = chrome.runtime.getURL('plugin-config.json');

interface StoredScriptCreationSettings {
  enabled?: boolean;
}

interface ScriptCreationConfig {
  enabled?: boolean;
  hideToggle?: boolean;
}

interface PluginConfig {
  features?: {
    scriptCreation?: ScriptCreationConfig;
  };
}

export const scriptCreationSettingsStore = {
  userEnabled: signal(true),
  remoteEnabled: signal(true),
  hideToggle: signal(false),
  loaded: signal(false),
};

export function isScriptCreationEnabled(): boolean {
  return scriptCreationSettingsStore.userEnabled.value && scriptCreationSettingsStore.remoteEnabled.value;
}

export function isScriptCreationToggleVisible(): boolean {
  return !scriptCreationSettingsStore.hideToggle.value;
}

async function loadRemoteConfig(): Promise<ScriptCreationConfig | null> {
  try {
    const response = await fetch(CONFIG_URL);
    if (!response.ok) {
      return null;
    }

    const config = await response.json() as PluginConfig;
    return config.features?.scriptCreation ?? null;
  } catch (error) {
    console.warn('[Browserlet] Failed to load plugin-config.json:', error);
    return null;
  }
}

export async function loadScriptCreationSettings(): Promise<void> {
  const [storedResult, remoteConfig] = await Promise.all([
    storage.local.get(STORAGE_KEY),
    loadRemoteConfig(),
  ]);

  const stored = storedResult[STORAGE_KEY] as StoredScriptCreationSettings | undefined;

  scriptCreationSettingsStore.userEnabled.value = stored?.enabled ?? true;
  scriptCreationSettingsStore.remoteEnabled.value = remoteConfig?.enabled ?? true;
  scriptCreationSettingsStore.hideToggle.value = remoteConfig?.hideToggle ?? false;
  scriptCreationSettingsStore.loaded.value = true;
}

export async function saveScriptCreationSettings(enabled: boolean): Promise<void> {
  scriptCreationSettingsStore.userEnabled.value = enabled;
  await storage.local.set({
    [STORAGE_KEY]: { enabled },
  });
}

storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes[STORAGE_KEY]) {
    return;
  }

  const nextValue = changes[STORAGE_KEY].newValue as StoredScriptCreationSettings | undefined;
  scriptCreationSettingsStore.userEnabled.value = nextValue?.enabled ?? true;
});
