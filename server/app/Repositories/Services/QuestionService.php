<?php

namespace App\Repositories\Services;

use Exception;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;
use App\Repositories\Interfaces\QuestionRepositoryInterface;


class QuestionService
{

    protected $questionRepository;


    public function __construct(QuestionRepositoryInterface $questionRepository){
        $this->questionRepository = $questionRepository;
    }

    public function getPaginatedQuestions(int $perPage = 10){
        return $this->questionRepository->getPaginated($perPage);
    }

    public function getQuestionsByTag(int $tagId, int $perPage = 10){
        return $this->questionRepository->getByTag($tagId, $perPage);
    }

    public function getQuestionsByUser(int $userId, int $perPage = 10){
        return $this->questionRepository->getByUser($userId, $perPage);
    }

    public function searchQuestions(string $query, int $perPage = 10){
        return $this->questionRepository->search($query, $perPage);
    }



    public function getQuestionById(int $id){
        $question = $this->questionRepository->findWithRelations($id);

        return $question;
    }

    public function createQuestion(array $data, int $userId, ?\Illuminate\Http\UploadedFile $image = null, array $tagIds = []){
        Storage::disk('public')->makeDirectory('question_images');
        try {
            $questionData = [
                'title' => $data['title'],
                'description' => $data['description'],
                'user_id' => $userId,
                'votes' => 0,
            ];
    
            if ($image) {
                $fileName = time() . '_' . $image->getClientOriginalName();
                $filePath = $image->storeAs('question_images', $fileName, 'public');
                
                $imageModel = Image::create([
                    'file_path' => $filePath,
                ]);
                
                $questionData['image_id'] = $imageModel->id;
            } else if (isset($data['image_id'])) {
                $questionData['image_id'] = $data['image_id'];
            }
    
            $question = $this->questionRepository->create($questionData);
    
            if (!empty($tagIds)) {
                $this->questionRepository->attachTags($question->id, $tagIds);
            }
    
            return $question->fresh(['user', 'tags']);
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    public function updateQuestion(int $id, array $data, ?\Illuminate\Http\UploadedFile $image = null, array $tagIds = []){
        Storage::disk('public')->makeDirectory('question_images');
        try {
            $updateData = [];
    
            if (isset($data['title'])) {
                $updateData['title'] = $data['title'];
            }
    
            if (isset($data['description'])) {
                $updateData['description'] = $data['description'];
            }
    
            $question = $this->questionRepository->find($id);
            
            if ($image) {
                if ($question->image_id) {
                    $question->image_id = null;
                    $question->save();
                }
                
                $fileName = time() . '_' . $image->getClientOriginalName();
                $filePath = $image->storeAs('question_images', $fileName, 'public');
                
                $imageModel = Image::create([
                    'file_path' => $filePath,
                ]);
                
                $updateData['image_id'] = $imageModel->id;
            } else if (isset($data['image_id'])) {
                $updateData['image_id'] = $data['image_id'];
            }
    
            $question = $this->questionRepository->update($id, $updateData);
    
            if (!empty($tagIds)) {
                $this->questionRepository->syncTags($id, $tagIds);
            }
    
            return $question->fresh(['user', 'tags']);
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    public function deleteQuestion(int $id): bool{
        try {
            $question = $this->questionRepository->find($id);
    
            if (!$question) {
                throw new Exception('Question not found');
            }
    
            if (method_exists($question, 'comments')) {
                $question->comments()->delete();
            }
    
            if (method_exists($question, 'likes')) {
                $question->likes()->delete();
            }
    
            if (method_exists($question, 'tags')) {
                $question->tags()->detach();
            }
    
            if ($question->image_id) {
                $question->image_id = null;
                $question->save();
            }
    
            return $this->questionRepository->delete($id);
        } catch (Exception $e) {
            throw $e;
        }
    }
}
