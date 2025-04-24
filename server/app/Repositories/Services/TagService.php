<?php
namespace App\Repositories\Services;

use App\Repositories\Interfaces\TagRepositoryInterface;

class TagService
{
   
    protected $tagRepository;

   
    public function __construct(TagRepositoryInterface $tagRepository){
        $this->tagRepository = $tagRepository;
    }

 
    public function getAllTags(){
        return $this->tagRepository->all();
    }


    public function getTagById(int $id){
        return $this->tagRepository->find($id);
    }


    public function createTag(array $data){
        return $this->tagRepository->create($data);
    }


    public function updateTag(int $id, array $data){
        return $this->tagRepository->update($id, $data);
    }

    public function deleteTag(int $id): bool{
        return $this->tagRepository->delete($id);
    }


    public function searchTags(string $query){
        return $this->tagRepository->search($query);
    }
}