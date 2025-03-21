export interface ApiResponse<T> {
  status: "success" | "Failed";
  data?: T;
  message?: string;
  error?: string;
}
