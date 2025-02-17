import { connect_db } from "@/configs/db";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json(
        {
          msg: "Please Fill Out the fields",
        },
        { status: 400 }
      );
    }

    const new_category = new Category({
      name,
    });

    await new_category.save();

    return NextResponse.json(
      {
        msg: "category created successfully",
        new_category,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 6);

    const items_per_page = 6;

    const skip = (page - 1) * items_per_page;

    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(items_per_page);

    const totalCategories = await Category.countDocuments();

    const totalPages = Math.ceil(totalCategories / items_per_page);

    return NextResponse.json(
      {
        msg: "Ok",
        details: {
          current_page: page,
          total: totalCategories,
          total_pages: totalPages,
        },
        categories,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const category_id = req.nextUrl.searchParams.get("category_id");
    const body = await req.json();
    if (!category_id) {
      return NextResponse.json(
        {
          msg: "category id is missing",
        },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndUpdate(category_id, body, {
      new: true,
    });

    return NextResponse.json(
      {
        msg: "Category Updated Sucessfully",
        category,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const category_id = req.nextUrl.searchParams.get("category_id");
    if (!category_id) {
      return NextResponse.json(
        {
          msg: "category id is missing",
        },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(category_id);

    return NextResponse.json(
      {
        msg: "Category deleted Sucessfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
