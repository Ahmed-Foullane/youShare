<?php

namespace App\Repositories\Eloquent;

use App\Models\Like;
use App\Models\Article;
use App\Models\Question;
use App\Models\Comment;
use Illuminate\Support\Facades\DB;
use App\Repositories\Interfaces\LikeRepositoryInterface;

class LikeRepository implements LikeRepositoryInterface
{
    
    public function toggleLike(string $entityType, int $entityId, int $userId): array{
        try {
            return DB::transaction(function () use ($entityType, $entityId, $userId) {
                $model = $this->getModelByType($entityType);
                $entity = $model::findOrFail($entityId);
                $modelClass = get_class($entity);
                $like = Like::where([
                    'user_id' => $userId,
                    'likeable_id' => $entityId,
                    'likeable_type' => $modelClass
                ])->first();
                
                if ($like) {
                    $like->delete();
                    $count = $this->getLikeCount($entityType, $entityId);
                    return [
                        'liked' => false,
                        'count' => $count,
                        'entity_id' => $entityId,
                        'entity_type' => $entityType
                    ];
                } 
                else {
                    Like::create([
                        'user_id' => $userId,
                        'likeable_id' => $entityId,
                        'likeable_type' => $modelClass
                    ]);
                    $count = $this->getLikeCount($entityType, $entityId);
                    return [
                        'liked' => true,
                        'count' => $count,
                        'entity_id' => $entityId,
                        'entity_type' => $entityType
                    ];
                }
            });
        } catch (Exception $e) {
            return [
                'error' => true,
                'message' => 'Failed to process like operation'
            ];
        }
    }

    public function hasUserLiked(string $entityType, int $entityId, int $userId): bool{
        try {
            $model = $this->getModelByType($entityType);
            $entity = $model::find($entityId);
            
            if (!$entity) {
                return false;
            }
            
            $modelClass = get_class($entity);
            
            return Like::where([
                'user_id' => $userId,
                'likeable_id' => $entityId,
                'likeable_type' => $modelClass
            ])->exists();
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function getLikeCount(string $entityType, int $entityId): int{
        try {
            $model = $this->getModelByType($entityType);
            $entity = $model::find($entityId);
            
            if (!$entity) {
                return 0;
            }
            
            $modelClass = get_class($entity);
            
            return Like::where([
                'likeable_id' => $entityId,
                'likeable_type' => $modelClass
            ])->count();
        } catch (Exception $e) {
            return 0;
        }
    }

    private function getModelByType($type){
        return match ($type) {
            'articles' => \App\Models\Article::class,
            'questions' => \App\Models\Question::class,
            'comments' => \App\Models\Comment::class,
            default => throw new \Exception('Invalid entity type: ' . $type),
        };
    }
}
