import { nextTick } from "vue"
import { createPinia, setActivePinia } from "pinia"
import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"
import ProfileEditor from "@/components/ProfileEditor.vue"
import { useProfileStore } from "@/stores/profile"

describe("ProfileEditor", () => {
  it("名前を更新した後は、ストアと画面の両方に新しい表示名を出す", async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(ProfileEditor, {
      global: {
        plugins: [pinia],
      },
    })

    await wrapper.get("button").trigger("click")
    await nextTick()

    // ストアの更新だけでなく、利用者が見る DOM が更新されることを検証する。
    expect(useProfileStore(pinia).displayName).toBe("佐藤")
    expect(wrapper.get('[data-testid="display-name"]').text()).toBe("佐藤")
  })
})
