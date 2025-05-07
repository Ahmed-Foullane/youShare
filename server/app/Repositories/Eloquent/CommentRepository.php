<?php

namespace App\Repositories\Eloquent;

use App\Models\Comment;
use App\Models\CommentVote;
use App\Repositories\Interfaces\CommentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Request;

class CommentRepository extends CrudRepository implements CommentRepositoryInterface
{

    public function __construct(Comment $model){
        parent::__construct($model);
    }


    public function getByQuestion(int $questionId): Collection{
        return $this->model
            ->where('question_id', $questionId)
            ->with('user')
            ->orderBy('is_accepted', 'desc')
            ->orderBy('votes', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function markAsAccepted(int $commentId): bool{
        $comment = $this->model->findOrFail($commentId);

        $this->model->where('question_id', $comment->question_id)
            ->where('is_accepted', true)
            ->update(['is_accepted' => false]);

        $comment->is_accepted = true;
        $comment->save();

        return true;
    }

    public function unmarkAsAccepted(int $commentId): bool{
        $comment = $this->model->findOrFail($commentId);

        $comment->is_accepted = false;
        $comment->save();

        return true;
    }

    public function store(Request $request, int $questionId): JsonResponse{
        $request->validate([
            'content' => 'required|string'
        ]);


        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $question = $this->questionService->getQuestionById($questionId);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $data = [
            'content' => $request->input('content'),
            'question_id' => $questionId,
            'votes' => 0,
            'is_accepted' => false
        ];

        $comment = $this->commentService->createComment($data, $request->user()->id);

        return response()->json([
            'message' => 'Comment created successfully',
            'data' => $comment
        ], 201);
    }
}
