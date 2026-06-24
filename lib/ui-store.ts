import { create } from "zustand"

interface NavUIStore {
  paletteOpen: boolean
  drawerOpen: boolean
  searchOpen: boolean
  setPaletteOpen: (open: boolean) => void
  setDrawerOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
}

export const useNavUI = create<NavUIStore>((set) => ({
  paletteOpen: false,
  drawerOpen: false,
  searchOpen: false,
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}))
