<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\API\LikeController;
use App\Http\Requests\ArticleRequest;
use App\Repositories\Services\ArticleService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    protected $articleService;

    public function __construct(ArticleService $articleService){
        $this->articleService = $articleService;
    }

    public function index(Request $request): JsonResponse{
        $perPage = $request->query('per_page', 10);
        $articles = $this->articleService->getPaginatedArticles($perPage);
        
        return response()->json($articles);
    }

    public function byCategory(Request $request, int $categoryId): JsonResponse {
        $perPage = $request->query('per_page', 10);
        $articles = $this->articleService->getArticlesByCategory($categoryId, $perPage);
        
        return response()->json($articles);
    }

    public function byTag(Request $request, int $tagId): JsonResponse {
        $perPage = $request->query('per_page', 10);
        $articles = $this->articleService->getArticlesByTag($tagId, $perPage);
        
        return response()->json($articles);
    }

    public function byUser(Request $request, int $userId): JsonResponse {
        $perPage = $request->query('per_page', 10);
        $articles = $this->articleService->getArticlesByUser($userId, $perPage);
        
        return response()->json($articles);
    }

    public function search(Request $request): JsonResponse{
        $request->validate([
            'query' => 'required|string|min:3',
            'per_page' => 'nullable|integer|min:1|max:50'
        ]);
        
        $perPage = $request->query('per_page', 10);
        $articles = $this->articleService->searchArticles($request->query('query'), $perPage);
        
        return response()->json($articles);
    }

    public function mostLiked(Request $request): JsonResponse {
        $limit = $request->query('limit', 5);
        $articles = $this->articleService->getMostLikedArticles($limit);
        
        return response()->json(['data' => $articles]);
    }

    public function show(Request $request, int $id): JsonResponse {
        $article = $this->articleService->getArticleById($id);

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }
        
        $userId = $request->user() ? $request->user()->id : null;
        $likesInfo = $this->articleService->getArticleLikesInfo($id, $userId);
        
        $data = $article->toArray();
        $data['likes_count'] = $likesInfo['likes_count'];
        $data['has_liked'] = $likesInfo['has_liked'];
        
        if ($article->image_id && !isset($data['image'])) {
            $article->load('image');
            $data['image'] = $article->image;
        }

        return response()->json(['data' => $data]);
    }

    public function store(ArticleRequest $request): JsonResponse
    {
        $article = $this->articleService->createArticle(
            $request->validated(),
            $request->user()->id,
            $request->file('image'),
            $request->input('tags', [])
        );

        return response()->json([
            'message' => 'Article created successfully',
            'data' => $article
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $article = $this->articleService->getArticleById($id);
    
            if (!$article) {
                return response()->json(['message' => 'Article not found'], 404);
            }
    
            if ($article->user_id !== $request->user()->id && $request->user()->role->name !== 'admin') {
                return response()->json(['message' => 'You are not authorized to update this article'], 403);
            }

            $data = [
                'title' => $request->input('title'),
                'content' => $request->input('content'),
                'category_id' => $request->input('category_id'),
            ];

            $imageString = null;
            if ($request->has('image') && is_string($request->input('image'))) {
                $imageString = $request->input('image');
            }
            
            $updatedArticle = $this->articleService->updateArticle(
                $id,
                $data,
                $request->file('image'),
                $request->input('tags', []),
                $imageString
            );
    
            return response()->json([
                'message' => 'Article updated successfully',
                'data' => $updatedArticle
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error updating article: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse {
        try {
            $article = $this->articleService->getArticleById($id);

            if (!$article) {
                return response()->json(['message' => 'Article not found'], 404);
            }

            if ($article->user_id !== $request->user()->id && $request->user()->role->name !== 'admin') {
                return response()->json(['message' => 'You are not authorized to delete this article'], 403);
            }

            $result = $this->articleService->deleteArticle($id);
                
            if ($result) {
                return response()->json(['message' => 'Article deleted successfully']);
            }
                
            return response()->json(['message' => 'Failed to delete article'], 500);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error deleting article: ' . $e->getMessage()
            ], 500);
        }
    }

   
}