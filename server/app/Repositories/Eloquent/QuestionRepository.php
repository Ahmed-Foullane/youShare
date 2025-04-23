<?php

namespace App\Repositories\Eloquent;

use App\Models\Question;
use App\Repositories\Interfaces\QuestionRepositoryInterface;
use App\Models\QuestionVote;
use Illuminate\Database\Eloquent\Collection;

class QuestionRepository extends CrudRepository implements QuestionRepositoryInterface
{

    public function __construct(Question $model){
        parent::__construct($model);
    }


    public function getPaginated(int $perPage = 10){
        return $this->model
            ->with(['user', 'tags', 'image'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getByTag(int $tagId, int $perPage = 10){
        return $this->model
            ->with(['user', 'tags', 'image'])
            ->whereHas('tags', function($query) use ($tagId) {
                $query->where('tags.id', $tagId);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getByUser(int $userId, int $perPage = 10){
        return $this->model
            ->with(['user', 'tags', 'image'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function search(string $query, int $perPage = 10){
        return $this->model
            ->with(['user', 'tags', 'image'])
            ->where('title', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function attachTags(int $questionId, array $tagIds){
        $question = $this->find($questionId);
        $question->tags()->attach($tagIds);
    }
    public function syncTags(int $questionId, array $tagIds){
        $question = $this->find($questionId);
        $question->tags()->sync($tagIds);
    }

    public function findWithRelations(int $id) {
        return $this->model
            ->with(['user', 'tags', 'image', 'comments'])
            ->find($id);
    }
}
