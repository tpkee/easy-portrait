<template>
  <details
    ref="accordion"
    :name="name ?? uid"
    class="border border-slate-800 bg-slate-900 rounded-md px-4 py-2 w-full"
  >
    <summary>
      <slot name="title" />
    </summary>

    <slot />
  </details>
</template>

<script setup lang="ts">
import { onMounted, useId, useTemplateRef } from 'vue'

// Props
const props = withDefaults(
  defineProps<{
    name?: string
    openAtMount?: boolean
  }>(),
  {
    openAtMount: true,
  },
)

// Non reactive state
const uid = useId()

// Template refs
const accordion = useTemplateRef('accordion')

// Lifecycle hooks
onMounted(() => {
  if (props.openAtMount && accordion.value) {
    accordion.value.open = true
  }
})
</script>
