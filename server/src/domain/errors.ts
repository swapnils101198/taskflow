export type DomainErrorCode =
  | 'PROJECT_DUPLICATE'
  | 'PROJECT_INVALID_NAME'
  | 'TASK_DUPLICATE'
  | 'TASK_INVALID_TITLE'
  | 'TASK_DONE_WITHOUT_ASSIGNEE'
  | 'TASK_START_WITHOUT_ASSIGNEE'
  | 'TASK_INVALID_TRANSITION';

export class DomainError extends Error {
  constructor(
    public readonly code: DomainErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
