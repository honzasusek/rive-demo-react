'use client'

import { FormEvent, useRef } from 'react'
import styles from './page.module.css'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
import axios from 'axios'

export default function Home() {
  const uploadForm = useRef<HTMLFormElement>(null)
  const { rive, RiveComponent } = useRive({
    src: './rive_demo.riv',
    stateMachines: 'State Machine',
    autoplay: true,
    onStateChange: console.log,
  })
  const uploading = useStateMachineInput(rive, 'State Machine', 'uploading')
  const progress = useStateMachineInput(rive, 'State Machine', 'progress')

  const uploadFile = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    axios.post('./upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: event => {
        progress!.value = (event.progress ?? 0) * 100
      },
    })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    uploading!.value = true
    progress!.value = 0

    const selectedFile = (uploadForm.current!.elements[0] as HTMLInputElement)
      .files![0]

    uploadFile(selectedFile)
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <form ref={uploadForm} onSubmit={onSubmit} id="uploadForm">
          <label>
            <input type="file" name="imageFile" />
          </label>
          <button type="submit">
            <RiveComponent />
          </button>
        </form>
      </main>
    </div>
  )
}
