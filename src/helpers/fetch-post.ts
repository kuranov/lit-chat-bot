import {apiUrl} from "./api-url";

export async function fetchPost(path: string, data: any): Promise<any> {
  const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });
  const res = await fetch(apiUrl(path), {
    headers,
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}