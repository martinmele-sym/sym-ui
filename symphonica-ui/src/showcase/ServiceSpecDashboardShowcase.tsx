import { useMemo, useState } from 'react'
import { AddDeviceModal, type AddDevicePayload } from '../components/AddDeviceModal'
import { ServiceSpecCascadeBreadcrumb } from '../components/ServiceSpecCascadeBreadcrumb'
import { ServiceSpecModelColumn } from '../components/ServiceSpecModelColumn'
import { ServiceSpecVendorColumn } from '../components/ServiceSpecVendorColumn'
import { ServiceSpecVersionColumn } from '../components/ServiceSpecVersionColumn'
import {
  SERVICE_SPEC_VENDORS,
  SERVICE_SPEC_MODELS,
  SERVICE_SPEC_VERSIONS,
  type ServiceSpecModel,
  type ServiceSpecVendor,
  type ServiceSpecVersion,
} from '../data/serviceSpecMockData'

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Service Spec Dashboard — Figma 8899:33910 / header 8949:28561. */
export function ServiceSpecDashboardShowcase() {
  const [vendors, setVendors] = useState<ServiceSpecVendor[]>(() => [...SERVICE_SPEC_VENDORS])
  const [models, setModels] = useState<ServiceSpecModel[]>(() => [...SERVICE_SPEC_MODELS])
  const [versions, setVersions] = useState<ServiceSpecVersion[]>(() => [...SERVICE_SPEC_VERSIONS])
  const [selectedVendorId, setSelectedVendorId] = useState('cisco')

  const vendorModels = useMemo(
    () => models.filter((m) => m.vendorId === selectedVendorId),
    [models, selectedVendorId],
  )
  const [selectedModelId, setSelectedModelId] = useState('asr-9000')

  const effectiveModelId = vendorModels.some((m) => m.id === selectedModelId)
    ? selectedModelId
    : (vendorModels[0]?.id ?? '')

  const modelVersions = useMemo(
    () => versions.filter((v) => v.modelId === effectiveModelId),
    [versions, effectiveModelId],
  )
  const [selectedVersionId, setSelectedVersionId] = useState('ios-xr-791')
  const [addDeviceOpen, setAddDeviceOpen] = useState(false)

  const effectiveVersionId = modelVersions.some((v) => v.id === selectedVersionId)
    ? selectedVersionId
    : (modelVersions[0]?.id ?? '')

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId)
  const selectedModel = vendorModels.find((m) => m.id === effectiveModelId)
  const selectedVersion = modelVersions.find((v) => v.id === effectiveVersionId)

  function handleVendorSelect(vendorId: string) {
    setSelectedVendorId(vendorId)
    const nextModels = models.filter((m) => m.vendorId === vendorId)
    const nextModelId = nextModels[0]?.id ?? ''
    setSelectedModelId(nextModelId)
    const nextVersions = nextModelId ? versions.filter((v) => v.modelId === nextModelId) : []
    setSelectedVersionId(nextVersions[0]?.id ?? '')
  }

  function handleModelSelect(modelId: string) {
    setSelectedModelId(modelId)
    const nextVersions = versions.filter((v) => v.modelId === modelId)
    setSelectedVersionId(nextVersions[0]?.id ?? '')
  }

  function handleVendorSave(vendor: ServiceSpecVendor, mode: 'add' | 'edit') {
    setVendors((prev) => {
      if (mode === 'edit') {
        return prev.map((v) => (v.id === vendor.id ? vendor : v))
      }
      return [vendor, ...prev]
    })
    setSelectedVendorId(vendor.id)
    const nextModels = models.filter((m) => m.vendorId === vendor.id)
    setSelectedModelId(nextModels[0]?.id ?? '')
    const nextVersions = nextModels[0] ? versions.filter((v) => v.modelId === nextModels[0].id) : []
    setSelectedVersionId(nextVersions[0]?.id ?? '')
  }

  function handleModelSave(model: ServiceSpecModel, mode: 'add' | 'edit') {
    setModels((prev) => {
      if (mode === 'edit') {
        return prev.map((m) => (m.id === model.id ? model : m))
      }
      return [model, ...prev]
    })
    setSelectedModelId(model.id)
    const nextVersions = versions.filter((v) => v.modelId === model.id)
    setSelectedVersionId(nextVersions[0]?.id ?? '')
  }

  function handleVersionSave(version: ServiceSpecVersion, mode: 'add' | 'edit') {
    setVersions((prev) => {
      if (mode === 'edit') {
        return prev.map((v) => (v.id === version.id ? version : v))
      }
      return [version, ...prev]
    })
    setSelectedVersionId(version.id)
  }

  function handleVendorDelete(vendorId: string) {
    const vendor = vendors.find((v) => v.id === vendorId)
    if (!vendor) return
    if (!window.confirm(`Delete vendor "${vendor.name}" and its models and versions?`)) return

    const modelIds = models.filter((m) => m.vendorId === vendorId).map((m) => m.id)
    setVendors((prev) => prev.filter((v) => v.id !== vendorId))
    setModels((prev) => prev.filter((m) => m.vendorId !== vendorId))
    setVersions((prev) => prev.filter((v) => !modelIds.includes(v.modelId)))

    const remaining = vendors.filter((v) => v.id !== vendorId)
    const nextVendorId = remaining[0]?.id ?? ''
    setSelectedVendorId(nextVendorId)
    const nextModels = models.filter((m) => m.vendorId === nextVendorId)
    const nextModelId = nextModels[0]?.id ?? ''
    setSelectedModelId(nextModelId)
    const nextVersions = nextModelId ? versions.filter((v) => v.modelId === nextModelId) : []
    setSelectedVersionId(nextVersions[0]?.id ?? '')
  }

  function handleModelDelete(modelId: string) {
    const model = models.find((m) => m.id === modelId)
    if (!model) return
    if (!window.confirm(`Delete model "${model.name}" and its versions?`)) return

    setModels((prev) => prev.filter((m) => m.id !== modelId))
    setVersions((prev) => prev.filter((v) => v.modelId !== modelId))

    const remaining = models.filter((m) => m.vendorId === selectedVendorId && m.id !== modelId)
    const nextModelId = remaining[0]?.id ?? ''
    setSelectedModelId(nextModelId)
    const nextVersions = nextModelId ? versions.filter((v) => v.modelId === nextModelId) : []
    setSelectedVersionId(nextVersions[0]?.id ?? '')
  }

  function handleVersionDelete(versionId: string) {
    const version = versions.find((v) => v.id === versionId)
    if (!version) return
    if (!window.confirm(`Delete version "${version.name}"?`)) return

    setVersions((prev) => prev.filter((v) => v.id !== versionId))
    const remaining = modelVersions.filter((v) => v.id !== versionId)
    setSelectedVersionId(remaining[0]?.id ?? '')
  }

  function handleRefresh() {
    setVendors([...SERVICE_SPEC_VENDORS])
    setModels([...SERVICE_SPEC_MODELS])
    setVersions([...SERVICE_SPEC_VERSIONS])
    setSelectedVendorId('cisco')
    setSelectedModelId('asr-9000')
    setSelectedVersionId('ios-xr-791')
  }

  function handleAddDeviceSubmit({ vendorId, modelId, versionName }: AddDevicePayload) {
    setSelectedVendorId(vendorId)
    setSelectedModelId(modelId)

    const normalizedName = versionName.trim()
    const existing = versions.find(
      (version) => version.modelId === modelId && version.name === normalizedName,
    )
    if (existing) {
      setSelectedVersionId(existing.id)
      return
    }

    const baseId = slugify(normalizedName) || 'version'
    let id = baseId
    let n = 1
    while (versions.some((version) => version.id === id)) {
      id = `${baseId}-${n}`
      n += 1
    }

    const newVersion: ServiceSpecVersion = {
      id,
      modelId,
      name: normalizedName,
    }
    setVersions((prev) => [newVersion, ...prev])
    setSelectedVersionId(id)
  }

  const dashboardGrid = (
    <div className="sym-service-spec-dashboard__grid">
      <ServiceSpecVendorColumn
        vendors={vendors}
        selectedId={selectedVendorId}
        onSelect={handleVendorSelect}
        onSave={handleVendorSave}
        onDelete={handleVendorDelete}
      />
      <ServiceSpecModelColumn
        vendorId={selectedVendorId}
        vendorName={selectedVendor?.name}
        models={vendorModels}
        selectedId={effectiveModelId || null}
        onSelect={handleModelSelect}
        onSave={handleModelSave}
        onDelete={handleModelDelete}
      />
      <ServiceSpecVersionColumn
        modelId={effectiveModelId}
        modelName={selectedModel?.name}
        versions={modelVersions}
        selectedId={effectiveVersionId || null}
        onSelect={setSelectedVersionId}
        onSave={handleVersionSave}
        onDelete={handleVersionDelete}
      />
    </div>
  )

  const dashboardFooter = (
    <footer className="sym-service-spec-dashboard__footer">
      <p className="sym-service-spec-dashboard__copyright">
        ©2001-2026 Symphonica - V.: 2.17 . All Rights Reserved
      </p>
    </footer>
  )

  return (
    <div className="sym-page sym-service-spec-dashboard sym-service-spec-dashboard--section-card">
      <article className="sym-card-primary sym-card-primary--section-sticky sym-service-spec-dashboard__section-card sym-no-hover">
        <header className="sym-card-header">
          <div className="sym-card-header__top">
            <h1 className="sym-card-title">Device Management</h1>
          </div>
          <div className="sym-card-header__bottom">
            <div className="sym-card-header__left">
              <button
                type="button"
                className="sym-btn-outlined-icon-only"
                aria-label="Refresh"
                onClick={handleRefresh}
              >
                <span className="material-icons-outlined" aria-hidden>
                  refresh
                </span>
              </button>
              <ServiceSpecCascadeBreadcrumb
                vendorName={selectedVendor?.name}
                modelName={selectedModel?.name}
                versionName={selectedVersion?.name}
              />
            </div>
            <div className="sym-card-header__right">
              <button
                type="button"
                className="sym-btn-filled-primary"
                onClick={() => setAddDeviceOpen(true)}
              >
                <span className="material-icons-outlined" aria-hidden>
                  add
                </span>
                Add Device
              </button>
            </div>
          </div>
        </header>
      </article>
      {dashboardGrid}
      {dashboardFooter}
      <AddDeviceModal
        open={addDeviceOpen}
        onClose={() => setAddDeviceOpen(false)}
        vendors={vendors}
        models={models}
        onAdd={handleAddDeviceSubmit}
      />
    </div>
  )
}
