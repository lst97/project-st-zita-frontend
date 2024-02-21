export class ResponseStatus {
    static SUCCESS = 'success';
    static ERROR = 'error';
    static PARTIAL = 'partial';
}

interface Message {
    code: string;
    message: string;
}

export class ResponseWarning implements Message {
    code: string;
    message: string;

    constructor(code: string, message: string) {
        this.code = code;
        this.message = message;
    }
}

export class ResponseMessage implements Message {
    code: string;
    message: string;

    constructor(code: string, message: string) {
        this.code = code;
        this.message = message;
    }
}

export interface Pagination {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
}

export interface Metadata {
    // Add any relevant metadata properties here
}

// For partial success
class Result<T> {
    data: T;
    success: boolean;
    errorMessage?: string;

    constructor(data: T, success: boolean, errorMessage?: string) {
        this.data = data;
        this.success = success;
        this.errorMessage = errorMessage;
    }
}

interface BackendStandardResponseInput<T> {
    status: 'success' | 'error' | 'partial';
    message: ResponseMessage;
    data?: T;
    requestId: string;
    timestamp: string; // ISO 8601 format
    errorCode?: string;
    warnings?: ResponseWarning[];
    version?: string;
    pagination?: Pagination;
    metadata?: Metadata;
    result?: Result<T>[];
}

class BackendStandardResponse<T> {
    status: 'success' | 'error' | 'partial';
    message: ResponseMessage;
    data?: T;
    requestId: string;
    timestamp: string = new Date().toISOString();
    errorCode?: string;
    warnings?: ResponseWarning[];
    version?: string = '1.0';
    pagination?: Pagination;
    metadata?: Metadata;
    result?: Result<T>[]; // List of Result<T>

    constructor(input: BackendStandardResponseInput<T>) {
        this.status = input.status;
        this.message = input.message;
        this.data = input.data;
        this.requestId = input.requestId;
        this.timestamp = input.timestamp;
        this.errorCode = input.errorCode;
        this.warnings = input.warnings;
        this.version = input.version;
        this.pagination = input.pagination;
        this.metadata = input.metadata;
        this.result = input.result;
    }
}

export default BackendStandardResponse;
