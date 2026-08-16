import { ref } from "vue"
import { defineStore } from "pinia"

export const useProfileStore = defineStore("profile", () => {
  const displayName = ref("田中")

  function rename(nextDisplayName: string) {
    displayName.value = nextDisplayName
  }

  return {
    displayName,
    rename,
  }
})
