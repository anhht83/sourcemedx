export enum EPublicVersionStatus {
  New = 'New',
  Update = 'Update',
  Delete = 'Delete',
}

export enum EDeviceRecordStatus {
  Published = 'Published',
  Unpublished = 'Unpublished',
  Deactivated = 'Deactivated',
}

export enum EMRISafetyStatus {
  MRSafe = 'MR Safe',
  MRUnsafe = 'MR Unsafe',
  MRConditional = 'MR Conditional',
  NoMRLabel = 'Labeling does not contain MRI Safety Information',
}

export enum EDeviceIdType {
  Primary = 'Primary',
  Secondary = 'Secondary',
  DirectMarking = 'Direct Marking',
  UnitOfUse = 'Unit of Use',
  Package = 'Package',
  Previous = 'Previous',
}

export enum EDeviceIdIssuingAgency {
  GS1 = 'GS1',
  ICCBBA = 'ICCBBA',
  HIBCC = 'HIBCC',
  NDCNHRIC = 'NDC/NHRIC',
}

export enum EPkgStatus {
  InCommercialDistribution = 'In Commercial Distribution',
  NotInCommercialDistribution = 'Not in Commercial Distribution',
}

export enum EGmdnCodeStatus {
  Active = 'Active',
  Obsolete = 'Obsolete',
}

export enum ESterilizationMethod {
  ChlorineDioxide = 'Chlorine Dioxide',
  DryHeatSterilization = 'Dry Heat Sterilization',
  EthyleneOxide = 'Ethylene Oxide',
  HighIntensityLightOrPulseLight = 'High Intensity Light or Pulse Light',
  HighLevelDisinfectant = 'High-level Disinfectant',
  HydrogenPeroxide = 'Hydrogen Peroxide',
  LiquidChemical = 'Liquid Chemical',
  MicrowaveRadiation = 'Microwave Radiation',
  MoistHeatOrSteamSterilization = 'Moist Heat or Steam Sterilization',
  NitrogenDioxide = 'Nitrogen Dioxide',
  Ozone = 'Ozone',
  PeraceticAcid = 'Peracetic Acid',
  RadiationSterilization = 'Radiation Sterilization',
  SoundWaves = 'Sound Waves',
  SupercriticalCarbonDioxide = 'Supercritical Carbon Dioxide',
  UltravioletLight = 'Ultraviolet Light',
}
