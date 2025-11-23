<template>
  <div
    ref="controls"
    :style="getStyle"
    class="w-56 border border-slate-800 fixed rounded-md bg-slate-950 p-2.5 grid gap-2.5 cursor-move z-60"
  >
    <controls-category label="Previews">
      <div class="space-y-2.5">
        <div
          v-for="(portrait, index) of getAvailablePortraits"
          :key="index"
          class="flex flex-col items-start justify-center first-letter:uppercase font-medium"
        >
          {{ portrait.mode }}
          <img :src="portrait.src" :alt="portrait.mode" class="object-contain" />
        </div>
      </div>
    </controls-category>
  </div>
</template>

<script lang="ts" setup>
import { computed, useTemplateRef, inject } from 'vue'
import type { ComputedRef } from 'vue'
import { useDraggable } from '@vueuse/core'
import ControlsCategory from '@/components/ControlsCategory.vue'
import type * as Portrait from '@/types/portrait'

// Template refs
const controlsRef = useTemplateRef('controls')

// Non reactive state
const margin = 16 //px
const controlsDivWidth = 224 //px

// Reactive State
const { style } = useDraggable(controlsRef, {
  preventDefault: true,
  initialValue: {
    x: window.innerWidth - controlsDivWidth - margin,
    y: margin,
  },
})

// Computed
const getAvailablePortraits = inject<ComputedRef<Portrait.ISavedPortrait[]>>('availablePortraits')!
const getStyle = computed(() => {
  return [style.value, { width: `${controlsDivWidth}px` }]
})
</script>
