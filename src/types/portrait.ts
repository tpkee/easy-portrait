import type { Nullable } from './misc'

type TPortrait = 'full' | 'medium' | 'small'

interface IDimensions {
  height: number
  width: number
}

interface IPortraitData {
  dimensions: IDimensions
  url: string
}

interface ISavedPortrait {
  mode: TPortrait
  src: string
  blob: Nullable<Blob>
}

export type { TPortrait, IDimensions, IPortraitData, ISavedPortrait }
