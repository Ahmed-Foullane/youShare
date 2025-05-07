<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Repositories\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    
    protected $categoryService;

    public function __construct(CategoryService $categoryService){
        $this->categoryService = $categoryService;
    }

    
    public function index(): JsonResponse{
        $categories = $this->categoryService->getAllCategories();
        return response()->json($categories);
    }
    
    
    public function withCount(): JsonResponse{
        $categories = $this->categoryService->getCategoriesWithArticleCount();
        return response()->json($categories);
    }

    public function store(CategoryRequest $request): JsonResponse{
        $category = $this->categoryService->createCategory($request->validated());
        
        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }

    public function show(int $id): JsonResponse {
        $category = $this->categoryService->getCategoryById($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        return response()->json(['data' => $category]);
    }

    public function update(CategoryRequest $request, int $id): JsonResponse {
        $category = $this->categoryService->updateCategory($id, $request->validated());
        
        return response()->json([
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }

    public function destroy(int $id): JsonResponse{
        $result = $this->categoryService->deleteCategory($id);
        
        if ($result) {
            return response()->json(['message' => 'Category deleted successfully']);
        }
        
        return response()->json(['message' => 'Failed to delete category'], 500);
    }

 
    public function search(Request $request): JsonResponse{
        $request->validate([
            'query' => 'required|string|min:1'
        ]);
        
        $categories = $this->categoryService->searchCategories($request->query('query'));
        
        return response()->json(['data' => $categories]);
    }
}