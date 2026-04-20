'use client'

import { useEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { AVATAR_BUCKET, avatarObjectPath, getAvatarSignedUrl } from '@/lib/avatar'
import { getProfileInitialLetter } from '@/lib/profile-initial'
import type { Profile } from '@/lib/types/profile'
import { AvatarCropDialog } from '@/components/avatar-crop-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const MAX_BYTES = 5 * 1024 * 1024

type Props = {
  user: User
  profile: Profile
  initialAvatarSignedUrl: string | null
}

export function ProfileEditor({ user, profile, initialAvatarSignedUrl }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [fullName, setFullName] = useState(profile.full_name)
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [avatarPath, setAvatarPath] = useState<string | null>(profile.avatar_url)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatarSignedUrl)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [cropOpen, setCropOpen] = useState(false)
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)

  const initial = getProfileInitialLetter(fullName, user.email)

  useEffect(() => {
    return () => {
      if (cropImageSrc) URL.revokeObjectURL(cropImageSrc)
    }
  }, [cropImageSrc])

  function handleCropDialogChange(open: boolean) {
    if (!open && cropImageSrc) {
      URL.revokeObjectURL(cropImageSrc)
      setCropImageSrc(null)
    }
    setCropOpen(open)
  }

  function handlePickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX_BYTES) {
      setMessage({ type: 'err', text: 'Image must be 5MB or smaller.' })
      return
    }
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'err', text: 'Choose an image file (JPEG, PNG, WebP, or GIF).' })
      return
    }
    if (cropImageSrc) URL.revokeObjectURL(cropImageSrc)
    const url = URL.createObjectURL(file)
    setCropImageSrc(url)
    setCropOpen(true)
    setMessage(null)
  }

  async function handleCroppedUpload(blob: Blob) {
    setUploading(true)
    setMessage(null)
    const supabase = createClient()
    const path = avatarObjectPath(user.id, 'jpg')

    if (avatarPath && avatarPath !== path) {
      await supabase.storage.from(AVATAR_BUCKET).remove([avatarPath])
    }

    const { error: upErr } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, blob, { upsert: true, contentType: 'image/jpeg' })

    if (upErr) {
      setUploading(false)
      setMessage({ type: 'err', text: upErr.message })
      return
    }

    const { error: dbErr } = await supabase
      .from('profiles')
      .update({ avatar_url: path })
      .eq('id', user.id)

    if (dbErr) {
      setUploading(false)
      setMessage({ type: 'err', text: dbErr.message })
      return
    }

    setAvatarPath(path)
    const signed = await getAvatarSignedUrl(supabase, path)
    setAvatarPreview(signed)
    setUploading(false)
    setMessage({ type: 'ok', text: 'Profile picture updated.' })
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
      })
      .eq('id', user.id)

    setSaving(false)
    if (error) {
      setMessage({ type: 'err', text: error.message })
      return
    }
    setMessage({ type: 'ok', text: 'Profile saved.' })
  }

  return (
    <div className="space-y-8">
      <AvatarCropDialog
        open={cropOpen}
        onOpenChange={handleCropDialogChange}
        imageSrc={cropImageSrc}
        onCropped={async (blob) => {
          await handleCroppedUpload(blob)
        }}
      />

      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Your profile</h1>
        <p className="mt-2 text-muted-foreground">
          Update your details and profile picture. Drag and zoom to fit your photo in the circle; it is stored privately
          (you and practice admins can access it).
        </p>
      </div>

      {message && (
        <p
          className={
            message.type === 'ok' ? 'text-sm text-primary font-medium' : 'text-sm text-destructive font-medium'
          }
          role="status"
        >
          {message.text}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile picture</CardTitle>
          <CardDescription>Choose a photo, then adjust crop and zoom. JPEG, PNG, WebP, or GIF — up to 5MB.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar className="h-24 w-24">
            {avatarPreview ? <AvatarImage src={avatarPreview} alt="" /> : null}
            <AvatarFallback className="text-2xl font-semibold bg-primary/15 text-primary">{initial}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={handlePickFile}
            />
            <Button
              type="button"
              variant="secondary"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? 'Saving…' : 'Change photo'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Email comes from your sign-in provider.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Role</span>
            <Badge variant="secondary">{profile.role}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline">{profile.status}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>Name and phone stored on your practice profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
