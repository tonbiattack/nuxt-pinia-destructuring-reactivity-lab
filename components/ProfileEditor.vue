<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useProfileStore } from "@/stores/profile"

const profileStore = useProfileStore()

// 状態は ref として取得し、テンプレートが更新を追跡できるようにする。
const { displayName } = storeToRefs(profileStore)
// アクションはストアへ束縛されているため、直接取得してよい。
const { rename } = profileStore

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
