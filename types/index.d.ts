export type Commands = string[]

declare module 'claude-code' {
  interface PluginState {
    'spectra-buttons': { commands: Commands }
  }
}
