import { NextResponse } from "next/server";
import { toErrorResponse } from "./errors";

export type ApiSuccess<T> = { data: T };
export type ApiFailure = { error: { message: string; code: string } };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ data }, init);
}

export function apiError(error: unknown) {
  const { message, code, status } = toErrorResponse(error);
  return NextResponse.json<ApiFailure>({ error: { message, code } }, { status });
}
