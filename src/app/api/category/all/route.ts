import { connect_db } from "@/configs/db";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function GET(req: NextRequest) {
  try {
    const categories = await Category.find();

    return NextResponse.json(
      {
        msg: "Ok",
        categories,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
