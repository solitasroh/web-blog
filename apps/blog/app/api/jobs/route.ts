import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getJobsData } from "@/lib/jobs";

const AUTH_COOKIE_NAME = "admin_session";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE_NAME);

    if (!session?.value) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const jobsData = getJobsData();
    return NextResponse.json(jobsData);
  } catch (error) {
    console.error("Error fetching jobs data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
