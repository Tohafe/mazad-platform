import type { AxiosInstance } from "axios";
import type { UserSummary } from "../types/UserSummary";

async function getAllUsers(api: AxiosInstance, password: string): Promise<UserSummary[]> {
  let response;
  try {
    response = await api.get<UserSummary[]>(`/profile/users?password=${encodeURIComponent(password)}`);
  } catch (errors: any) {
    throw errors;
  }
  return response?.data;
}

export { getAllUsers };
