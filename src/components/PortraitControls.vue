<template>
  <div class="w-72 border border-slate-800 rounded-md bg-slate-900 p-2.5 grid gap-2.5 relative">
    <button @click="emit('save')">Save portrait</button>
    <button v-if="canDownloadZip" @click="downloadZip">Download portraits</button>
    <button @click="emit('zen')">
      Toggle Zen Mode
      <!-- TODO: change label to explicitate the open/close state -->
    </button>

    <controls-category label="Selected size">
      <app-select v-model="selectedMode" label="Size">
        <option v-for="(opt, index) of ['full', 'medium', 'small']" :key="index" :value="opt">
          {{ opt }}
        </option>
      </app-select>
    </controls-category>

    <h3 class="text-lg font-semibold">Controls</h3>

    <controls-category label="Zoom">
      <app-input
        v-model="zoom"
        type="number"
        :min="0"
        step="0.01"
        placeholder="0.01"
        label="Zoom"
      />
      <div class="grid grid-cols-2 gap-1 pt-1.5">
        <button @click="emit('zoom', toValue(zoom))">+</button>
        <button @click="emit('zoom', -toValue(zoom))">-</button>
      </div>
    </controls-category>

    <controls-category label="Scale">
      <div class="grid grid-cols-2 gap-2">
        <app-input
          v-model="scale.x"
          type="number"
          :min="0"
          step="0.01"
          placeholder="1"
          class="w-full"
          label="Horizontal"
        />
        <app-input
          v-model="scale.y"
          type="number"
          :min="0"
          step="0.01"
          placeholder="1"
          class="w-full"
          label="Vertical"
        />
      </div>
      <button @click="emit('transform', toValue(scale))" class="mt-1.5 w-full">Scale</button>
    </controls-category>
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { ref, toValue, inject, computed } from 'vue'
import AppInput from '@/components/AppInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import ControlsCategory from '@/components/ControlsCategory.vue'
import type * as Portrait from '@/types/portrait'
import { BlobReader, BlobWriter, ZipWriter } from '@zip.js/zip.js'

// Emits
const emit = defineEmits<{
  zen: []
  save: []
  transform: [{ x: number; y: number }]
  zoom: [number]
}>()

// Reactive State
const zoom = ref(0.01)
const scale = ref({
  x: 1,
  y: 1,
})
const selectedMode = inject<Ref<Portrait.TPortrait>>('selectedMode')!

// Computed
const getAvailablePortraits = inject<Ref<Portrait.ISavedPortrait[]>>('availablePortraits')!
const canDownloadZip = computed(
  () =>
    getAvailablePortraits.value.length === 3 &&
    getAvailablePortraits.value.every((p) => p.blob != null),
)

// Functions
async function getZipFileBlob() {
  if (!canDownloadZip.value) return null

  const zipWriter = new ZipWriter(new BlobWriter('application/zip'))
  await Promise.all(
    getAvailablePortraits.value.map((portrait) => {
      let filename
      switch (portrait.mode) {
        case 'full':
          filename = 'Fulllength.png'
          break
        case 'medium':
          filename = 'Medium.png'
          break
        case 'small':
          filename = 'Small.png'
          break
      }

      return zipWriter.add(filename, new BlobReader(portrait.blob!))
    }),
  )
  return zipWriter.close()
}

async function downloadZip() {
  const bob = await getZipFileBlob()

  if (!bob) return

  document.body
    .appendChild(
      Object.assign(document.createElement('a'), {
        download: `${window.crypto.randomUUID()}.zip`,
        href: URL.createObjectURL(bob),
      }),
    )
    .click()
}
</script>
