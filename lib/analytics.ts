export function isValidMeasurementId(measurementId: string | undefined): boolean {
  if (!measurementId) {
    return false;
  }

  const normalizedMeasurementId = measurementId.trim();
  return /^G-[A-Z0-9]+$/i.test(normalizedMeasurementId);
}
