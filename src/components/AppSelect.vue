<template>
  <div>
    <label v-if="label" :for="uid" class="block">
      {{ label }}
    </label>

    <select :id="uid" v-bind="$attrs" v-model="modelValue">
      <slot />
    </select>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  label?: string
}>()

const uid = useId()

const modelValue = defineModel()
</script>
