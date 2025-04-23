<?php

namespace App\Repositories\Interfaces;


interface ArticleRepositoryInterface extends CrudRepositoryInterface
{
    public function getPaginated(int $perPage = 10);

    public function getByCategory(int $categoryId, int $perPage = 10);

    public function getByTag(int $tagId, int $perPage = 10);

    public function getByUser(int $userId, int $perPage = 10);

    public function search(string $query, int $perPage = 10);

    public function getMostLiked(int $limit = 5);

    public function attachTags(int $articleId, array $tagIds);

    public function syncTags(int $articleId, array $tagIds);

    public function findWithRelations(int $id);

    public function getArticleLikesInfo(int $articleId, ?int $userId = null): array;
}
