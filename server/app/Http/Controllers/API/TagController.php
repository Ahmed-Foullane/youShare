<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Requests\TagRequest;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Repositories\Services\TagService;

class TagController extends Controller
{
    protected $tagService;

    public function __construct(TagService $tagService){
        $this->tagService = $tagService;
    }

    public function index(): JsonResponse
    {
        $tags = $this->tagService->getAllTags();
        
        return response()->json(['data' => $tags]);
    }

    public function store(TagRequest $request)
    {
        $tag = $this->tagService->createTag($request->validated());
        
        return response()->json([
            'message' => 'Tag created successfully',
            'data' => $tag
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $tag = $this->tagService->getTagById($id);
        
        if (!$tag) {
            return response()->json(['message' => 'Tag not found'], 404);
        }
        
        return response()->json(['data' => $tag]);
    }

    public function update(TagRequest $request, int $id): JsonResponse
    {
        $tag = $this->tagService->updateTag($id, $request->validated());
        
        return response()->json([
            'message' => 'Tag updated successfully',
            'data' => $tag
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $result = $this->tagService->deleteTag($id);
        
        if ($result) {
            return response()->json(['message' => 'Tag deleted successfully']);
        }
        
        return response()->json(['message' => 'Failed to delete tag'], 500);
    }

    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'query' => 'required|string|min:1'
        ]);
        $tags = $this->tagService->searchTags($request->query('query'));
        return response()->json(['data' => $tags]);
    }
}