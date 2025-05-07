<?php

namespace App\Repositories\Services;

use App\Repositories\Interfaces\LikeRepositoryInterface;
use App\Models\Article;
use App\Models\Question;
use App\Models\Comment;

class LikeService
{
    protected $likeRepository;

    public function __construct(LikeRepositoryInterface $likeRepository){
        $this->likeRepository = $likeRepository;
    }

    public function toggleLike(string $entityType, int $entityId, int $userId){
        if (!in_array($entityType, ['articles', 'questions', 'comments'])) {
            return [
                'error' => true,
                'message' => 'Invalid entity type: ' . $entityType
            ];
        }

        $result = $this->likeRepository->toggleLike($entityType, $entityId, $userId);
        if (isset($result['count'])) {
            if ($entityType === 'articles') {
                $this->updateArticleLikesCount($entityId, $result['count']);
            } elseif ($entityType === 'questions') {
                $this->updateQuestionVotesCount($entityId, $result['count']);
            } elseif ($entityType === 'comments') {
                $this->updateCommentVotesCount($entityId, $result['count']);
            }
        }
        return $result;
    }

    public function hasUserLiked(string $entityType, int $entityId, int $userId){
        if (!in_array($entityType, ['articles', 'questions', 'comments'])) {
            return false;
        }

        return $this->likeRepository->hasUserLiked($entityType, $entityId, $userId);
    }

    public function getLikeCount(string $entityType, int $entityId){
        if (!in_array($entityType, ['articles', 'questions', 'comments'])) {
            return 0;
        }

        return $this->likeRepository->getLikeCount($entityType, $entityId);
    }

    private function updateArticleLikesCount(int $articleId, int $count){
        $article = Article::find($articleId);
        if ($article) {
            $article->likes = $count;
            $article->save();
        }
    }

    private function updateQuestionVotesCount(int $questionId, int $count){
        $question = Question::find($questionId);
        if ($question) {
            $question->votes = $count;
            $question->save();
        }
    }

    private function updateCommentVotesCount(int $commentId, int $count){
        $comment = Comment::find($commentId);
        if ($comment) {
            $comment->votes = $count;
            $comment->save();
        }
    }
}
