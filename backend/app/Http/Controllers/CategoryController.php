<?php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('products')->get();
        return CategoryResource::collection($categories);
    }

    public function show($id)
    {
        $category = Category::with('products')->find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        return new CategoryResource($category);
    }

    // Admin: List all categories
    public function adminIndex()
    {
        $categories = Category::all();
        return response()->json(['data' => $categories]);
    }

    // Admin: Create category
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($validated);
        return response()->json(['data' => $category], 201);
    }

    // Admin: Update category
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update($validated);
        return response()->json(['data' => $category, 'message' => 'Category updated successfully']);
    }

    // Admin: Delete category
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }}
