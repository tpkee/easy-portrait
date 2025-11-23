<template>
  <div>
    <label class="cursor-pointer">
      <slot />
      <input
        ref="input"
        type="file"
        accept=".png, .jpg, .jpeg"
        class="cursor-pointer file:mr-4 file:rounded file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:bg-violet-600 file:text-violet-100 hover:file:bg-violet-500"
        @change="uploadFile"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
// Emits
const emit = defineEmits<{
  upload: [File]
}>()

// Functions
function uploadFile(e: Event) {
  const files: FileList | null = (e.target as HTMLInputElement)?.files

  if (!files) return

  if (files && files.length === 1) {
    emit('upload', files[0]!)
  }
}
</script>
