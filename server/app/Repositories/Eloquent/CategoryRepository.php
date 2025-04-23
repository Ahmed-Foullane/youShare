<?php

namespace App\Repositories\Eloquent;


use App\Models\Category;
use App\Repositories\Interfaces\CategoryRepositoryInterface;

class CategoryRepository extends CrudRepository implements CategoryRepositoryInterface
{

    public function __construct(Category $model){
        parent::__construct($model);
    }


    public function search(string $query){
        return $this->model->where('name', 'LIKE', "%{$query}%")->get();
    }


    public function getCategoriesWithArticleCount(){
        return $this->model->withCount('articles')->get();
    }
}
