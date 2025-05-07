<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface QuestionRepositoryInterface extends CrudRepositoryInterface
{

    public function getPaginated(int $perPage = 10);


    public function getByTag(int $tagId, int $perPage = 10);


    public function getByUser(int $userId, int $perPage = 10);


    public function search(string $query, int $perPage = 10);

    public function attachTags(int $questionId, array $tagIds);

    public function syncTags(int $questionId, array $tagIds);

    public function findWithRelations(int $id);
}
