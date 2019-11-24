import { TConfiguration } from '../types/configuration'

// ==========================================================
export const loadConfiguration: () => TConfiguration = () => {
  // @ts-ignore
  const config: TConfiguration = window.electron.remote.getGlobal('config').initial
  return config
}

export const updateConfiguration = (configuration: TConfiguration) => {
  // @ts-ignore
  window.electron.remote.getGlobal('config').updateConfiguration(configuration)
}
