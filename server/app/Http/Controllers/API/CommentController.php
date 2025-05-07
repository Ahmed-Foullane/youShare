<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\API\LikeController;
use App\Repositories\Services\CommentService;
use App\Repositories\Services\QuestionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{

    protected $commentService;


    protected $questionService;


    public function __construct(CommentService $commentService, QuestionService $questionService) {
        $this->commentService = $commentService;
        $this->questionService = $questionService;
    }


    public function getByQuestion(int $questionId): JsonResponse {
        $question = $this->questionService->getQuestionById($questionId);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $comments = $this->commentService->getCommentsByQuestion($questionId);

        return response()->json(['data' => $comments]);
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


    public function update(Request $request, int $id): JsonResponse{
        $request->validate([
            'content' => 'required|string'
        ]);

        $comment = $this->commentService->getCommentById($id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        if ($comment->user_id !== $request->user()->id && $request->user()->role->name !== 'admin') {
            return response()->json(['message' => 'You are not authorized to update this comment'], 403);
        }

        $comment = $this->commentService->updateComment($id, $request->only('content'));

        return response()->json([
            'message' => 'Comment updated successfully',
            'data' => $comment
        ]);
    }


    public function destroy(Request $request, int $id): JsonResponse{
        $comment = $this->commentService->getCommentById($id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        if ($comment->user_id !== $request->user()->id && $request->user()->role->name !== 'admin') {
            return response()->json(['message' => 'You are not authorized to delete this comment'], 403);
        }

        $result = $this->commentService->deleteComment($id);

        if ($result) {
            return response()->json(['message' => 'Comment deleted successfully']);
        }

        return response()->json(['message' => 'Failed to delete comment'], 500);
    }

    public function markAsAccepted(Request $request, int $id): JsonResponse {
        $comment = $this->commentService->getCommentById($id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        if (!$comment->question_id) {
            return response()->json(['message' => 'This comment is not attached to a question'], 400);
        }

        $question = $this->questionService->getQuestionById($comment->question_id);

        if ($question->user_id !== $request->user()->id && $request->user()->role->name !== 'admin') {
            return response()->json(['message' => 'Only the question author or an admin can mark a comment as accepted'], 403);
        }

        $isCurrentlyAccepted = $comment->is_accepted;
        
        if ($isCurrentlyAccepted) {
            $result = $this->commentService->unmarkAsAccepted($id);
            $actionMessage = 'Comment unmarked as accepted answer';
        } else {
            $result = $this->commentService->markAsAccepted($id);
            $actionMessage = 'Comment marked as accepted answer';
        }

        if ($result) {
            $updatedComment = $this->commentService->getCommentById($id);
            $updatedComment->load('user');
            
            return response()->json([
                'message' => $actionMessage,
                'data' => $updatedComment
            ]);
        }

        return response()->json(['message' => 'Failed to update comment accepted status'], 500);
    }

}
