<?php

namespace App\Repositories\Services;

use App\Models\Image;
use App\Repositories\Interfaces\ArticleRepositoryInterface;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ArticleService
{
    protected $articleRepository;

    public function __construct(ArticleRepositoryInterface $articleRepository){
        $this->articleRepository = $articleRepository;
    }

    public function getPaginatedArticles(int $perPage = 10){
        return $this->articleRepository->getPaginated($perPage);
    }

    public function getArticlesByCategory(int $categoryId, int $perPage = 10){
        return $this->articleRepository->getByCategory($categoryId, $perPage);
    }

    public function getArticlesByTag(int $tagId, int $perPage = 10){
        return $this->articleRepository->getByTag($tagId, $perPage);
    }

    public function getArticlesByUser(int $userId, int $perPage = 10){
        return $this->articleRepository->getByUser($userId, $perPage);
    }

    public function searchArticles(string $query, int $perPage = 10){
        return $this->articleRepository->search($query, $perPage);
    }

    public function getMostLikedArticles(int $limit = 5){
        return $this->articleRepository->getMostLiked($limit);
    }

    public function getArticleById(int $id){
        return $this->articleRepository->findWithRelations($id);
    }

    public function getArticleLikesInfo(int $articleId, ?int $userId = null): array{
        return $this->articleRepository->getArticleLikesInfo($articleId, $userId);
    }

    public function createArticle(array $data, int $userId, ?UploadedFile $image = null, array $tagIds = []){
        $imageId = null;
        if ($image) {
            $imageId = $this->handleImageUpload($image);
        }

        $articleData = [
            'title' => $data['title'],
            'content' => $data['content'],
            'category_id' => $data['category_id'],
            'user_id' => $userId,
            'likes' => 0,
            'image_id' => $imageId,
        ];

        $article = $this->articleRepository->create($articleData);

        if (!empty($tagIds)) {
            $this->articleRepository->attachTags($article->id, $tagIds);
        }

        return $article->fresh(['user', 'category', 'tags', 'image']);
    }

    public function updateArticle(int $id, array $data, ?UploadedFile $image = null, array $tagIds = [], ?string $imageString = null){
        $article = $this->articleRepository->find($id);
        
        if (!$article) {
            throw new Exception('Article not found with ID: ' . $id);
        }
        
        if ($image) {
            if ($article->image_id) {
                $this->deleteImage($article->image_id);
            }
    
            $imageId = $this->handleImageUpload($image);
            $data['image_id'] = $imageId;
        }
        elseif ($imageString && !empty($imageString)) {
            if ($article->image_id) {
                $this->deleteImage($article->image_id);
            }
    
            // Create the directory if it doesn't exist
            Storage::disk('public')->makeDirectory('article_images');
            
            $fileName = time() . '_' . uniqid() . '.jpg';
            $filePath = 'article_images/' . $fileName;
    
            Storage::disk('public')->put($filePath, $imageString);
    
            $imageModel = Image::create([
                'file_path' => $filePath,
            ]);
    
            $data['image_id'] = $imageModel->id;
        }
    
        $article = $this->articleRepository->update($id, $data);
    
        if (isset($tagIds)) {
            $this->articleRepository->syncTags($id, $tagIds);
        }
    
        return $article->fresh(['user', 'category', 'tags', 'image']);
    }

    public function deleteArticle(int $id): bool{
        $article = $this->articleRepository->find($id);
    
        if (!$article) {
            throw new Exception('Article not found with ID: ' . $id);
        }
    
        if ($article->image_id) {
            $this->deleteImage($article->image_id);
        }
    
        return $this->articleRepository->delete($id);
    }

    protected function handleImageUpload(UploadedFile $image){
        // Create the directory if it doesn't exist
        Storage::disk('public')->makeDirectory('article_images');
        
        $fileName = time() . '_' . $image->getClientOriginalName();
        $filePath = $image->storeAs('article_images', $fileName, 'public');

        $imageModel = Image::create([
            'file_path' => $filePath,
        ]);

        return $imageModel->id;
    }

    protected function deleteImage(int $imageId): void{
        $image = Image::find($imageId);

        if ($image) {
            Storage::disk('public')->delete($image->file_path);
            $image->delete();
        }
    }

    protected function handleBase64Image(string $base64Image){
        // Create the directory if it doesn't exist
        Storage::disk('public')->makeDirectory('article_images');
        
        $imageData = explode(',', $base64Image);
        
        if (count($imageData) < 2) {
            return null;
        }
        
        $imageInfo = explode(';', $imageData[0]);
        $mimeType = str_replace('data:', '', $imageInfo[0]);
        $extension = $this->getExtensionFromMimeType($mimeType);
        
        if (!$extension) {
            return null;
        }
        
        $fileName = time() . '_' . uniqid() . '.' . $extension;
        $filePath = 'article_images/' . $fileName;
        
        $decodedImage = base64_decode($imageData[1]);
        Storage::disk('public')->put($filePath, $decodedImage);
        
        $imageModel = Image::create([
            'file_path' => $filePath,
        ]);
        
        return $imageModel->id;
    }
    
    private function getExtensionFromMimeType(string $mimeType): ?string{
        $mimeTypeMap = [
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
        ];
        
        return $mimeTypeMap[$mimeType] ?? null;
    }
}