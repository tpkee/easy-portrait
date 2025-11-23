<template>
  <main class="container mx-auto my-4 py-4 space-y-5 px-5 border border-slate-800 rounded-md">
    <header class="flex items-center justify-between gap-5 w-f">
      <div>
        <h1 class="font-bold text-4xl md:text-6xl italic leading-normal">Le portrait generator</h1>
        <div class="space-y-2">
          <p class="text-slate-400 max-w-2xl">
            Have you ever wanted a tool to make portraits for games with no way to screw it up? One
            so easy to use you don't have to wonder how it will look in game, nor worry about weird
            and wrong croppings? Here it is: powered by sheer laziness, made by the lamest
            developer.
            <i>Enjoy!</i>
          </p>
        </div>
      </div>
    </header>

    <app-upload @upload="uploadFile" class="w-72" />

    <section v-if="originalFileUrl">
      <app-portrait
        v-for="(item, index) of getPortraits"
        :key="index"
        v-show="item.mode === selectedMode"
        :image="item.src!"
        :full-size="dimensions['full']"
        :cropper-size="dimensions[item.mode as Portrait.TPortrait]"
        @save="savePortrait(item.mode as Portrait.TPortrait, $event)"
      />
    </section>

    <portraits-preview v-if="getAvailablePortraits.length" />
  </main>
</template>

<script setup lang="ts">
import { computed, onUnmounted, provide, ref } from 'vue'
import AppUpload from '@/components/AppUpload.vue'
import AppPortrait from '@/components/AppPortrait.vue'
import * as Portrait from '@/types/portrait'
import PortraitsPreview from '@/components/PortraitsPreview.vue'

// Reactive state
const originalFileUrl = ref<string>()
const selectedMode = ref<Portrait.TPortrait>('full')
const dimensions = ref<Record<Portrait.TPortrait, Portrait.IDimensions>>({
  full: {
    height: 1480,
    width: 1080,
  },
  medium: {
    width: 448,
    height: 600,
  },
  small: {
    height: 336,
    width: 260,
  },
})
const portraits = ref<Portrait.ISavedPortrait[]>([])

// Computed
const getAvailablePortraits = computed(() => portraits.value.filter((p) => p.blob !== null))
const getPortraits = computed(() =>
  Object.entries(dimensions.value).map(([mode, size]) => {
    let previousMode = 'none'
    switch (mode) {
      case 'medium':
        previousMode = 'full'
        break
      case 'small':
        previousMode = 'medium'
        break
    }

    return {
      mode: mode as Portrait.TPortrait,
      size,
      src:
        previousMode === 'none'
          ? originalFileUrl.value
          : (portraits.value.find((p) => p.mode === previousMode)!.src ?? originalFileUrl.value),
    }
  }),
)
// Providers
provide('selectedMode', selectedMode)
provide('availablePortraits', getAvailablePortraits)

// Functions
function uploadFile(f: File) {
  originalFileUrl.value = URL.createObjectURL(f)
  portraits.value = Object.keys(dimensions.value).map((mode) => ({
    mode: mode as Portrait.TPortrait,
    src: originalFileUrl.value!,
    blob: null,
  }))
  selectedMode.value = 'full'
}

function savePortrait(mode: Portrait.TPortrait, blob: Blob) {
  const index = portraits.value.findIndex((p) => p.mode === mode)
  if (index !== -1) {
    portraits.value.splice(index, 1, {
      mode,
      src: URL.createObjectURL(blob),
      blob,
    })
  } else {
    portraits.value.push({
      mode,
      src: URL.createObjectURL(blob),
      blob,
    })
  }
}

// Lifecycle hooks
onUnmounted(() => {
  if (originalFileUrl.value) {
    URL.revokeObjectURL(originalFileUrl.value)
  }
})
</script>
