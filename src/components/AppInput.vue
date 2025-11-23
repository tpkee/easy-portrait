<template>
  <label>
    <span v-if="label" class="font-medium block mb-px">{{ label }}</span>
    <input v-model="modelValue" v-bind="$attrs" />
  </label>
</template>

<script setup lang="ts">
// Props
defineProps<{
  label?: string
}>()

const modelValue = defineModel()

//Misc
defineOptions({
  inheritAttrs: false,
})
</script>
