<?php

namespace App\Repositories\Eloquent;
use App\Models\Tag;
use App\Repositories\Eloquent\CrudRepository;
use App\Repositories\Interfaces\TagRepositoryInterface;

class TagRepository extends CrudRepository implements TagRepositoryInterface
{

    public function __construct(Tag $model){
        parent::__construct($model);
    }

    public function search(string $query){
        return $this->model->where('name', 'LIKE', "%{$query}%")->get();
    }

}
