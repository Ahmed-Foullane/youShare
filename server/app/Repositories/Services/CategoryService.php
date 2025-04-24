<?php

namespace App\Repositories\Services;
use App\Repositories\Interfaces\CategoryRepositoryInterface;


class CategoryService
{
  
    protected $categoryRepository;

   
    public function __construct(CategoryRepositoryInterface $categoryRepository){
        $this->categoryRepository = $categoryRepository;
    }

  
    public function getAllCategories(){
        return $this->categoryRepository->all();
    }

   
    public function getCategoriesWithArticleCount(){
        return $this->categoryRepository->getCategoriesWithArticleCount();
    }

   
    public function getCategoryById(int $id){
        return $this->categoryRepository->find($id);
    }

   
    public function createCategory(array $data){
        return $this->categoryRepository->create($data);
    }

    public function updateCategory(int $id, array $data){
        return $this->categoryRepository->update($id, $data);
    }

    public function deleteCategory(int $id): bool{
        return $this->categoryRepository->delete($id);
    }

    
    public function searchCategories(string $query){
        return $this->categoryRepository->search($query);
    }
}