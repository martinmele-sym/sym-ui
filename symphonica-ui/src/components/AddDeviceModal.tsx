import { useEffect, useId, useMemo, useState } from 'react'
import type { ServiceSpecModel, ServiceSpecVendor } from '../data/serviceSpecMockData'
import { SymModal } from './SymModal'

export type AddDevicePayload = {
  vendorId: string
  modelId: string
  versionName: string
}

type AddDeviceModalProps = {
  open: boolean
  onClose: () => void
  vendors: ServiceSpecVendor[]
  models: ServiceSpecModel[]
  onAdd: (payload: AddDevicePayload) => void
}

/** Add Device modal — Vendor / Model selects + Version input (Guía §5.10). */
export function AddDeviceModal({ open, onClose, vendors, models, onAdd }: AddDeviceModalProps) {
  const titleId = useId()
  const vendorFieldId = useId()
  const modelFieldId = useId()
  const versionFieldId = useId()

  const [vendorId, setVendorId] = useState('')
  const [modelId, setModelId] = useState('')
  const [versionName, setVersionName] = useState('')

  const vendorModels = useMemo(
    () => (vendorId ? models.filter((model) => model.vendorId === vendorId) : []),
    [models, vendorId],
  )

  const canSubmit =
    vendorId.length > 0 && modelId.length > 0 && versionName.trim().length > 0

  useEffect(() => {
    if (!open) return
    setVendorId('')
    setModelId('')
    setVersionName('')
  }, [open])

  function handleVendorChange(nextVendorId: string) {
    setVendorId(nextVendorId)
    setModelId('')
  }

  function handleSubmit() {
    if (!canSubmit) return
    onAdd({
      vendorId,
      modelId,
      versionName: versionName.trim(),
    })
    onClose()
  }

  return (
    <SymModal
      open={open}
      onClose={onClose}
      titleId={titleId}
      title="Add Device"
      icon="add"
      primaryLabel="Add Device"
      primaryDisabled={!canSubmit}
      onPrimary={handleSubmit}
    >
      <div>
        <label className="sym-form-label form-label" htmlFor={vendorFieldId}>
          Vendor
        </label>
        <select
          id={vendorFieldId}
          className="form-select sym-form-control"
          value={vendorId}
          onChange={(event) => handleVendorChange(event.target.value)}
        >
          <option value="">Select vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="sym-form-label form-label" htmlFor={modelFieldId}>
          Model
        </label>
        <select
          id={modelFieldId}
          className="form-select sym-form-control"
          value={modelId}
          disabled={!vendorId}
          onChange={(event) => setModelId(event.target.value)}
        >
          <option value="">{vendorId ? 'Select model' : 'Select vendor first'}</option>
          {vendorModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="sym-form-label form-label" htmlFor={versionFieldId}>
          Version
        </label>
        <input
          id={versionFieldId}
          type="text"
          className="form-control sym-form-control"
          value={versionName}
          placeholder="Enter version"
          onChange={(event) => setVersionName(event.target.value)}
        />
      </div>
    </SymModal>
  )
}
