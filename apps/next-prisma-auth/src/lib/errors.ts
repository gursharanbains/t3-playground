import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function getErrorResponse(
  error: unknown,
  setStatus = 0,
  setMessage = ""
) {
  let response;
  if (error instanceof ZodError) {
    response = {
      status: 400,
      message: "failed validation",
      error: error.flatten(),
    };
  } else if (
    error instanceof Error ||
    (error && typeof error == "object" && "message" in error)
  ) {
    response = {
      status: 500,
      message: "something went wrong",
      error: error.message,
    };
  } else if (typeof error == "string") {
    response = {
      status: 500,
      message: "something went wrong",
      error,
    };
  } else {
    response = {
      status: 500,
      message: "something went wrong",
      error: "not available",
    };
  }

  // override status or message if specified
  response = {
    status: setStatus !== 0 ? setStatus : response.status,
    message: setMessage ? setMessage : response.message,
    error: response.error,
  };

  console.log(response);

  return new NextResponse(JSON.stringify(response), {
    status: setStatus !== 0 ? setStatus : response.status,
    headers: { "Content-Type": "application/json" },
  });
}
