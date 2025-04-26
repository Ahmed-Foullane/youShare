<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\API\LikeController;
use App\Http\Requests\QuestionRequest;
use App\Repositories\Services\QuestionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class QuestionController extends Controller
{

    protected $questionService;


    public function __construct(QuestionService $questionService){
        $this->questionService = $questionService;
    }


    public function index(Request $request): JsonResponse{
        $perPage = $request->query('per_page', 10);
        $questions = $this->questionService->getPaginatedQuestions($perPage);
        return response()->json($questions);
    }

    public function byTag(Request $request, int $tagId): JsonResponse{
        $perPage = $request->query('per_page', 10);
        $questions = $this->questionService->getQuestionsByTag($tagId, $perPage);

        return response()->json($questions);
    }


    public function byUser(Request $request, int $userId): JsonResponse{
        $perPage = $request->query('per_page', 10);
        $questions = $this->questionService->getQuestionsByUser($userId, $perPage);

        return response()->json($questions);
    }


    public function search(Request $request): JsonResponse{
        $request->validate([
            'query' => 'required|string|min:3',
            'per_page' => 'nullable|integer|min:1|max:50'
        ]);

        $perPage = $request->query('per_page', 10);
        $questions = $this->questionService->searchQuestions($request->query('query'), $perPage);

        return response()->json($questions);
    }

    public function show(int $id): JsonResponse{
        $question = $this->questionService->getQuestionById($id);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }
        
        // Ensure image data is properly loaded
        if ($question->image_id && !$question->relationLoaded('image')) {
            $question->load('image');
        }

        return response()->json(['data' => $question]);
    }


    public function store(QuestionRequest $request): JsonResponse{
        $question = $this->questionService->createQuestion(
            $request->validated(),
            $request->user()->id,
            $request->file('image'),
            $request->input('tags', [])
        );

        return response()->json([
            'message' => 'Question created successfully',
            'data' => $question
        ], 201);
    }


    public function update(QuestionRequest $request, int $id): JsonResponse{
        try {
            Log::info('Question update request', [
                'method' => $request->method(),
                'content_type' => $request->header('Content-Type'),
                'has_method_override' => $request->has('_method'),
                'method_override' => $request->input('_method'),
                'question_id' => $id,
                'user_id' => $request->user()->id,
                'user_role' => $request->user()->role->name ?? 'unknown',
            ]);
            
            $question = $this->questionService->getQuestionById($id);

            if (!$question) {
                return response()->json(['message' => 'Question not found'], 404);
            }

            if ($question->user_id !== $request->user()->id && $request->user()->role->name !== 'admin') {
                return response()->json(['message' => 'You are not authorized to update this question'], 403);
            }

            $updatedQuestion = $this->questionService->updateQuestion(
                $id,
                $request->validated(),
                $request->file('image'),
                $request->input('tags', [])
            );

            return response()->json([
                'message' => 'Question updated successfully',
                'data' => $updatedQuestion
            ]);
        } catch (Exception $e) {
            Log::error('Error updating question:', [
                'question_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error updating question: ' . $e->getMessage()
            ], 500);
        }
    }


    public function destroy(Request $request, int $id): JsonResponse{
        try {
            
            Log::info('Question delete request', [
                'method' => $request->method(),
                'content_type' => $request->header('Content-Type'),
                'has_method_override' => $request->has('_method'),
                'method_override' => $request->input('_method'),
                'question_id' => $id,
                'user_id' => $request->user()->id,
                'user_role' => $request->user()->role->name ?? 'unknown',
            ]);
            
            $question = $this->questionService->getQuestionById($id);

            if (!$question) {
                Log::warning('Question not found on delete attempt', ['id' => $id]);
                return response()->json(['message' => 'Question not found'], 404);
            }

           
            if ($question->user_id !== $request->user()->id && $request->user()->role->name !== 'admin') {
                Log::warning('Unauthorized delete attempt', [
                    'question_id' => $id,
                    'question_user_id' => $question->user_id,
                    'request_user_id' => $request->user()->id,
                    'request_user_role' => $request->user()->role->name ?? 'unknown'
                ]);
                return response()->json(['message' => 'You are not authorized to delete this question'], 403);
            }

            try {
                $result = $this->questionService->deleteQuestion($id);
                
                if ($result) {
                    return response()->json(['message' => 'Question deleted successfully']);
                }
                
                return response()->json(['message' => 'Failed to delete question'], 500);
            } catch (Exception $e) {
                Log::error('Error in question deletion service:', [
                    'question_id' => $id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                
                return response()->json([
                    'message' => 'Error deleting question: ' . $e->getMessage()
                ], 500);
            }
        } catch (Exception $e) {
            Log::error('Unhandled exception in question destroy method:', [
                'question_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Internal server error while deleting question',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    


}
