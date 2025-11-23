<template>
  <div>
    <app-accordion>
      <template #title>
        <span class="text-sm font-semibold leading-normal">{{ label }}</span>
      </template>
      <slot />
    </app-accordion>
  </div>
</template>

<script setup lang="ts">
import AppAccordion from '@/components/AppAccordion.vue'

defineProps<{
  label: string
}>()
</script>
