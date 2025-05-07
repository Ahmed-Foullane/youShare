<?php

namespace App\Repositories\Interfaces;

interface LikeRepositoryInterface
{
   
    public function toggleLike(string $entityType, int $entityId, int $userId): array;

  
    public function hasUserLiked(string $entityType, int $entityId, int $userId): bool;

    
    public function getLikeCount(string $entityType, int $entityId): int;
}