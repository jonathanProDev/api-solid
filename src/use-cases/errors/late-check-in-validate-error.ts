export class LateCheckInValidateError extends Error {
  constructor() {
    super(
      'The check-in can only be lavidate until 20 minutes of its cretation.',
    )
  }
}
