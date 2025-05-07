<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Repositories\Services\LikeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{

    protected $likeService;

    public function __construct(LikeService $likeService){
        $this->likeService = $likeService;
    }

    public function toggleLike(Request $request, string $entityType, int $entityId): JsonResponse{
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $result = $this->likeService->toggleLike($entityType, $entityId, $request->user()->id);
        if (isset($result['error']) && $result['error']) {
            return response()->json(['message' => $result['message'] ?? 'Operation failed'], 400);
        }

        return response()->json($result);
    }


    public function checkLike(Request $request, string $entityType, int $entityId): JsonResponse{
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        try {
            $hasLiked = $this->likeService->hasUserLiked($entityType, $entityId, $request->user()->id);
            $likeCount = $this->likeService->getLikeCount($entityType, $entityId);

            return response()->json([
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'liked' => $hasLiked,
                'count' => $likeCount
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => 'Failed to check like status'], 500);
        }
    }
}
