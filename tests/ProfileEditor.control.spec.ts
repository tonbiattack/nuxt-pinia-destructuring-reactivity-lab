import { createPinia, setActivePinia } from "pinia"
import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"
import ProfileEditor from "@/components/ProfileEditor.vue"

describe("ProfileEditor の対照ケース", () => {
  it("初期表示では表示名を描画できる", () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(ProfileEditor, {
      global: {
        plugins: [pinia],
      },
    })

    expect(wrapper.get('[data-testid="display-name"]').text()).toBe("田中")
  })
})
