import type { OrderType } from './orderTypes'

export type ServiceSpecVendor = {
  id: string
  name: string
  description?: string
  imageUrl?: string
  imageName?: string
}

export type ServiceSpecModel = {
  id: string
  vendorId: string
  name: string
  description?: string
  imageUrl?: string
  imageName?: string
  orderTypes?: OrderType[]
}

export type ServiceSpecVersion = {
  id: string
  modelId: string
  name: string
  description?: string
  fileUrl?: string
  fileName?: string
}

export const SERVICE_SPEC_VENDORS: ServiceSpecVendor[] = [
  { id: 'cisco', name: 'Cisco' },
  { id: 'huawei', name: 'Huawei' },
  { id: 'nokia', name: 'Nokia' },
  { id: 'juniper', name: 'Juniper' },
  { id: 'arista', name: 'Arista' },
  { id: 'ericsson', name: 'Ericsson' },
  { id: 'adtran', name: 'ADTRAN' },
  { id: 'zte', name: 'ZTE' },
  { id: 'ciena', name: 'Ciena' },
  { id: 'calix', name: 'Calix' },
  { id: 'ribbon', name: 'Ribbon' },
  { id: 'infinera', name: 'Infinera' },
  { id: 'fortinet', name: 'Fortinet' },
]

export const SERVICE_SPEC_MODELS: ServiceSpecModel[] = [
  { id: 'asr-9000', vendorId: 'cisco', name: 'ASR-9000', orderTypes: ['ACTIVATE', 'CHANGE_EQUIPMENT', 'CHANGE_OWNER'] },
  { id: 'catalyst-9300', vendorId: 'cisco', name: 'Catalyst 9300' },
  { id: 'nexus-9000', vendorId: 'cisco', name: 'Nexus 9000' },
  { id: 'isr-4000', vendorId: 'cisco', name: 'ISR 4000' },
  { id: 'asr-1000', vendorId: 'cisco', name: 'ASR-1000' },
  { id: 'ncs-5500', vendorId: 'cisco', name: 'NCS 5500' },
  { id: 'catalyst-8000', vendorId: 'cisco', name: 'Catalyst 8000' },
  { id: 'ncs-540', vendorId: 'cisco', name: 'NCS 540' },
  { id: 'asr-920', vendorId: 'cisco', name: 'ASR-920' },
  { id: 'nexus-3000', vendorId: 'cisco', name: 'Nexus 3000' },
  { id: 'isr-1000', vendorId: 'cisco', name: 'ISR 1000' },
  { id: 'catalyst-9500', vendorId: 'cisco', name: 'Catalyst 9500' },
  { id: 'ncs-4000', vendorId: 'cisco', name: 'NCS 4000' },
  { id: 'huawei-ne8000', vendorId: 'huawei', name: 'NE8000' },
  { id: 'huawei-ce6800', vendorId: 'huawei', name: 'CE6800' },
  { id: 'nokia-7750', vendorId: 'nokia', name: '7750 SR' },
  { id: 'nokia-7250', vendorId: 'nokia', name: '7250 IXR' },
  { id: 'juniper-mx', vendorId: 'juniper', name: 'MX Series' },
  { id: 'juniper-ptx', vendorId: 'juniper', name: 'PTX Series' },
  { id: 'arista-7280', vendorId: 'arista', name: '7280R' },
  { id: 'ericsson-ssr', vendorId: 'ericsson', name: 'SSR 6700' },
  { id: 'adtran-ta5000', vendorId: 'adtran', name: 'TA5000' },
  { id: 'zte-zxctn', vendorId: 'zte', name: 'ZXCTN 9000' },
  { id: 'ciena-6500', vendorId: 'ciena', name: '6500 Packet' },
  { id: 'calix-e7', vendorId: 'calix', name: 'E7-2' },
  { id: 'ribbon-swe', vendorId: 'ribbon', name: 'SWE Lite' },
  { id: 'infinera-groove', vendorId: 'infinera', name: 'Groove G30' },
  { id: 'fortinet-fg', vendorId: 'fortinet', name: 'FortiGate 600F' },
]

export const SERVICE_SPEC_VERSIONS: ServiceSpecVersion[] = [
  { id: 'ios-xr-791', modelId: 'asr-9000', name: 'IOS-XR 7.9.1' },
  { id: 'ios-xr-782', modelId: 'asr-9000', name: 'IOS-XR 7.8.2' },
  { id: 'ios-xr-771', modelId: 'asr-9000', name: 'IOS-XR 7.7.1' },
  { id: 'ios-xr-754', modelId: 'asr-9000', name: 'IOS-XR 7.5.4' },
  { id: 'ios-xr-732', modelId: 'asr-9000', name: 'IOS-XR 7.3.2' },
  { id: 'ios-xr-721', modelId: 'asr-9000', name: 'IOS-XR 7.2.1' },
  { id: 'ios-xr-713', modelId: 'asr-9000', name: 'IOS-XR 7.1.3' },
  { id: 'ios-xr-702', modelId: 'asr-9000', name: 'IOS-XR 7.0.2' },
  { id: 'ios-xr-674', modelId: 'asr-9000', name: 'IOS-XR 6.7.4' },
  { id: 'ios-xr-663', modelId: 'asr-9000', name: 'IOS-XR 6.6.3' },
  { id: 'ios-xr-652', modelId: 'asr-9000', name: 'IOS-XR 6.5.2' },
  { id: 'ios-xr-631', modelId: 'asr-9000', name: 'IOS-XR 6.3.1' },
  { id: 'ios-xr-614', modelId: 'asr-9000', name: 'IOS-XR 6.1.4' },
  { id: 'cat9300-1712', modelId: 'catalyst-9300', name: 'IOS-XE 17.12.04' },
  { id: 'cat9300-1711', modelId: 'catalyst-9300', name: 'IOS-XE 17.11.01' },
  { id: 'nexus9000-102', modelId: 'nexus-9000', name: 'NX-OS 10.2(4)' },
  { id: 'nexus9000-101', modelId: 'nexus-9000', name: 'NX-OS 10.1(2)' },
  { id: 'isr4000-169', modelId: 'isr-4000', name: 'IOS-XE 16.09.08' },
  { id: 'huawei-v800r021', modelId: 'huawei-ne8000', name: 'V800R021C00' },
  { id: 'huawei-v800r020', modelId: 'huawei-ne8000', name: 'V800R020C10' },
  { id: 'nokia-7750-221', modelId: 'nokia-7750', name: 'SR OS 22.10.R1' },
  { id: 'juniper-231', modelId: 'juniper-mx', name: 'Junos OS 23.1R1' },
  { id: 'arista-428', modelId: 'arista-7280', name: 'EOS 4.28.2F' },
  { id: 'fortinet-742', modelId: 'fortinet-fg', name: 'FortiOS 7.4.2' },
]

export function modelsForVendor(vendorId: string): ServiceSpecModel[] {
  return SERVICE_SPEC_MODELS.filter((m) => m.vendorId === vendorId)
}

export function versionsForModel(modelId: string): ServiceSpecVersion[] {
  return SERVICE_SPEC_VERSIONS.filter((v) => v.modelId === modelId)
}
