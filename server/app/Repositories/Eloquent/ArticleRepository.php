<?php

namespace App\Repositories\Eloquent;

use App\Models\Article;
use App\Repositories\Interfaces\ArticleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ArticleRepository extends CrudRepository implements ArticleRepositoryInterface
{
    public function __construct(Article $model) {
        parent::__construct($model);
    }

    public function getPaginated(int $perPage = 10) {
        return $this->model
            ->with(['user', 'category', 'tags', 'image', 'likes'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getByCategory(int $categoryId, int $perPage = 10) {
        return $this->model
            ->with(['user', 'category', 'tags', 'image', 'likes'])
            ->where('category_id', $categoryId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getByTag(int $tagId, int $perPage = 10) {
        return $this->model
            ->with(['user', 'category', 'tags', 'image', 'likes'])
            ->whereHas('tags', function($query) use ($tagId) {
                $query->where('tags.id', $tagId);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getByUser(int $userId, int $perPage = 10) {
        return $this->model
            ->with(['user', 'category', 'tags', 'image', 'likes'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function search(string $query, int $perPage = 10) {
        return $this->model
            ->with(['user', 'category', 'tags', 'image', 'likes'])
            ->where('title', 'LIKE', "%{$query}%")
            ->orWhere('content', 'LIKE', "%{$query}%")
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getMostLiked(int $limit = 5): Collection {
        return $this->model
            ->with(['user', 'category', 'tags', 'image', 'likes'])
            ->orderBy('likes', 'desc')
            ->take($limit)
            ->get();
    }

    public function attachTags(int $articleId, array $tagIds): void {
        $article = $this->find($articleId);
        $article->tags()->attach($tagIds);
    }

    public function syncTags(int $articleId, array $tagIds): void {
        $article = $this->find($articleId);
        $article->tags()->sync($tagIds);
    }

    public function findWithRelations(int $id) {
        return $this->model
            ->with(['user', 'category', 'tags', 'image', 'likes'])
            ->find($id);
    }

    public function getArticleLikesInfo(int $articleId, ?int $userId = null): array {
        $article = $this->findWithRelations($articleId);

        if (!$article) {
            return ['likes_count' => 0, 'has_liked' => false];
        }

        $likes = $article->likes;
        $likesCount = 0;
        $hasLiked = false;

        if (is_countable($likes)) {
            $likesCount = count($likes);

            if ($userId && is_iterable($likes)) {
                foreach ($likes as $like) {
                    if ($like->user_id == $userId) {
                        $hasLiked = true;
                        break;
                    }
                }
            }
        } else if (is_object($likes) && method_exists($likes, 'count')) {
            $likesCount = $likes->count();
        } else {
            $likesCount = is_numeric($article->likes) ? $article->likes : 0;
        }

        return [
            'likes_count' => $likesCount,
            'has_liked' => $hasLiked
        ];
    }
}
