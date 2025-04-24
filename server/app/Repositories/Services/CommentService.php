<?php

namespace App\Repositories\Services;

use App\Repositories\Interfaces\CommentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class CommentService
{

    protected $commentRepository;


    public function __construct(CommentRepositoryInterface $commentRepository){
        $this->commentRepository = $commentRepository;
    }
    public function getCommentsByQuestion(int $questionId): Collection{
        return $this->commentRepository->getByQuestion($questionId);
    }

    public function getCommentById(int $id): ?Model{
        return $this->commentRepository->find($id);
    }


    public function createComment(array $data, int $userId): Model{
        $data['user_id'] = $userId;
        return $this->commentRepository->create($data);
    }


    public function updateComment(int $id, array $data): Model{
        return $this->commentRepository->update($id, $data);
    }


    public function deleteComment(int $id): bool{
        return $this->commentRepository->delete($id);
    }

    public function markAsAccepted(int $id): bool{
        return $this->commentRepository->markAsAccepted($id);
    }
    
    public function unmarkAsAccepted(int $id): bool{
        return $this->commentRepository->unmarkAsAccepted($id);
    }
}
