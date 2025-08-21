export class ProfileError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ProfileError';
  }
}

export class ProfileNotFound extends ProfileError {
  constructor() {
    super(
      `Profile not found`,
      'PROFILE_NOT_FOUND'
    );
  }
}