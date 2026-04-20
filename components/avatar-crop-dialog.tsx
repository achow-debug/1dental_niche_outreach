'use client'

import { useCallback, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import { getCroppedImageBlob } from '@/lib/crop-image'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string | null
  onCropped: (blob: Blob) => void | Promise<void>
}

export function AvatarCropDialog({ open, onOpenChange, imageSrc, onCropped }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [applying, setApplying] = useState(false)

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
    }
    onOpenChange(next)
  }

  async function handleApply() {
    if (!imageSrc || !croppedAreaPixels) return
    setApplying(true)
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels)
      await onCropped(blob)
      handleOpenChange(false)
    } finally {
      setApplying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className="max-w-[min(100%-2rem,28rem)] gap-4 sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>Adjust profile photo</DialogTitle>
          <DialogDescription>
            Drag to reposition, use the slider to zoom, then apply. The image is saved as a square.
          </DialogDescription>
        </DialogHeader>

        {imageSrc ? (
          <div className="space-y-3">
            <div className="relative mx-auto h-[min(72vw,320px)] w-[min(72vw,320px)] overflow-hidden rounded-xl bg-muted">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="space-y-2 px-1">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="avatar-zoom" className="text-xs text-muted-foreground">
                  Zoom
                </Label>
                <span className="text-xs tabular-nums text-muted-foreground">{zoom.toFixed(2)}×</span>
              </div>
              <Slider
                id="avatar-zoom"
                min={1}
                max={3}
                step={0.02}
                value={[zoom]}
                onValueChange={(v) => setZoom(v[0] ?? 1)}
              />
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!imageSrc || !croppedAreaPixels || applying} onClick={() => void handleApply()}>
            {applying ? 'Saving…' : 'Apply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
