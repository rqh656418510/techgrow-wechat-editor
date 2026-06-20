<script setup lang="ts">
import { Sparkles } from '@lucide/vue'
import { useEditorRefresh } from '@/composables/useEditorRefresh'
import { applyHexoStyleMarkdown } from '@/services/style/hexo'
import { useEditorStore } from '@/stores/editor'
import { usePostStore } from '@/stores/post'

const props = withDefaults(defineProps<{
  asSub?: boolean
}>(), {
  asSub: false,
})

const { asSub } = toRefs(props)

const editorStore = useEditorStore()
const postStore = usePostStore()
const { editorRefresh } = useEditorRefresh()

function useHexoStyle() {
  const content = applyHexoStyleMarkdown(editorStore.getContent())
  editorStore.importContent(content)

  const currentPost = postStore.currentPost
  if (currentPost)
    postStore.updatePostContent(currentPost.id, content)

  editorRefresh()
  toast.success(`已将文章从 Hexo 风格转换为公众号风格`)
}
</script>

<template>
  <!-- 作为 MenubarSub 使用 -->
  <MenubarSub v-if="asSub">
    <MenubarSubTrigger>
      转换
    </MenubarSubTrigger>
    <MenubarSubContent>
      <MenubarItem @click="useHexoStyle()">
        <Sparkles class="mr-2 h-4 w-4" />
        Hexo 转公众号风格
      </MenubarItem>
    </MenubarSubContent>
  </MenubarSub>

  <!-- 作为 MenubarMenu 使用（默认） -->
  <MenubarMenu v-else>
    <MenubarTrigger>转换</MenubarTrigger>
    <MenubarContent align="start">
      <MenubarItem @click="useHexoStyle()">
        <Sparkles class="mr-2 h-4 w-4" />
        Hexo 转公众号风格
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</template>
