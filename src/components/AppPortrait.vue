<template>
  <div class="relative flex gap-5 w-full">
    <div>
      <portrait-controls
        @zen="toggleZenMode"
        @transform="cropperImageRef?.$setTransform($event.x, 0, 0, $event.y, 0, 0)"
        @zoom="onZoom($event)"
        @save="onSave"
      />
    </div>
    <div
      class="self-start justify-center"
      :class="{
        'fixed inset-0 bg-black z-50 min-h-screen min-w-screen grid justify-center overflow-scroll transition-all duration-100 ease-in-out':
          isZenMode,
      }"
    >
      <cropper-canvas ref="cropperCanvas" :style="getCanvasStyle" background>
        <cropper-image ref="cropperImage" :src="imageUrl" translatable scalable />
        <cropper-shade hidden />
        <cropper-handle action="move" plain />
      </cropper-canvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Nullable } from '@/types/misc'
import type * as Portrait from '@/types/portrait'
import { computed, onBeforeMount, ref, useTemplateRef, watch } from 'vue'
import CropperCanvas from '@cropper/element-canvas'
import CropperImage from '@cropper/element-image'
import CropperHandle from '@cropper/element-handle'
import CropperShade from '@cropper/element-shade'
import PortraitControls from '@/components/PortraitControls.vue'

// Template refs
const cropperCanvasRef = useTemplateRef('cropperCanvas')
const cropperImageRef = useTemplateRef('cropperImage')

//Emits
const emit = defineEmits<{
  save: [Blob]
}>()

// Props
const props = defineProps<{
  image: string
  fullSize?: Portrait.IDimensions
  cropperSize: Portrait.IDimensions
}>()

// Reactive state
const originalDimensions = ref<Portrait.IDimensions>({
  width: 0,
  height: 0,
})
const isZenMode = ref(false)
const imageUrl = ref<string>(props.image)

// Watchers
watch(
  () => props.image,
  (newVal) => {
    console.log(
      'New image prop value:',
      newVal,
      imageUrl.value,
      newVal !== imageUrl.value,
      props.cropperSize,
    )
    if (newVal !== imageUrl.value) {
      imageUrl.value = newVal
    }
  },
  { immediate: true },
)
watch(cropperImageRef, () => {
  cropperImageRef.value?.$ready((image) => {
    originalDimensions.value = {
      width: image.naturalWidth,
      height: image.naturalHeight,
    }
  })
})

// Computed
const getCanvasStyle = computed<string>((): string => {
  return `
    height: ${valueToPx(props.cropperSize?.height)};
    width: ${valueToPx(props.cropperSize?.width)};
    border:  1px solid red;
  `
})
// Functions
function valueToPx(value: Nullable<number>) {
  return `${value ?? 0}px`
}

function onZoom(value: number) {
  console.log('Zooming to:', value)
  cropperImageRef?.value?.$zoom(value)
}

function toggleZenMode() {
  isZenMode.value = !isZenMode.value
}

function onSave() {
  console.log('Saving image')
  const cc = cropperCanvasRef.value
  if (!cc) return

  cc.$toCanvas().then((canvas) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return

        emit('save', blob)
      },
      'image/png',
      1,
    )
  })
}

// Misc
CropperCanvas.$define()
CropperImage.$define()
CropperHandle.$define()
CropperShade.$define()

// Lifecycle hooks
onBeforeMount(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      isZenMode.value = false
    }
  })
})
</script>
