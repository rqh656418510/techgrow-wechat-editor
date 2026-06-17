<script setup lang="ts">
import { BookText, Heart, HelpCircle, MessageSquare, Tag } from '@lucide/vue'
import {
  isHelpAboutEnabled,
  isHelpFeedbackEnabled,
  isHelpFundEnabled,
  isHelpMarkdownEnabled,
  isHelpMenuEnabled,
  isHelpReleasesEnabled,
} from '@/services/help/config'
import { useUIStore } from '@/stores/ui'

const props = withDefaults(defineProps<{
  asSub?: boolean
}>(), {
  asSub: false,
})

const { asSub } = toRefs(props)
const uiStore = useUIStore()
const { toggleShowAboutDialog, toggleShowFundDialog, toggleShowMarkdownHelpDialog } = uiStore

const showHelpMenu = isHelpMenuEnabled()
const showMarkdownHelp = isHelpMarkdownEnabled()
const showFeedback = isHelpFeedbackEnabled()
const showReleases = isHelpReleasesEnabled()
const showAbout = isHelpAboutEnabled()
const showFund = isHelpFundEnabled()

function openAboutDialog() {
  toggleShowAboutDialog(true)
}

function openFundDialog() {
  toggleShowFundDialog(true)
}

function openMarkdownHelp() {
  toggleShowMarkdownHelpDialog(true)
}

function openFeedback() {
  window.open(`https://github.com/doocs/md/issues`, `_blank`)
}

function openReleases() {
  window.open(`https://github.com/doocs/md/releases`, `_blank`)
}
</script>

<template>
  <!-- 作为 MenubarSub 使用 -->
  <MenubarSub v-if="asSub && showHelpMenu">
    <MenubarSubTrigger>
      帮助
    </MenubarSubTrigger>
    <MenubarSubContent>
      <MenubarItem v-if="showMarkdownHelp" @click="openMarkdownHelp()">
        <BookText class="mr-2 h-4 w-4" />
        语法帮助
      </MenubarItem>
      <MenubarItem v-if="showFeedback" @click="openFeedback()">
        <MessageSquare class="mr-2 h-4 w-4" />
        反馈
      </MenubarItem>
      <MenubarItem v-if="showReleases" @click="openReleases()">
        <Tag class="mr-2 h-4 w-4" />
        版本历史
      </MenubarItem>
      <MenubarItem v-if="showAbout" @click="openAboutDialog()">
        <HelpCircle class="mr-2 h-4 w-4" />
        关于
      </MenubarItem>
      <MenubarItem v-if="showFund" @click="openFundDialog()">
        <Heart class="mr-2 h-4 w-4" />
        赞赏
      </MenubarItem>
    </MenubarSubContent>
  </MenubarSub>

  <!-- 作为 MenubarMenu 使用（默认） -->
  <MenubarMenu v-else-if="showHelpMenu">
    <MenubarTrigger>帮助</MenubarTrigger>
    <MenubarContent align="start">
      <MenubarItem v-if="showMarkdownHelp" @click="openMarkdownHelp()">
        <BookText class="mr-2 h-4 w-4" />
        语法帮助
      </MenubarItem>
      <MenubarItem v-if="showFeedback" @click="openFeedback()">
        <MessageSquare class="mr-2 h-4 w-4" />
        反馈
      </MenubarItem>
      <MenubarItem v-if="showReleases" @click="openReleases()">
        <Tag class="mr-2 h-4 w-4" />
        版本历史
      </MenubarItem>
      <MenubarItem v-if="showAbout" @click="openAboutDialog()">
        <HelpCircle class="mr-2 h-4 w-4" />
        关于
      </MenubarItem>
      <MenubarItem v-if="showFund" @click="openFundDialog()">
        <Heart class="mr-2 h-4 w-4" />
        赞赏
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</template>
