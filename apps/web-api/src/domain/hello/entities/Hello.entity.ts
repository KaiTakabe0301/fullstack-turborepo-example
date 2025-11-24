/**
 * Hello Domain Entity
 *
 * Represents the core domain model for Hello functionality.
 * This is a simple example demonstrating DDD entity pattern.
 */

export interface HelloEntityProps {
  message: string;
  timestamp: Date;
  requestId?: string;
}

export class HelloEntity {
  private readonly _message: string;
  private readonly _timestamp: Date;
  private readonly _requestId?: string;

  constructor(props: HelloEntityProps) {
    this._message = props.message;
    this._timestamp = props.timestamp;
    this._requestId = props.requestId;
  }

  get message(): string {
    return this._message;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  get requestId(): string | undefined {
    return this._requestId;
  }

  /**
   * Factory method to create a new Hello entity
   */
  static create(message: string, requestId?: string): HelloEntity {
    return new HelloEntity({
      message,
      timestamp: new Date(),
      requestId,
    });
  }

  /**
   * Convert entity to plain object for API response
   */
  toJSON(): Record<string, unknown> {
    return {
      message: this._message,
      timestamp: this._timestamp.toISOString(),
      ...(this._requestId && { requestId: this._requestId }),
    };
  }
}
