"use client"

import { useCallback, useEffect, useState } from "react"
import type { AppData } from "@/lib/types"
import { loadData, saveData, getDefaultData } from "@/lib/storage"

export function useAppData() {
  const [data, setData] = useState<AppData>(getDefaultData)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setData(loadData())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) saveData(data)
  }, [data, loaded])

  const update = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => updater(prev))
  }, [])

  return { data, setData, update, loaded }
}
