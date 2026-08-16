<script setup lang="ts">
import { useProfileStore } from "@/stores/profile"

const profileStore = useProfileStore()

// 不具合: プリミティブな状態を直接分割代入すると、以後の更新を購読できない。
const { displayName, rename } = profileStore

function updateName() {
  rename("佐藤")
}
</script>

<template>
  <section>
    <p data-testid="display-name">{{ displayName }}</p>
    <button type="button" @click="updateName">名前を更新</button>
  </section>
</template>
