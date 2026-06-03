class ApiResponse {
    constructor(
        statusCode,
        data,
        message="success") {
        this.statusCode = statusCode;
        this.data = data;
        this.success = true;
        this.message = statusCode >= 400 ? "failed" : message;

        }
    
}
export { ApiResponse };